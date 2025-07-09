import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useValidation } from '../hooks/useValidation';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import registerIllustration from '../assets/conceptual-template.jpg';
import FormField from '../components/FormField';

const Register: React.FC = () => {
  const { register, login } = useAuth(); 
  const navigate = useNavigate();
  const { validateEmailFormat, getPasswordStrength, checkEmailAvailable } = useValidation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [strength, setStrength] = useState<'Weak' | 'Medium' | 'Strong'>('Weak');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    setForm(prev => ({ ...prev, [name]: updatedValue }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'password') {
      setStrength(getPasswordStrength(value));
    }

    if (name === 'email' && validateEmailFormat(value)) {
      const available = await checkEmailAvailable(value);
      setEmailAvailable(available);
      if (!available) {
        setErrors(prev => ({ ...prev, email: 'Email already registered' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmailFormat(form.email)) newErrors.email = 'Invalid email';
    if (!emailAvailable) newErrors.email = 'Email is already taken';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.agree) newErrors.agree = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('🎉 Registered successfully! Logging you in...');
      
      const loginError = await login(form.email, form.password, true);
      if (!loginError) {
        navigate('/dashboard'); 
      } else {
        toast.error(loginError.message);
      }
    } catch {
      toast.error('Registration failed');
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 'Strong':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="flex min-h-screen font-[Poppins]">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-100">
        <img src={registerIllustration} alt="Register Visual" className="w-3/4" />
      </div>

      <motion.div
        className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 rounded-lg space-y-6 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-purple-700">Create Your Account</h2>

          <FormField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            error={errors.name}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            showToggle
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword(prev => !prev)}
          />

          <div className="w-full h-2 mt-2 rounded bg-gray-200">
            <div className={`h-2 ${getStrengthColor()} rounded`} style={{ width: `${strength === 'Strong' ? 100 : strength === 'Medium' ? 66 : 33}%` }} />
          </div>
          <p className="text-sm text-gray-500">Password Strength: {strength}</p>

          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
            showToggle
            showPassword={confirmShowPassword}
            onToggleVisibility={() => setConfirmShowPassword(prev => !prev)}
          />

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mt-1"
            />
            <label className="text-sm text-gray-700">
              I agree to the <span className="text-blue-600 underline">Terms & Privacy</span>
            </label>
          </div>
          {errors.agree && <p className="text-red-500 text-sm">{errors.agree}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-lg transition"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-purple-700 cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
