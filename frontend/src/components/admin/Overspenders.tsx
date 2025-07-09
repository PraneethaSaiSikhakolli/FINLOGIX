// src/components/admin/OverspendersPanel.tsx
import { useEffect, useState } from 'react';
import API from '../../services/axiosInstance';
import { toast } from 'react-toastify';

interface Overspender {
  user_id: number;
  email: string;
  total_spent: number;
}

const OverspendersPanel = () => {
  const [limit, setLimit] = useState(10000);
  const [data, setData] = useState<Overspender[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOverspenders = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/admin/overspenders?limit=${limit}`);
      setData(res.data);
    } catch {
      toast.error('Failed to fetch overspenders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverspenders();
  }, [limit]);

  return (
    <div className="bg-white rounded shadow p-4 border mt-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-red-600 mb-4">🚩 Overspenders</h2>

      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">
          Flag users spending over:
        </label>
        <input
          type="number"
          value={limit}
          min={1000}
          step={500}
          onChange={(e) => setLimit(parseInt(e.target.value))}
          className="border px-3 py-1 rounded w-32 text-right"
        />
        <span className="text-gray-600 text-sm">₹</span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">No overspenders found for ₹{limit.toLocaleString()} threshold.</p>
      ) : (
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-red-100 text-red-800">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border text-right">Total Spent (₹)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, idx) => (
              <tr key={user.user_id} className="hover:bg-red-50">
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border text-right font-semibold text-red-700">
                  ₹{user.total_spent.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OverspendersPanel;
