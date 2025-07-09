// src/components/admin/CategoryStats.tsx
import { useEffect, useState } from 'react';
import API from '../../services/axiosInstance';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Sector
} from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaChartPie, FaChartBar, FaBalanceScale } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';

const COLORS = ['#FF8C94', '#FFAAA5', '#FFD3B6', '#DCE775', '#A8E6CF'];

interface CategoryStat {
  category: string;
  transactions: number;
  total_spent: number;
}

interface SummaryData {
  total_spent: number;
  total_transactions: number;
  top_category: string;
}

interface BreakdownData {
  category: string;
  income: number;
  expense: number;
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.category}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} txns`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 20} textAnchor={textAnchor} fill="#999">
        {(percent * 100).toFixed(1)}%
      </text>
    </g>
  );
};

const CategoryStats = () => {
  const [data, setData] = useState<CategoryStat[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/categories/stats'),
      API.get('/admin/categories/summary'),
      API.get('/admin/categories/type-breakdown')
    ])
      .then(([stats, summaryRes, breakdownRes]) => {
        setData(stats.data);
        setSummary(summaryRes.data);
        setBreakdown(breakdownRes.data);
      })
      .catch(() => {
        toast.error('Failed to load category analytics');
      })
      .finally(()=>{
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <ClipLoader color="#FF8C94" size={50} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-10 max-w-6xl mx-auto p-4"
    >
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div
            className="bg-[#FFF8F6] text-[#2A2A2A] p-5 rounded-xl shadow-md"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-sm flex items-center gap-2 font-semibold">
              <FaChartPie className="text-[#E8A6A1]" /> Top Category
            </h3>
            <p className="text-xl font-bold mt-2">{summary.top_category}</p>
          </motion.div>
          <motion.div
            className="bg-[#FFF8F6] text-[#2A2A2A] p-5 rounded-xl shadow-md"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-sm flex items-center gap-2 font-semibold">
              💸 Total Spent
            </h3>
            <p className="text-xl font-bold mt-2">₹{summary.total_spent.toLocaleString()}</p>
          </motion.div>
          <motion.div
            className="bg-[#FFF8F6] text-[#2A2A2A] p-5 rounded-xl shadow-md"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-sm flex items-center gap-2 font-semibold">
              🔄 Total Transactions
            </h3>
            <p className="text-xl font-bold mt-2">{summary.total_transactions}</p>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-2xl shadow-md p-5 border border-[#F9ECE8]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-[#2A2A2A] mb-4 flex items-center gap-2">
            <FaChartPie /> Category Usage
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                animationDuration={400}
                activeShape={renderActiveShape}
                data={data}
                dataKey="transactions"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={index === activeIndex ? '#333' : undefined}
                    strokeWidth={index === activeIndex ? 2 : 1}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-md p-5 border border-[#F9ECE8]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-[#2A2A2A] mb-4 flex items-center gap-2">
            <FaChartBar /> Transactions per Category
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} barSize={30}>
              <XAxis dataKey="category" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Bar dataKey="transactions" fill="#FFAAA5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        className="bg-white rounded-2xl shadow-md p-5 border border-[#F9ECE8]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-[#2A2A2A] mb-4 flex items-center gap-2">
          <FaBalanceScale /> Income vs Expense by Category
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={breakdown} barSize={30}>
            <XAxis dataKey="category" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Bar dataKey="income" fill="#DCE775" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#FF8C94" name="Expense" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default CategoryStats;
