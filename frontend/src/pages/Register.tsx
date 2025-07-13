import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useValidation } from '../hooks/useValidation';
import { toast } from 'react-toastify';
import { FiUser, FiMail } from 'react-icons/fi';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import illustration from '../assets/conceptual-template.jpg';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const { validateEmailFormat, getPasswordStrength, checkEmailAvailable } = useValidation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [strength, setStrength] = useState<'Weak' | 'Medium' | 'Strong' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  let debounceTimer: ReturnType<typeof setTimeout>;
  const debounceEmailCheck = (email: string) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (validateEmailFormat(email)) {
        const available = await checkEmailAvailable(email);
        if (!available) {
          setErrors((prev) => ({ ...prev, email: 'Email already exists' }));
        }
      }
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'password') {
      if (!value) setStrength(null);
      else setStrength(getPasswordStrength(value));
    }
    if (name === 'email') debounceEmailCheck(value);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!validateEmailFormat(form.email)) errs.email = 'Invalid email';
    if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords must match';
    if (!form.agree) errs.agree = 'Please accept terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Welcome to FinLogix!');
      const loginErr = await login(form.email, form.password, true);
      if (!loginErr) navigate('/dashboard');
      else toast.error('Login failed after registration');
    } catch {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthWidth = () => {
    if (!strength) return '0%';
    if (strength === 'Strong') return '100%';
    if (strength === 'Medium') return '60%';
    return '30%';
  };

  const strengthColor = !strength
    ? 'bg-transparent'
    : strength === 'Strong'
    ? 'bg-green-500'
    : strength === 'Medium'
    ? 'bg-yellow-400'
    : 'bg-red-500';

  return (
    <div className="min-h-screen flex font-[Poppins] bg-gradient-to-br from-white to-blue-50 transition-all duration-700">
      {/* Left Illustration */}
      <motion.div
        className="hidden md:flex w-1/2 relative"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={illustration}
          alt="Register"
          className="w-full h-full object-contain p-10 rounded-r-[100px] mix-blend-multiply opacity-95 transition-transform duration-500 hover:scale-[1.02]"
        />
      </motion.div>

      {/* Right Form Section */}
      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center px-6 py-10 bg-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <motion.div
          className="w-full max-w-md"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-6">
            Join <span className="text-indigo-600">FinLogix</span> Today
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            {/* Name */}
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 ring-indigo-400 transition hover:shadow-md">
                <FiUser className="text-gray-400 mr-2" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full outline-none text-sm bg-transparent"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 ring-indigo-400 transition hover:shadow-md">
                <FiMail className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full outline-none text-sm bg-transparent"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 ring-indigo-400 transition hover:shadow-md">
                <RiShieldKeyholeLine className="text-blue-600 mr-2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full outline-none text-sm bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-blue-600 ml-2"
                >
                  {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              <div className="h-2 rounded bg-gray-200 mt-2 overflow-hidden transition-all">
                <div
                  className={`h-full transition-all duration-300 ${strengthColor}`}
                  style={{ width: getStrengthWidth() }}
                ></div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 mb-1">Confirm Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 ring-indigo-400 transition hover:shadow-md">
                <RiShieldKeyholeLine className="text-blue-600 mr-2" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full outline-none text-sm bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-blue-600 ml-2"
                >
                  {showConfirm ? <BsEyeSlashFill /> : <BsEyeFill />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="mt-1 accent-indigo-600"
              />
              <label className="text-xs text-gray-700">
                I agree to the{' '}
                <span className="underline text-indigo-600 hover:text-indigo-700 transition">
                  Terms & Privacy
                </span>
              </label>
            </div>
            {errors.agree && <p className="text-xs text-red-500 mt-1">{errors.agree}</p>}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-sm font-medium rounded-lg shadow-md transition-all text-white
                ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'}
              `}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
            >
              {loading ? 'Registering...' : 'Sign Up'}
            </motion.button>

            <p className="text-xs text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="underline text-indigo-600 hover:text-indigo-500"
              >
                Login
              </button>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
