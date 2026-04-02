import { create } from 'zustand';

import type {
  AddTodoInput,
  Todo,
  TodoFilter,
  TodoStats,
  TodoStore,
  UpdateTodoInput,
} from '../types/todo';
import { getTodos, saveTodos } from '../utils/storage';

const initialFilter: TodoFilter = {
  category: 'all',
  priority: 'all',
  status: 'all',
  searchQuery: '',
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: getTodos(),
  filter: initialFilter,

  addTodo: (input: AddTodoInput) => {
    set((state) => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        category: input.category,
        priority: input.priority,
        dueDate: input.dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const nextTodos = [newTodo, ...state.todos];
      saveTodos(nextTodos);

      return { todos: nextTodos };
    });
  },

  deleteTodo: (id: string) => {
    set((state) => {
      const nextTodos = state.todos.filter((todo) => todo.id !== id);
      saveTodos(nextTodos);

      return { todos: nextTodos };
    });
  },

  updateTodo: (id: string, updates: UpdateTodoInput) => {
    set((state) => {
      const nextTodos = state.todos.map((todo) => {
        if (todo.id !== id) {
          return todo;
        }

        return {
          ...todo,
          ...updates,
          title: updates.title !== undefined ? updates.title.trim() : todo.title,
          description:
            updates.description !== undefined
              ? updates.description?.trim() || undefined
              : todo.description,
        };
      });

      saveTodos(nextTodos);
      return { todos: nextTodos };
    });
  },

  toggleTodo: (id: string) => {
    set((state) => {
      const nextTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );

      saveTodos(nextTodos);
      return { todos: nextTodos };
    });
  },

  toggleTodoStatus: (id: string) => {
    get().toggleTodo(id);
  },

  setFilter: (partial: Partial<TodoFilter>) => {
    set((state) => ({
      filter: {
        ...state.filter,
        ...partial,
      },
    }));
  },

  getFilteredTodos: () => {
    const { todos, filter } = get();

    // 链式过滤：先分类/优先级/状态，再按关键词模糊匹配标题与描述
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

      const query = filter.searchQuery.trim().toLowerCase();
      if (!query) {
        return true;
      }

      const titleMatched = todo.title.toLowerCase().includes(query);
      const descriptionMatched = todo.description?.toLowerCase().includes(query) ?? false;

      return titleMatched || descriptionMatched;
    });
  },

  getStats: (): TodoStats => {
    const { todos } = get();

    // 统计总数、完成数、待完成数与完成率
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
  },
}));
