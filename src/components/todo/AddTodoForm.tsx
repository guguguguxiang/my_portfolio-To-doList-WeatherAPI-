import { useState } from 'react';
import type { FormEvent } from 'react';

import { useTodoStore } from '../../store/useTodoStore';
import type { Category, Priority } from '../../types/todo';

export function AddTodoForm() {
  const addTodo = useTodoStore((state) => state.addTodo);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('工作');
  const [priority, setPriority] = useState<Priority>('中');
  const [dueDate, setDueDate] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setTitleError('任务标题不能为空');
      return;
    }

    addTodo({
      title,
      description: description.trim() || undefined,
      category,
      priority,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setCategory('工作');
    setPriority('中');
    setDueDate('');
    setTitleError('');
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">快速添加任务</h2>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError) {
                setTitleError('');
              }
            }}
            type="text"
            placeholder="输入任务内容..."
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-400"
          />
          {titleError ? <p className="mt-1 text-xs text-red-600">{titleError}</p> : null}
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400 lg:col-span-2"
        >
          <option value="工作">工作</option>
          <option value="学习">学习</option>
          <option value="生活">生活</option>
        </select>

        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400 lg:col-span-2"
        >
          <option value="高">高</option>
          <option value="中">中</option>
          <option value="低">低</option>
        </select>

        <button
          type="submit"
          className="rounded-md border border-gray-800 bg-gray-800 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-700 lg:col-span-3"
        >
          添加任务
        </button>
      </form>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="任务描述（可选）"
          className="min-h-20 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-400"
        />
        <input
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          type="date"
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400"
        />
      </div>
    </section>
  );
}
