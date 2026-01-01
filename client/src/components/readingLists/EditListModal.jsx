import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditListModal = ({ isOpen, onClose, list, onListUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (list) {
      setFormData({
        title: list.title || '',
        description: list.description || '',
        tags: list.tags ? [...list.tags] : []
      });
      setTagInput('');
    }
  }, [list, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(',', '');

      if (newTag && !formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag]
        });
        setTagInput('');
      } else if (formData.tags.includes(newTag)) {
        toast.error('Tag already exists');
      }
    }
    else if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      const newTags = [...formData.tags];
      newTags.pop();
      setFormData({ ...formData, tags: newTags });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const titleTrimmed = formData.title.trim();
    if (titleTrimmed.length === 0 || titleTrimmed.length > 50) {
        toast.error('Title must be between 1 and 50 characters');
        return;
    }
    if (formData.description.length > 300) {
        toast.error('Description is too long (max 300)');
        return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        title: titleTrimmed,
        description: formData.description.trim(),
        tags: tagInput.trim() 
            ? [...formData.tags, tagInput.trim()] 
            : formData.tags
      };

      await axios.put(`/api/reading-lists/${list._id}`, payload, config);

      toast.success('List updated successfully');
      onListUpdated();
      onClose();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update list');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Reading List</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">List Title <span className="text-red-500">*</span></label>
                <span className={`text-xs ${formData.title.length === 50 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    {formData.title.length}/50
                </span>
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={50}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <span className={`text-xs ${formData.description.length === 300 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    {formData.description.length}/300
                </span>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={300}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            
            <div className="w-full p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent bg-white flex flex-wrap gap-2 min-h-[46px]">
                
                {formData.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md border border-gray-200">
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                    </span>
                ))}

                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 min-w-[100px] outline-none text-sm bg-transparent"
                    placeholder={formData.tags.length === 0 ? "Type and press Enter..." : ""}
                />
            </div>
            <p className="text-xs text-gray-400 mt-1">Press <kbd className="font-sans bg-gray-100 px-1 rounded">Enter</kbd> or <kbd className="font-sans bg-gray-100 px-1 rounded">Comma</kbd> to add a tag.</p>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditListModal;