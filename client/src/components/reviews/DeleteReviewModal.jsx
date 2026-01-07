import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DeleteReviewModal = ({ isOpen, onClose, review, onReviewDeleted }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !review) return null;

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/reviews/${review._id}`, config);

      toast.success('Review deleted');
      onReviewDeleted();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 border border-red-100" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-red-600">Delete Review?</h2>
        <p className="text-gray-600 mb-6 text-sm">
            Are you sure you want to delete your review for <b>"{review.bookId?.title}"</b>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button onClick={handleDelete} disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-md">
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReviewModal;