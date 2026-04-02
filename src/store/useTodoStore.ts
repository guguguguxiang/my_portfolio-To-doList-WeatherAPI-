import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  AddTodoInput,
  Todo,
  TodoFilter,
  TodoStats,
  TodoStore,
  UpdateTodoInput,
} from '../types/todo';

const initialFilter: TodoFilter = {
  category: 'all',
  priority: 'all',
  status: 'all',
  searchQuery: '',
};

function createDefaultTodos(): Todo[] {
  const now = Date.now();

  return [
    {
      id: crypto.randomUUID(),
      title: '准备周会汇报材料',
      description: '整理本周项目进度、风险点和下周计划。',
      category: '工作',
      priority: '高',
      dueDate: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: '复习 React 状态管理章节',
      description: '重点回顾 Zustand 与组件渲染优化实践。',
      category: '学习',
      priority: '中',
      dueDate: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: '晚上跑步 30 分钟',
      description: '跑前热身，结束后拉伸并记录步数。',
      category: '生活',
      priority: '低',
      dueDate: new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString(),
      completed: true,
      createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: '处理客户需求反馈邮件',
      description: '确认问题优先级并同步给研发排期。',
      category: '工作',
      priority: '中',
      dueDate: new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
      createdAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: createDefaultTodos(),
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

          return { todos: [newTodo, ...state.todos] };
        });
      },

      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      updateTodo: (id: string, updates: UpdateTodoInput) => {
        set((state) => ({
          todos: state.todos.map((todo) => {
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
          }),
        }));
      },

      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        }));
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

        // 链式过滤：先按分类/优先级/状态过滤，再按关键词模糊匹配标题和描述
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

        // 统计总任务、待完成、已完成与完成率
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
    }),
    {
      name: 'gxk-todo-store',
      partialize: (state) => ({
        todos: state.todos,
        filter: state.filter,
      }),
      merge: (persistedState, currentState) => {
        const typedState = persistedState as Partial<TodoStore> | undefined;
        const persistedTodos = typedState?.todos;

        return {
          ...currentState,
          ...typedState,
          todos:
            Array.isArray(persistedTodos) && persistedTodos.length > 0
              ? persistedTodos
              : currentState.todos,
          filter: typedState?.filter
            ? {
                ...currentState.filter,
                ...typedState.filter,
              }
            : currentState.filter,
        };
      },
    },
  ),
);
