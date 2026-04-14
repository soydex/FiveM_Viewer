import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Activity } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  ping: number;
}

interface StatisticsChartsProps {
  players: Player[];
}

export function StatisticsCharts({ players }: StatisticsChartsProps) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const idRanges = [
    { label: '0-999', min: 0, max: 999 },
    { label: '1000-9999', min: 1000, max: 9999 },
    { label: '10000-99999', min: 10000, max: 99999 },
    { label: '100000+', min: 100000, max: Infinity }
  ];
  const idData = idRanges.map(range => ({
    name: range.label,
    value: players.filter(p => p.id >= range.min && p.id < range.max).length
  }));
  const pingRanges = [
    { label: '< 50ms', max: 50 },
    { label: '50-99ms', min: 50, max: 99 },
    { label: '100-149ms', min: 100, max: 149 },
    { label: '150-199ms', min: 150, max: 199 },
    { label: '200ms+', min: 200 }
  ];

  const pingData = pingRanges.map((range, index) => ({
    name: range.label,
    value: players.filter(p =>
      (range.min === undefined || p.ping >= range.min) &&
      (range.max === undefined || p.ping < range.max)
    ).length,
    color: COLORS[index % COLORS.length]
  }));

  if (!players.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">IDs</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Aucune donnée disponible
          </div>
        </div>
        <div className="p-6 rounded-lg border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">Distribution des pings</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Aucune donnée disponible
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-6 rounded-lg border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">IDs</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={idData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tw-bg-opacity-1, white)',
                border: '1px solid var(--tw-border-opacity-1, rgb(228 228 231))',
                borderRadius: '0.5rem',
                color: 'currentColor'
              }}
              labelStyle={{ color: 'currentColor' }}
            />
            <Bar
              dataKey="value"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 rounded-lg border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold">Pings</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pingData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ value }) => `${value} joueurs`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tw-bg-opacity-1, white)',
                border: '1px solid var(--tw-border-opacity-1, rgb(228 228 231))',
                borderRadius: '0.5rem',
                color: 'currentColor'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}