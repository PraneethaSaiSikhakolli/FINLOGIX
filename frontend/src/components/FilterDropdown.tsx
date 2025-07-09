const FilterDropdown = ({ filter, setFilter }: { filter: string; setFilter: (f: any) => void }) => {
  return (
    <div className="flex justify-end mb-4">
      <select
        className="p-2 rounded bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-gray-800 dark:text-white"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="custom">Custom</option>
      </select>
    </div>
  );
};

export default FilterDropdown;
