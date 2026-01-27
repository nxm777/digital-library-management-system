import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Login = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('auth/login', data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Successfully logged in');
      navigate('/dashboard');

    } catch (error) {
      console.log('Login error:', error.response?.data);
      let errorMessage = 'Login failed. Please check your credentials';
      if (error.response) {
          if (error.response.data.message) {
              errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
              errorMessage = error.response.data.error;
          }
      }
      toast.error(errorMessage, {
        id: 'invalid-credentials'
      }
        
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 font-sans">
      <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        <Link 
          to="/" 
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition duration-200"
          title="Back to Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Log in
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email or username
            </label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.emailOrUsername ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="jdoe12@example.com or johndoe12"
              {...register('emailOrUsername', { required: 'Email or username is required', minLength: { value: 3, message: 'Email or username must be at least 3 characters' } })}
            />
            {errors.emailOrUsername && <p className="text-red-500 text-xs mt-1">{errors.emailOrUsername.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                
                className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                {...register('password', { required: 'Password is required' })}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;