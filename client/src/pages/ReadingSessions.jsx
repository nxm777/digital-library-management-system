import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddSessionModal from '../components/readingSessions/AddSessionModal';
import EditSessionModal from '../components/readingSessions/EditSessionModal';
import DeleteSessionModal from '../components/readingSessions/DeleteSessionModal';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ReadingSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const [bookFilterQuery, setBookFilterQuery] = useState('');
  const [bookSearchResults, setBookSearchResults] = useState([]);
  const [selectedBookFilter, setSelectedBookFilter] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const debouncedFilterSearch = useDebounce(bookFilterQuery, 300);

  const fetchSessions = async () => {
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await axios.get(`/api/reading-sessions?${params.toString()}`, config);
        
        if (response.data.success) {
            setSessions(response.data.data);
            setFilteredSessions(response.data.data);
        }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchSessions();
  }, [startDate, endDate]);

  useEffect(() => {
    if (selectedBookFilter) {
      const filtered = sessions.filter(session => 
        session.book && session.book._id === selectedBookFilter._id
      );
      setFilteredSessions(filtered);
    } else {
      setFilteredSessions(sessions);
    }
  }, [selectedBookFilter, sessions]);

  useEffect(() => {
    const searchBooks = async () => {
      if (!debouncedFilterSearch) {
        setBookSearchResults([]);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`/api/books?search=${debouncedFilterSearch}&limit=5`, config);
        setBookSearchResults(response.data.data || []);
        setIsFilterDropdownOpen(true);
      } catch (error) { console.error(error); }
    };

    if (!selectedBookFilter) {
        searchBooks();
    }
  }, [debouncedFilterSearch, selectedBookFilter]);


  const handleEditClick = (session) => {
    setSessionToEdit(session);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const handleSelectFilter = (book) => {
    setSelectedBookFilter(book);
    setBookFilterQuery(book.title);
    setIsFilterDropdownOpen(false);
  };

  const clearBookFilter = () => {
    setSelectedBookFilter(null);
    setBookFilterQuery('');
    setBookSearchResults([]);
  };

  const clearDateFilter = () => {
      setStartDate('');
      setEndDate('');
  };

  if (loading) return <div className="p-12 text-center">Loading sessions...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reading Sessions</h1>
          <p className="text-gray-500 text-sm">Track your reading progress over time</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Log Session
        </button>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        
        <div className="relative flex-1 max-w-md">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Filter by book title..."
                    value={bookFilterQuery}
                    onChange={(e) => {
                        setBookFilterQuery(e.target.value);
                        if (e.target.value === '') clearBookFilter();
                        else setSelectedBookFilter(null);
                    }}
                    onFocus={() => bookFilterQuery && setIsFilterDropdownOpen(true)}
                />
                {bookFilterQuery && (
                    <button onClick={clearBookFilter} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    </button>
                )}
            </div>
            {isFilterDropdownOpen && bookSearchResults.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {bookSearchResults.map((book) => (
                        <li key={book._id} onClick={() => handleSelectFilter(book)} className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 text-gray-900">
                            <span className="block truncate font-medium">{book.title}</span>
                            <span className="block truncate text-xs text-gray-500">{book.author?.first_name} {book.author?.last_name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <div className="flex gap-2 items-center bg-white p-1 rounded-lg border border-gray-300 shadow-sm h-[38px] sm:h-[42px]">
            <div className="relative">
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-2 pr-1 py-1 text-sm text-gray-600 outline-none bg-transparent border-none focus:ring-0"
                    title="Start Date"
                />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative">
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-1 pr-2 py-1 text-sm text-gray-600 outline-none bg-transparent border-none focus:ring-0"
                    title="End Date"
                />
            </div>
            
            {(startDate || endDate) && (
                <button 
                    onClick={clearDateFilter}
                    className="px-2 h-full text-gray-400 hover:text-red-500 border-l border-gray-200 transition-colors"
                    title="Clear dates"
                >
                    ✕
                </button>
            )}
        </div>

      </div>

      {filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div key={session._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200 relative group">
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                  <button onClick={() => handleEditClick(session)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition bg-white border border-gray-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                  </button>
                  <button onClick={() => handleDeleteClick(session)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition bg-white border border-gray-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex gap-4">
                   <div className="flex flex-col items-center justify-center bg-green-50 text-green-700 rounded-lg w-16 h-16 flex-shrink-0 border border-green-100">
                      <span className="text-xs font-bold uppercase">{new Date(session.sessionDate).toLocaleString('en-US', { month: 'short' })}</span>
                      <span className="text-xl font-bold">{new Date(session.sessionDate).getDate()}</span>
                   </div>
                   <div>
                      <h3 className="font-bold text-lg text-gray-800">{session.book ? session.book.title : 'Unknown Book'}</h3>
                      <p className="text-sm text-gray-500 mb-2">by {session.book?.author ? `${session.book.author.first_name} ${session.book.author.last_name}` : 'Unknown'}</p>
                      {session.notes && <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic border border-gray-100 max-w-xl">"{session.notes}"</div>}
                   </div>
                </div>
                <div className="flex items-center gap-6 md:border-l md:border-gray-100 md:pl-6 pr-12">
                    <div className="text-center"><p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Time</p><p className="text-lg font-semibold text-gray-800">{session.durationMinutes} min</p></div>
                    <div className="text-center"><p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pages</p><p className="text-lg font-semibold text-gray-800">{session.pagesRead}</p></div>
                    <div className="hidden sm:block text-center"><p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Speed</p><p className="text-sm font-medium text-green-600">{session.durationMinutes > 0 ? (Math.round(session.pagesRead / session.durationMinutes * 10) / 10) : 0} p/m</p></div>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
           {sessions.length > 0 ? (
               <p className="text-gray-500 mb-4">
                   No sessions found {bookFilterQuery && `for "${bookFilterQuery}"`}
                   {startDate && endDate && ` between ${startDate} and ${endDate}`}
                   .
               </p>
           ) : (
               <>
                <p className="text-gray-500 mb-4">No reading sessions logged yet.</p>
                <button onClick={() => setIsAddModalOpen(true)} className="text-green-600 font-semibold hover:text-green-700">Start tracking &rarr;</button>
               </>
           )}
        </div>
      )}

      <AddSessionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSessionAdded={fetchSessions} />
      <EditSessionModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} session={sessionToEdit} onSessionUpdated={fetchSessions} />
      <DeleteSessionModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} session={sessionToDelete} onSessionDeleted={fetchSessions} />

    </div>
  );
};

export default ReadingSessions;