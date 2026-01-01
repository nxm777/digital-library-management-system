import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import CreateListModal from './readingLists/CreateListModal';

const ReadingLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('No authorization token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('/api/reading-lists', config);
      
      if (response.data.success) {
        setLists(response.data.data);
      } else {
        toast.error('Failed to retrieve lists');
      }
      
    } catch (error) {
      console.error('Error fetching lists:', error);
      toast.error('Failed to load reading lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = () => {
    toast('Create List Modal will open here', { icon: '✨' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reading Lists</h1>
          <p className="text-gray-500 text-sm">Organize your books into collections</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create new list
        </button>
      </div>

      {lists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <Link 
              key={list.id}
              to={`/lists/${list.id}`} 
              className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition duration-200 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                 <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                   </svg>
                 </div>
                 <span className="text-xs font-semibold bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100">
                    {list.bookCount} {list.bookCount === 1 ? 'book' : 'books'}
                 </span>
              </div>

              <div className="mb-4 flex-grow">
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors line-clamp-1">
                  {list.title}
                </h3>
                {list.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {list.description}
                  </p>
                )}
              </div>
              
              {list.tags && list.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-50">
                  {list.tags.map((tag, index) => (
                    <span key={index} className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No lists found</h3>
          <p className="text-gray-500 mb-6">You haven't created any reading lists yet.</p>
          <button onClick={handleCreateList} className="text-green-600 font-semibold hover:text-green-700">
            Create first list &rarr;
          </button>
          
        </div>
        
      )}
      <CreateListModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onListCreated={fetchLists}
      />
    </div>
  );
};

export default ReadingLists;