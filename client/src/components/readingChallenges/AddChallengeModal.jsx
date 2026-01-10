import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddChallengeModal = ({ isOpen, onClose, onChallengeAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'PAGES',
    targetValue: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleQuickDuration = (type) => {
    const date = new Date();
    
    if (type === 'WEEK') {
      date.setDate(date.getDate() + 7);
    } else if (type === 'MONTH') {
      date.setMonth(date.getMonth() + 1);
    }
    
    setFormData({ ...formData, endDate: formatDateForInput(date) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('/api/challenges', formData, config);
      toast.success('Challenge created successfully!');
      onChallengeAdded();
      setFormData({ title: '', type: 'PAGES', targetValue: '', endDate: '' });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">New Challenge</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Challenge Title</label>
            <input 
              type="text" required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Read 12 Books in 2024"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="PAGES">Pages</option>
                <option value="TIME">Time (Minutes)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
              <input 
                type="number" required min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={formData.type === 'PAGES' ? "1000" : "600"}
                value={formData.targetValue}
                onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleQuickDuration('WEEK')}
                className="flex-1 py-1.5 px-3 text-sm bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition"
              >
                1 Week
              </button>
              <button
                type="button"
                onClick={() => handleQuickDuration('MONTH')}
                className="flex-1 py-1.5 px-3 text-sm bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition"
              >
                1 Month
              </button>
            </div>

            <input 
              type="date" required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
            <p className="text-xs text-gray-400 mt-1">Select predefined duration or pick a custom date.</p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition font-medium text-sm disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChallengeModal;