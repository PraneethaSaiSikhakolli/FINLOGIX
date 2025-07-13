import { useState } from 'react';
import API from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUserShield, FaSearch, FaCrown } from 'react-icons/fa';

interface User {
  id: number;
  email: string;
  role: string;
}

const PromoteUser = () => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const searchUser = async () => {
    if (!email.trim()) return toast.warn('Enter email');
    setLoading(true);
    try {
      const res = await API.get(`/user/by-email/${encodeURIComponent(email)}`);
      setUser(res.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'User not found';
      toast.error(msg);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const promote = async () => {
    if (!user) return;
    try {
      const res = await API.post(`/admin/promote/${user.id}`);
      toast.success(res.data.message || 'Promoted!');
      setUser(null);
      setEmail('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to promote user';
      toast.error(msg);
    }
  };

  return (
    <motion.div
      className="bg-[#FAF9F7] rounded-2xl shadow-lg p-6 border border-[#EAE7DC] mt-8 w-full max-w-xl mx-auto transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-[#2A2A2A] mb-6 flex items-center gap-2">
        <span className="text-yellow-500 text-3xl">
          <FaUserShield />
        </span>
        Promote User to Admin
      </h2>

      {/* Email input and search button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8B6A6] bg-white"
        />
        <button
          onClick={searchUser}
          disabled={loading}
          className="bg-[#9A8C98] hover:bg-[#8B7C88] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors sm:min-w-[140px]"
        >
          <FaSearch /> {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* User info display */}
      {user && (
        <motion.div
          className="border border-[#EAE7DC] rounded-xl p-5 bg-[#F5F4F2] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[#1F1F1F] font-medium">
            📧 <strong>Email:</strong> {user.email}
          </p>
          <p className="text-[#1F1F1F] font-medium">
            🎖️ <strong>Role:</strong> {user.role}
          </p>

          {user.role === 'admin' ? (
            <p className="text-green-600 font-semibold">✅ Already an admin</p>
          ) : (
            <button
              onClick={promote}
              className="bg-[#6C757D] hover:bg-[#5A6268] text-white px-4 py-2 rounded flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FaCrown /> Promote to Admin
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PromoteUser;
