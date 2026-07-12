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
      <p className="text-[11px] tracking-wider text-muted-foreground uppercase mb-1.5 flex items-center gap-1.5">
        <Icon size={13} /> {label}
      </p>
      <div className="bg-input border border-border rounded-lg px-3.5 py-2.5">
        <p className="text-sm text-foreground truncate">{value || "—"}</p>
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

  const openEditModal = () => {
    setForm({
      StationName: partner?.StationName || "",
      address: partner?.address || "",
    });
    setShowModal(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const result = await updatePartnerProfileAPI(form, getAuthHeader());
      if (result.status === 200) {
        setPartnerData((prev) => ({
          ...prev,
          partner: { ...prev.partner, ...form },
        }));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <header className="flex z-0 w-full md:hidden justify-between border border-b-border items-center px-4 py-3 bg-card">
        <div className="flex items-center gap-1">
          <i className="fa-solid fa-bolt text-lg md:text-xl text-foreground"></i>
          <span className="text-lg md:text-2xl font-bold text-foreground">
            <span className="text-primary">Volt</span>Spot
          </span>
        </div>
        <div>
          <button
            className="z-50 bg-secondary p-2 rounded-md text-secondary-foreground"
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

        <section className="bg-card border mb-6 border-border flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="min-w-0">
            <h1 className="text-xl text-foreground font-semibold">Partner Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account identity and contact details.
            </p>
          </div>
          <button
            onClick={openEditModal}
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary border border-border hover:border-zinc-soft px-3.5 py-2 rounded-full shrink-0 self-start sm:self-auto"
          >
            <Pencil size={12} /> Edit profile
          </button>
        </section>

        {/* Profile + account details */}
        <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
          {loading ? (
            <>
              {/* Profile card skeleton */}
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <div className="h-5 w-1/2 bg-muted rounded" />
                    <div className="h-3.5 w-1/3 bg-muted rounded" />
                    <div className="h-3.5 w-2/3 bg-muted rounded" />
                  </div>
                </div>
              </div>

              {/* Account details skeleton */}
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 animate-pulse">
                <div className="h-4 w-40 bg-muted rounded mb-5" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-3 w-24 bg-muted rounded" />
                      <div className="h-9 w-full bg-muted rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats skeleton */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2">
                    <div className="h-3 w-16 bg-muted rounded" />
                    <div className="h-6 w-10 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Profile card */}
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-semibold text-primary text-base sm:text-lg shrink-0">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                          {partner?.StationName || "Add your business name"}
                        </h2>
                        <span
                          className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${
                            partner?.isVerified
                              ? "bg-primary/10 text-primary"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          <BadgeCheck size={12} />
                          {partner?.isVerified ? "Verified partner" : "Pending verification"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">{partner?.email}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[13px] text-muted-foreground">
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
                            <span className="text-muted-foreground">({stats.ratingCount})</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account details */}
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <h3 className="text-base font-medium text-foreground mb-5">Account details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <DetailField icon={Store} label="Business name" value={partner?.StationName} />
                  <DetailField icon={Mail} label="Email" value={partner?.email} />
                  <DetailField icon={MapPin} label="Address" value={partner?.address} />
                  <DetailField icon={Calendar} label="Joined" value={joinedDate} />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-[11px] tracking-wider text-muted-foreground uppercase mb-1.5">Stations</p>
                  <p className="text-xl font-semibold text-foreground">{stats.stations}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-[11px] tracking-wider text-muted-foreground uppercase mb-1.5">Bookings</p>
                  <p className="text-xl font-semibold text-foreground">{stats.bookings}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-[11px] tracking-wider text-muted-foreground uppercase mb-1.5">Rating</p>
                  <p className="text-xl font-semibold text-foreground">{stats.rating || "—"}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit profile modal — bottom sheet on mobile, centered dialog on desktop */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-border w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-foreground font-semibold text-base">Edit profile</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 -m-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] tracking-wider text-muted-foreground uppercase mb-1.5 block">
                  Business name
                </label>
                <input
                  type="text"
                  value={form.StationName}
                  onChange={(e) => setForm({ ...form, StationName: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-ring"
                  placeholder="e.g. VoltSpot Kannur"
                />
              </div>
              <div>
                <label className="text-[11px] tracking-wider text-muted-foreground uppercase mb-1.5 block">
                  Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-ring"
                  placeholder="e.g. Thavakkara, Kannur"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-secondary disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerProfile;