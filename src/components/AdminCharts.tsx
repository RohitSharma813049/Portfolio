"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

interface AdminChartsProps {
  categoryData: { name: string; count: number }[];
  timelineData: { month: string; count: number }[];
}

export default function AdminCharts({ categoryData, timelineData }: AdminChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Category Chart */}
      <div className="bg-white p-6 rounded-none-none border border-[#EAEAEA] shadow-sm">
        <h3 className="font-bold text-lg mb-6">Projects by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666666', fontSize: 12}} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#666666', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f4f4f4'}}
                contentStyle={{ borderRadius: '12px', border: '1px solid #EAEAEA', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="count" fill="#111111" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-white p-6 rounded-none-none border border-[#EAEAEA] shadow-sm">
        <h3 className="font-bold text-lg mb-6">Project Growth (Last 6 Months)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#666666', fontSize: 12}} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#666666', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #EAEAEA', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
              />
              <Line type="monotone" dataKey="count" stroke="#111111" strokeWidth={3} dot={{r: 4, fill: '#111111'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
