import React, { useRef, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import type { ChartOptions } from 'chart.js';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

interface Transaction {
  amount: number;
  category: string | { name: string };
  type: 'income' | 'expense';
  timestamp: string;
}

interface ChartProps {
  data: Transaction[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [timeFilter, setTimeFilter] = useState<'month' | 'week' | 'all' | 'custom'>('month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const barRef = useRef<any>(null);
  const pieRef = useRef<any>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const now = dayjs();
  const filteredData = data.filter(item => {
    const txnDate = dayjs(item.timestamp);
    const isTypeMatch = filter === 'all' || item.type === filter;

    if (!isTypeMatch) return false;

    if (timeFilter === 'week') {
      return txnDate.isAfter(now.subtract(7, 'day'));
    } else if (timeFilter === 'month') {
      return txnDate.month() === now.month() && txnDate.year() === now.year();
    } else if (timeFilter === 'custom') {
      if (!customStart || !customEnd) return false;
      const start = dayjs(customStart).startOf('day');
      const end = dayjs(customEnd).endOf('day');
      return txnDate.isAfter(start.subtract(1, 'second')) && txnDate.isBefore(end.add(1, 'second'));
    } else {
      return true;
    }
  });

  const totals: { [key: string]: number } = {};
  filteredData.forEach(item => {
    const category = typeof item.category === 'object' ? item.category.name : item.category;
    totals[category] = (totals[category] || 0) + item.amount;
  });

  const chartData = {
    labels: Object.keys(totals),
    datasets: [
      {
        label:
          filter === 'income'
            ? 'Income by Category'
            : filter === 'expense'
              ? 'Expenses by Category'
              : 'All Transactions by Category',
        data: Object.values(totals),
        backgroundColor: [
          '#f9a8d4', '#fcd34d', '#a5f3fc', '#c4b5fd', '#6ee7b7',
          '#fca5a5', '#fdba74', '#93c5fd', '#fef08a'
        ],
        borderWidth: 0,
        hoverOffset: 16,
      },
    ],
  };

  const commonAnimation: ChartOptions['animation'] = {
    duration: 800,
    easing: 'easeInOutCubic',
  };

  const barOptions: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    animation: commonAnimation,
  };

  const pieOptions: ChartOptions<'pie'> = {
    maintainAspectRatio: false,
    animation: commonAnimation,
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value: number, ctx: any) => {
          const total = ctx.chart.data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
          const percent = ((value / total) * 100).toFixed(1);
          return Number(percent) < 5 ? '' : `${percent}%`;
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw as number;
            return `${label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const downloadCSV = () => {
    let csv = 'Category,Amount\n';
    Object.entries(totals).forEach(([cat, amt]) => {
      csv += `${cat},${amt}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transaction_data.csv');
    toast.success('Data exported as CSV');
  };

  const downloadPNG = () => {
    const bar = barRef.current?.toBase64Image();
    const pie = pieRef.current?.toBase64Image();

    if (bar) {
      fetch(bar).then(res => res.blob()).then(blob => saveAs(blob, 'bar_chart.png'));
    }
    if (pie) {
      fetch(pie).then(res => res.blob()).then(blob => saveAs(blob, 'pie_chart.png'));
    }

    toast.success('Charts exported as PNG');
  };

  const downloadPDF = async () => {
    if (!chartContainerRef.current) return;
    const canvas = await html2canvas(chartContainerRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const ratio = imgProps.width / imgProps.height;
    const height = pageWidth / ratio;
    pdf.addImage(imgData, 'PNG', 10, 10, pageWidth - 20, height);
    pdf.save('dashboard_report.pdf');
    toast.success('Dashboard exported as PDF');
  };

  return (
    <div ref={chartContainerRef} className="bg-white dark:bg-zinc-800 p-4 mt-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-3 py-1 rounded text-sm ${
                filter === type
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 dark:bg-zinc-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="border px-2 py-1 rounded text-sm dark:bg-zinc-700"
          >
            <option value="month">This Month</option>
            <option value="week">Last 7 Days</option>
            <option value="all">All Time</option>
            <option value="custom">Custom</option>
          </select>

          {timeFilter === 'custom' && (
            <>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="border px-2 py-1 rounded text-sm dark:bg-zinc-700"
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="border px-2 py-1 rounded text-sm dark:bg-zinc-700"
              />
            </>
          )}

          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Download
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-10 bg-white dark:bg-zinc-700 border rounded shadow z-10 w-48 text-sm">
                <button onClick={downloadCSV} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-600 w-full text-left">Export Data (CSV)</button>
                <button onClick={downloadPNG} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-600 w-full text-left">Export Charts (PNG)</button>
                <button onClick={downloadPDF} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-600 w-full text-left">Export Report (PDF)</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-center mb-4">Spending Breakdown</h2>

      {Object.keys(totals).length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          No data for this filter and date range.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-[300px] w-full">
            <Bar ref={barRef} data={chartData} options={barOptions} />
          </div>
          <div className="h-[300px] w-full">
            <Pie ref={pieRef} data={chartData} options={pieOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart;
