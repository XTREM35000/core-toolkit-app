import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import aquaTheme from '../../lib/aquaTheme';

type Point = { date: string; biomassKg: number };

interface Props { data?: Point[]; height?: number; title?: string }

export const sampleData: Point[] = Array.from({ length: 14 }).map((_, i) => ({
  date: `J-${14 - i}`,
  biomassKg: Math.round(100 + Math.sin(i / 2) * 10 + i * 3)
}));

const BiomassChart: React.FC<Props> = ({ data = sampleData, height = 240, title = 'Biomass' }) => (
  <div style={{ width: '100%', height }}>
    <h3 style={{ margin: '0 0 8px 0', color: aquaTheme.primary.deep }}>{title}</h3>
    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="biomassKg" stroke={aquaTheme.primary.aqua} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default BiomassChart;
