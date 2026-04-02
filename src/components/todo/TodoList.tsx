import { TodoItem } from './TodoItem';

type TodoData = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: '高' | '中' | '低';
  dueDate: string;
  completed: boolean;
};

type TodoListProps = {
  todos: TodoData[];
};

export function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
        暂无待办事项
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
