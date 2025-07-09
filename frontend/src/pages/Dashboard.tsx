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
import MetricCard from '../components/MetricCard';
import AdviceModal from '../components/AdviceModal';
import { FaWallet, FaArrowUp, FaArrowDown, FaPiggyBank, FaRobot } from 'react-icons/fa';
import { toast } from 'react-toastify';

type TabType = 'income' | 'expense' | 'charts';

const Dashboard = () => {
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 px-4 sm:px-6">
      <Navbar />
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard title="Total Balance" value={balance} icon={<FaWallet />} color="blue" />
          <MetricCard title="Monthly Income" value={monthlyIncome} icon={<FaArrowUp />} color="green" />
          <MetricCard title="Monthly Expenses" value={monthlyExpenses} icon={<FaArrowDown />} color="red" />
          <MetricCard title="Savings This Month" value={monthlyIncome - monthlyExpenses} icon={<FaPiggyBank />} color="gray" />
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          {['income', 'expense', 'charts'].map((tab) => (
            <button key={tab}
              className={`px-4 py-2 rounded font-semibold text-white shadow ${activeTab === tab ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setActiveTab(tab as TabType)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {(activeTab === 'income' || activeTab === 'expense') && (
          <div className="flex justify-center mt-6">
            <button className={`px-4 py-2 rounded-md font-semibold shadow text-white ${activeTab === 'income' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'}`} onClick={() => setIsModalOpen(true)}>
              + Add {activeTab}
            </button>
          </div>
        )}

        <div className="mt-6">
          {(activeTab === 'income' || activeTab === 'expense') && (
            <>
              <TransactionList
                transactions={transactions.filter(t => t.type === activeTab)}
                onEdit={(txn) => setEditingTxn(txn)}
                onDelete={handleDelete}
                onUpdated={fetchData}
              />
              <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TransactionForm
                  onAdd={() => {
                    setIsModalOpen(false);
                    fetchData();
                  }}
                  categories={categories}
                  defaultType={activeTab}
                />
              </TransactionModal>
              <EditTransactionModal
                isOpen={!!editingTxn}
                onClose={() => setEditingTxn(null)}
                onUpdated={fetchData}
                transaction={editingTxn}
                categories={categories}
              />
            </>
          )}
          {activeTab === 'charts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Charts & Analysis</h2>
                <button
                  onClick={() => setShowAdviceModal(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                >
                  <FaRobot />
                  Get Budget Advice
                </button>
              </div>
              <Chart data={transactions} />
            </div>
          )}
        </div>

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
        {flashMsg && (
          <FlashMessage message={flashMsg} type={flashType} onClose={() => setFlashMsg('')} />
        )}
        <AdviceModal isOpen={showAdviceModal} onClose={() => setShowAdviceModal(false)} />
      </div>
    </div>
  );
};

export default Dashboard;
