export function AddTodoForm() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">快速添加任务</h2>

      <form className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <input
          type="text"
          placeholder="输入任务内容..."
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-400 lg:col-span-5"
        />

        <select className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400 lg:col-span-2">
          <option>工作</option>
          <option>学习</option>
          <option>生活</option>
        </select>

        <select className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400 lg:col-span-2">
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </select>

        <button
          type="button"
          className="rounded-md border border-gray-800 bg-gray-800 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-700 lg:col-span-3"
        >
          添加任务
        </button>
      </form>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <textarea
          placeholder="任务描述（可选）"
          className="min-h-20 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-400"
        />
        <input
          type="date"
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400"
        />
      </div>
    </section>
  );
}
