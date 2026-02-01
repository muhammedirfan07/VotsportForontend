import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Battery,
  Car,
  Clock,
  X,
  SlidersHorizontal,
  Filter,
} from "lucide-react";
import station1 from "../../assets/station1.jpg";
import { Link } from "react-router-dom";
import Header from "./Header";
import { feachApproveStationAPI, filterStationAPI } from "../../Server/allAPI";
import SERVER_URL from "../../Server/serverURL";
import Sidebar from "../../ui/SideBarFillter";


const Home = () => {
  const [isloging, setLoaging] = useState(true);
  const [isloding, setLoading] = useState(true);
  const [viewStation, setViewStation] = useState([]);
  const [viewStations, setViewStations] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [searchStation, setSearchStation] = useState("");
  const [suggestions, setSuggestions] = useState([]); //auto suggection
  const [showMap, setShowMap] = useState(false);
  const [currentPage, SetCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    chargingType: "",
    vehicleType: "",
  });

  useEffect(() => {
    fetchViewStations();
  }, []);

  useEffect(() => {
    if (searchStation.trim() !== "") {
      // Filter stations based on search input
      const filtered = viewStation.filter((station) =>
        station.city.toLowerCase().includes(searchStation.toLowerCase())
      );
      setViewStations(filtered);

      // Generate autocomplete suggestions
      const citySuggestions = [
        ...new Set(viewStation.map((station) => station.city)),
      ].filter((city) =>
        city.toLowerCase().includes(searchStation.toLowerCase())
      );
      setSuggestions(citySuggestions);
    } else {
      setViewStations(viewStation);
      setSuggestions([]);
    }
  }, [searchStation]);

  useEffect(() => {
    if (filters.city || filters.state || filters.chargingType || filters.vehicleType) {
      fetchFilteredStations();
    } else {
      setViewStations(viewStation);
    }
  }, [filters]);



  // Fetch all approved stations
  const fetchViewStations = async () => {
    console.log("Fetching approved stations...");
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.log("No token found!");
      setLoading(false);
      return;
    }

    const reqHeaders = {
      Authorization: `Bearer ${token}`,
    };

    try {
      setLoading(true); 
      const result = await feachApproveStationAPI(reqHeaders);
      console.log("API Result:", result);

      if (result.status === 200) {
        setViewStation(result.data);
        setViewStations(result.data); 
        // Extract unique cities and states
        const uniqueCities = [
          ...new Set(result.data.map((station) => station.city)),
        ];
        const uniqueStates = [
          ...new Set(result.data.map((station) => station.state)),
        ];

        setCities(uniqueCities);
        setStates(uniqueStates);
      } else {
        console.log("Failed to fetch stations, status:", result.status);
      }
    } catch (error) {
      console.log("Error fetching stations:", error);
    } finally {
      setLoading(false); 
    }
  };

  // Filter stations based on user inputs
  const fetchFilteredStations = async () => {
    console.log("Fetching filtered stations...");
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.log("No token found!");
      return;
    }

    const reqHeaders = {
      Authorization: `Bearer ${token}`,
    };

    try {
      setLoading(true);
      const result = await filterStationAPI(
        filters.city,
        filters.state,
        filters.chargingType,
        filters.vehicleType,
        reqHeaders
      );

      console.log("Filtered API Response:", result);
      if (result.status === 200) {
        setViewStations(result.data);
      } else {
        console.log("No stations found!");
        setViewStations([]);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    } finally {
      setLoading(false);
    }
  };


  // Handle city selection from autocomplete suggestions
  const handleCitySelect = (city) => {
    setSearchStation(city);
    setSuggestions([]);
  };

  const getBatteryColor = (type) => {
    console.log("type =", type);

    if (!type) return "text-gray-500";
    switch (type.toLowerCase()) {
      case "slow":
        return "text-green-500";
      case "fast":
        return "text-yellow-500";
      case "superfast":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(viewStations.length / 4);

    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      SetCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <>
      <Header isloging={isloging} />
      <div className="min-h-screen  font-[DM_Sans] pt-15 bg-neutral-950">

        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-8">
            {/* Sidebar - Full width on mobile, fixed width on desktop */}
            <aside className="hidden lg:block w-80  flex-shrink-0">
              <div className="sticky top-24">
                <div className="text-gray-400 font-medium mb-4">Filters</div>
                {/* DESKTOP FILTER BOX */}
                <div className="hidden mb-20 lg:block bg-gray-800/50 px-8 py-6 rounded-xl shadow-lg ">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Filter className="w-5 h-5 text-green-400/75" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Filters</h2>
                    {activeFiltersCount > 0 && (
                      <button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilters({ city: '', state: '', chargingType: '', vehicleType: '' })}
                        className="text-red-600 hover:text-red-400/100 ml-auto"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  {/* City */}
                  <div className="min-w-[250px] rounded-xl mb-4 md:min-w-0 space-y-2">
                    <label className="block text-gray-300 text-sm mb-1">City</label>
                    <select
                      className="w-full bg-neutral-800 text-white  rounded-xl px-2 py-3"
                      value={filters.city}
                      onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value })
                      }
                    >
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State */}
                  <div className="min-w-[200px] mb-4 md:min-w-0 space-y-2">
                    <label className="block text-gray-300 text-sm mb-1">
                      State
                    </label>
                    <select
                      className="w-full bg-neutral-800 text-white rounded-xl px-2 py-3"
                      value={filters.state}
                      onChange={(e) =>
                        setFilters({ ...filters, state: e.target.value })
                      }
                    >
                      <option value="">Select State</option>
                      {states.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Vehicle */}
                  <div className="min-w-[200px] mb-4 md:min-w-0 space-y-2">
                    <label className="block w-full text-gray-300 text-sm mb-1">
                      Vehicle Type
                    </label>
                    <select
                      className="px-2 py-3 rounded-xl w-full bg-neutral-800 text-white "
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
                  </div>

                  {/* Charging Type */}
                  <div className="min-w-[200px] mb-4 md:min-w-0 space-y-2">
                    <label className="block text-gray-300 text-sm mb-1">
                      Charging  Type
                    </label>
                    <select
                      className="p-2 w-full bg-neutral-800 text-white rounded-xl px-2 py-3"
                      value={filters.chargingType}
                      onChange={(e) =>
                        setFilters({ ...filters, chargingType: e.target.value })
                      }
                    >
                      <option value="">All Charging Types</option>
                      <option value="slow">Slow</option>
                      <option value="fast">Fast</option>
                      <option value="superfast">Superfast</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content*/}
            <main className={`${isMobileFilterOpen ? "blur-sm" : "flex-1 min-w-0 p-4"} `}>
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-xl font-[Manrope] md:text-2xl font-bold text-white">
                  Explore EV Charging station in India
                </h1>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="w-full md:w-auto bg-emerald-800 text-white px-4 py-2 rounded-2xl hover:bg-emerald-600"
                >
                  {showMap ? "Hide Map" : "Explore Map"}
                </button>
              </div>

              <div className="lg:hidden mt-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="w-full mb-4 bg-neuttral-950 text-white p-3 rounded-lg flex items-center justify-center gap-2 border border-zinc-700"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </button>
              </div>

              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by city or state"
                    className="w-full px-4 py-3 bg-neutral-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={searchStation}
                    onChange={(e) => setSearchStation(e.target.value)} // Update state on input
                  />
                  <button>
                    <Search className="absolute right-4 top-3 text-gray-400" />
                  </button>
                  {/* Autocomplete Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-neutral-800 rounded-lg mt-1 max-h-40 overflow-y-auto">
                      {suggestions.map((city, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-white hover:bg-neutral-700 cursor-pointer"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Map View - Conditionally rendered */}
              {showMap && (
                <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                  <div className="relative">
                    <button
                      onClick={() => setShowMap(false)}
                      className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
                    >
                      <X size={20} />
                    </button>
                    <iframe
                      src="https://www.google.com/maps/d/u/0/embed?mid=1ZJAUHIjyykkJtqurWZ8SlSCZrBENF7g&ehbc=2E312F"
                      width="100%"
                      height="480"
                      className="border-0"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Pagination */}
              <div className="my-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-400">Showing {viewStations.length} charging stations</div>
                <button className="text-emerald-400 hover:text-emerald-300">
                  {" "}
                  Page {currentPage} of {Math.ceil(viewStations.length / 4)}
                </button>
              </div>

              {/* Charging Stations Grid */}
              <div className=" items-center font-[Dm_Sans] overflow-y-auto  ">
                {isloding ? (
                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-0 z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid"></div>
                  </div>
                ) : viewStations.length > 0 ? (
                  viewStations.slice(currentPage * 4 - 4, currentPage * 4).map((station) => (
                    <div className="bg-neutral-900 mb-6 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1 group">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="relative overflow-hidden sm:w-64 sm:flex-shrink-0">
                          <img
                            className="w-full h-48 sm:h-[276px] object-cover transition-transform duration-300 group-hover:scale-105"
                            src={`${SERVER_URL}/${station?.image}`}
                            alt={station.stationName}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="mb-4">
                              <h3 className="text-2xl font-semibold text-white mb-2 line-clamp-1">
                                {station?.stationName}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{`${station?.city}, ${station?.state}`}</span>
                              </div>
                            </div>
                            {/* Details */}
                            <div className="space-y-3 mb-4 flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                  <Battery className={getBatteryColor(station?.chargingType)} />
                                  <span>Socket Type</span>
                                </div>
                                <span className="text-white text-sm font-medium capitalize">
                                  {station?.chargingType}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                  <Car />
                                  <span>Vehicle Type</span>
                                </div>
                                <span className="text-white text-sm font-medium capitalize">
                                  {station?.vehicleType}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                  <Clock className="w-4 h-4" />
                                  <span>Price per hour</span>
                                </div>
                                <span className="text-emerald-400 text-lg font-bold">
                                  ₹{station?.pricePerHour}
                                </span>
                              </div>
                            </div>
                            {/* Actions */}
                            <div className="flex items-center justify-between gap-4">
                              <a
                                href={station?.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                              >
                                <MapPin className="w-4 h-4" />
                                View Location
                              </a>
                              <Link to={`/${station?._id}/view`}>
                                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm">
                                  Booking
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-400 mb-2">
                      No stations found
                    </h3>
                    <p className="text-gray-400">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {viewStations.length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-8">

                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-6 py-2.5 bg-neutral-900 text-gray-300 rounded-lg border border-gray-700 
                    hover:bg-neutral-800 hover:border-gray-600 transition-all duration-200 
                    disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    Previous
                  </button>A

                  {/* Page Numbers */}
                  <div className="flex gap-2">
                    {[...Array(Math.ceil(viewStations.length / 4))].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`min-w-[44px] h-[44px] rounded-lg font-semibold transition-all duration-200
              ${currentPage === index + 1
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                            : "bg-neutral-900 text-gray-300 border border-gray-700 hover:bg-neutral-800 hover:border-gray-600"
                          }
            `}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(viewStations.length / 4)}
                    className="px-6 py-2.5 bg-neutral-900 text-gray-300 rounded-lg border border-gray-700 
                    hover:bg-neutral-800 hover:border-gray-600 transition-all duration-200 
                    disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    Next
                  </button>
                </div>
              )}


            </main>
          </div >
        </div>
        {/* MOBILE FILTER DRAWER */}
        <div className="lg:hidden">
          <Sidebar
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            filters={filters}
            setFilters={setFilters}
            cities={cities}
            states={states}
            hasActiveFilters={activeFiltersCount > 0}
            clearAllFilters={() =>
              setFilters({ city: "", state: "", chargingType: "", vehicleType: "" })
            }
          />
        </div>
      </div>
    </>
  );
};

export default Home;