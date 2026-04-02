import { Header } from './components/layout/Header';
import { AddTodoForm } from './components/todo/AddTodoForm';
import { CategoryFilter } from './components/todo/CategoryFilter';
import { StatsPanel } from './components/todo/StatsPanel';
import { TodoList } from './components/todo/TodoList';
import { TodoToolbar } from './components/todo/TodoToolbar';
import { useTodoStore } from './store/useTodoStore';

export default function App() {
  const currentCategory = useTodoStore((state) => state.filter.category);
  const listTitle = currentCategory === 'all' ? '今日任务' : `${currentCategory}任务`;

  return (
    <div className="min-h-screen bg-[#f5f5f0] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl">
        <Header title="gxk的待办清单" subtitle="高效安排每一天，把重要的事先做完。" />

        <main className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-10 md:gap-5">
          <aside className="space-y-4 md:col-span-3">
            <StatsPanel />
            <CategoryFilter />
          </aside>

          <section className="space-y-4 md:col-span-7">
            <AddTodoForm />

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <TodoToolbar title={listTitle} />
              <div className="mt-4">
                <TodoList />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
