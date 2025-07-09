// src/components/admin/AnalyticsCharts.tsx
import { useEffect, useState } from 'react';
import API from '../../services/axiosInstance';
import {
  XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface SummaryData {
  total_users: number;
  active_today: number;
  transactions: number;
}

interface TrendData {
  day: string;
  users: number;
  txns: number;
}

const AnalyticsCharts = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [summaryRes, trendRes] = await Promise.all([
          API.get('/admin/analytics-summary'),
          API.get('/admin/analytics-trends'),
        ]);
        setSummary(summaryRes.data);
        setTrendData(trendRes.data);
      } catch (err) {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading analytics...</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-2xl font-bold text-indigo-600">{summary?.total_users}</h2>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Active Today</p>
          <h2 className="text-2xl font-bold text-green-600">{summary?.active_today}</h2>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Transactions</p>
          <h2 className="text-2xl font-bold text-purple-600">{summary?.transactions}</h2>
        </div>
      </div>


      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Transaction Volume Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={trendData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="txns" fill="#6C5CE7" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AnalyticsCharts;
