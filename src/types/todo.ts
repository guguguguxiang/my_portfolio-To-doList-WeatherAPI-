export type PresetCategory = '工作' | '学习' | '生活';

export type Category = PresetCategory | (string & {});

export type Priority = '高' | '中' | '低';

export type FilterCategory = 'all' | Category;

export type FilterPriority = 'all' | Priority;

export type FilterStatus = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoFilter {
  category: FilterCategory;
  priority: FilterPriority;
  status: FilterStatus;
  searchQuery: string;
}

export type Filter = TodoFilter;

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
  completionRate: number;
}

export interface AddTodoInput {
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate?: string;
}

export type UpdateTodoInput = Partial<
  Pick<Todo, 'title' | 'description' | 'category' | 'priority' | 'dueDate' | 'completed'>
>;

export interface TodoStore {
  todos: Todo[];
  filter: TodoFilter;
  addTodo: (input: AddTodoInput) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updates: UpdateTodoInput) => void;
  toggleTodo: (id: string) => void;
  toggleTodoStatus: (id: string) => void;
  setFilter: (partial: Partial<TodoFilter>) => void;
  getFilteredTodos: () => Todo[];
  getStats: () => TodoStats;
}
