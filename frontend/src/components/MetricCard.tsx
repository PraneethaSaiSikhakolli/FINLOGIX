// Refreshed MetricCard.tsx with animations and teal palette

import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color = 'gray' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center gap-2 hover:shadow-xl transition"
    >
      <div className={`text-${color}-600 text-2xl`}>{icon}</div>
      <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
      <p className="text-xl font-bold text-gray-800">₹{value}</p>
    </motion.div>
  );
};

export default MetricCard;
