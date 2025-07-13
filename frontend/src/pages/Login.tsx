import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useValidation } from '../hooks/useValidation';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import Illustration from '../assets/business.jpg';
import { FiMail } from 'react-icons/fi';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import API from '../services/axiosInstance';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { validateEmailFormat } = useValidation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateEmailFormat(email) || !password) {
    toast.error('Please enter valid email and password');
    return;
  }

  setLoading(true);
  try {
    const error = await login(email, password, rememberMe);

    if (error) {
      toast.error(error.message);
    } else {
      navigate('/dashboard'); 
    }
  } catch (err: any) {
    toast.error('Login failed');
  } finally {
    setLoading(false);
  }
};


  const handleForgotPassword = async () => {
    if (!validateEmailFormat(email)) {
      toast.error('Please enter a valid email to reset password');
      return;
    }
    try {
      await API.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent! Check your email.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl transition-all duration-500 hover:shadow-indigo-300">
        {/* Left Section - Login Form */}
        <motion.div
          className="p-10 flex flex-col justify-center"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-6">
            Welcome back to <span className="text-indigo-600">FinLogix</span>
          </h2>

          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg hover:shadow-md hover:bg-gray-50 transition-all duration-300"
          >
            <img src="https://img.icons8.com/color/16/google-logo.png" alt="Google" />
            Continue with Google
          </button>

          <div className="flex items-center gap-2 my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <FiMail className="absolute top-3 left-3 text-gray-400 group-hover:text-indigo-500 transition" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white transition-shadow hover:shadow-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <RiShieldKeyholeLine className="absolute top-3 left-3 text-gray-400 group-hover:text-indigo-500 transition" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white transition-shadow hover:shadow-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-500 hover:text-indigo-500 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-indigo-600"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-indigo-600 hover:underline hover:text-indigo-700 transition"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded-lg font-medium transition-all 
                ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:shadow-xl hover:scale-[1.02]'}
              `}
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Don’t have an account?{' '}
            <a
              href="/register"
              className="text-indigo-600 font-medium hover:underline hover:text-indigo-700 transition"
            >
              Register
            </a>
          </p>
        </motion.div>

        {/* Right Section - Illustration */}
        <motion.div
          className="hidden md:flex items-center justify-center p-10"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <img
            src={Illustration}
            alt="Login Illustration"
            className="max-w-full h-auto drop-shadow-xl transition-transform duration-500 rounded-l-[100px] opacity-95 mix-blend-multiply hover:scale-105"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
