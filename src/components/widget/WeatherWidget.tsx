type WeatherWidgetProps = {
  city: string;
  temperature: string;
  condition: string;
};

export function WeatherWidget({ city, temperature, condition }: WeatherWidgetProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <div className="text-2xl" aria-hidden="true">
        ⛅
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-gray-800">{city}</p>
        <p className="text-xs text-gray-500">
          {condition} · {temperature}
        </p>
      </div>
    </div>
  );
}
