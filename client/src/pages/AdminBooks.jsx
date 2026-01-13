import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import BookModal from '../components/admin/BookModal';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/books?limit=10&page=${page}&search=${search}`);
      
      if (response.data.data) {
        setBooks(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchBooks(), 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/books/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Book deleted');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const openAddModal = () => {
    setBookToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setBookToEdit(book);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition">
                ←
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Manage Books</h1>
                <p className="text-gray-500 text-sm">Database management</p>
            </div>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add New Book
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
            <input 
            type="text" 
            placeholder="Search by title or author..." 
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">Cover</th>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Genre</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {books.map((book) => {
                const imageSrc = book.imageUrl || book.coverImage;

                return (
                  <tr key={book._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                        {imageSrc ? (
                            <img 
                                src={imageSrc} 
                                alt={book.title} 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-900">{book.title}</td>
                    <td className="p-4 text-gray-600">
                        {book.author?.first_name} {book.author?.last_name}
                    </td>
                    <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                            {Array.isArray(book.genres) && book.genres.map((g, idx) => (
                                <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">{g}</span>
                            ))}
                            {!Array.isArray(book.genres) && book.genre && (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">{book.genre}</span>
                            )}
                        </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(book)} className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1.5 hover:bg-blue-50 rounded transition">Edit</button>
                      <button onClick={() => handleDelete(book._id)} className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1.5 hover:bg-red-50 rounded transition">Delete</button>
                    </td>
                  </tr>
                );
            })}
            {books.length === 0 && !loading && (
                <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No books found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                  Previous
              </button>
              <span className="text-sm text-gray-600">
                  Page <b>{page}</b> of <b>{totalPages}</b>
              </span>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                  Next
              </button>
          </div>
      )}

      <BookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        bookToEdit={bookToEdit} 
        onRefresh={fetchBooks} 
      />

    </div>
  );
};

export default AdminBooks;