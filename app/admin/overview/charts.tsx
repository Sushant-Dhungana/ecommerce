"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
const Charts = ({
  data: { salesData },
}: {
  data: { salesData: { month: string; totalSales: number }[] };
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={salesData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        ></XAxis>
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        ></YAxis>
        <Bar dataKey="totalSales" fill="primary" radius={[4, 4, 0, 0]}></Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
