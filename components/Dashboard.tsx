
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Task, TaskStatus } from '../types';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  
  const COLORS = ['#94a3b8', '#3b82f6', '#f43f5e', '#10b981'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Stats */}
        {Object.values(TaskStatus).map((status) => (
          <div key={status} className={`p-4 rounded-xl border bg-white shadow-sm`}>
            <p className="text-slate-500 text-sm font-medium">{status}</p>
            <p className="text-2xl font-bold mt-1">{statusCounts[status] || 0}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
          <h3 className="text-slate-800 font-semibold mb-6">Task Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
          <h3 className="text-slate-800 font-semibold mb-6">Status Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
