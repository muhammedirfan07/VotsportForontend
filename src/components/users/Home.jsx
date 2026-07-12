import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Battery,
  Car,
  Clock,
  SlidersHorizontal,
  Filter,
  User
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../util/lib/utils";
import { feachApproveStationAPI, filterStationAPI } from "../../Server/allAPI";
import Sidebar from "../../ui/SideBarFillter";
import { useRef } from "react";
import StationsMapModal from "../../ui/StationMapModal";
import ThemeToggle from "../../ui/ThemeToggle";

const Home = () => {
  const [isloding, setLoading] = useState(true);
  const [viewStation, setViewStation] = useState([]);
  const [viewStations, setViewStations] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [searchStation, setSearchStation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [currentPage, SetCurrentPage] = useState(1);
  const [visible, setVisible] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    chargingType: "",
    vehicleType: "",
  });
  const navigate = useNavigate();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchViewStations();
  }, []);

  useEffect(() => {
    SetCurrentPage(1);
    if (searchStation.trim() !== "") {
      const filtered = viewStation.filter((station) =>
        station.city.toLowerCase().includes(searchStation.toLowerCase())
      );
      setViewStations(filtered);
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
    SetCurrentPage(1);
    if (filters.city || filters.state || filters.chargingType || filters.vehicleType) {
      fetchFilteredStations();
    } else {
      setViewStations(viewStation);
    }
  }, [filters]);

  const fetchViewStations = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    const reqHeaders = { Authorization: `Bearer ${token}` };
    try {
      setLoading(true);
      const result = await feachApproveStationAPI(reqHeaders);
      if (result.status === 200) {
        setViewStation(result.data);
        setViewStations(result.data);
        const uniqueCities = [...new Set(result.data.map((station) => station.city))];
        const uniqueStates = [...new Set(result.data.map((station) => station.state))];
        setCities(uniqueCities);
        setStates(uniqueStates);
      }
    } catch (error) {
      console.log("Error fetching stations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredStations = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    const reqHeaders = { Authorization: `Bearer ${token}` };
    try {
      const result = await filterStationAPI(
        filters.city,
        filters.state,
        filters.chargingType,
        filters.vehicleType,
        reqHeaders
      );
      if (result.status === 200) {
        setViewStations(result.data);
      } else {
        setViewStations([]);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const handleCitySelect = (city) => {
    setSearchStation(city);
    setSuggestions([]);
  };

  const getBatteryColor = (type) => {
    if (!type) return "text-muted-foreground";
    switch (type.toLowerCase()) {
      case "slow":
        return "text-primary";
      case "fast":
        return "text-yellow-500";
      case "superfast":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(viewStations.length / 4);
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      SetCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "").length;

  return (
    <>
      <div className="min-h-screen font-display pt-15 bg-background">
        <header
          className={cn(
            "fixed top-5 left-0 w-full z-50 font-display flex justify-center px-4 md:px-25",
            "transition-transform duration-300",
            visible ? "translate-y-0" : "-translate-y-20"
          )}
        >
          <nav
            className={cn(
              "nav-pill flex items-center w-full justify-between px-4 md:px-6 py-2 md:pl-5 transition-[border-radius] duration-300 rounded-full"
            )}
          >
            {/* Logo */}
            <div>
              <Link to="/">
                <h3 className="flex text-xl gap-1 md:gap-2 text-foreground font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <i className="fa-solid fa-bolt text-xl text-primary-foreground"></i>
                  </span>
                  <p>
                    <span className="md:text-2xl text-primary font-heading">Volt</span>Spot
                  </p>
                </h3>
              </Link>
            </div>

            {/* Theme + Profile */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => navigate("/profile")}
                className="flex rounded-full bg-primary/20 items-center gap-1 px-3 py-2 hover:bg-primary/30 transition-colors cursor-pointer text-foreground"
              >
                <User className="w-5 h-5" />
                <span className="text-md font-normal">Profile</span>
              </button>
            </div>
          </nav>
        </header>
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="hidden mb-20 mt-4 lg:block bg-card border border-border px-8 py-6 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Filter className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground font-heading">Filters</h2>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={() => setFilters({ city: "", state: "", chargingType: "", vehicleType: "" })}
                        className="text-destructive hover:opacity-80 ml-auto"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* City */}
                  <div className="min-w-[250px] rounded-xl mb-4 md:min-w-0 space-y-2">
                    <label className="block text-muted-foreground text-sm mb-1">City</label>
                    <select
                      className="w-full bg-secondary text-foreground rounded-xl px-2 py-3 border border-border"
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    >
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* State */}
                  <div className="min-w-[200px] mb-4 md:min-w-0 space-y-2">
                    <label className="block text-muted-foreground text-sm mb-1">State</label>
                    <select
                      className="w-full bg-secondary text-foreground rounded-xl px-2 py-3 border border-border"
                      value={filters.state}
                      onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                    >
                      <option value="">Select State</option>
                      {states.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  {/* Vehicle */}
                  <div className="min-w-[200px] mb-4 md:min-w-0 space-y-2">
                    <label className="block w-full text-muted-foreground text-sm mb-1">Vehicle Type</label>
                    <select
                      className="px-2 py-3 rounded-xl w-full bg-secondary text-foreground border border-border"
                      value={filters.vehicleType}
                      onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                    >
                      <option value="">All Vehicles</option>
                      <option value="2-wheeler">2-Wheeler</option>
                      <option value="3-wheeler">3-Wheeler</option>
                      <option value="4-wheeler">4-Wheeler</option>
                    </select>
                  </div>

                  {/* Charging Type */}
                  <div className="min-w-[200px] mb-4 md:min-w-0 space-y-2">
                    <label className="block text-muted-foreground text-sm mb-1">Charging Type</label>
                    <select
                      className="p-2 w-full bg-secondary text-foreground rounded-xl px-2 py-3 border border-border"
                      value={filters.chargingType}
                      onChange={(e) => setFilters({ ...filters, chargingType: e.target.value })}
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

            {/* Main Content */}
            <main className={`${isMobileFilterOpen ? "blur-sm" : "flex-1 min-w-0 p-4"}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-xl font-heading md:text-2xl font-bold text-foreground">
                  Explore EV Charging station in India
                </h1>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="w-full md:w-auto bg-primary text-primary-foreground px-4 py-2 rounded-2xl hover:opacity-90"
                >
                  {showMap ? "Hide Map" : "Explore Map"}
                </button>
              </div>

              <div className="lg:hidden mt-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="w-full mb-4 bg-card text-foreground p-3 rounded-lg flex items-center justify-center gap-2 border border-border"
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
                    className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring border border-border"
                    value={searchStation}
                    onChange={(e) => setSearchStation(e.target.value)}
                  />
                  <button>
                    <Search className="absolute right-4 top-3 text-muted-foreground" />
                  </button>
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-card border border-border rounded-lg mt-1 max-h-40 overflow-y-auto">
                      {suggestions.map((city, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-foreground hover:bg-muted cursor-pointer"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {showMap && (
                <StationsMapModal stations={viewStation} onClose={() => setShowMap(false)} />
              )}

              {/* Pagination info */}
              <div className="my-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-muted-foreground text-sm">
                  Showing{" "}
                  <span className="text-foreground font-medium">
                    {Math.min((currentPage - 1) * 4 + 1, viewStations.length)}–
                    {Math.min(currentPage * 4, viewStations.length)}
                  </span>{" "}
                  of <span className="text-foreground font-medium">{viewStations.length}</span> stations
                </p>
                <p className="text-primary hover:opacity-80">
                  Page {currentPage} of {Math.ceil(viewStations.length / 4)}
                </p>
              </div>

              {/* Charging Stations Grid */}
              <div className="items-center font-display overflow-y-auto">
                {isloding ? (
                  <div className="space-y-6 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-64 sm:flex-shrink-0">
                            <div className="w-full h-48 sm:h-[276px] bg-muted" />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex flex-col h-full">
                              <div className="mb-4">
                                <div className="h-6 w-2/3 bg-muted rounded mb-3" />
                                <div className="h-4 w-1/3 bg-muted rounded" />
                              </div>
                              <div className="space-y-4 mb-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="h-4 w-24 bg-muted rounded" />
                                  <div className="h-4 w-16 bg-muted rounded" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="h-4 w-28 bg-muted rounded" />
                                  <div className="h-4 w-20 bg-muted rounded" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="h-4 w-32 bg-muted rounded" />
                                  <div className="h-5 w-16 bg-muted rounded" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <div className="h-4 w-28 bg-muted rounded" />
                                <div className="h-9 w-24 bg-muted rounded-lg" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : viewStations.length > 0 ? (
                  viewStations.slice(currentPage * 4 - 4, currentPage * 4).map((station) => (
                    <div
                      key={station?._id}
                      className="bg-card mb-6 border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 group"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative overflow-hidden sm:w-64 sm:flex-shrink-0">
                          <img
                            className="w-full h-48 sm:h-[276px] object-cover transition-transform duration-300 group-hover:scale-105"
                            src={station?.image}
                            alt={station.stationName}
                          />
                          <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-col h-full">
                            <div className="mb-4">
                              <h3 className="text-2xl font-heading font-semibold text-foreground mb-2 line-clamp-1">
                                {station?.stationName}
                              </h3>
                              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{`${station?.city}, ${station?.state}`}</span>
                              </div>
                            </div>
                            <div className="space-y-3 mb-4 flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                  <Battery className={getBatteryColor(station?.chargingType)} />
                                  <span>Socket Type</span>
                                </div>
                                <span className="text-foreground text-sm font-medium capitalize">
                                  {station?.chargingType}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                  <Car />
                                  <span>Vehicle Type</span>
                                </div>
                                <span className="text-foreground text-sm font-medium capitalize">
                                  {station?.vehicleType}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                  <Clock className="w-4 h-4" />
                                  <span>Price per hour</span>
                                </div>
                                <span className="text-primary text-lg font-bold">
                                  ₹{station?.pricePerHour}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <a
                                href={station?.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-accent hover:opacity-80 text-sm font-medium"
                              >
                                <MapPin className="w-4 h-4" />
                                View Location
                              </a>
                              <Link to={`/${station?._id}/view`}>
                                <button className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-lg text-sm">
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
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      No stations found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {viewStations.length > 0 && (() => {
                const totalPages = Math.ceil(viewStations.length / 4);
                const getPageNumbers = () => {
                  if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1);
                  const pages = new Set(
                    [1, totalPages, currentPage, currentPage - 1, currentPage + 1].filter(
                      (p) => p >= 1 && p <= totalPages
                    )
                  );
                  return [...pages].sort((a, b) => a - b);
                };
                const pageNumbers = getPageNumbers();

                return (
                  <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 sm:px-5 py-2 bg-card text-foreground rounded-lg border border-border
                      hover:bg-muted hover:border-ring transition-all duration-200
                      disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      ← <span className="hidden sm:inline">Prev</span>
                    </button>

                    <div className="flex gap-1.5 flex-wrap justify-center">
                      {pageNumbers.map((page, i) => {
                        const prev = pageNumbers[i - 1];
                        const showEllipsis = prev && page - prev > 1;
                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="min-w-[36px] h-[36px] flex items-center justify-center text-muted-foreground text-sm select-none">
                                …
                              </span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`min-w-[36px] h-[36px] sm:min-w-[40px] sm:h-[40px] rounded-lg text-sm font-semibold transition-all duration-200
                              ${currentPage === page
                                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                                  : "bg-card text-foreground border border-border hover:bg-muted hover:border-ring"
                                }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 sm:px-5 py-2 bg-card text-foreground rounded-lg border border-border
                      hover:bg-muted hover:border-ring transition-all duration-200
                      disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <span className="hidden sm:inline">Next</span> →
                    </button>
                  </div>
                );
              })()}
            </main>
          </div>
        </div>

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