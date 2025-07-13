import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaMoneyBillWave, FaExchangeAlt, FaChartPie } from 'react-icons/fa';

interface SidebarProps {
  onTabChange: (tab: 'income' | 'expense' | 'charts') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onTabChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'income' | 'expense' | 'charts'>('income');

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: 'Income', value: 'income', icon: <FaMoneyBillWave /> },
    { name: 'Expense', value: 'expense', icon: <FaExchangeAlt /> },
    { name: 'Charts', value: 'charts', icon: <FaChartPie /> },
  ];

  return (
    <motion.aside
      animate={{ width: isOpen ? 220 : 60 }}
      transition={{ duration: 0.3 }}
      className="bg-teal-800 text-white h-full max-h-screen overflow-y-auto shadow-lg flex flex-col py-6 px-3"
    >
      <button
        className="text-white text-xl self-end mb-6 md:hidden"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      <nav className="space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.value}
            onClick={() => {
              setActiveTab(item.value as any);
              onTabChange(item.value as 'income' | 'expense' | 'charts');
            }}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition duration-200 font-medium hover:bg-teal-600 ${
              activeTab === item.value ? 'bg-white text-teal-800 font-bold' : ''
            }`}
          >
            <span>{item.icon}</span>
            {isOpen && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
