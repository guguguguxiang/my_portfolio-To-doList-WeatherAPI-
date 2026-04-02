import { useEffect, useState } from 'react';

import { useDebounce } from '../../hooks/useDebounce';
import { useTodoStore } from '../../store/useTodoStore';
import type { FilterPriority } from '../../types/todo';

type TodoToolbarProps = {
  title: string;
};

export function TodoToolbar({ title }: TodoToolbarProps) {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);

  const [searchInput, setSearchInput] = useState(filter.searchQuery);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setFilter({ searchQuery: debouncedSearch });
  }, [debouncedSearch, setFilter]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={filter.priority}
          onChange={(event) => setFilter({ priority: event.target.value as FilterPriority })}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400"
        >
          <option value="all">全部优先级</option>
          <option value="高">高优先级</option>
          <option value="中">中优先级</option>
          <option value="低">低优先级</option>
        </select>

        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          type="text"
          placeholder="搜索标题或描述..."
          className="w-full min-w-52 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-400"
        />
      </div>
    </div>
  );
}
