import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 font-sans">
      
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Your personal virtual library
        </h1>
        
        <p className="text-gray-600 text-lg mb-8">
          Track your reading progress, organize your collection, and discover new insights. The smartest way to manage your books.
        </p>
        
        <div className="flex gap-4 justify-center">
          
          <Link 
            to="/register" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            Create account
          </Link>

          <Link 
            to="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            Log in
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default LandingPage;