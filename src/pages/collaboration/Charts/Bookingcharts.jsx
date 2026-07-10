import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, IndianRupee, Zap, Star, ChevronDown, Menu, XIcon } from "lucide-react";
import Sidebar from "../../../components/collaboration/Sidebar";
import Headerr from '../../../components/collaboration/Headerr';
import { getPartnerBookingChartStatsAPI } from "../../../Server/allAPI"; 

const VEHICLE_COLORS = {
  "4-wheeler": "#34d399", 
  "3-wheeler": "#22d3ee", 
  "2-wheeler": "#fbbf24", 
};

const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white font-semibold">
          {prefix}
          {p.value?.toLocaleString?.() ?? p.value}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subLabel, changePercent }) => {
  const positive = changePercent >= 0;
  return (
    <div className="bg-neutral-950 border border-zinc-900 rounded-2xl px-5 py-4 flex-1 min-w-[220px]">
      <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wide mb-3">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs mt-1 text-gray-500">
        {changePercent !== undefined ? (
          <span className={positive ? "text-emerald-500" : "text-red-500"}>
            {positive ? "+" : ""}
            {changePercent}%
          </span>
        ) : (
          <span className="text-emerald-500">{subLabel}</span>
        )}
        {changePercent !== undefined && subLabel ? <span className="ml-1">{subLabel}</span> : null}
      </div>
    </div>
  );
};

const ChartCard = ({ title, subtitle, children, className = "" }) => (
  <div className={`bg-neutral-950 border border-zinc-900 rounded-2xl p-5 ${className}`}>
    <div className="mb-4">
      <h3 className="text-white font-semibold text-[15px]">{title}</h3>
      {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const BookingCharts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchChartStats();
  }, []);

  const fetchChartStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("PartnerToken");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getPartnerBookingChartStatsAPI(reqHeader);
      if (result.status === 200) {
        setData(result.data);
        console.log("CHART DATA =",result.data);
        
      } else {
        setError("Couldn't load chart data");
      }
    } catch (err) {
      console.error("fetchChartStats error:", err);
      setError("Couldn't load chart data");
    } finally {
      setLoading(false);
    }
  };

  const { stats, bookingsLast7Days, revenueLast7Days, slotUtilizationByStation, vehicleMix, monthlyTrend } =
    data || {};

  return (
    <div className="min-h-screen bg-black overflow-hidden flex flex-col md:flex-row font-[Dm_Sans]">
      {/* Mobile top bar */}
      <header className="flex z-0 w-full md:hidden justify-between border border-b-zinc-900 items-center px-4 py-3 bg-zinc-950">
        <div className="flex items-center gap-1">
          <i className="fa-solid fa-bolt text-lg md:text-xl" style={{ color: "#f0efef" }}></i>
          <span className="text-lg md:text-2xl font-bold text-white">
            <span className="text-green-600">Volt</span>Spot
          </span>
        </div>
        <div>
          <button
            className="z-50 bg-zinc-900 p-2 rounded-md text-white"
            onClick={toggleSidebar}
          >
            {!sidebarOpen ? <Menu /> : <XIcon />}
          </button>
        </div>
      </header>

      {/* Sidebar - hidden on mobile by default, shown when toggled */}
      <div
        className={`
          fixed
          top-0
          left-0
          z-40
          h-screen
          transition-transform
          duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          md:static
        `}
      >
        <Sidebar />
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 h-screen overflow-y-auto custom-scroll px-4 py-5 md:px-8 md:py-7 w-full">
        {/* Header */}
        <Headerr />

        <section className="bg-zinc-950 border mb-6 border-zinc-900 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="min-w-0">
            <h1 className="text-xl text-white font-semibold">Booking Charts</h1>
            <p className="mt-1 text-sm text-gray-500">
                Revenue, bookings, and utilization across your VoltSpot network.
            </p>
          </div>
          
        </section>

        {error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-gray-400 mb-3">{error}</p>
              <button
                onClick={fetchChartStats}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-xl"
              >
                Try again
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-4 md:space-y-6 animate-pulse">
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 flex-1 min-w-[220px] bg-zinc-900 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-72 bg-zinc-900 rounded-2xl" />
              <div className="h-72 bg-zinc-900 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-72 bg-zinc-900 rounded-2xl" />
              <div className="h-72 bg-zinc-900 rounded-2xl" />
            </div>
            <div className="h-64 bg-zinc-900 rounded-2xl" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="flex flex-wrap gap-4 mb-6">
              <StatCard
                icon={TrendingUp}
                label="Bookings (7d)"
                value={stats.bookings7d.count}
                changePercent={stats.bookings7d.changePercent}
              />
              <StatCard
                icon={IndianRupee}
                label="Revenue (7d)"
                value={`₹${stats.revenue7d.amount.toLocaleString()}`}
                changePercent={stats.revenue7d.changePercent}
              />
              <StatCard
                icon={Zap}
                label="Active Stations"
                value={stats.activeStations.count}
                subLabel={`${stats.activeStations.totalSlots} slots`}
              />
              <StatCard
                icon={Star}
                label="Avg Rating"
                value={stats.avgRating.rating || "—"}
                subLabel="last 30 days"
              />
            </div>

            {/* Bookings + Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <ChartCard title="Bookings — last 7 days" subtitle="Sessions per day">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={bookingsLast7Days}>
                    <defs>
                      <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fill="url(#bookingsFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Revenue — last 7 days" subtitle="₹ collected">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={revenueLast7Days}>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip prefix="₹" />} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#38bdf8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Utilization + Vehicle mix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <ChartCard title="Slot utilization by station" subtitle="% occupied this week">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={slotUtilizationByStation} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="stationName"
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={110}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="utilizationPercent" fill="#10b981" radius={[0, 6, 6, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Vehicle mix" subtitle="Bookings by vehicle type">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={vehicleMix}
                      dataKey="count"
                      nameKey="vehicleType"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {vehicleMix.map((entry, i) => (
                        <Cell key={i} fill={VEHICLE_COLORS[entry.vehicleType] || "#a1a1aa"} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(value) => <span className="text-gray-400 text-xs">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Monthly trend */}
            <ChartCard title="Bookings — monthly trend" subtitle="Last 6 months">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="bookings" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingCharts;