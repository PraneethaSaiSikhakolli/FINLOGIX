// src/components/Navbar.tsx
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  FaSignOutAlt,
  FaUserShield,
  FaHome,
  FaUserCircle
} from 'react-icons/fa';

const Navbar = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex justify-between items-center">
      <div
        className="text-2xl font-bold text-indigo-600 cursor-pointer hover:text-indigo-700 transition"
        onClick={() => navigate('/dashboard')}
      >
        FinLogix
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
        >
          <FaHome className="text-sm" />
          Home
        </button>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
          >
            <FaUserShield className="text-sm" />
            Admin Panel
          </button>
        )}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
            <FaUserCircle className="text-lg text-indigo-500" />
                <button
                  onClick={() => navigate('/profile')}
                  className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Profile
                </button>
            {currentUser.email}
          </div>
        )}

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="sm:hidden focus:outline-none"
        >
          <FaUserCircle className="text-2xl text-indigo-500" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-12 w-40 bg-white text-gray-800 rounded shadow-lg z-50">
            <div
              onClick={() => {
                navigate('/profile');
                setDropdownOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              Profile
            </div>
            <div
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-1"
            >
              <FaSignOutAlt className="text-xs" />
              Logout
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="hidden sm:inline bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
