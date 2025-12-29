import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({mode: "onChange"});
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const passwordValue = watch('password', '');
  const passwordRequirements = [
    { label: 'At least 8 characters', isValid: (value) => value.length >= 8 },
    { label: 'One lowercase letter', isValid: (value) => /[a-z]/.test(value) },
    { label: 'One uppercase letter', isValid: (value) => /[A-Z]/.test(value) },
    { label: 'One number', isValid: (value) => /[0-9]/.test(value) },
    { label: 'One special character', isValid: (value) => /[^a-zA-Z0-9]/.test(value) },
  ];

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/auth/register', data);
      const { token, user } = response.data;

       localStorage.setItem('token', token);
       localStorage.setItem('user', JSON.stringify(user));
    
       toast.success(`Account created successfully`);
       navigate('/dashboard');

    } catch (error) {
      console.log('Registration error:', error.response?.data);
      let errorMessage = 'Registration failed. Please try again';
      if (error.response) {
          if (error.response.data.message) errorMessage = error.response.data.message;
          else if (error.response.data.errors) errorMessage = error.response.data.errors[0].msg || error.response.data.errors[0].message;
      }
      toast.error(errorMessage);
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
          Create account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
             <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">First name</label>
                <input type="text" className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} placeholder="John" {...register('firstName', { required: 'First name is required', minLength: { value: 2, message: 'First name must be at least 2 characters' } })} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
             </div>
             
             <div>
               <label className="block text-gray-700 text-sm font-bold mb-2">Last name</label>
               <input type="text" className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Doe" {...register('lastName', { required: 'Last name is required', minLength: { value: 2, message: 'Last name must be at least 2 characters' } })} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
             </div>

             <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input type="text" className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.username ? 'border-red-500' : 'border-gray-300'}`} placeholder="johndoe12" {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Username must be at least 3 characters' } })} />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
             </div>

             <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="jdoe12@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email format' } })} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
             </div>

             <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                {...register('password', { 
                  required: 'Password is required',
                  validate: (value) => {
                    const allRequirementsMet = passwordRequirements.every(req => req.isValid(value));
                    return allRequirementsMet || "Password needs to meet all requirements above.";
                  }
                })}
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

            <ul className="mt-3 space-y-1">
                  {passwordRequirements.map((req, index) => {
                    const isMet = req.isValid(passwordValue);
                    return (
                      <li 
                        key={index} 
                        className={`text-xs flex items-center gap-2 transition-colors duration-200 ${isMet ? 'text-green-600 font-medium' : 'text-gray-500'}`}
                      >
                        {isMet ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 opacity-50">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                          </svg>
                        )}
                        {req.label}
                      </li>
                    );
                  })}
                </ul>

            {errors.password && errors.password.type === 'validate' && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
            {errors.password && errors.password.type === 'required' && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
          </div>

             <button type="submit" disabled={isSubmitting} className={`w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>{isSubmitting ? 'Creating account...' : 'Create account'}</button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
         Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:text-green-800 font-bold">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;