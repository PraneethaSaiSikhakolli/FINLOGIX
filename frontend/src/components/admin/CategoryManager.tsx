// src/components/admin/CategoryManager.tsx
import { useEffect, useState } from 'react';
import API from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaTags } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/admin/categories');
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return toast.warn('Name required');
    try {
      await API.post('/admin/categories/add', { name: newName });
      toast.success('Category added');
      setNewName('');
      fetchCategories();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error adding category';
      toast.error(msg);
    }
  };

  const handleUpdate = async () => {
    if (!editName.trim() || editId === null) return;
    try {
      await API.put(`/admin/categories/update/${editId}`, { name: editName });
      toast.success('Category updated');
      setEditId(null);
      setEditName('');
      fetchCategories();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Update failed';
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/admin/categories/delete/${deleteId}`);
      toast.success('✅ Category deleted');
      setDeleteId(null);
      fetchCategories();
    } catch (err: any) {
      const msg = err?.message;
      if (err?.response?.status === 400) {
        toast.error("Category is in use and can't be deleted");
      } else if (err?.response?.status === 403) {
        toast.error('⛔ Access denied. Admins only.');
      } else {
        toast.error(`⚠️ ${msg}`);
      }
    }
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl mx-auto mt-6 transition-all duration-500">
      <h2 className="text-2xl font-bold text-black flex items-center gap-2">
        <FaTags className="text-gray-700" /> Manage Categories
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-3 mt-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm transition-all"
        />
        <button
          onClick={handleAdd}
          className="bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-md transition-transform duration-300 hover:scale-105"
        >
          <FaPlus /> Add
        </button>
      </div>

      <ul className="divide-y mt-6">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex justify-between items-center py-3 px-2 hover:bg-neutral-100 rounded-lg transition-all duration-300"
          >
            <span className="text-sm md:text-base font-medium text-gray-900">
              {cat.name}
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditId(cat.id);
                  setEditName(cat.name);
                }}
                className="text-gray-700 hover:text-black text-lg transition-colors"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => setDeleteId(cat.id)}
                className="text-gray-700 hover:text-red-600 text-lg transition-colors"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {editId !== null && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#f4f4f4] rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-black mb-3">Edit Category</h3>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditId(null)}
                  className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded bg-gray-800 hover:bg-black text-white transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId !== null && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#f4f4f4] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center border border-gray-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <p className="text-lg font-semibold text-black mb-4">Confirm Deletion</p>
              <p className="text-sm text-gray-800 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 border rounded text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManager;
