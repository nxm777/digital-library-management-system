import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DeleteSessionModal = ({ isOpen, onClose, session, onSessionDeleted }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !session) return null;

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/reading-sessions/${session._id}`, config);

      toast.success('Reading session deleted');
      onSessionDeleted();
      onClose();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = new Date(session.sessionDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 border border-red-100 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3 text-red-600">
                <div className="bg-red-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Delete Session</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-6 text-gray-600 text-sm leading-relaxed">
            <p className="mb-2">Are you sure you want to delete this reading session? This action cannot be undone.</p>
            
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-3">
                <p className="font-bold text-gray-800 text-base mb-1">
                    {session.book?.title || 'Unknown Book'}
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                    <li className="flex items-center gap-2">
                        <span className="font-semibold">Date:</span> {formattedDate}
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="font-semibold">Pages:</span> {session.pagesRead}
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="font-semibold">Time:</span> {session.durationMinutes} min
                    </li>
                </ul>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-md flex items-center gap-2"
            >
              {isSubmitting ? 'Deleting...' : 'Yes, Delete Session'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteSessionModal;