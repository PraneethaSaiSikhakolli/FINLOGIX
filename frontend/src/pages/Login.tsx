import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useValidation } from '../hooks/useValidation';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import financeIllustration from '../assets/business.jpg';
import googleLogo from '../assets/google-logo.jpeg';
import FormField from '../components/FormField';

const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const { validateEmailFormat } = useValidation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailFormat(email)) {
      return toast.error('🚫 Please enter a valid email address.');
    }
    if (password.length < 6) {
      return toast.error('🔒 Password must be at least 6 characters.');
    }

    const error = await login(email, password, rememberMe);
    if (error) toast.error(error.message);

  };

  const handleGoogleLogin = () => {
    toast.info('🔧 Google login integration coming soon.');
    // TODO: Replace with actual Google login logic
  };

  return (
    <div className="flex min-h-screen font-[Poppins]">
      <div className="hidden md:flex w-1/2 bg-indigo-100 items-center justify-center p-10">
        <img
          src={financeIllustration}
          alt="Finance illustration"
          className="w-full max-w-lg rounded-xl shadow-xl animate-float"
        />
      </div>

      <motion.div
        className="flex flex-col justify-center w-full md:w-1/2 items-center bg-white"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700">FinLogix Login</h2>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 rounded-lg flex items-center justify-center py-2 hover:bg-gray-100 transition"
          >
            <img src={googleLogo} alt="Google logo" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
            <span className="h-px bg-gray-300 flex-1"></span>
            OR
            <span className="h-px bg-gray-300 flex-1"></span>
          </div>

          <FormField
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
          />

          <FormField
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            showToggle
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword((prev) => !prev)}
          />

          {/* Forgot password */}
          <div className="text-right text-xs text-indigo-600 cursor-pointer hover:underline -mt-4">
            Forgot password?
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              id="rememberMe"
              className="rounded border-gray-300"
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Authenticating…</span>
              </span>
            ) : (
              'Login'
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{' '}
            <button
              type="button"
              className="text-indigo-600 underline hover:text-indigo-800"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
