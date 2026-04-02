type CategoryFilterProps = {
  categories: string[];
  activeCategory: string;
};

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">分类筛选</h2>

      <div className="mt-4 flex flex-col gap-2">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              className={[
                'w-full rounded-md border px-3 py-2 text-left text-sm transition-all duration-200',
                isActive
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
              ].join(' ')}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
}
