import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const AddBookToListModal = ({ isOpen, onClose, listId, onBookAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingBookId, setAddingBookId] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const searchBooks = async () => {
      if (!debouncedSearch) {
        setSearchResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`/api/books?search=${debouncedSearch}&limit=20`, config);
        
        setSearchResults(response.data.data); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    searchBooks();
  }, [debouncedSearch]);

  const handleAddBook = async (bookId) => {
    setAddingBookId(bookId);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post(`/api/reading-lists/${listId}/books`, { bookId }, config);

      toast.success('Book added to list');
      onBookAdded();

    } catch (error) {
        if (error.response && error.response.status === 409) {
            toast.error(error.response.data.message || 'This book is already in your reading list');
        } else {
            console.error('Błąd dodawania książki:', error);
            toast.error(error.response?.data?.message || 'Failed to add book');
        }
    } finally {
      setAddingBookId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add Book to List</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative mb-4">
            <input
                type="text"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[200px]">
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                </div>
            ) : searchResults.length > 0 ? (
                <ul className="space-y-2">
                    {searchResults.map((book) => {
                        const imageSrc = book.imageUrl || book.coverImage;

                        return (
                            <li key={book._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition border border-transparent hover:border-gray-100">
                                <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100">
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
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                        </svg>
                                    )}
                                </div>
                                    
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-800 truncate" title={book.title}>{book.title}</h4>
                                    <p className="text-xs text-gray-500 truncate">
                                        {book.author ? `${book.author.first_name} ${book.author.last_name}` : 'Unknown'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleAddBook(book._id)}
                                    disabled={addingBookId === book._id}
                                    className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-md hover:bg-green-200 transition disabled:opacity-50"
                                >
                                    {addingBookId === book._id ? 'Adding...' : 'Add'}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : searchQuery ? (
                <div className="text-center py-8 text-gray-500">
                    No books found matching "{searchQuery}"
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                    Start typing to search for books...
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddBookToListModal;