import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/collaboration/Sidebar';
import Headerr from '../../components/collaboration/Headerr';
import socket from '../../Server/socket';
import {
  viewNotificationsAPI,
  deleteNotificationAPI,
  deleteAllNotificationsAPI,
  getPartnerProfileAPI,
  updatePartnerProfileAPI,
} from '../../Server/allAPI';
import {
  CircleAlert,
  Trash2,
  Menu,
  XIcon,
  Loader2,
  BellOff,
  Zap,
  MapPin,
  Bell,
  CircleUserRound,
  BarChart3,
  ChevronDown,
  Pencil,
  Store,
  Mail,
  Phone,
  Calendar,
  Star,
  BadgeCheck,
  Landmark,
  Check,
  X,
} from "lucide-react";
import { format } from "timeago.js";

function DetailField({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] tracking-wider text-zinc-500 uppercase mb-1.5 flex items-center gap-1.5">
        <Icon size={13} /> {label}
      </p>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5">
        <p className="text-sm text-zinc-200 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

const PartnerProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ StationName: "", address: "" });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getAuthHeader = () => {
    const token = sessionStorage.getItem("PartnerToken");
    return { Authorization: `Bearer ${token}` };
  };

  const getPartnerProfile = async () => {
    setLoading(true);
    try {
      const result = await getPartnerProfileAPI(getAuthHeader());
      if (result.status === 200) {
        setPartnerData(result.data);
        console.log(result.data);
        
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPartnerProfile();
  }, []);

  const partner = partnerData?.partner;
  const stats = partnerData?.stats || { stations: 0, bookings: 0, rating: 0, ratingCount: 0 };

  const initials = (partner?.StationName || "P")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedDate = partner?.createdAt
    ? new Date(partner.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "—";


  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-black flex items-center justify-center">
  //       <Loader2 className="animate-spin text-emerald-500" size={28} />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-black overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
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

      {/* Sidebar - Hidden on mobile by default, shown when toggled */}
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

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto p-4 md:p-8 w-full">
        {/* Header */}
        <Headerr />

        <section className="bg-zinc-950 border mb-6 border-zinc-900 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="min-w-0">
            <h1 className="text-lg text-white font-semibold">Partner Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Your account identity and contact details.
            </p>
          </div>
        </section>

        {/* Profile + account details */}
        <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Profile card */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-900/60 border border-emerald-800/50 flex items-center justify-center font-semibold text-emerald-400 text-base sm:text-lg shrink-0">
                  {initials}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 truncate">
                      {partner?.StationName || "Add your business name"}
                    </h2>
                    <span
                      className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${
                        partner?.isVerified
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      <BadgeCheck size={12} />
                      {partner?.isVerified ? "Verified partner" : "Pending verification"}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-0.5 truncate">{partner?.email}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[13px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {partner?.address || "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> Joined {joinedDate}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star size={14} className="fill-amber-400" />
                      {stats.rating || 0} rating
                      {stats.ratingCount > 0 && (
                        <span className="text-zinc-500">({stats.ratingCount})</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account details */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 sm:p-6">
            <h3 className="text-base font-medium text-zinc-100 mb-5">Account details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <DetailField icon={Store} label="Business name" value={partner?.StationName} />
              <DetailField icon={Mail} label="Email" value={partner?.email} />
              <DetailField icon={MapPin} label="Address" value={partner?.address} />
              <DetailField icon={Calendar} label="Joined" value={joinedDate} />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
              <p className="text-[11px] tracking-wider text-zinc-500 uppercase mb-1.5">Stations</p>
              <p className="text-xl font-semibold text-zinc-100">{stats.stations}</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
              <p className="text-[11px] tracking-wider text-zinc-500 uppercase mb-1.5">Bookings</p>
              <p className="text-xl font-semibold text-zinc-100">{stats.bookings}</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
              <p className="text-[11px] tracking-wider text-zinc-500 uppercase mb-1.5">Rating</p>
              <p className="text-xl font-semibold text-zinc-100">{stats.rating || "—"}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PartnerProfile;