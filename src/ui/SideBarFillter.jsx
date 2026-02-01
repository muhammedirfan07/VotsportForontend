import React from "react";
import { X, Filter, ChevronDown } from "lucide-react";
 // your Button component

const Sidebar = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  cities,
  states,
  hasActiveFilters,
  clearAllFilters,
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-full w-[80%] lg:w-80 z-50 transform transition-transform duration-300 bg-neutral-950 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Filters</h2>
          </div>
          <button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-neutral-800 rounded-full w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex justify-between items-center p-3 bg-red-700/10 border border-red-600/20 rounded-lg">
              <span className="text-sm text-white font-medium">
                Active filters applied
              </span>
              <button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-500 hover:text-red-400 hover:bg-red-700/20 h-auto py-1 px-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Vehicle Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              Vehicle Type
            </label>
            <div className="relative">
              <select
                className="w-full bg-neutral-800 text-white rounded-xl px-3 py-2 appearance-none pr-10"
                value={filters.vehicleType}
                onChange={(e) =>
                  setFilters({ ...filters, vehicleType: e.target.value })
                }
              >
                <option value="">All Vehicles</option>
                <option value="2-wheeler">2-Wheeler</option>
                <option value="3-wheeler">3-Wheeler</option>
                <option value="4-wheeler">4-Wheeler</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Charging Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              Socket Type
            </label>
            <div className="relative">
              <select
                className="w-full bg-neutral-800 text-white rounded-xl px-3 py-2 appearance-none pr-10"
                value={filters.chargingType}
                onChange={(e) =>
                  setFilters({ ...filters, chargingType: e.target.value })
                }
              >
                <option value="">All Charging Types</option>
                <option value="slow">Slow Charging</option>
                <option value="fast">Fast Charging</option>
                <option value="superfast">Superfast Charging</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">City</label>
            <div className="relative">
              <select
                className="w-full bg-neutral-800 text-white rounded-xl px-3 py-2 appearance-none pr-10"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">State</label>
            <div className="relative">
              <select
                className="w-full bg-neutral-800 text-white rounded-xl px-3 py-2 appearance-none pr-10"
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              >
                <option value="">Select State</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-black/90">
          <button
            onClick={onClose}
            className="w-full text-white bg-green-600 hover:bg-green-500 font-semibold rounded-lg py-3"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
