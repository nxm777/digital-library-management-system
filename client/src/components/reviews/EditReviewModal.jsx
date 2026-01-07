import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import StarRating from '../StarRating';

const EditReviewModal = ({ isOpen, onClose, review, onReviewUpdated }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (review && isOpen) {
      setRating(review.rating);
      setComment(review.comment || '');
    }
  }, [review, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = { rating, comment };

      await axios.put(`/api/reviews/${review._id}`, payload, config);

      toast.success('Review updated successfully');
      onReviewUpdated();
      onClose();

    } catch (error) {
      console.error(error);
      toast.error('Failed to update review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4" onClick={e => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Review for:</p>
            <p className="font-bold text-gray-800">{review.bookId?.title || 'Unknown Book'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <p className="text-xs text-gray-400 text-right">{comment.length}/1000</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition shadow-md disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;