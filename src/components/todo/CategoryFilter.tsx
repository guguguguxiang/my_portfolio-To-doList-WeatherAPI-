import type { FilterCategory } from '../../types/todo';
import { useTodoStore } from '../../store/useTodoStore';

const categoryOptions: { label: string; value: FilterCategory }[] = [
  { label: '全部任务', value: 'all' },
  { label: '工作', value: '工作' },
  { label: '学习', value: '学习' },
  { label: '生活', value: '生活' },
];

export function CategoryFilter() {
  const activeCategory = useTodoStore((state) => state.filter.category);
  const setFilter = useTodoStore((state) => state.setFilter);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">分类筛选</h2>

      <div className="mt-4 flex flex-col gap-2">
        {categoryOptions.map((category) => {
          const isActive = category.value === activeCategory;

          return (
            <button
              key={category.label}
              type="button"
              onClick={() => setFilter({ category: category.value })}
              className={[
                'w-full rounded-md border px-3 py-2 text-left text-sm transition-all duration-200',
                isActive
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
              ].join(' ')}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
