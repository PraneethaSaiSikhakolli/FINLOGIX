// src/components/admin/AdminList.tsx
import { useEffect, useState } from 'react';
import API from '../../services/axiosInstance';
import { FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface AdminUser {
  id: number;
  email: string;
}

const AdminList = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/list')
      .then(res => setAdmins(res.data))
      .catch(() => toast.error('Failed to fetch admin users'))
      .finally(() => setLoading(false)); 
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto mt-6 space-y-4"
    >
      <h2 className="text-2xl font-semibold text-[#2A2A2A] mb-4">Admin Users</h2>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading...</div>
      ) : admins.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No admin users found.</div>
      ) : (
        admins.map((admin) => (
          <motion.div
            key={admin.id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow border border-[#F0F0F0] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <FaUserShield className="text-indigo-600 text-xl" />
              </div>
              <div>
                <p className="text-base text-gray-700 font-medium">{admin.email}</p>
                <p className="text-xs text-gray-400">ID: {admin.id}</p>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default AdminList;
