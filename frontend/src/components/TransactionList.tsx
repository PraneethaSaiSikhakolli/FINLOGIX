import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import AudioRecorder from './AudioRecorder';
import API from '../services/axiosInstance';
import { motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  note?: string;
  timestamp: string;
  category: Category;
}

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  onUpdated: () => void;
}

const TransactionList: React.FC<Props> = ({ transactions, onEdit, onDelete, onUpdated }) => {
  const [audioUrls, setAudioUrls] = useState<{ [key: number]: string | null }>({});
  const [loadingAudio, setLoadingAudio] = useState(false);

  useEffect(() => {
    const fetchAllAudio = async () => {
      const urls: { [key: number]: string | null } = {};
      setLoadingAudio(true);

      try {
        const res = await API.get('/audio/list');
        const audioTransactionIds: number[] = res.data.ids;

        await Promise.all(
          transactions.map(async (txn) => {
            if (!audioTransactionIds.includes(txn.id)) return;
            try {
              const res = await API.get(`/audio/get/${txn.id}`);
              urls[txn.id] = res.data.url;
            } catch {
              urls[txn.id] = null;
            }
          })
        );

        setAudioUrls(urls);
      } catch {
        console.error('❌ Failed to fetch audio list');
        setAudioUrls({});
      } finally {
        setLoadingAudio(false);
      }
    };

    if (transactions.length > 0) {
      fetchAllAudio();
    }
  }, [transactions]);

  if (!transactions.length) {
    return <p className="text-center text-gray-500 mt-4">No transactions found.</p>;
  }

  return (
    <div className="mt-6 space-y-6">
      {loadingAudio && (
        <div className="text-indigo-600 italic animate-pulse mt-4">Loading audio data...</div>
      )}
      {transactions.map((txn) => (
        <motion.div
          key={txn.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-full text-white ${
                  txn.type === 'income' ? 'bg-green-500' : 'bg-rose-500'
                }`}
              >
                {txn.type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
              </div>
              <div>
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                  {txn.category.name}
                </p>
                {txn.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{txn.note}</p>
                )}
                <p className="text-xs text-gray-500">
                  {format(new Date(txn.timestamp), 'PPpp')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(txn)}
                className="text-sky-600 hover:text-sky-800 transition"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(txn.id)}
                className="text-rose-600 hover:text-rose-800 transition"
                title="Delete"
              >
                <FaTrash />
              </button>
              <span
                className={`text-lg font-bold ${
                  txn.type === 'income' ? 'text-green-600' : 'text-rose-600'
                }`}
              >
                {txn.type === 'income' ? '+' : '-'} ₹{txn.amount}
              </span>
            </div>
          </div>

          <AudioRecorder
            transactionId={txn.id}
            existingUrl={`http://localhost:5000/static/uploads/${txn.id}.webm`}
            onUpload={onUpdated}
            onDelete={async () => {
              try {
                await API.delete(`/audio/delete/${txn.id}`);
                toast.success('Audio deleted');
                onUpdated();
              } catch {
                toast.error('Failed to delete audio');
              }
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionList;
