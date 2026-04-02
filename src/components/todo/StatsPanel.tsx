type StatsPanelProps = {
  total: number;
  active: number;
  completed: number;
  completionRate: number;
};

export function StatsPanel({ total, active, completed, completionRate }: StatsPanelProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">数据总览</h2>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">总任务</span>
          <span className="font-semibold text-gray-900">{total}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">待完成</span>
          <span className="font-semibold text-orange-500">{active}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">已完成</span>
          <span className="font-semibold text-green-600">{completed}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">完成率</span>
          <span className="font-semibold text-gray-900">{completionRate}%</span>
        </div>
      </div>
    </section>
  );
}
