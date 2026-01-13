import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin dashboard</h1>
        <p className="text-gray-500 text-sm">Manage books, reviews and users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link 
            to="/admin/books"
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition duration-200 flex flex-col items-center text-center cursor-pointer"
        >
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">Manage books</h3>
            <p className="text-sm text-gray-500">Add, edit or remove books from database</p>
        </Link>

        <Link 
            to="/admin/reviews"
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition duration-200 flex flex-col items-center text-center cursor-pointer"
        >
            <div className="bg-yellow-100 p-4 rounded-full text-yellow-600 mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">Manage reviews</h3>
            <p className="text-sm text-gray-500"> Remove unwanted reviews</p>
        </Link>

        <Link 
          to="/admin/users"
          className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition duration-200 flex flex-col items-center text-center cursor-pointer"
        >
            <div className="bg-purple-100 p-4 rounded-full text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">Manage users</h3>
            <p className="text-sm text-gray-500">Display all users and give permissions</p>
        </Link>

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 opacity-50 min-h-[200px]">
            <span className="text-sm font-medium">More modules soon</span>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;