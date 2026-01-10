import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import AddChallengeModal from '../components/readingChallenges/AddChallengeModal';
import DeleteChallengeModal from '../components/readingChallenges/DeleteChallengeModal';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeTab, setActiveTab] = useState('ongoing');

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('/api/challenges', config);
      if (response.data.success) {
        setChallenges(response.data.data);
      }
    } catch (err) { 
      console.error(err);
      toast.error('Failed to load challenges');
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleOpenDeleteModal = (challenge) => {
    setChallengeToDelete(challenge);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!challengeToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/challenges/${challengeToDelete._id}`, config);
      
      toast.success('Challenge deleted');
      setChallenges(prev => prev.filter(c => c._id !== challengeToDelete._id));
      setIsDeleteModalOpen(false);
      setChallengeToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete challenge');
    } finally {
      setIsDeleting(false);
    }
  };

  const getDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Ended';
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === 'ongoing') {
      return challenge.status === 'ACTIVE' || challenge.status === 'FAILED';
    }
    return challenge.status === 'COMPLETED';
  });

  if (loading) return <div className="p-12 text-center text-gray-500">Loading challenges...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reading Challenges</h1>
          <p className="text-gray-500 text-sm">Push your limits and track your goals</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition font-medium shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Challenge
        </button>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'ongoing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ongoing ({challenges.filter(c => c.status !== 'COMPLETED').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'completed' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed ({challenges.filter(c => c.status === 'COMPLETED').length})
          </button>
        </div>
      </div>

      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            const percent = Math.min(100, Math.round((challenge.currentProgress / challenge.targetValue) * 100));
            const isCompleted = challenge.status === 'COMPLETED';

            return (
              <div key={challenge._id} className={`bg-white p-6 rounded-xl shadow-sm border transition duration-200 flex flex-col justify-between h-full group relative ${isCompleted ? 'border-green-100 bg-green-50/30' : 'border-gray-100 hover:shadow-md'}`}>
                
                <div className="absolute top-4 right-4 flex gap-2">
                    {isCompleted && (
                        <span className="bg-green-100 text-green-700 p-1 rounded-full">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </span>
                    )}
                    
                    <button 
                        onClick={() => handleOpenDeleteModal(challenge)}
                        className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete challenge"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-4 pr-8">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{challenge.title}</h3>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        {isCompleted 
                          ? `Finished on ${new Date(challenge.updatedAt).toLocaleDateString()}` 
                          : getDaysLeft(challenge.endDate)
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-1.5">
                      <span>Progress</span>
                      <span className={isCompleted ? 'text-green-600' : 'text-blue-600'}>{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${
                          isCompleted ? 'bg-green-500' : 'bg-blue-600'
                        }`} 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                  <div className="text-gray-500">
                    Target: <span className="font-semibold text-gray-700">{challenge.targetValue} {challenge.type === 'PAGES' ? 'pages' : 'min'}</span>
                  </div>
                  
                  <div className="text-right font-medium text-gray-500">
                    {isCompleted ? (
                       <span className="text-green-600 font-bold">Done! 🏆</span>
                    ) : (
                       <span>{challenge.currentProgress} done</span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="mx-auto h-12 w-12 text-gray-300 mb-4 flex items-center justify-center bg-gray-50 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 11-4.5 0v3.375m7.5 0v2.25m-7.5 0v2.25m-12 5.25h24" /></svg>
          </div>
          <p className="text-gray-500 mb-4">
            {activeTab === 'ongoing' 
              ? "No active challenges found." 
              : "No completed challenges yet. Keep reading!"}
          </p>
          {activeTab === 'ongoing' && (
            <button onClick={() => setIsAddModalOpen(true)} className="text-blue-600 font-semibold hover:text-blue-700">
              Create challenge &rarr;
            </button>
          )}
        </div>
      )}

      <AddChallengeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onChallengeAdded={fetchChallenges} 
      />

      <DeleteChallengeModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
            setIsDeleteModalOpen(false);
            setChallengeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        challengeTitle={challengeToDelete?.title}
        loading={isDeleting}
      />
    </div>
  );
};

export default Challenges;