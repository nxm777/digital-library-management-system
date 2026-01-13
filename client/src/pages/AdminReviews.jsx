import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/reviews/all?limit=10&page=${page}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.data) {
        setReviews(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
         toast.error("Session expired");
      } else {
         toast.error('Error while fetching reviews');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchReviews(), 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this review?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/reviews/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      toast.error('Error while deleting');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
             <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.53.044.739.676.354 1.014l-4.182 3.876a.562.562 0 00-.172.543l1.205 5.378a.563.563 0 00-.811.603l-4.71-2.783a.562.562 0 00-.586 0l-4.71 2.783a.563.563 0 00-.811-.603l1.205-5.378a.562.562 0 00-.172-.543L.342 10.41c-.385-.338-.176-.97.354-1.014l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition">
                ←
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Manage reviews</h1>
                <p className="text-gray-500 text-sm">Remove unwanted reviews</p>
            </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
            <input 
            type="text" 
            placeholder="Search by title or comment..." 
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
              <th className="p-4">Title</th>
              <th className="p-4">User</th>
              <th className="p-4">Rating</th>
              <th className="p-4 w-1/3">Comment</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                        {review.bookId?.title || <span className="text-red-400 italic">Removed book</span>}
                    </div>
                  </td>
                  
                  <td className="p-4 text-sm">
                     {review.userId ? (
                        <div className="flex flex-col">
                            <span className="text-gray-900 font-medium">{review.userId.username}</span>
                            <span className="text-gray-500 text-xs">{review.userId.email}</span>
                        </div>
                     ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs" title="Użytkownik został usunięty z bazy">
                            Account deleted
                        </span>
                     )}
                  </td>

                  <td className="p-4">
                    {renderStars(review.rating)}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="line-clamp-2" title={review.comment}>
                        {review.comment ? `"${review.comment}"` : <span className="italic text-gray-400">No comment</span>}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                        onClick={() => handleDelete(review._id)} 
                        className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1.5 hover:bg-red-50 rounded transition flex items-center gap-1 ml-auto"
                    >
                        Delete
                    </button>
                  </td>
                </tr>
            ))}
            {reviews.length === 0 && !loading && (
                <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">No reviews in the database</td>
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
                  Page <b>{page}</b> z <b>{totalPages}</b>
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
    </div>
  );
};

export default AdminReviews;