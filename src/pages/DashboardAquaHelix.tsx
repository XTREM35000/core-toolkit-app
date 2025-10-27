import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sample = [
  { name: 'Lun', value: 12 },
  { name: 'Mar', value: 18 },
  { name: 'Mer', value: 20 },
  { name: 'Jeu', value: 16 },
  { name: 'Ven', value: 24 },
  { name: 'Sam', value: 30 },
  { name: 'Dim', value: 22 }
];

export default function DashboardAquaHelix() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
  <h2 className="text-2xl font-semibold">Aperçu MultiFarm SaaS</h2>
        <div className="w-full h-64 bg-white rounded-lg shadow-sm p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sample}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1BA7C1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#128C7E" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#128C7E" fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
