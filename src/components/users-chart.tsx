"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"


const data = [
  { name: 'Nov', value: 100 },
  { name: 'Subscribed', value: 300 },
];

const COLORS = ['hsl(var(--primary))', '#FFBB28'];

export function UsersChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend align="center" verticalAlign="bottom" height={36}/>
      </PieChart>
    </ResponsiveContainer>
  )
}
