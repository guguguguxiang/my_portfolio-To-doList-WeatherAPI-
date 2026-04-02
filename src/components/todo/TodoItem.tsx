export type TodoItemData = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: '高' | '中' | '低';
  dueDate: string;
  completed: boolean;
};

type TodoItemProps = {
  todo: TodoItemData;
};

function getPriorityClass(priority: TodoItemData['priority']): string {
  if (priority === '高') {
    return 'border-red-200 bg-red-50 text-red-600';
  }

  if (priority === '中') {
    return 'border-blue-200 bg-blue-50 text-blue-600';
  }

  return 'border-gray-200 bg-gray-100 text-gray-600';
}

export function TodoItem({ todo }: TodoItemProps) {
  return (
    <article className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:bg-gray-50">
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={todo.completed} readOnly className="mt-1 size-4 cursor-default" />

        <div className="min-w-0 flex-1">
          <h3
            className={[
              'truncate text-sm font-semibold',
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-900',
            ].join(' ')}
          >
            {todo.title}
          </h3>

          <p
            className={[
              'mt-1 line-clamp-2 text-sm',
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-500',
            ].join(' ')}
          >
            {todo.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
              {todo.category}
            </span>
            <span
              className={[
                'rounded-full border px-2.5 py-1 text-xs font-medium',
                getPriorityClass(todo.priority),
              ].join(' ')}
            >
              {todo.priority}优先级
            </span>
            <span className="text-xs text-gray-400">截止：{todo.dueDate}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
          <button
            type="button"
            className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 transition-all duration-200 hover:bg-white"
          >
            编辑
          </button>
          <button
            type="button"
            className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 transition-all duration-200 hover:bg-red-50"
          >
            删除
          </button>
        </div>
      </div>
    </article>
  );
}
