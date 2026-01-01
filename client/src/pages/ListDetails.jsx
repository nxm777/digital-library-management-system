import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddBookToListModal from '../components/readingLists/AddBookToListModal';
import DeleteListModal from '../components/readingLists/DeleteListModal';
import EditListModal from '../components/readingLists/EditListModal';

const ListDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [removingBookId, setRemovingBookId] = useState(null);

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');

  const handleListDeleted = () => navigate('/lists');

  const fetchListDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`/api/reading-lists/${id}`, config);
      if (response.data && response.data.readingList) {
        setList(response.data.readingList);
      } else {
        toast.error('List not found');
        navigate('/lists');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading list');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchListDetails();
  }, [fetchListDetails]);

  const handleRemoveTag = async (tagToRemove) => {
    const oldTags = list.tags;
    const newTags = list.tags.filter(tag => tag !== tagToRemove);
    setList(prev => ({ ...prev, tags: newTags }));

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { title: list.title, description: list.description, tags: newTags };
      await axios.put(`/api/reading-lists/${id}`, payload, config);
      toast.success(`Tag removed`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove tag');
      setList(prev => ({ ...prev, tags: oldTags }));
    }
  };

  const handleAddTag = async () => {
    const tagToAdd = newTagValue.trim();

    if (!tagToAdd) {
        setIsAddingTag(false);
        setNewTagValue('');
        return;
    }

    if (list.tags.includes(tagToAdd)) {
        toast.error('Tag already exists');
        return;
    }

    const oldTags = list.tags || [];
    const newTags = [...oldTags, tagToAdd];
    setList(prev => ({ ...prev, tags: newTags }));
    
    setIsAddingTag(false);
    setNewTagValue('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = { 
          title: list.title, 
          description: list.description, 
          tags: newTags 
      };

      await axios.put(`/api/reading-lists/${id}`, payload, config);
      toast.success('Tag added');

    } catch (error) {
      console.error(error);
      toast.error('Failed to add tag');
      setList(prev => ({ ...prev, tags: oldTags }));
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleAddTag();
    } else if (e.key === 'Escape') {
        setIsAddingTag(false);
        setNewTagValue('');
    }
  };

  const handleRemoveBook = async (bookId) => {
      if (!window.confirm('Are you sure you want to remove this book from the list?')) return;
      setRemovingBookId(bookId);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/reading-lists/${id}/books/${bookId}`, config);
        toast.success('Book removed from list');
        fetchListDetails();
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to remove book');
      } finally {
        setRemovingBookId(null);
      }
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!list) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link to="/lists" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Back to lists
        </Link>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
         
         <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{list.title}</h1>
                <p className="text-gray-600 text-lg mb-4">{list.description}</p>
                 
                 <div className="flex flex-wrap gap-2 mb-4 items-center">
                    
                    {list.tags && list.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-200 group hover:border-gray-300 transition-colors">
                            <span className="tracking-wide">#{tag}</span>
                            <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                            </button>
                        </span>
                    ))}

                    {isAddingTag ? (
                        <input
                            type="text"
                            autoFocus
                            value={newTagValue}
                            onChange={(e) => setNewTagValue(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            onBlur={() => handleAddTag()}
                            className="px-3 py-1 text-xs font-semibold rounded-full border border-green-500 focus:outline-none w-24 normal-case text-gray-700"
                            placeholder="New tag..."
                        />
                    ) : (
                        <button
           onClick={() => setIsAddingTag(true)}
           className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-gray-500 hover:text-green-600 hover:bg-green-50 border border-dashed border-gray-300 hover:border-green-400 transition-all text-xs font-medium"
           title="Add new tag"
       >
           <span>New tag</span>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
           </svg>
       </button>
                    )}

                </div>

                <div className="text-sm text-gray-400 mt-4 flex gap-4">
                      <span>{list.books ? list.books.length : 0} books</span>
                </div>
            </div>

            <div className="flex gap-2 relative z-10">
                 <button onClick={() => setIsEditModalOpen(true)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                 </button>
                 <button onClick={() => setIsDeleteModalOpen(true)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                 </button>
            </div>
         </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Books in this list</h2>
            <button onClick={() => setIsAddBookModalOpen(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Add a book
            </button>
        </div>
        {list.books && list.books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {list.books.map(book => {
               const imageSrc = book.imageUrl || book.coverImage;

               return (
                <div key={book._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition relative group">
                    <div className="w-16 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100">
                        {imageSrc ? (
                            <img 
                                src={imageSrc} 
                                alt={book.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.classList.add('bg-gray-200');
                                }}
                            />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                        )}
                    </div>

                    <div className="flex flex-col justify-center flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 line-clamp-2 leading-tight mb-1" title={book.title}>{book.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{book.author ? `${book.author.first_name} ${book.author.last_name}` : 'Unknown Author'}</p>
                    </div>
                    <div className="flex flex-col justify-center ml-2">
                        <button onClick={() => handleRemoveBook(book._id)} disabled={removingBookId === book._id} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove book">
                            {removingBookId === book._id ? <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>}
                        </button>
                    </div>
                </div>
               );
             })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
             <p className="text-gray-500 mb-4">This list is empty.</p>
             <button onClick={() => setIsAddBookModalOpen(true)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition">Search & Add Books</button>
          </div>
        )}
      </div>

      <AddBookToListModal isOpen={isAddBookModalOpen} onClose={() => setIsAddBookModalOpen(false)} listId={id} onBookAdded={fetchListDetails} />
      <DeleteListModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} listId={list._id} listTitle={list.title} onDeleted={handleListDeleted} />
      <EditListModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} list={list} onListUpdated={fetchListDetails} />
    </div>
  );
};

export default ListDetails;