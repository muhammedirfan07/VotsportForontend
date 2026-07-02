
import React, { useContext, useEffect, useMemo, useState } from 'react'
import SERVER_URL from '../../Server/serverURL'
import { deleteStaionAPI, viewOurStationsAPI } from '../../Server/allAPI'
import UpdateStation from './UpdateStation'
import { addStaionResponseContext, updateStaionResponseContext } from '../../context/ContextAPI'
import { toast } from 'react-toastify'
import {
  Search,
  X,
  SlidersHorizontal,
  Trash2,
  MapPin,
  ExternalLink,
  Zap,
  ImageOff,
} from 'lucide-react'

const CHARGING_STYLES = {
  slow: { dot: 'bg-zinc-400', text: 'text-zinc-300', ring: 'ring-zinc-700' },
  fast: { dot: 'bg-sky-400', text: 'text-sky-300', ring: 'ring-sky-900/60' },
  superfast: { dot: 'bg-emerald-400', text: 'text-emerald-300', ring: 'ring-emerald-900/60' },
}

const ChargingChip = ({ type }) => {
  const style = CHARGING_STYLES[type] || CHARGING_STYLES.slow
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium ${style.text} ring-1 ${style.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {type ? type.charAt(0).toUpperCase() + type.slice(1) : '—'}
    </span>
  )
}

const StationImage = ({ image, alt }) => {
  if (!image) {
    return (
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-900 text-zinc-600 ring-1 ring-zinc-800">
        <ImageOff className="h-4 w-4" />
      </div>
    )
  }
  return (
    <img
      src={`${SERVER_URL}/${image}`}
      alt={alt}
      className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-zinc-800"
    />
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

const StationListPage = () => {
  const [viewStationDetails, setViewStationDetails] = useState([])
  const [search, setSearch] = useState('')
  const [charging, setCharging] = useState('all')
  const [vehicle, setVehicle] = useState('all')

  const { addStaionResponse } = useContext(addStaionResponseContext)
  const { updateStaionResponse } = useContext(updateStaionResponseContext)

  useEffect(() => {
    getViewStationDetails()
  }, [addStaionResponse, updateStaionResponse])

  const getViewStationDetails = async () => {
    const token = sessionStorage.getItem('PartnerToken')
    if (token) {
      const reqHeader = { Authorization: `Bearer ${token}` }
      try {
        const result = await viewOurStationsAPI(reqHeader)
        if (result.status === 200) {
          setViewStationDetails(result.data)
        }
      } catch (error) {
        console.log('error', error)
      }
    }
  }

  const delectStaions = async (id) => {
    const token = sessionStorage.getItem('PartnerToken')
    if (token) {
      const reqHeader = { Authorization: `Bearer ${token}` }
      try {
        const removeStation = await deleteStaionAPI(id, reqHeader)
        if (removeStation.status === 200) {
          toast.success(removeStation.data.message, { position: 'top-right', theme: 'dark' })
          getViewStationDetails()
        }
      } catch (error) {
        console.log('error', error)
      }
    }
  }

  const vehicleOptions = useMemo(() => {
    const unique = Array.from(new Set(viewStationDetails.map((s) => s.vehicleType).filter(Boolean)))
    return ['all', ...unique]
  }, [viewStationDetails])

  const filtered = useMemo(() => {
    return viewStationDetails.filter((s) => {
      const matchesSearch =
        !search ||
        [s.stationName, s.city, s.state, s.vehicleType]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(search.toLowerCase()))
      const matchesCharging = charging === 'all' || s.chargingType === charging
      const matchesVehicle = vehicle === 'all' || s.vehicleType === vehicle
      return matchesSearch && matchesCharging && matchesVehicle
    })
  }, [viewStationDetails, search, charging, vehicle])

  const hasActiveFilters = Boolean(search) || charging !== 'all' || vehicle !== 'all'

  const resetFilters = () => {
    setSearch('')
    setCharging('all')
    setVehicle('all')
  }

  return (
    <section className="font-[DM_Sans] text-zinc-100">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Your Stations</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Showing {filtered.length} of {viewStationDetails.length}{' '}
            {viewStationDetails.length === 1 ? 'station' : 'stations'}
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
            placeholder="Search by name, city, vehicle…"
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
            value={charging}
            onChange={setCharging}
            options={[
              { value: 'all', label: 'All charging' },
              { value: 'slow', label: 'Slow' },
              { value: 'fast', label: 'Fast' },
              { value: 'superfast', label: 'Superfast' },
            ]}
          />
          <FilterSelect
            value={vehicle}
            onChange={setVehicle}
            options={vehicleOptions.map((v) => ({ value: v, label: v === 'all' ? 'All vehicles' : v }))}
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
      {viewStationDetails.length === 0 && (
        <div className="grid place-items-center rounded-2xl border border-zinc-900 bg-zinc-950 px-6 py-16 text-center">
          <Zap className="h-8 w-8 text-zinc-700" />
          <p className="mt-3 text-sm font-medium text-zinc-300">No stations added yet</p>
          <p className="mt-1 text-xs text-zinc-500">Add a station to see it listed here.</p>
        </div>
      )}

      {viewStationDetails.length > 0 && filtered.length === 0 && (
        <div className="grid place-items-center rounded-2xl border border-zinc-900 bg-zinc-950 px-6 py-16 text-center">
          <Search className="h-8 w-8 text-zinc-700" />
          <p className="mt-3 text-sm font-medium text-zinc-300">No stations match your filters</p>
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
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-300">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-4 py-4">Station</th>
                <th className="px-4 py-4">Location</th>
                <th className="px-4 py-4">Charging</th>
                <th className="px-4 py-4">Vehicle</th>
                <th className="px-4 py-4">Slots</th>
                <th className="px-4 py-4">Rate/hr</th>
                <th className="px-4 py-4">Map</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s._id} className="border-t border-zinc-900 transition hover:bg-zinc-900/40">
                  <td className="px-6 py-4 font-mono text-zinc-500">{String(i + 1).padStart(2, '0')}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <StationImage image={s.image} alt={s.stationName} />
                      <span className="font-medium text-zinc-100">{s.stationName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-zinc-400">
                    {s.city}, {s.state}
                  </td>
                  <td className="px-4 py-4">
                    <ChargingChip type={s.chargingType} />
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{s.vehicleType}</td>
                  <td className="px-4 py-4 text-zinc-400">{s.availableSlots}</td>
                  <td className="px-4 py-4 font-semibold text-zinc-100">₹{s.pricePerHour}</td>
                  <td className="px-4 py-4">
                    <a
                      href={s.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-emerald-400 hover:underline"
                    >
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <UpdateStation station={s} />
                      <button
                        onClick={() => delectStaions(s._id)}
                        className="inline-flex items-center cursor-pointer gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
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
          {filtered.map((s, i) => (
            <article key={s._id} className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5">
              <div className="flex items-start gap-4">
                <StationImage image={s.image} alt={s.stationName} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-zinc-500">#{String(i + 1).padStart(2, '0')}</p>
                      <h3 className="mt-0.5 truncate text-base text-wrap font-semibold text-zinc-100">{s.stationName}</h3>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-zinc-900 px-2.5 py-1 text-sm font-semibold text-emerald-400 ring-1 ring-zinc-800">
                      ₹{s.pricePerHour}
                      <span className="text-xs font-normal text-zinc-500">/hr</span>
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {s.city}, {s.state}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-900 pt-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">Charging</p>
                  <div className="mt-1">
                    <ChargingChip type={s.chargingType} />
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">Vehicle</p>
                  <p className="mt-1.5 text-sm font-medium text-zinc-200">{s.vehicleType}</p>
                </div>
              </div>

              <a
                href={s.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-zinc-300 hover:text-emerald-400 hover:underline"
              >
                <MapPin className="h-4 w-4" />
                Open on map
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <UpdateStation station={s} fullWidth />
                <button
                  onClick={() => delectStaions(s._id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default StationListPage