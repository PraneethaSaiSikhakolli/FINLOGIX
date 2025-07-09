// src/components/admin/UserSummaries.tsx
import { useEffect, useState } from 'react';
import API from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface Summary {
  user_id: number;
  email: string;
  total_spent: number;
}

const UserSummaries = () => {
  const [data, setData] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/user-summaries')
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load user summaries'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      className="bg-[#FAF9F7] rounded-2xl shadow-lg p-6 border border-[#EAE7DC] mt-8 max-w-5xl mx-auto transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-[#2A2A2A] mb-6 flex items-center gap-2">
        <span className="text-yellow-500 text-3xl">💰</span> User Spending Summaries
      </h2>

      {loading ? (
        <p className="text-gray-500 italic">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 italic">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#EDEDED] bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F7F6F3] text-[#3F3F3F]">
              <tr>
                <th className="p-3 font-semibold tracking-wide">#</th>
                <th className="p-3 font-semibold tracking-wide">Email</th>
                <th className="p-3 font-semibold tracking-wide text-right">Total Spent (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, index) => (
                <motion.tr
                  key={user.user_id}
                  className={`transition-colors duration-300 border-t border-[#EDEDED] ${
                    user.total_spent > 10000 ? 'bg-[#FFF0F0]' : 'hover:bg-[#F3F3F3]'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="p-3 text-[#2C2C2C] font-semibold">{index + 1}</td>
                  <td className="p-3 text-[#1F1F1F] font-medium">{user.email}</td>
                  <td className="p-3 text-right text-[#5B3926] font-bold">
                    ₹{user.total_spent.toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default UserSummaries;
