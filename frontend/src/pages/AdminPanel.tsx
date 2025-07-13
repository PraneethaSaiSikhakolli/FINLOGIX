import { useState } from 'react';
import CategoryManager from '../components/admin/CategoryManager';
import UserSummaries from '../components/admin/UserSummaries';
import Overspenders from '../components/admin/Overspenders';
import PromoteUser from '../components/admin/PromoteUser';
import CategoryStats from '../components/admin/CategoryStats';
import AdminList from '../components/admin/AdminList';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaListAlt, FaUsers, FaExclamationTriangle, FaUserShield,
  FaChartPie, FaUserCog, FaChartLine, FaPlus, FaBars, FaTimes
} from 'react-icons/fa';

const tabs = [
  { name: 'Categories', icon: <FaListAlt />, component: <CategoryManager /> },
  { name: 'User Summaries', icon: <FaUsers />, component: <UserSummaries /> },
  { name: 'Overspenders', icon: <FaExclamationTriangle />, component: <Overspenders /> },
  { name: 'Promote User', icon: <FaUserShield />, component: <PromoteUser /> },
  { name: 'Category Stats', icon: <FaChartPie />, component: <CategoryStats /> },
  { name: 'Admin List', icon: <FaUserCog />, component: <AdminList /> },
  { name: 'Analytics', icon: <FaChartLine />, component: <AnalyticsCharts /> },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const breadcrumb = `Admin > ${tabs[activeTab].name}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col md:flex-row relative overflow-hidden">
      {/* Floating background blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-96 h-96 bg-neutral-300 rounded-full opacity-10 animate-ping top-10 left-10 blur-3xl" />
        <div className="absolute w-72 h-72 bg-neutral-400 rounded-full opacity-10 animate-pulse top-1/2 left-2/3 blur-2xl" />
        <div className="absolute w-60 h-60 bg-neutral-200 rounded-full opacity-10 animate-ping bottom-10 right-10 blur-2xl" />
      </div>

      {/* Mobile menu toggle */}
      <button
        className="fixed top-4 left-4 z-40 bg-black text-white p-2 rounded-md shadow-md md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-60 min-h-full bg-white border-r border-gray-200 p-6 shadow-md z-20 flex-col">
        <h2 className="text-3xl font-bold text-black mb-8 text-center tracking-tight">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          {tabs.map((tab, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveTab(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                ${activeTab === i ? 'bg-black text-white shadow-lg' : 'text-gray-800 hover:bg-neutral-100 hover:text-black'}`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* Sidebar for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar drawer */}
            <motion.aside
              className="fixed top-0 left-0 w-64 h-full bg-white p-6 shadow-xl z-40 flex flex-col md:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-600">
                  <FaTimes size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {tabs.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab(i);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                      ${activeTab === i ? 'bg-black text-white shadow-lg' : 'text-gray-800 hover:bg-neutral-100 hover:text-black'}`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-12 py-8 z-10">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-center mb-2 text-black tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🛠️ Admin Dashboard
        </motion.h1>
        <p className="text-gray-500 mb-6 text-sm italic text-center">{breadcrumb}</p>

        <section className="w-full max-w-6xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 mb-24 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {tabs[activeTab].component}
            </motion.div>
          </AnimatePresence>

          {(tabs[activeTab].name === 'Categories' || tabs[activeTab].name === 'Promote User') && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-neutral-800 z-50"
              onClick={() => {
                const target = document.querySelector('input');
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              <FaPlus />
            </motion.button>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
