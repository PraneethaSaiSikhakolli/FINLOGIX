// src/components/EditTransactionModal.tsx
import React, { useState, useEffect } from 'react';
import API from '../services/axiosInstance';
import { toast } from 'react-toastify';
import TransactionModal from './TransactionModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  transaction: {
    id: number;
    amount: number;
    type: 'income' | 'expense';
    category: { id: number; name: string };
    note?: string;
  } | null;
  categories: { id: number; name: string }[];
}

const EditTransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUpdated,
  transaction,
  categories,
}) => {
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category_id: '',
    note: '',
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        amount: transaction.amount.toString(),
        type: transaction.type,
        category_id: transaction.category.id.toString(),
        note: transaction.note || '',
      });
    }
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;
    const payload: any = {
      amount: parseFloat(form.amount),
      type: form.type,
      note: form.note,
    };

    if (form.type === 'expense') {
      payload.category_id = parseInt(form.category_id);
    }
    try {
      await API.put(`/transactions/edit/${transaction.id}`, payload);
      toast.success('Transaction updated');
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <TransactionModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleUpdate} className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">Edit Transaction</h2>

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="input"
        />

        <select name="type" value={form.type} onChange={handleChange} className="input">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {form.type==='expense' && (
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
        <input
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
          className="input"
        />

        <button type="submit" className="btn-primary w-full">
          Save Changes
        </button>
      </form>
    </TransactionModal>
  );
};

export default EditTransactionModal;
