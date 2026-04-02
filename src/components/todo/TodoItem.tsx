import { useState } from 'react';

import { format, parseISO } from 'date-fns';
import { Check, Edit, Trash2, X } from 'lucide-react';

import { useTodoStore } from '../../store/useTodoStore';
import type { Category, Priority, Todo } from '../../types/todo';

type TodoItemProps = {
  todo: Todo;
};

type EditFormState = {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string;
};

function getPriorityClass(priority: Todo['priority']): string {
  if (priority === '高') {
    return 'border-red-200 bg-red-50 text-red-600';
  }

  if (priority === '中') {
    return 'border-blue-200 bg-blue-50 text-blue-600';
  }

  return 'border-gray-200 bg-gray-100 text-gray-600';
}

function formatDueDate(dueDate?: string): string {
  if (!dueDate) {
    return '未设置';
  }

  return format(parseISO(dueDate), 'yyyy-MM-dd');
}

function createInitialEditState(todo: Todo): EditFormState {
  return {
    title: todo.title,
    description: todo.description ?? '',
    category: todo.category,
    priority: todo.priority,
    dueDate: todo.dueDate ?? '',
  };
}

export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodoStatus = useTodoStore((state) => state.toggleTodoStatus);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const [isEditing, setIsEditing] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [editForm, setEditForm] = useState<EditFormState>(() => createInitialEditState(todo));

  const handleStartEdit = () => {
    setEditForm(createInitialEditState(todo));
    setTitleError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTitleError('');
    setEditForm(createInitialEditState(todo));
  };

  const handleSaveEdit = () => {
    if (!editForm.title.trim()) {
      setTitleError('任务标题不能为空');
      return;
    }

    updateTodo(todo.id, {
      title: editForm.title,
      description: editForm.description.trim() || undefined,
      category: editForm.category,
      priority: editForm.priority,
      dueDate: editForm.dueDate || undefined,
    });

    setIsEditing(false);
    setTitleError('');
  };

  return (
    <article className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:bg-gray-50">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodoStatus(todo.id)}
          className="mt-1 size-4 cursor-pointer"
        />

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                value={editForm.title}
                onChange={(event) => {
                  setEditForm((prev) => ({ ...prev, title: event.target.value }));
                  if (titleError) {
                    setTitleError('');
                  }
                }}
                className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-gray-400"
              />
              {titleError ? <p className="text-xs text-red-600">{titleError}</p> : null}

              <textarea
                value={editForm.description}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, description: event.target.value }))
                }
                className="min-h-16 w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400"
                placeholder="任务描述（可选）"
              />

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <select
                  value={editForm.category}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, category: event.target.value as Category }))
                  }
                  className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400"
                >
                  <option value="工作">工作</option>
                  <option value="学习">学习</option>
                  <option value="生活">生活</option>
                </select>

                <select
                  value={editForm.priority}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, priority: event.target.value as Priority }))
                  }
                  className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400"
                >
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>

                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, dueDate: event.target.value }))
                  }
                  className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-gray-400"
                />
              </div>
            </div>
          ) : (
            <>
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
                {todo.description || '暂无描述'}
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
                <span className="text-xs text-gray-400">截止：{formatDueDate(todo.dueDate)}</span>
              </div>
            </>
          )}
        </div>

        <div
          className={[
            'flex shrink-0 items-center gap-2 transition-all duration-200',
            isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          ].join(' ')}
        >
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-md border border-green-200 p-1.5 text-green-600 transition-all duration-200 hover:bg-green-50"
                aria-label="保存任务"
              >
                <Check className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-md border border-gray-200 p-1.5 text-gray-600 transition-all duration-200 hover:bg-white"
                aria-label="取消编辑"
              >
                <X className="size-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleStartEdit}
                className="rounded-md border border-gray-200 p-1.5 text-gray-600 transition-all duration-200 hover:bg-white"
                aria-label="编辑任务"
              >
                <Edit className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => deleteTodo(todo.id)}
                className="rounded-md border border-red-200 p-1.5 text-red-600 transition-all duration-200 hover:bg-red-50"
                aria-label="删除任务"
              >
                <Trash2 className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
