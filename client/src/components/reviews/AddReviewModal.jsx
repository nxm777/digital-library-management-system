import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import StarRating from '../StarRating';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const AddReviewModal = ({ isOpen, onClose, onReviewAdded }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const searchBooks = async () => {
      if (!debouncedSearch || selectedBook) {
        setSearchResults([]);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`/api/books?search=${debouncedSearch}&limit=5`, config);
        setSearchResults(response.data.data || []); 
      } catch (error) { console.error(error); }
    };
    searchBooks();
  }, [debouncedSearch, selectedBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBook) return toast.error('Please select a book');
    if (rating === 0) return toast.error('Please select a rating');
    if (!comment.trim()) return toast.error('Please write a review');

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      

      if (!token) {
        toast.error('You are not logged in!');
        return;
      }

      const config = { 
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        } 
      };

      const payload = {
        bookId: selectedBook._id,
        rating: rating,
        comment: comment
      };

      console.log('Wysyłam dane:', payload);

      await axios.post('/api/reviews', payload, config);

      toast.success('Review added!');
      onReviewAdded();
      
      setSelectedBook(null);
      setRating(0);
      setComment('');
      setSearchQuery('');
      onClose();

    } catch (error) {
      console.error('Błąd dodawania:', error.response || error);
      
      if (error.response?.status === 409 || error.response?.data?.message?.includes('duplicate')) {
          toast.error('You have already reviewed this book');
      } else if (error.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
      } else {
          const msg = error.response?.data?.message || 'Failed to add review';
          toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4" onClick={e => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Write a Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Book</label>
            {selectedBook ? (
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="font-bold text-yellow-800">{selectedBook.title}</p>
                  <p className="text-xs text-yellow-600">{selectedBook.author?.first_name} {selectedBook.author?.last_name}</p>
                </div>
                <button type="button" onClick={() => { setSelectedBook(null); setSearchQuery(''); }} className="text-yellow-700 text-sm font-medium hover:underline">Change</button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Search for a book..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {searchResults.map(book => (
                      <li key={book._id} onClick={() => setSelectedBook(book)} className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-0 border-gray-100">
                        <p className="font-medium text-sm text-gray-800">{book.title}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex justify-center py-2 bg-gray-50 rounded-lg border border-gray-100">
                <StarRating rating={rating} setRating={setRating} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
            <textarea
              rows="5"
              maxLength="1000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
              placeholder="What did you think about this book?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <p className="text-xs text-gray-400 text-right">{comment.length}/1000</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-md disabled:opacity-50">
                {isSubmitting ? 'Posting...' : 'Post Review'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;