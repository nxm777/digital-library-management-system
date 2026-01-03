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

const AddSessionModal = ({ isOpen, onClose, onSessionAdded }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    pagesRead: '',
    durationMinutes: '',
    sessionDate: new Date().toISOString().slice(0, 16),
    notes: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const searchBooks = async () => {
      if (!debouncedSearch || selectedBook) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`/api/books?search=${debouncedSearch}&limit=5`, config);
        setSearchResults(response.data.data || []); 
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    };

    searchBooks();
  }, [debouncedSearch, selectedBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBook) {
      toast.error('Please select a book');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        book: selectedBook._id,
        pagesRead: Number(formData.pagesRead),
        durationMinutes: Number(formData.durationMinutes),
        sessionDate: formData.sessionDate,
        notes: formData.notes
      };

      await axios.post('/api/reading-sessions', payload, config);

      toast.success('Session added successfully!');
      onSessionAdded();
      
      setFormData({
        pagesRead: '',
        durationMinutes: '',
        sessionDate: new Date().toISOString().slice(0, 16),
        notes: ''
      });
      setSelectedBook(null);
      setSearchQuery('');
      onClose();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add session');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Log Reading Session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Book <span className="text-red-500">*</span></label>
            
            {selectedBook ? (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-bold text-green-800">{selectedBook.title}</p>
                  <p className="text-xs text-green-600">
                    {selectedBook.author?.first_name} {selectedBook.author?.last_name}
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setSelectedBook(null); setSearchQuery(''); }}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Search for a book..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {searchResults.map(book => (
                      <li 
                        key={book._id}
                        onClick={() => setSelectedBook(book)}
                        className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-0 border-gray-100"
                      >
                        <p className="font-medium text-sm text-gray-800">{book.title}</p>
                        <p className="text-xs text-gray-500">
                          {book.author?.first_name} {book.author?.last_name}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
                  placeholder="e.g. 45"
                  required
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pages Read <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={formData.pagesRead}
                  onChange={(e) => setFormData({...formData, pagesRead: e.target.value})}
                  placeholder="e.g. 20"
                  required
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Date <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-600"
              value={formData.sessionDate}
              onChange={(e) => setFormData({...formData, sessionDate: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              rows="3"
              maxLength="500"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
              placeholder="Thoughts on what you read..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
            <p className="text-xs text-gray-400 text-right">{formData.notes.length}/500</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition">Log Session</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddSessionModal;