import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaHome, FaUserCircle, FaSignOutAlt, FaTools } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.body.classList.remove('dark');
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("🔍 Decoded Role:", decoded.role);
        setIsAdmin(decoded?.role?.toLowerCase() === 'admin');
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white text-black shadow-md z-50 h-16 flex items-center justify-between px-4 sm:px-6 md:px-10">
      <div className="text-2xl font-bold text-teal-700">
        <Link to="/dashboard" className="hover:opacity-80 transition">FinLogix</Link>
      </div>

      <div className="flex items-center space-x-4 sm:space-x-6 text-sm font-medium">
        <Link to="/" className="flex items-center gap-1 hover:text-teal-600 transition">
          <FaHome className="text-base" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <Link to="/profile" className="flex items-center gap-1 hover:text-teal-600 transition">
          <FaUserCircle className="text-base" />
          <span className="hidden sm:inline">Profile</span>
        </Link>

        {isAdmin && (
          <Link to="/admin" className="flex items-center gap-1 hover:text-teal-600 transition">
            <FaTools className="text-base" />
            <span className="hidden sm:inline">Admin Panel</span>
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white px-3 sm:px-4 py-1.5 rounded-full transition text-xs sm:text-sm"
        >
          <FaSignOutAlt className="text-base" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
