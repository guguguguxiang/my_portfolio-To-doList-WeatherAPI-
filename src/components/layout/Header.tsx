import { WeatherWidget } from '../widget/WeatherWidget';

type HeaderProps = {
  title: string;
  subtitle: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="border-b border-black/80 pb-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        </div>

        <WeatherWidget />
      </div>
    </header>
  );
}
