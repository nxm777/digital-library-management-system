import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookModal = ({ isOpen, onClose, bookToEdit, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: '',
    authorFirstName: '',
    authorLastName: '',
    isbn: '', 
    publisher: '',  
    genre: '', 
    numOfPages: '',
    publicationYear: '', 
    description: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bookToEdit && isOpen) {
      setFormData({
        title: bookToEdit.title || '',
        authorFirstName: bookToEdit.author?.first_name || '',
        authorLastName: bookToEdit.author?.last_name || '',
        isbn: bookToEdit.isbn || '',
        publisher: bookToEdit.publisher || '',
        genre: bookToEdit.genres ? bookToEdit.genres.join(', ') : '',
        numOfPages: bookToEdit.numOfPages || '',
        publicationYear: bookToEdit.publicationYear || '',
        description: bookToEdit.description || '',
      });
      setImagePreview(bookToEdit.imageUrl || bookToEdit.coverImage || '');
      setSelectedFile(null);
    } else {
      setFormData({
        title: '', authorFirstName: '', authorLastName: '', isbn: '', publisher: '', genre: '', numOfPages: '', publicationYear: '', description: ''
      });
      setImagePreview('');
      setSelectedFile(null);
    }
  }, [bookToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();

    formDataToSend.append('title', formData.title);
    formDataToSend.append('isbn', formData.isbn);
    formDataToSend.append('publisher', formData.publisher);
    
    formDataToSend.append('numOfPages', Number(formData.numOfPages));
    formDataToSend.append('publicationYear', Number(formData.publicationYear));
    formDataToSend.append('description', formData.description);


    formDataToSend.append('author[first_name]', formData.authorFirstName);
    formDataToSend.append('author[last_name]', formData.authorLastName);


    const genresArray = formData.genre.split(',').map(g => g.trim()).filter(g => g !== '');
    
    genresArray.forEach((genre, index) => {
        formDataToSend.append(`genres[${index}]`, genre);
    });

    if (selectedFile) {
      formDataToSend.append('image', selectedFile); 
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (bookToEdit) {
        await axios.put(`/api/books/${bookToEdit._id}`, formDataToSend, config);
        toast.success('Book updated successfully');
      } else {
        await axios.post('/api/books', formDataToSend, config);
        toast.success('Book created successfully');
      }

      onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
            {bookToEdit ? 'Edit Book' : 'Add New Book'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
            />
            {imagePreview && (
                <div className="mt-4 flex flex-col items-center sm:items-start">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img src={imagePreview} alt="Preview" className="h-32 w-24 object-cover rounded shadow-md border" onError={(e) => e.target.style.display = 'none'}/>
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author First Name</label>
              <input type="text" name="authorFirstName" value={formData.authorFirstName} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Last Name</label>
              <input type="text" name="authorLastName" value={formData.authorLastName} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
              <input type="number" name="numOfPages" value={formData.numOfPages} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genres (comma separated)</label>
            <input 
                type="text" 
                name="genre" 
                value={formData.genre} 
                onChange={handleChange} 
                placeholder="Psychology, Self Help"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {isSubmitting ? 'Saving...' : (bookToEdit ? 'Update Book' : 'Add Book')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookModal;