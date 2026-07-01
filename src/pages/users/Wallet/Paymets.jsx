import React, { useEffect, useState } from "react";
import {
  Wallet, Battery, Clock, Calendar, ChevronDown,
  Loader2, ArrowDownCircle, ArrowUpCircle, TrendingUp,
} from "lucide-react";
import { getWalletSummaryAPI } from "../../../Server/allAPI";

export default function EVPaymentPage() {
  const [summary, setSummary]                   = useState(null);
  const [isLoading, setIsLoading]               = useState(true);
  const [activeTab, setActiveTab]               = useState("all");
  const [selectedFilter, setSelectedFilter]     = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const timeFilters = [
    { value: "all",     label: "All Time" },
    { value: "today",   label: "Today" },
    { value: "1week",   label: "Last 7 Days" },
    { value: "1month",  label: "Last Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    getWalletSummaryAPI({ Authorization: `Bearer ${token}` })
      .then((res) => { if (res?.data) setSummary(res.data); })
      .finally(() => setIsLoading(false));
  }, []);

  // ── merge & sort all transactions ───────────────────────────────────────────
  const allTransactions = () => {
    if (!summary) return [];
    const payments = (summary.payments || []).map((p) => ({
      _id:    p._id,
      type:   "payment",
      // use createdAt as the filter key (when transaction happened)
      date:   p.createdAt,
      displayDate: p.paymentDate || p.createdAt,
      amount: p.amount,
      label:  p.stationId?.stationName || "EV Station",
      sub:    p.stationId?.city || "",
      detail: p.bookingId
        ? `Booking #${p.bookingId.bookingId} · Slot ${p.bookingId.slotNumber} · ${p.bookingId.duration}h`
        : "",
      txnId:  p.transactionId,
    }));

    const refunds = (summary.refunds || []).map((r) => ({
      _id:    r._id,
      type:   "refund",
      date:   r.createdAt,
      displayDate: r.createdAt,
      amount: r.amount,
      label:  "Refund",
      sub:    r.bookingId ? `Booking #${r.bookingId.bookingId}` : "",
      detail: "",
      txnId:  null,
    }));

    return [...payments, ...refunds].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

  // ── filter by createdAt ──────────────────────────────────────────────────────
  const filterByTime = (list) => {
    if (selectedFilter === "all") return list;
    const now = new Date();
    const cutoff = new Date(now);

    switch (selectedFilter) {
      case "today":
        cutoff.setHours(0, 0, 0, 0);
        break;
      case "1week":
        cutoff.setDate(cutoff.getDate() - 7);
        break;
      case "1month":
        cutoff.setMonth(cutoff.getMonth() - 1);
        break;
      case "3months":
        cutoff.setMonth(cutoff.getMonth() - 3);
        break;
      case "6months":
        cutoff.setMonth(cutoff.getMonth() - 6);
        break;
      default:
        return list;
    }

    // compare against createdAt (stored in `date`)
    return list.filter((t) => new Date(t.date) >= cutoff);
  };

  const getDisplayList = () => {
    const all = allTransactions();
    const byTab =
      activeTab === "payments" ? all.filter((t) => t.type === "payment") :
      activeTab === "refunds"  ? all.filter((t) => t.type === "refund")  : all;
    return filterByTime(byTab);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });

  const displayList = getDisplayList();

  return (
    <div className="min-h-screen bg-black p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">

        {/* ── Wallet Summary Card ── */}
        <div className="bg-gradient-to-br from-green-900 to-green-950 rounded-2xl p-5 sm:p-8 relative overflow-hidden border border-green-800/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-700/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-5 sm:mb-6 gap-3">
              <div className="min-w-0">
                <p className="text-green-300/70 text-xs sm:text-sm mb-1">Wallet Balance (paid)</p>
                <h1 className="text-4xl sm:text-5xl font-bold text-white truncate">
                  {isLoading ? "—" : `₹${(summary?.walletBalance || 0).toFixed(2)}`}
                </h1>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-700/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-xl px-3 py-3 sm:px-4 border border-green-700/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <ArrowUpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                  <span className="text-green-300/60 text-xs truncate">Total Spent</span>
                </div>
                <p className="text-white font-bold text-lg sm:text-xl">
                  {isLoading ? "—" : `₹${(summary?.totalSpent || 0).toFixed(2)}`}
                </p>
                <p className="text-green-300/40 text-xs mt-0.5">
                  {summary?.payments?.length || 0} transaction{(summary?.payments?.length || 0) !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="bg-black/20 rounded-xl px-3 py-3 sm:px-4 border border-green-700/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <ArrowDownCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <span className="text-green-300/60 text-xs truncate">Total Refunded</span>
                </div>
                <p className="text-white font-bold text-lg sm:text-xl">
                  {isLoading ? "—" : `₹${(summary?.totalRefund || 0).toFixed(2)}`}
                </p>
                <p className="text-green-300/40 text-xs mt-0.5">
                  {summary?.refunds?.length || 0} refund{(summary?.refunds?.length || 0) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Transaction History ── */}
        <div className="bg-zinc-950 rounded-2xl p-4 sm:p-8 border border-zinc-900">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Payment History</h2>
              <p className="text-gray-500 text-sm">Recent transactions and refunds</p>
            </div>

            {/* Time filter — full width on mobile */}
            <div className="relative w-full sm:w-auto sm:flex-shrink-0">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 border border-zinc-800 transition-all sm:min-w-[170px]"
              >
                <span className="text-sm">
                  {timeFilters.find((f) => f.value === selectedFilter)?.label}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform flex-shrink-0 ${showFilterDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full mt-2 left-0 right-0 sm:right-0 sm:left-auto sm:w-48 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-20 shadow-xl">
                  {timeFilters.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => { setSelectedFilter(f.value); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${
                        selectedFilter === f.value
                          ? "bg-green-900/30 text-green-400"
                          : "text-white"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs — scrollable on tiny screens */}
          <div className="flex gap-1.5 mb-5 bg-zinc-900 p-1 rounded-xl w-fit max-w-full overflow-x-auto">
            {[
              { key: "all",      label: "All" },
              { key: "payments", label: "Payments" },
              { key: "refunds",  label: "Refunds" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active filter badge */}
          {selectedFilter !== "all" && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-500">Filtered by:</span>
              <span className="text-xs bg-green-900/30 text-green-600 border border-green-800/40 px-2.5 py-0.5 rounded-full">
                {timeFilters.find((f) => f.value === selectedFilter)?.label}
              </span>
              <button
                onClick={() => setSelectedFilter("all")}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          {/* Transaction list */}
          <div className="space-y-3 max-h-[480px] sm:max-h-[540px] overflow-y-auto pr-1 custom-scroll">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
              </div>
            ) : displayList.length === 0 ? (
              <div className="text-center py-14 text-gray-600">
                <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No transactions found</p>
                {selectedFilter !== "all" && (
                  <button
                    onClick={() => setSelectedFilter("all")}
                    className="mt-3 text-xs text-green-500 hover:text-green-400 transition-colors"
                  >
                    Show all transactions
                  </button>
                )}
              </div>
            ) : (
              displayList.map((txn) => (
                <div
                  key={txn._id}
                  className="bg-zinc-900 rounded-xl p-3 sm:p-4 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-3 sm:gap-4"
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      txn.type === "refund" ? "bg-green-900/40" : "bg-red-900/20"
                    }`}
                  >
                    {txn.type === "refund"
                      ? <ArrowDownCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      : <ArrowUpCircle  className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />}
                  </div>

                  {/* Info — truncates on small screens */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{txn.label}</p>
                    {txn.sub && (
                      <p className="text-gray-500 text-xs truncate">{txn.sub}</p>
                    )}
                    {txn.detail && (
                      <p className="text-gray-600 text-xs mt-0.5 truncate hidden sm:block">
                        {txn.detail}
                      </p>
                    )}
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                      <span className="text-gray-600 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        {formatDate(txn.displayDate)}
                      </span>
                      <span className="text-gray-600 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {formatTime(txn.displayDate)}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`font-bold text-base sm:text-lg ${
                        txn.type === "refund" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {txn.type === "refund" ? "+" : "-"}₹{txn.amount.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        txn.type === "refund"
                          ? "bg-green-900/40 text-green-400"
                          : "bg-red-900/20 text-red-400"
                      }`}
                    >
                      {txn.type === "refund" ? "Refund" : "Paid"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer count */}
          {!isLoading && displayList.length > 0 && (
            <p className="text-center text-gray-700 text-xs mt-4">
              {displayList.length} transaction{displayList.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}