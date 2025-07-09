// src/components/MetricCard.tsx
import type { FC, ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  icon?: ReactNode;
  color?: 'green' | 'red' | 'blue' | 'gray';
}

const colorMap = {
  green: {
    bg: 'bg-green-100 dark:bg-green-600',
    text: 'text-green-600 dark:text-white',
    icon: 'text-green-500 dark:text-white',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-600',
    text: 'text-red-600 dark:text-white',
    icon: 'text-red-500 dark:text-white',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-600',
    text: 'text-blue-600 dark:text-white',
    icon: 'text-blue-500 dark:text-white',
  },
  gray: {
    bg: 'bg-gray-100 dark:bg-zinc-600',
    text: 'text-gray-800 dark:text-white',
    icon: 'text-gray-500 dark:text-white',
  },
};

const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color = 'gray',
}) => {
  const styles = colorMap[color];

  return (
    <div className={`p-6 rounded-lg shadow-md flex items-center justify-between ${styles.bg}`}>
      <div>
        <h2 className={`text-lg font-semibold ${styles.text}`}>{title}</h2>
        <p className={`text-3xl mt-2 font-bold ${styles.text}`}>₹{value.toFixed(2)}</p>
      </div>
      {icon && <div className={`text-4xl ${styles.icon}`}>{icon}</div>}
    </div>
  );
};

export default MetricCard;
