import { useMemo } from 'react';

import { useTodoStore } from '../../store/useTodoStore';

import { TodoItem } from './TodoItem';

export function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);

  const filteredTodos = useMemo(() => {
    const query = filter.searchQuery.trim().toLowerCase();

    return todos.filter((todo) => {
      if (filter.category !== 'all' && todo.category !== filter.category) {
        return false;
      }

      if (filter.priority !== 'all' && todo.priority !== filter.priority) {
        return false;
      }

      if (filter.status === 'active' && todo.completed) {
        return false;
      }

      if (filter.status === 'completed' && !todo.completed) {
        return false;
      }

      if (!query) {
        return true;
      }

      const titleMatched = todo.title.toLowerCase().includes(query);
      const descriptionMatched = todo.description?.toLowerCase().includes(query) ?? false;

      return titleMatched || descriptionMatched;
    });
  }, [todos, filter]);

  if (filteredTodos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
        暂无待办事项
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
