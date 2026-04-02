import { useEffect, useState } from 'react';

import { useDebounce } from '../../hooks/useDebounce';
import { getWeatherByCity, getWeatherIconUrl, type WeatherData } from '../../utils/weather';

const DEFAULT_CITY = 'Shenzhen';

export function WeatherWidget() {
  const [cityInput, setCityInput] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const debouncedCity = useDebounce(cityInput, 500);

  useEffect(() => {
    const city = debouncedCity.trim();
    if (!city) {
      setWeatherData(null);
      setError('请输入城市名称');
      return;
    }

    let cancelled = false;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await getWeatherByCity(city);
        if (!cancelled) {
          setWeatherData(result);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setWeatherData(null);
          setError(fetchError instanceof Error ? fetchError.message : '天气请求失败');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [debouncedCity]);

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm md:w-[260px]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Weather</p>
        {loading ? <span className="text-xs text-gray-400">加载中...</span> : null}
      </div>

      <input
        type="text"
        value={cityInput}
        onChange={(event) => setCityInput(event.target.value)}
        placeholder="输入城市，如 Shenzhen"
        className="mt-2 w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-400"
      />

      {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}

      {weatherData && !error ? (
        <div className="mt-3 flex items-center gap-2">
          <img
            src={getWeatherIconUrl(weatherData.iconCode)}
            alt={weatherData.description}
            className="size-10"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">{weatherData.city}</p>
            <p className="text-xs text-gray-500">
              {weatherData.description} · {weatherData.temperature}°C
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
