export type City = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export const CITIES: City[] = [
  { id: 'tokyo', name: '東京', latitude: 35.6895, longitude: 139.6917 },
  { id: 'osaka', name: '大阪', latitude: 34.6937, longitude: 135.5023 },
  { id: 'sapporo', name: '札幌', latitude: 43.0621, longitude: 141.3544 },
  { id: 'fukuoka', name: '福岡', latitude: 33.5904, longitude: 130.4017 },
  { id: 'naha', name: '那覇', latitude: 26.2124, longitude: 127.6809 },
];

export function getCityById(id: string): City | undefined {
  return CITIES.find((city) => city.id === id);
}
