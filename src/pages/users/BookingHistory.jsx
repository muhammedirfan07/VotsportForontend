import React, { useEffect, useState } from "react";
import {
  ChevronDown, ChevronUp, MapPin, Calendar, Clock,
  Battery, Loader2, XCircle, RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { viewBookingAPI, cancelBookingAPI, rebookCheckAPI, paymentAPI } from "../../Server/allAPI";

const BookingHistory = ({ joinData }) => {
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [rebookingId, setRebookingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    viewBookingHistory();

  }, []);

  const currentYear = new Date().getFullYear();
  const joinYear = joinData ? new Date(joinData).getFullYear() : currentYear;
  const yearFilters = [];
  for (let y = currentYear; y >= joinYear; y--)
    yearFilters.push({ value: String(y), label: String(y) });

  const timeFilters = [
    { value: "all", label: "All Time" },
    { value: "1week", label: "Last 7 Days" },
    { value: "1month", label: "Last Month" },
    { value: "6months", label: "Last 6 Months" },
    ...yearFilters,
  ];

  const toggleBookingDetails = (id) =>
    setExpandedBooking(expandedBooking === id ? null : id);

  const viewBookingHistory = async () => {
    const authUser = JSON.parse(sessionStorage.getItem("user"));
    const userId = authUser?._id;
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      const result = await viewBookingAPI(userId, { Authorization: `Bearer ${token}` });
      if (result.status === 200) {
        setBookingHistory(result.data.bookings);
        console.log("booking history =", result.data.bookings);

      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const isCancelAllowed = (booking) => {
    if (booking?.status !== "confirmed")
      return false
    const bookedAt = new Date(booking.createdAt)
    const now = new Date()
    const diffminutes = (now - bookedAt) / (1000 * 60)
    return diffminutes <= 15
  }

  // ── Cancel booking ──────────────────────────────────────────────────────────
  const handleCancel = async (bookingId) => {
    setConfirmCancelId(null);
    setCancellingId(bookingId);
    const token = sessionStorage.getItem("token");
    try {
      const result = await cancelBookingAPI(bookingId, { Authorization: `Bearer ${token}` });
      if (result.status === 200) {
        toast.success("Booking cancelled. Refund added to your wallet.", {
          position: "top-center", theme: "dark",
        });
        // Update local state immediately
        setBookingHistory((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "canceled" } : b
          )
        );
      } else {
        toast.error(result.response?.data?.message || "Cancellation failed", {
          position: "top-center", theme: "dark",
        });
      }
    } catch (err) {
      toast.error("Something went wrong.", { position: "top-center", theme: "dark" });
    } finally {
      setCancellingId(null);
    }
  };

  // ── Rebook slot ─────────────────────────────────────────────────────────────
  const handleRebook = async (booking) => {
    setRebookingId(booking._id);
    const token = sessionStorage.getItem("token");
    const authUser = JSON.parse(sessionStorage.getItem("user"));
    const userId = authUser?._id;

    try {
      //  Check slot availability
      const checkResult = await rebookCheckAPI(
        {
          stationId: booking.stationId?._id,
          slotNumber: booking.slotNumber,
          duration: booking.duration,
        },
        { Authorization: `Bearer ${token}` }
      );

      if (checkResult.status !== 200) {
        toast.warning(
          checkResult.response?.data?.message ||
          "Slot no longer available. Choose another slot.",
          { position: "top-center", theme: "dark" }
        );
        return;
      }

      //  Slot is free  create new booking then go to payment
      const { bookingStaionAPI } = await import("../../Server/allAPI");
      const bookingData = {
        userId,
        stationId: booking.stationId?._id,
        slotNumber: booking.slotNumber,
        startTime: new Date().toISOString(),
        duration: booking.duration,
      };

      const bookResult = await bookingStaionAPI(bookingData, { Authorization: `Bearer ${token}` });
      if (bookResult.status === 200) {
        toast.success("Slot rebooked! Redirecting to payment...", {
          position: "top-center", theme: "dark",
        });
        const price = booking.totalPrice;
        const paymentResult = await paymentAPI(
          booking.stationId?._id,
          userId,
          price,
          bookResult.data.booking?._id
        );
        if (paymentResult.data?.id) {
          navigate(`/stripe-checkout/${paymentResult.data.id}`);
        } else {
          toast.error("Could not start payment. Try again.", {
            position: "top-center", theme: "dark",
          });
        }
      } else {
        toast.error(
          bookResult.response?.data?.message || "Rebooking failed.",
          { position: "top-center", theme: "dark" }
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.", { position: "top-center", theme: "dark" });
    } finally {
      setRebookingId(null);
    }
  };

  // ── Filtering ───────────────────────────────────────────────────────────────
  const filterBookingsByTime = () => {
    const now = new Date();
    if (selectedFilter === "all") return bookingHistory;

    if (["1week", "1month", "6months"].includes(selectedFilter)) {
      const d = new Date(now);
      if (selectedFilter === "1week") d.setDate(d.getDate() - 7);
      if (selectedFilter === "1month") d.setMonth(d.getMonth() - 1);
      if (selectedFilter === "6months") d.setMonth(d.getMonth() - 6);
      return bookingHistory.filter((b) => new Date(b.startTime) >= d);
    }

    const year = parseInt(selectedFilter);
    if (!isNaN(year))
      return bookingHistory.filter((b) => new Date(b.startTime).getFullYear() === year);

    return bookingHistory;
  };

  const filteredBookings = filterBookingsByTime();
  const enableScroll = filteredBookings.length > 5;

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "completed": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "canceled": return "bg-red-500/20 text-red-400 border border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  return (
    <div className="bg-zinc-900 drop-shadow-xl rounded-xl ">
      {/* Header */}
      <div className="px-6 py-5 border-b border-neutral-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl text-amber-50 font-semibold">Booking History</h2>
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="w-full sm:w-auto bg-neutral-800 hover:bg-zinc-900 text-white px-4 py-2 rounded-lg flex items-center justify-between gap-3 border border-neutral-600 transition-all min-w-[180px]"
          >
            <span className="text-sm">{timeFilters.find((f) => f.value === selectedFilter)?.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
          </button>
          {showFilterDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 custom-scroll shadow-xl z-40">
              {timeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => { setSelectedFilter(filter.value); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-zinc-800 ${selectedFilter === filter.value ? "bg-green-900/30 text-green-400" : "text-white"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* List */}
      <div className="p-6">
        <div className={`space-y-4 pr-2 ${enableScroll ? "max-h-[560px] overflow-y-auto custom-scroll" : ""}`}>
          {isLoading ? (
            <p className="text-gray-400 flex gap-2 justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin mt-1" /> Loading History...
            </p>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const startTime = new Date(booking.startTime);
              const endTime = new Date(booking.endTime);
              const timeOpts = { hour: "2-digit", minute: "2-digit", hour12: true };
              const isCanceled = booking.status === "canceled";
              const isConfirmed = booking.status === "confirmed";

              return (
                <div
                  key={booking._id}
                  className={`rounded-xl border overflow-hidden transition-all ease-in-out ${isCanceled
                      ? "bg-zinc-900/60 border-zinc-800 opacity-70"
                      : "bg-zinc-950/50 border-zinc-700 hover:border-green-600/30 shadow"
                    }`}
                >
                  {/* Confirm-cancel overlay */}
                  {confirmCancelId === booking._id && (
                    <div className="bg-red-950/60 border-b border-red-800 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                      <p className="text-red-300 text-sm">
                        Cancel this booking? The amount will be refunded to your wallet.
                      </p>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={!!cancellingId}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-1.5 rounded-lg transition disabled:opacity-50 flex items-center gap-1"
                        >
                          {cancellingId === booking._id ? (
                            <><Loader2 className="w-3 h-3 animate-spin" /> Cancelling...</>
                          ) : "Yes, Cancel"}
                        </button>
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="bg-neutral-700 hover:bg-neutral-600 text-white text-xs px-4 py-1.5 rounded-lg transition"
                        >
                          Keep Booking
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Card header (clickable to expand) */}
                  <div onClick={() => toggleBookingDetails(booking._id)} className="cursor-pointer p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-base font-semibold text-white">
                            {booking.stationId?.stationName || "Unknown Station"}
                          </h3>
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin size={13} className="mr-1" />
                          {booking.stationId?.city}
                          {booking.stationId?.state ? `, ${booking.stationId.state}` : ""}
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white transition-colors ml-2">
                        {expandedBooking === booking._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center text-gray-400 text-xs mb-1"><Calendar size={13} className="mr-1" />Date</div>
                        <p className="text-white font-medium text-sm">
                          {startTime.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-400 text-xs mb-1"><Clock size={13} className="mr-1" />Time</div>
                        <p className="text-white font-medium text-sm">{startTime.toLocaleTimeString([], timeOpts)}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-400 text-xs mb-1"><Battery size={13} className="mr-1" />Energy</div>
                        <p className="text-white font-medium text-sm">{booking.stationId?.chargingType || "N/A"}</p>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-1">Amount</div>
                        <p className={`font-semibold text-base ${isCanceled ? "text-red-400 line-through" : "text-green-400"}`}>
                          {formatCurrency(booking.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedBooking === booking._id && (
                    <div className="px-5 pb-5 pt-2 border-t border-gray-800">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-5">
                        <div>
                          <p className="text-gray-400 mb-1">Slot Number</p>
                          <p className="text-white font-medium">Slot {booking.slotNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Duration</p>
                          <p className="text-white font-medium">
                            {booking.duration} {booking.duration === 1 ? "hour" : "hours"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Start Time</p>
                          <p className="text-white font-medium">{startTime.toLocaleTimeString([], timeOpts)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">End Time</p>
                          <p className="text-white font-medium">{endTime.toLocaleTimeString([], timeOpts)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Total Price</p>
                          <p className={`font-semibold ${isCanceled ? "text-red-400" : "text-green-400"}`}>
                            {formatCurrency(booking.totalPrice)}
                            {isCanceled && <span className="text-xs text-gray-400 ml-2">(Refunded to wallet)</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Energy Type</p>
                          <p className="text-white font-medium">{booking.stationId?.chargingType || "N/A"}</p>
                        </div>
                      </div>
                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-3 pt-3 border-t border-neutral-800">
                        {/* Cancel only within 15 min */}
                        {isConfirmed && isCancelAllowed(booking) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmCancelId(booking._id); }}
                            disabled={!!cancellingId}
                            className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/50 border border-red-700/40 text-red-400 hover:text-red-300 text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
                          >
                            <XCircle size={15} /> Cancel Booking
                          </button>
                        )}

                        {/* Window expired  show rebook instead */}
                        {isConfirmed && !isCancelAllowed(booking) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRebook(booking); }}
                            disabled={rebookingId === booking._id}
                            className="flex items-center gap-1.5 bg-green-900/30 hover:bg-green-900/50 border border-green-700/40 text-green-400 hover:text-green-300 text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
                          >
                            {rebookingId === booking._id ? (
                              <><Loader2 size={14} className="animate-spin" /> Checking slot...</>
                            ) : (
                              <><RefreshCw size={14} /> Rebook Same Slot</>
                            )}
                          </button>
                        )}

                        {/* Already cancelled always show rebook */}
                        {isCanceled && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRebook(booking); }}
                            disabled={rebookingId === booking._id}
                            className="flex items-center gap-1.5 bg-green-900/30 hover:bg-green-900/50 border border-green-700/40 text-green-400 hover:text-green-300 text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
                          >
                            {rebookingId === booking._id ? (
                              <><Loader2 size={14} className="animate-spin" /> Checking slot...</>
                            ) : (
                              <><RefreshCw size={14} /> Rebook Same Slot</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <Battery className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400 text-lg">No bookings found for this period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;