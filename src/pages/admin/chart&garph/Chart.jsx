import React, { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { getChartDeatilsAPI } from '../../../Server/allAPI';

const Chart = () => {
  const [chartData, setChartData] = useState({
    totalUsers: 0,
    totalStations: 0,
    weeklyData: [],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await getChartDeatilsAPI();
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-zinc-950 border border-zinc-900 p-4 md:p-6 rounded-xl">
          <h2 className="text-base md:text-lg font-semibold text-gray-400 mb-3 md:mb-4">User and Station Trends</h2>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181B" /> 
                <XAxis dataKey="day" stroke="#808080" tick={{ fontSize: 12 }} />
                <YAxis stroke="#808080" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#27272A',
                    border: '1px solid #3F3F46',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#A1A1AA' }}
                />
                <Area
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="New Users"
                />
                <Area
                  type="monotone"
                  dataKey="newStations"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="New Stations"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-4 md:p-6 rounded-xl">
          <h2 className="text-base md:text-lg font-semibold text-gray-400 mb-3 md:mb-4">Station Usage</h2>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="day" stroke="#808080" tick={{ fontSize: 12 }} />
                <YAxis stroke="#808080" tick={{ fontSize: 12 }} />
                <Tooltip
                contentStyle={{
                    backgroundColor: '#27272A',
                    border: '1px solid #3F3F46',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#A1A1AA' }}
                 />
                <Bar dataKey="newStations" fill="#10B981" name="New Stations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chart;