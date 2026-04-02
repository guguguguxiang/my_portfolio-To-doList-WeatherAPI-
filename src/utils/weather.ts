export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  iconCode: string;
}

const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('缺少天气 API Key，请配置 VITE_WEATHER_API_KEY');
  }

  const query = city.trim();
  if (!query) {
    throw new Error('城市名称不能为空');
  }

  const url = `${WEATHER_BASE_URL}?q=${encodeURIComponent(query)}&appid=${apiKey}&units=metric&lang=zh_cn`;

  const response = await fetch(url);

  if (response.status === 404) {
    throw new Error('未找到该城市，请检查拼写');
  }

  if (!response.ok) {
    throw new Error('天气服务暂时不可用，请稍后重试');
  }

  const data = (await response.json()) as {
    name: string;
    main: { temp: number };
    weather: Array<{ description: string; icon: string }>;
  };

  const current = data.weather?.[0];

  if (!current) {
    throw new Error('天气数据解析失败');
  }

  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    description: current.description,
    iconCode: current.icon,
  };
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
