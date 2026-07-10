import React, { useEffect, useState, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Zap, IndianRupee, Grid3x3, CheckCircle2, Menu, XIcon } from "lucide-react";
import Sidebar from "../../../components/collaboration/Sidebar";
import Headerr from "../../../components/collaboration/Headerr";
import { getPartnerPaymentsOverviewAPI } from "../../../Server/allAPI";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs space-y-0.5">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className={p.dataKey === "refunds" ? "text-red-400 font-semibold" : "text-white font-semibold"}>
          {p.dataKey === "revenue" ? "Revenue: " : "Refunds: "}₹{p.value?.toLocaleString?.() ?? p.value}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subLabel }) => (
  <div className="bg-neutral-950 border border-zinc-900 rounded-2xl px-5 py-4 flex-1 min-w-[220px]">
    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wide mb-3">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    {subLabel && <div className="text-xs mt-1 text-emerald-500">{subLabel}</div>}
  </div>
);

const ChartCard = ({ title, subtitle, children, className = "", headerRight = null }) => (
  <div className={`bg-neutral-950 border border-zinc-900 rounded-2xl p-5 ${className}`}>
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h3 className="text-white font-semibold text-[15px]">{title}</h3>
        {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {headerRight}
    </div>
    {children}
  </div>
);

// A single station's slot grid — green = free, red = occupied
const StationSlotRow = ({ station }) => {
  const cols = Math.min(station.totalSlots, 6) || 1;
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-zinc-200 font-medium">{station.stationName}</span>
        <span className="text-xs text-zinc-500">
          {station.occupiedCount} / {station.totalSlots} booked ·{" "}
          <span className="text-emerald-500">{station.freeCount} free</span>
        </span>
      </div>
      {station.totalSlots > 0 ? (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth: cols * 56 }}
        >
          {station.slots.map((slot) => (
            <div
              key={slot.slotNumber}
              title={slot.occupied ? "Booked" : "Free"}
              className={`text-[11px] text-center py-1.5 rounded-md font-medium ${
                slot.occupied
                  ? "bg-red-950 text-red-400"
                  : "bg-emerald-950 text-emerald-400"
              }`}
            >
              S{slot.slotNumber}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-600">No slots configured for this station.</p>
      )}
    </div>
  );
};

const PaymentsPageChart = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStationId, setSelectedStationId] = useState("all");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("PartnerToken");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getPartnerPaymentsOverviewAPI(reqHeader);
      if (result.status === 200) {
        setData(result.data);
      } else {
        setError("Couldn't load payments overview");
      }
    } catch (err) {
      console.error("fetchOverview error:", err);
      setError("Couldn't load payments overview");
    } finally {
      setLoading(false);
    }
  };

  const { stats, stationSlotStatus, revenueLast7Days } = data || {};

  const visibleStations = useMemo(() => {
    if (!stationSlotStatus) return [];
    if (selectedStationId === "all") return stationSlotStatus;
    return stationSlotStatus.filter((s) => s.stationId === selectedStationId);
  }, [stationSlotStatus, selectedStationId]);

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
        <button className="z-50 bg-zinc-900 p-2 rounded-md text-white" onClick={toggleSidebar}>
          {!sidebarOpen ? <Menu /> : <XIcon />}
        </button>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={toggleSidebar} />
      )}

      {/* Main content */}
      <div className="flex-1 h-screen overflow-y-auto custom-scroll px-4 py-5 md:px-8 md:py-7 w-full">
        <Headerr />

        <section className="bg-zinc-950 border mb-6 border-zinc-900 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="min-w-0">
            <h1 className="text-xl text-white font-semibold">Payments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Slot availability and revenue across your VoltSpot network.
            </p>
          </div>
        </section>

        {error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-gray-400 mb-3">{error}</p>
              <button
                onClick={fetchOverview}
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
            <div className="h-40 bg-zinc-900 rounded-2xl" />
            <div className="h-40 bg-zinc-900 rounded-2xl" />
            <div className="h-64 bg-zinc-900 rounded-2xl" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="flex flex-wrap gap-4 mb-6">
              <StatCard icon={Grid3x3} label="Stations" value={stats.stationCount} />
              <StatCard icon={Zap} label="Total slots" value={stats.totalSlots} />
              <StatCard
                icon={CheckCircle2}
                label="Occupied now"
                value={`${stats.occupiedNow} / ${stats.totalSlots}`}
                subLabel={`${stats.totalSlots - stats.occupiedNow} free`}
              />
              <StatCard
                icon={IndianRupee}
                label="Revenue today"
                value={`₹${stats.revenueToday.toLocaleString()}`}
              />
              <StatCard
                icon={IndianRupee}
                label="Refunds today"
                value={`₹${stats.refundsToday.toLocaleString()}`}
              />
            </div>

            {/* Slot status by station */}
            <ChartCard
              title="Slot status by station"
              subtitle="Live — booked vs free right now"
              className="mb-4"
              headerRight={
                <select
                  value={selectedStationId}
                  onChange={(e) => setSelectedStationId(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg outline-none"
                >
                  <option value="all">All stations</option>
                  {stationSlotStatus.map((s) => (
                    <option key={s.stationId} value={s.stationId}>
                      {s.stationName}
                    </option>
                  ))}
                </select>
              }
            >
              <div className="flex flex-col gap-3">
                {visibleStations.length > 0 ? (
                  visibleStations.map((s) => <StationSlotRow key={s.stationId} station={s} />)
                ) : (
                  <p className="text-xs text-zinc-600">No stations to show.</p>
                )}
              </div>
            </ChartCard>

            {/* Revenue + Refunds combo chart */}
            <ChartCard title="Revenue & refunds — last 7 days" subtitle="Combined across all stations">
              <div className="flex gap-4 mb-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" /> Revenue (₹)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-red-400 inline-block" /> Refunds (₹)
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={revenueLast7Days}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#71717a"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} barSize={22} />
                  <Line
                    type="monotone"
                    dataKey="refunds"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#f87171" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentsPageChart;