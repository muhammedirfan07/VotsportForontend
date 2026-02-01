import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Calendar, Clock, Battery } from "lucide-react";
import { viewBookingAPI } from "../../Server/allAPI";

const BookingHistory = () => {
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);


  useEffect(() => {
    viewBookingHistory();
  }, []);

  const toggleBookingDetails = (id) => {
    if (expandedBooking === id) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(id);
    }
  };

  const viewBookingHistory = async () => {
    const userData = sessionStorage.getItem("user");
    const authUser = JSON.parse(userData);
    const userId = authUser?._id;
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.log("Token is not available.");
      return;
    }

    const reqHeaders = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await viewBookingAPI(userId, reqHeaders);
      if (result.status === 200) {
        setBookingHistory(result.data.bookings);
        console.log("history:", result.data.bookings);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: '1week', label: 'Last 7 Days' },
    { value: '1month', label: 'Last Month' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];

  const filterBookingsByTime = () => {
    const now = new Date();

    switch (selectedFilter) {
      case 'all':
        return bookingHistory;

      case '1week':
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return bookingHistory.filter(booking => {
          const bookingDate = new Date(booking.startTime);
          return bookingDate >= oneWeekAgo;
        });

      case '1month':
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return bookingHistory.filter(booking => {
          const bookingDate = new Date(booking.startTime);
          return bookingDate >= oneMonthAgo;
        });

      case '6months':
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        return bookingHistory.filter(booking => {
          const bookingDate = new Date(booking.startTime);
          return bookingDate >= sixMonthsAgo;
        });

      case '2024':
        return bookingHistory.filter(booking => {
          const bookingDate = new Date(booking.startTime);
          return bookingDate.getFullYear() === 2024;
        });

      case '2023':
        return bookingHistory.filter(booking => {
          const bookingDate = new Date(booking.startTime);
          return bookingDate.getFullYear() === 2023;
        });

      case '2022':
        return bookingHistory.filter(booking => {
          const bookingDate = new Date(booking.startTime);
          return bookingDate.getFullYear() === 2022;
        });

      default:
        return bookingHistory;
    }
  };

  const filteredBookings = filterBookingsByTime();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const enableScroll = filteredBookings.length > 5;

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "active":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="bg-neutral-900 drop-shadow-xl rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl text-amber-50 font-semibold">Booking History</h2>

        {/* Time Filter Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg flex items-center justify-between gap-3 border border-neutral-600 transition-all min-w-[180px]"
          >
            <span className="text-sm">{timeFilters.find(f => f.value === selectedFilter)?.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showFilterDropdown && (
            <div className="absolute top-full mt-2 w-full bg-neutral-800 border border-neutral-600 rounded-lg overflow-hidden z-20 shadow-xl">
              {timeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setSelectedFilter(filter.value);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-neutral-700 transition-colors text-sm ${selectedFilter === filter.value ? 'bg-green-900/30 text-green-400' : 'text-white'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 ">
        <div className={`space-y-6 pr-2 ${enableScroll
            ? "max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900"
            : ""
          }`}>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const startTime = new Date(booking.startTime);
              const endTime = new Date(booking.endTime);
              const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

              return (
                <div
                  key={booking._id}
                  className="bg-neutral-900/50 rounded-xl border border-neutral-700 overflow-hidden hover:border-green-600/30 shadow transition-all ease-in-out"
                >
                  <div
                    onClick={() => toggleBookingDetails(booking._id)}
                    className="cursor-pointer p-6"
                  >
                    <div className=" flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-white">
                            {booking.stationId?.stationName || "Unknown Station"}
                          </h3>
                          <span className={`px-3 py-1 text-xs border border-green-600 bg-green-500/15 text-green-600 font-medium rounded-full ${getStatusStyles(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin size={14} className="mr-1" />
                          {booking.stationId?.city}{booking.stationId?.state ? `, ${booking.stationId?.state}` : " n/a"}
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        {expandedBooking === booking._id ? (
                          <ChevronUp size={24} />
                        ) : (
                          <ChevronDown size={24} />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center text-gray-400 text-xs mb-1">
                          <Calendar size={14} className="mr-1" />
                          Date
                        </div>
                        <p className="text-white font-medium text-sm">
                          {startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-400 text-xs mb-1">
                          <Clock size={14} className="mr-1" />
                          Time
                        </div>
                        <p className="text-white font-medium text-sm">
                          {startTime.toLocaleTimeString([], timeOptions)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-400 text-xs mb-1">
                          <Battery size={14} className="mr-1" />
                          Energy
                        </div>
                        <p className="text-white font-medium text-sm">
                          {booking.stationId?.chargingType || "N/A"}
                        </p>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-1">Amount</div>
                        <p className="text-green-400 font-semibold text-lg">
                          {formatCurrency(booking.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {expandedBooking === booking._id && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Station Name</p>
                          <p className="text-white font-medium">
                            {booking.stationId?.stationName || "Unknown Station"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Location</p>
                          <p className="text-white font-medium">
                            {`${booking.stationId?.city}${booking.stationId?.state ? `, ${booking.stationId?.state}` : ""}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Slot Number</p>
                          <p className="text-white font-medium">
                            {booking.slotNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Duration</p>
                          <p className="text-white font-medium">
                            {booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Start Time</p>
                          <p className="text-white font-medium">
                            {startTime.toLocaleTimeString([], timeOptions)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">End Time</p>
                          <p className="text-white font-medium">
                            {endTime.toLocaleTimeString([], timeOptions)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Energy Type</p>
                          <p className="text-white font-medium">
                            {booking.stationId?.chargingType || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Total Price</p>
                          <p className="text-green-400 font-semibold">
                            {formatCurrency(booking.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <Battery className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400 text-lg">No bookings found for this time period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;