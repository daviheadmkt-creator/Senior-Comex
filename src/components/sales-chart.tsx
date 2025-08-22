"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { name: "Jan", sales: 2000 },
  { name: "Feb", sales: 2200 },
  { name: "Mar", sales: 2500 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
  { name: "Jul", sales: 3490 },
  { name: "Aug", sales: 3000 },
  { name: "Sep", sales: 2800 },
  { name: "Oct", sales: 4000 },
  { name: "Nov", sales: 3500 },
  { name: "Dec", sales: 4300 },
]

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
            labelStyle={{ fontWeight: "bold" }}
            formatter={(value) => [`$${value}`, 'Vendas']}
        />
        <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
