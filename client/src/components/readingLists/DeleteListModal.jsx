import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DeleteListModal = ({ isOpen, onClose, listId, listTitle, onDeleted }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isMatch = inputValue === listTitle;

  const handleDelete = async () => {
    if (!isMatch) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/reading-lists/${listId}`, config);

      toast.success('Reading list deleted successfully');
      
      onDeleted(); 
      onClose();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete list');
      setIsSubmitting(false);
    }
  };

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
                <h2 className="text-xl font-bold text-gray-900">Delete Reading List</h2>
            </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-gray-900">"{listTitle}"</span>? 
            <br />
            This action cannot be undone. All books in this list will be unlinked.
        </p>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-gray-900 select-all normal-case">"{listTitle}"</span> to confirm
            </label>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder={listTitle}
                autoFocus
            />
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
              disabled={!isMatch || isSubmitting}
              className={`px-4 py-2 text-white font-medium rounded-lg transition flex items-center gap-2 ${
                  !isMatch || isSubmitting 
                  ? 'bg-red-300 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isSubmitting ? 'Deleting...' : 'Delete this list'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteListModal;