import React from 'react';
import aquaTheme from '../../lib/aquaTheme';

interface DataPoint { date: string; biomassKg: number }

interface BiomassChartProps { data?: DataPoint[]; title?: string }

export const BiomassChart: React.FC<BiomassChartProps> = ({ data = [], title = 'Biomass' }) => {
  // Composant minimal : table HTML stylée; remplaçable par chart lib (Chart.js, Recharts)
  return (
    <div style={{ border: `1px solid ${aquaTheme.primary.marine}`, padding: 12, borderRadius: 8 }}>
      <h3 style={{ color: aquaTheme.primary.deep, marginBottom: 8 }}>{title}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 6 }}>Date</th>
            <th style={{ textAlign: 'right', padding: 6 }}>Biomass (kg)</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={2} style={{ padding: 8 }}>No data</td></tr>
          ) : (
            data.map((d) => (
              <tr key={d.date}>
                <td style={{ padding: 6 }}>{d.date}</td>
                <td style={{ padding: 6, textAlign: 'right' }}>{d.biomassKg.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BiomassChart;
