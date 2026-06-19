import React, { useEffect, useState, useMemo } from "react";
import SideBars from "../../../components/admin/SideBars";
import Header from "../../../components/admin/Header";
import { getallPatnersAPI } from "../../../Server/allAPI";
import socket from "../../../Server/socket";
import { Search, X,XIcon,Menu, SlidersHorizontal, Mail, Users as UsersIcon } from 'lucide-react'

const STATUS_STYLES = {
  active: { dot: 'bg-emerald-400', text: 'text-emerald-300', ring: 'ring-emerald-900/60' },
  inactive: { dot: 'bg-zinc-400', text: 'text-zinc-300', ring: 'ring-zinc-700' },
}

const StatusChip = ({ status = 'active' }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.active
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium ${style.text} ring-1 ${style.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const UserAvatar = ({ name }) => {
  const initials = (name || '?')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-900 text-sm font-semibold text-zinc-300 ring-1 ring-zinc-800">
      {initials || '?'}
    </div>
  )
}

const FilterSelect = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value} className="bg-zinc-900">
        {opt.label}
      </option>
    ))}
  </select>
)

function AllPatnersViewPage() {
  const [patnerdetails, setPatnerDetails] = useState([]);
  const [partnerStatus, setPartnerStatus] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    getPatnerDetails()

    // Listen for real-time status updates
    socket.on("updatePartnerStatus", ({ partnerId, status }) => {
      console.log("Received updatePartnerStatus event:", partnerId, status);
      setPartnerStatus((prev) => ({ ...prev, [partnerId]: status }));
    });

    // Cleanup on unmount
    return () => {
      socket.off("updatePartnerStatus");
      socket.disconnect();
    };
  }, [])

  const getPatnerDetails = async () => {
    try {
      const result = await getallPatnersAPI()
      if (result.status === 200) {
        setPatnerDetails(result.data)
        console.log("view all partners=", result.data);

      }
    } catch (err) {
      console.log(err)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const statusOptions = useMemo(() => {
    const unique = Array.from(
      new Set(patnerdetails.map((u) => u.status || 'active').filter(Boolean))
    )
    return ['all', ...unique]
  }, [patnerdetails])

  const filtered = useMemo(() => {
    return patnerdetails.filter((u) => {
      const matchesSearch =
        !search ||
        [u.StationName, u.email]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(search.toLowerCase()))
      const matchesStatus = status === 'all' || (u.status || 'active') === status
      return matchesSearch && matchesStatus
    })
  }, [patnerdetails, search, status])

  const hasActiveFilters = Boolean(search) || status !== 'all'

  const resetFilters = () => {
    setSearch('')
    setStatus('all')
  }

  return (
    <div className="min-h-screen font-[DM_Sans] flex flex-col md:flex-row bg-black">
      {/* Mobile Sidebar Toggle */}
      <header className=' flex z-40 w-full md:hidden  justify-between items-center px-4 py-3 bg-zinc-950'>
        <div>
          <i className="fa-solid fa-bolt text-lg md:text-xl" style={{ color: "#f0efef" }}></i><span className="text-lg md:text-2xl font-bold  text-white"><span className='text-green-600'>Volt</span>Spot</span>
        </div>
        <div>
          <button
            className="z-50 bg-zinc-900 p-2 rounded-md text-white"
            onClick={toggleSidebar}
          >
            {!sidebarOpen ? (<Menu className='' />) : (<XIcon />)}
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
        <SideBars />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto custom-scroll px-4 pb-2 pt-6 sm:px-6 lg:px-10 lg:pt-10 w-full">
        {/* Header */}
        <Header />

        <section className="font-[DM_Sans] text-zinc-100 mt-2">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">All Partners</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Showing {filtered.length} of {patnerdetails.length}{' '}
                {patnerdetails.length === 1 ? 'partner' : 'partners'}
              </p>
            </div>
          </div>

          {/* Search + filters */}
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-zinc-900 bg-zinc-950 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-500 sm:inline-flex">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter
              </span>
              <FilterSelect
                value={status}
                onChange={setStatus}
                options={statusOptions.map((s) => ({
                  value: s,
                  label: s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1),
                }))}
              />
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Empty states */}
          {patnerdetails.length === 0 && (
            <div className="grid place-items-center rounded-2xl border border-zinc-900 bg-zinc-950 px-6 py-16 text-center">
              <UsersIcon className="h-8 w-8 text-zinc-700" />
              <p className="mt-3 text-sm font-medium text-zinc-300">No users found yet</p>
              <p className="mt-1 text-xs text-zinc-500">New sign-ups will appear here.</p>
            </div>
          )}

          {patnerdetails.length > 0 && filtered.length === 0 && (
            <div className="grid place-items-center rounded-2xl border border-zinc-900 bg-zinc-950 px-6 py-16 text-center">
              <Search className="h-8 w-8 text-zinc-700" />
              <p className="mt-3 text-sm font-medium text-zinc-300">No users match your filters</p>
              <p className="mt-1 text-xs text-zinc-500">Try a different search term or clear filters.</p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Desktop table */}
          {filtered.length > 0 && (
            <div className="hidden overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950 lg:block">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-300">
                  <tr>
                    <th className="px-6 py-4">No</th>
                    <th className="px-4 py-4">Stations Name</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Stations</th>
                    <th className="px-4 py-4">Location</th>
                    <th className="px-4 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u._id} className="border-t border-zinc-900 transition hover:bg-zinc-900/40">
                      <td className="px-6 py-4 font-mono text-zinc-500">{String(i + 1).padStart(2, '0')}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={u.StationName} />
                          <span className="font-medium text-zinc-100">{u.StationName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-zinc-400">{u.email}</td>
                      <td className="px-4 py-4 text-zinc-400">{u.stationCount}</td>
                      <td className="px-4 py-4 text-zinc-400">{u.address}</td>
                      <td className="px-4 py-4">
                        <StatusChip status={u.status || 'active'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile / tablet cards */}
          {filtered.length > 0 && (
            <div className="grid gap-4 lg:hidden">
              {filtered.map((u, i) => (
                <article key={u._id} className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5">
                  <div className="flex items-start gap-4">
                    <UserAvatar name={u.StationName} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-mono text-zinc-500">#{String(i + 1).padStart(2, '0')}</p>
                          <h3 className="mt-0.5 truncate text-base font-semibold text-zinc-100">{u.StationName}</h3>
                        </div>
                        <StatusChip status={u.status || 'active'} />
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </p>
                      <div>
                        <h3 className="mt-0.5 truncate text-sm font-semibold text-zinc-500">stations : <span className="text-zinc-300">{u.stationCount}</span> </h3>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AllPatnersViewPage;