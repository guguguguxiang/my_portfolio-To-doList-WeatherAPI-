import { useMemo } from 'react';

import { useTodoStore } from '../../store/useTodoStore';

export function StatsPanel() {
  const todos = useTodoStore((state) => state.todos);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      active,
      completed,
      completionRate,
    };
  }, [todos]);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">数据总览</h2>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">总任务</span>
          <span className="font-semibold text-gray-900">{stats.total}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">待完成</span>
          <span className="font-semibold text-orange-500">{stats.active}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">已完成</span>
          <span className="font-semibold text-green-600">{stats.completed}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">完成率</span>
          <span className="font-semibold text-gray-900">{stats.completionRate}%</span>
        </div>
      </div>
    </section>
  );
}
