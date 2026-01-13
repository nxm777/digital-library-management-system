import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/users?limit=10&page=${page}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleRoleChange = async (userId, nextRole) => {
    setUpdatingId(userId);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/users/${userId}/role`,
        { role: nextRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition">
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage users</h1>
            <p className="text-gray-500 text-sm">All users and roles</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or mail adress..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email address</th>
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4">Created at</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-700">{user.email}</td>
                <td className="p-4 text-sm text-gray-700">{user.username}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  {user.role === 'admin' ? (
                    <button
                      disabled={updatingId === user._id || (currentUser && (currentUser._id === user._id || currentUser.id === user._id))}
                      onClick={() => handleRoleChange(user._id, 'user')}
                      className="px-3 py-1.5 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded disabled:opacity-50"
                    >
                      Revoke admin
                    </button>
                  ) : (
                    <button
                      disabled={updatingId === user._id}
                      onClick={() => handleRoleChange(user._id, 'admin')}
                      className="px-3 py-1.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded disabled:opacity-50"
                    >
                      Grant admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No users in the database
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page <b>{page}</b> z <b>{totalPages}</b>
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
