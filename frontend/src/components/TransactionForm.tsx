import React, { useState } from 'react';
import API from '../services/axiosInstance';
import { toast } from 'react-toastify';

interface Props {
  onAdd: () => void;
  defaultType?: 'income' | 'expense';
  categories: { id: number; name: string }[];
}

const TransactionForm: React.FC<Props> = ({ onAdd, defaultType = 'expense', categories }) => {
  const [form, setForm] = useState({
    amount: '',
    type: defaultType,
    category_id: '',  // ✅ store the ID instead of name
    note: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.amount || Number(form.amount) <= 0) newErrors.amount = "Enter a valid amount";
    if (form.type === 'expense' && !form.category_id) {
      newErrors.category_id = 'Category is required for expenses';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors");
      return;
    }

    try {
      await API.post('/transactions/add', {
        amount: parseFloat(form.amount),
        type: form.type,
        category_id: parseInt(form.category_id),
        note: form.note
      });
      toast.success("Transaction added");
      onAdd();
      setForm({ amount: '', type: defaultType, category_id: '', note: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add transaction");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Add {form.type === 'income' ? 'Income' : 'Expense'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="input"
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
        </div>

        <select name="type" value={form.type} onChange={handleChange} className="input">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {form.type==='expense'&& (
          <div>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
          </div>
      )}

        <input
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
          className="input"
        />

        <button type="submit" className="btn-primary w-full">Save</button>
      </form>
    </div>
  );
};

export default TransactionForm;
