import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const InfoField = ({ label, value, isSecure = false, onEdit, editLabel = "Edit" }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="mb-2 sm:mb-0">
      <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
      <p className={`text-gray-900 font-semibold ${isSecure ? 'tracking-widest' : ''}`}>
        {value}
      </p>
    </div>
    {onEdit && (
      <button 
        onClick={onEdit}
        className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
      >
        {editLabel}
      </button>
    )}
  </div>
);

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {

    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setEmailInput(parsed.email || '');
    } else {
    }
    setLoading(false);
  }, []);

  const handleEmailSave = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Enter valid email address');
      return;
    }
    setSavingEmail(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        '/api/users/me/email',
        { email: emailInput.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        toast.success('Email updated');
        setIsEditingEmail(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error while updating email';
      toast.error(msg);
    } finally {
      setSavingEmail(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Enter current and new password');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must have at least 8 letters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Invalid confirmation');
      return;
    }

    setSavingPassword(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        '/api/users/me/password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password updated successfully');
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error updating password';
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading profile...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans py-10 px-4">
      
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center mb-8">
           <Link 
             to="/dashboard" 
             className="mr-4 text-gray-400 hover:text-white transition"
             title="Back to dashboard"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
             </svg>
           </Link>
           <div>
             <h1 className="text-2xl text-white font-bold">My Profile</h1>
             <p className="text-gray-400 text-sm">Manage your account settings</p>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            
            <div className="bg-green-600 p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 text-2xl font-bold uppercase shadow-sm">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div className="text-white">
                    <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                    <p className="text-green-100 text-sm">@{user.username}</p>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Personal Information
                </h3>
                
                <InfoField 
                    label="First Name" 
                    value={user.firstName} 
                />
                <InfoField 
                    label="Last Name" 
                    value={user.lastName} 
                />
                 <InfoField 
                    label="Username" 
                    value={user.username} 
                />
            </div>

            <div className="p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Security & Contact
                </h3>

                <InfoField 
                    label="Email Address" 
                    value={isEditingEmail ? '' : user.email} 
                    onEdit={() => setIsEditingEmail(true)}
                    editLabel="Update"
                />

                {isEditingEmail && (
                  <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg flex flex-col gap-3">
                    <label className="text-sm font-semibold text-gray-700">New email address</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => { setIsEditingEmail(false); setEmailInput(user.email); }}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        disabled={savingEmail}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEmailSave}
                        disabled={savingEmail}
                        className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60"
                      >
                        {savingEmail ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}
                
                <InfoField 
                    label="Password" 
                    value="••••••••••••" 
                    isSecure={true}
                    onEdit={() => setIsEditingPassword(true)}
                    editLabel="Change password"
                />

                {isEditingPassword && (
                  <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg flex flex-col gap-3">
                    <label className="text-sm font-semibold text-gray-700">Current password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <label className="text-sm font-semibold text-gray-700">New password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <label className="text-sm font-semibold text-gray-700">Confirm new password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setIsEditingPassword(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        disabled={savingPassword}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePasswordSave}
                        disabled={savingPassword}
                        className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60"
                      >
                        {savingPassword ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}
            </div>

            <div className="p-4 bg-gray-100 text-center border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    Member since {formatDate(user.createdAt || new Date())}
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;