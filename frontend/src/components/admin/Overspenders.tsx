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
    <div className="bg-white rounded-2xl shadow p-5 border mt-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-red-600 mb-5 tracking-tight">
        🚩 Overspenders
      </h2>

      {/* Input Row */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <label className="text-sm font-medium text-gray-700">
          Flag users spending over:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={limit}
            min={1000}
            step={500}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="border px-3 py-2 rounded-lg w-32 text-right shadow-sm focus:ring-red-200 focus:border-red-300"
          />
          <span className="text-gray-600 text-sm font-medium">₹</span>
        </div>
      </div>

      {/* Table or Message */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No overspenders found for ₹{limit.toLocaleString()} threshold.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-red-100 text-red-800">
              <tr>
                <th className="p-3 border font-semibold">#</th>
                <th className="p-3 border font-semibold">Email</th>
                <th className="p-3 border font-semibold text-right">Total Spent (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, idx) => (
                <tr key={user.user_id} className="hover:bg-red-50">
                  <td className="p-3 border">{idx + 1}</td>
                  <td className="p-3 border break-all">{user.email}</td>
                  <td className="p-3 border text-right font-semibold text-red-700">
                    ₹{user.total_spent.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OverspendersPanel;
