type TodoToolbarProps = {
  title: string;
};

export function TodoToolbar({ title }: TodoToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>

      <div className="flex items-center gap-2">
        <select className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400">
          <option>全部优先级</option>
          <option>高优先级</option>
          <option>中优先级</option>
          <option>低优先级</option>
        </select>

        <input
          type="text"
          placeholder="搜索标题或描述..."
          className="w-full min-w-52 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-400"
        />
      </div>
    </div>
  );
}
