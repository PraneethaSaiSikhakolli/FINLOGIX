import { useEffect, useState } from 'react';
import API from '../services/axiosInstance';
import {
  FaEnvelope,
  FaUserShield,
  FaUserCircle,
  FaKey,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';

interface UserProfile {
  email: string;
  role: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    API.get('/user/user-details')
      .then((res) => setUser(res.data))
      .catch(() => {
        toast.error('Failed to fetch user details.');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      toast.error('Please fill out both fields.');
      return;
    }

    try {
      await API.post('/user/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
      });

      toast.success('Password changed successfully ✅');
      setShowChangePassword(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.error || 'An unexpected error occurred';

      if (status === 401) {
        toast.error('Incorrect current password 🔐');
      } else if (status === 400) {
        toast.error('Invalid new password. Please use a strong one.');
      } else {
        toast.error(`Error: ${message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <ClipLoader color="#0f766e" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <FaUserCircle className="text-4xl text-teal-600" />
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <FaEnvelope className="text-teal-600" />
          <p className="text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FaUserShield className="text-teal-600" />
          <p className="text-gray-700">
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      </div>

      {!showChangePassword ? (
        <button
          onClick={() => setShowChangePassword(true)}
          className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-2"
        >
          <FaKey /> Change Password
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded pr-10 focus:outline-teal-600"
            />
            <span
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            >
              {showOld ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded pr-10 focus:outline-teal-600"
            />
            <span
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePasswordChange}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowChangePassword(false);
                setOldPassword('');
                setNewPassword('');
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
