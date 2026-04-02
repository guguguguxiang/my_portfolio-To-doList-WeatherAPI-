import { Header } from './components/layout/Header';
import { AddTodoForm } from './components/todo/AddTodoForm';
import { CategoryFilter } from './components/todo/CategoryFilter';
import { StatsPanel } from './components/todo/StatsPanel';
import { TodoList } from './components/todo/TodoList';
import { TodoToolbar } from './components/todo/TodoToolbar';

const mockStats = {
  total: 8,
  active: 5,
  completed: 3,
  completionRate: 38,
};

const mockCategories = ['全部任务', '工作', '学习', '生活'];

const mockTodos = [
  {
    id: '1',
    title: '完成产品需求评审会议纪要',
    description: '整理会议结论，补充负责人和截止时间，发到项目群同步。',
    category: '工作',
    priority: '高' as const,
    dueDate: '2026-04-04',
    completed: false,
  },
  {
    id: '2',
    title: '复习 TypeScript 高级类型',
    description: '重点整理泛型约束、条件类型和映射类型的常见场景。',
    category: '学习',
    priority: '中' as const,
    dueDate: '2026-04-06',
    completed: false,
  },
  {
    id: '3',
    title: '晚间跑步 5 公里',
    description: '跑前拉伸 10 分钟，结束后记录配速和心率数据。',
    category: '生活',
    priority: '低' as const,
    dueDate: '2026-04-03',
    completed: true,
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl">
        <Header title="gxk的待办清单" subtitle="高效安排每一天，把重要的事先做完。" />

        <main className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-10 md:gap-5">
          <aside className="space-y-4 md:col-span-3">
            <StatsPanel
              total={mockStats.total}
              active={mockStats.active}
              completed={mockStats.completed}
              completionRate={mockStats.completionRate}
            />
            <CategoryFilter categories={mockCategories} activeCategory="全部任务" />
          </aside>

          <section className="space-y-4 md:col-span-7">
            <AddTodoForm />

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <TodoToolbar title="今日任务" />
              <div className="mt-4">
                <TodoList todos={mockTodos} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
