import { useState, useEffect } from 'react';
import axios from 'axios';
import AddReviewModal from '../components/reviews/AddReviewModal';
import EditReviewModal from '../components/reviews/EditReviewModal'; 
import DeleteReviewModal from '../components/reviews/DeleteReviewModal'; 
import StarRating from '../components/StarRating';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [showMyReviews, setShowMyReviews] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchReviews = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const baseUrl = showMyReviews ? '/api/reviews' : '/api/reviews/all';
        const url = debouncedSearch ? `${baseUrl}?search=${debouncedSearch}` : baseUrl;

        const response = await axios.get(url, config);
        if (response.data.success) setReviews(response.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [debouncedSearch, showMyReviews]);

  const formatBookAuthor = (authorObj) => {
      if (!authorObj) return 'Unknown Author';
      if (authorObj.first_name) return `${authorObj.first_name} ${authorObj.last_name}`;
      return authorObj;
  };

  const handleEditClick = (review) => {
      setReviewToEdit(review);
      setIsEditModalOpen(true);
  };

  const handleDeleteClick = (review) => {
      setReviewToDelete(review);
      setIsDeleteModalOpen(true);
  };

  if (loading) return <div className="p-12 text-center">Loading reviews...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{showMyReviews ? 'My Reviews' : 'Community Reviews'}</h1>
          <p className="text-gray-500 text-sm">{showMyReviews ? 'Manage your ratings' : 'See what others are reading'}</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition font-bold shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Write Review
        </button>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
              <input type="text" placeholder="Search reviews..." className="w-full p-3 pl-10 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center bg-white px-4 py-2 rounded-xl border border-gray-300 shadow-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="accent-yellow-500 w-4 h-4" checked={showMyReviews} onChange={(e) => setShowMyReviews(e.target.checked)} />
                  <span className="text-sm font-medium text-gray-700">My reviews only</span>
              </label>
          </div>
      </div>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((review) => {
            
            const currentUserId = currentUser?._id || currentUser?.id;
            const reviewAuthorId = review.userId?._id;
            const isOwner = currentUser && reviewAuthorId === currentUserId;

            return (
                <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200 flex flex-col sm:flex-row gap-6 relative group">
                
                {isOwner && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white p-1 rounded shadow-sm border border-gray-100">
                        <button onClick={() => handleEditClick(review)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                        </button>
                        <button onClick={() => handleDeleteClick(review)} className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                    </div>
                )}

                <div className="flex-shrink-0 flex flex-col items-center sm:w-32">
                   <div className="w-24 h-36 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400 shadow-inner overflow-hidden relative">
                       {review.bookId?.imageUrl ? (
                           <img src={review.bookId.imageUrl} alt="Cover" className="w-full h-full object-cover" />
                       ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                       )}
                   </div>
                   
                   <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-yellow-400"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                            <span className="text-xs font-bold text-gray-700">
                                {review.bookId?.rating?.average || 0}
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-0.5">
                            ({review.bookId?.rating?.count || 0} votes)
                        </span>
                   </div>
                </div>

                <div className="flex-1">
                   <div className="flex justify-between items-start mb-2">
                       <div>
                           <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">{review.bookId ? review.bookId.title : 'Unknown Book'}</h3>
                           <p className="text-sm text-gray-500">by {formatBookAuthor(review.bookId?.author)}</p>
                       </div>
                       <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                   </div>
                   <div className="mb-4"><StarRating rating={review.rating} readOnly={true} /></div>
                   <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm mb-6">{review.comment}</div>
                   <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                       <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-xs">
                           {review.userId?.username ? review.userId.username.slice(0, 2).toUpperCase() : 'U'}
                       </div>
                       <div className="text-xs">
                           <span className="text-gray-400">Reviewed by </span>
                           <span className="font-bold text-gray-700">{review.userId ? review.userId.username : 'Unknown User'}</span>
                       </div>
                   </div>
                </div>

                </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-500 mb-4">{searchQuery ? `No reviews found for "${searchQuery}"` : "No reviews yet."}</p>
           <button onClick={() => setIsAddModalOpen(true)} className="text-yellow-600 font-semibold hover:text-yellow-700">Write Review &rarr;</button>
        </div>
      )}

      <AddReviewModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onReviewAdded={fetchReviews} />
      <EditReviewModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} review={reviewToEdit} onReviewUpdated={fetchReviews} />
      <DeleteReviewModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} review={reviewToDelete} onReviewDeleted={fetchReviews} />
    </div>
  );
};

export default Reviews;