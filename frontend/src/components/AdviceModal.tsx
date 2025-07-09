import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/axiosInstance';
import { toast } from 'react-hot-toast';
import { FaLightbulb, FaTimes } from 'react-icons/fa';

interface AdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdviceModal: React.FC<AdviceModalProps> = ({ isOpen, onClose }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAdvice();
    }
  }, [isOpen]);

  const fetchAdvice = async () => {
    setAdvice(null);
    setLoading(true);
    try {
      const res = await API.get('/ai/advice');
      setAdvice(res.data.advice);
    } catch (err: any) {
      toast.error('Failed to fetch AI advice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 max-w-2xl w-full relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <FaTimes size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <FaLightbulb className="text-yellow-500" />
              <h2 className="text-xl font-semibold">Smart Budgeting Tips</h2>
            </div>

            {loading ? (
              <div className="text-center py-6 text-blue-500 font-medium animate-pulse">
                Fetching personalized advice from Gemini AI...
              </div>
            ) : advice ? (
              <div className="space-y-2 text-gray-700 dark:text-gray-200 max-h-80 overflow-y-auto">
                {advice.split('\n').map((line, index) => (
                  line.trim() ? (
                    <div key={index} className="flex gap-2 items-start">
                      <span className="text-green-500">📌</span>
                      <span>{line.trim()}</span>
                    </div>
                  ) : null
                ))}
              </div>
            ) : (
              <div className="text-center text-red-500">No advice found.</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdviceModal;
