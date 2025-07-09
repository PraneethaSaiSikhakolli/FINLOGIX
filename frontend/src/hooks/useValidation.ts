import API from '../services/axiosInstance';

export const useValidation = () => {
  const validateEmailFormat = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return 'Weak';
    if (/[A-Z]/.test(password) && /\d/.test(password)) return 'Strong';
    return 'Medium';
  };

  const checkEmailAvailable = async (email: string) => {
  try {
    const res = await API.get(`/auth/check-email?email=${email}`);
    return res.data.available;
  } catch {
    return false;
  }
};


  return { validateEmailFormat, getPasswordStrength, checkEmailAvailable };
};
