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
  slow: { dot: 'bg-muted-foreground/60', text: 'text-muted-foreground', ring: 'ring-border' },
  fast: { dot: 'bg-sky-400', text: 'text-sky-500 dark:text-sky-300', ring: 'ring-sky-900/20 dark:ring-sky-900/60' },
  superfast: { dot: 'bg-primary', text: 'text-primary', ring: 'ring-primary/20' },
}

const ChargingChip = ({ type }) => {
  const style = CHARGING_STYLES[type] || CHARGING_STYLES.slow
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium ${style.text} ring-1 ${style.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {type ? type.charAt(0).toUpperCase() + type.slice(1) : '—'}
    </span>
  )
}

const StationImage = ({ image, alt }) => {
  if (!image) {
    return (
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border">
        <ImageOff className="h-4 w-4" />
      </div>
    )
  }
  return (
    <img
      src={image}
      alt={alt}
      className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
    />
  )
}

const FilterSelect = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-xl border border-border bg-muted px-3 py-2 text-xs font-medium text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value} className="bg-card">
        {opt.label}
      </option>
    ))}
  </select>
)

// Custom confirm toast content
const ConfirmDeleteToast = ({ closeToast, stationName, onConfirm }) => (
  <div className="flex flex-col gap-3">
    <p className="text-sm font-medium text-foreground">
      Delete <span className="font-semibold">{stationName || 'this station'}</span>?
    </p>
    <p className="text-xs text-muted-foreground">This action can't be undone.</p>
    <div className="flex justify-end gap-2 pt-1">
      <button
        onClick={closeToast}
        className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          onConfirm()
          closeToast()
        }}
        className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/20"
      >
        Delete
      </button>
    </div>
  </div>
)

const StationListPage = () => {
  const [viewStationDetails, setViewStationDetails] = useState([])
  const [search, setSearch] = useState('')
  const [charging, setCharging] = useState('all')
  const [vehicle, setVehicle] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
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
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
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

  const confirmDeleteStation = (station) => {
    toast(
      ({ closeToast }) => (
        <ConfirmDeleteToast
          closeToast={closeToast}
          stationName={station.stationName}
          onConfirm={() => delectStaions(station._id)}
        />
      ),
      {
        position: 'top-right',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: true,
        className: '!bg-card !text-foreground !border !border-border !rounded-2xl !shadow-lg',
      }
    )
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
    <section className="font-[DM_Sans] text-foreground">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Your Stations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Showing {filtered.length} of {viewStationDetails.length}{' '}
            {viewStationDetails.length === 1 ? 'station' : 'stations'}
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, vehicle…"
            className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-10 text-sm text-foreground placeholder-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground sm:inline-flex">
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
              className="rounded-xl border border-border bg-muted px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Empty state: only after loading is done AND there really are zero stations */}
      {!isLoading && viewStationDetails.length === 0 && (
        <div className="grid place-items-center rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <Zap className="h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium text-foreground">No stations added yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Add a station to see it listed here.</p>
        </div>
      )}

      {/* Desktop table */}
      {(isLoading || filtered.length > 0) ? (
        <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card lg:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-foreground">
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
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border animate-pulse">
                    <td className="px-6 py-4"><div className="h-3 w-6 rounded bg-muted" /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted" />
                        <div className="h-3 w-28 rounded bg-muted" />
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="h-3 w-20 rounded bg-muted" /></td>
                    <td className="px-4 py-4"><div className="h-5 w-16 rounded-full bg-muted" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-16 rounded bg-muted" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-8 rounded bg-muted" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-12 rounded bg-muted" /></td>
                    <td className="px-4 py-4"><div className="h-3 w-10 rounded bg-muted" /></td>
                    <td className="px-4 py-4"><div className="h-7 w-20 ml-auto rounded-lg bg-muted" /></td>
                  </tr>
                ))
                : filtered.map((s, i) => (
                  <tr key={s._id} className="border-t border-border transition hover:bg-muted/40">
                    <td className="px-6 py-4 font-mono text-muted-foreground">{String(i + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <StationImage image={s.image} alt={s.stationName} />
                        <span className="font-medium text-foreground">{s.stationName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{s.city}, {s.state}</td>
                    <td className="px-4 py-4"><ChargingChip type={s.chargingType} /></td>
                    <td className="px-4 py-4 text-muted-foreground">{s.vehicleType}</td>
                    <td className="px-4 py-4 text-muted-foreground">{s.availableSlots}</td>
                    <td className="px-4 py-4 font-semibold text-foreground">₹{s.pricePerHour}</td>
                    <td className="px-4 py-4">
                      <a href={s.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary hover:underline">
                        View <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <UpdateStation station={s} />
                        <button
                          onClick={() => confirmDeleteStation(s)}
                          className="inline-flex items-center cursor-pointer gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/20"
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
      ) : (
        <div className="hidden lg:grid place-items-center rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <Search className="h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium text-foreground">No stations match your filters</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different search term or clear filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 rounded-xl border border-border bg-muted px-4 py-2 text-xs font-medium text-foreground transition hover:bg-secondary"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Mobile / tablet cards */}
      {(isLoading || filtered.length > 0) ? (
        <div className="grid gap-4 lg:hidden">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-muted" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-8 rounded bg-muted" />
                    <div className="h-4 w-32 rounded bg-muted" />
                    <div className="h-3 w-24 rounded bg-muted" />
                  </div>
                  <div className="h-6 w-14 shrink-0 rounded-lg bg-muted" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div className="h-5 w-16 rounded-full bg-muted" />
                  <div className="h-4 w-16 rounded bg-muted" />
                </div>
                <div className="mt-3 h-4 w-28 rounded bg-muted" />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="h-9 rounded-xl bg-muted" />
                  <div className="h-9 rounded-xl bg-muted" />
                </div>
              </div>
            ))
            : filtered.map((s, i) => (
              <article key={s._id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <StationImage image={s.image} alt={s.stationName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-mono text-muted-foreground">#{String(i + 1).padStart(2, '0')}</p>
                        <h3 className="mt-0.5 truncate text-base text-wrap font-semibold text-foreground">{s.stationName}</h3>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-sm font-semibold text-primary ring-1 ring-border">
                        ₹{s.pricePerHour}
                        <span className="text-xs font-normal text-muted-foreground">/hr</span>
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{s.city}, {s.state}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Charging</p>
                    <div className="mt-1"><ChargingChip type={s.chargingType} /></div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Vehicle</p>
                    <p className="mt-1.5 text-sm font-medium text-foreground">{s.vehicleType}</p>
                  </div>
                </div>
                <a href={s.mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary hover:underline">
                  <MapPin className="h-4 w-4" />
                  Open on map
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <UpdateStation station={s} fullWidth />
                  <button
                    onClick={() => confirmDeleteStation(s)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </article>
            ))}
        </div>
      ) : (
        viewStationDetails.length > 0 && (
          <div className="grid place-items-center rounded-2xl border border-border bg-card px-6 py-16 text-center lg:hidden">
            <Search className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-foreground">No stations match your filters</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different search term or clear filters.</p>
            <button
              onClick={resetFilters}
              className="mt-4 rounded-xl border border-border bg-muted px-4 py-2 text-xs font-medium text-foreground transition hover:bg-secondary"
            >
              Clear filters
            </button>
          </div>
        )
      )}
    </section>
  )
}

export default StationListPage