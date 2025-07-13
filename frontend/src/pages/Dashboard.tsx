import { useEffect, useState } from 'react';
import API from '../services/axiosInstance';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import EditTransactionModal from '../components/EditTransactionModal';
import TransactionModal from '../components/TransactionModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import FlashMessage from '../components/FlashMessage';
import Chart from '../components/Chart';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import AdviceModal from '../components/AdviceModal';
import { FaWallet, FaArrowUp, FaArrowDown, FaPiggyBank, FaRobot } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  type TabType = 'income' | 'expense' | 'charts';

  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingTxn, setEditingTxn] = useState<any | null>(null);
  const [balance, setBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('income');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [flashMsg, setFlashMsg] = useState('');
  const [flashType, setFlashType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/user/categories');
      setCategories(res.data);
    } catch (err: any) {
      toast.error(err.response?.data || err.message);
    }
  };

  const fetchData = async () => {
    try {
      const res = await API.get('/transactions/list');
      const data = res.data;
      setTransactions(data);

      let total = 0, income = 0, expenses = 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      data.forEach((txn: any) => {
        const txnDate = new Date(txn.timestamp);
        if (txn.type === 'income') {
          total += txn.amount;
          if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
            income += txn.amount;
          }
        } else {
          total -= txn.amount;
          if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
            expenses += txn.amount;
          }
        }
      });

      setBalance(total);
      setMonthlyIncome(income);
      setMonthlyExpenses(expenses);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load transactions');
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/transactions/delete/${deleteId}`);
      setFlashMsg('Transaction deleted');
      setFlashType('success');
      fetchData();
    } catch (err: any) {
      setFlashMsg(err.response?.data?.message || 'Delete failed');
      setFlashType('error');
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleTransactionAdded = () => {
    setIsModalOpen(false);
    fetchData();
    setFlashMsg(`${activeTab} added successfully`);
    setFlashType('success');
  };

  const handleTransactionUpdated = () => {
    setEditingTxn(null);
    fetchData();
    setFlashMsg(`${activeTab} updated successfully`);
    setFlashType('success');
  };

  return (
    <div className="min-h-screen font-[Poppins] bg-gradient-to-br from-white to-teal-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-16">
        <div className="w-56 min-w-[220px] hidden md:block h-full">
          <Sidebar onTabChange={(tab) => setActiveTab(tab)} />
        </div>

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <motion.h1
            className="text-3xl font-bold text-teal-700 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Welcome back 👋
          </motion.h1>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <MetricCard title="Total Balance" value={balance} icon={<FaWallet />} color="teal" />
            <MetricCard title="Monthly Income" value={monthlyIncome} icon={<FaArrowUp />} color="green" />
            <MetricCard title="Monthly Expenses" value={monthlyExpenses} icon={<FaArrowDown />} color="red" />
            <MetricCard title="Savings This Month" value={monthlyIncome - monthlyExpenses} icon={<FaPiggyBank />} color="gray" />
          </motion.div>

          {(activeTab === 'income' || activeTab === 'expense') && (
            <div className="flex justify-end mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg transition-all"
                onClick={() => setIsModalOpen(true)}
              >
                + Add {activeTab}
              </motion.button>
            </div>
          )}

          {(activeTab === 'income' || activeTab === 'expense') && (
            <>
              <TransactionList
                transactions={transactions.filter(t => t.type === activeTab)}
                onEdit={setEditingTxn}
                onDelete={handleDelete}
                onUpdated={fetchData}
              />

              <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TransactionForm
                  onAdd={handleTransactionAdded}
                  categories={categories}
                  defaultType={activeTab}
                />
              </TransactionModal>

              <EditTransactionModal
                isOpen={!!editingTxn}
                onClose={() => setEditingTxn(null)}
                onUpdated={handleTransactionUpdated}
                transaction={editingTxn}
                categories={categories}
              />
            </>
          )}

          {activeTab === 'charts' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Charts & Analysis</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowAdviceModal(true)}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                >
                  <FaRobot /> Get Budget Advice
                </motion.button>
              </div>
              <Chart data={transactions} />
            </motion.div>
          )}

          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
          />

          <AnimatePresence>
            {flashMsg && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <FlashMessage message={flashMsg} type={flashType} onClose={() => setFlashMsg('')} />
              </motion.div>
            )}
          </AnimatePresence>

          <AdviceModal isOpen={showAdviceModal} onClose={() => setShowAdviceModal(false)} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
