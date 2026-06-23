import React, { useEffect, useState } from "react";
import { Wallet, Battery, Clock, Calendar, ChevronDown, Loader2, ArrowDownCircle, ArrowUpCircle, TrendingUp } from "lucide-react";
import { getWalletSummaryAPI } from "../../../Server/allAPI";

export default function EVPaymentPage() {
  const [summary, setSummary]                     = useState(null);
  const [isLoading, setIsLoading]                 = useState(true);
  const [activeTab, setActiveTab]                 = useState("all");       // all | payments | refunds
  const [selectedFilter, setSelectedFilter]       = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const timeFilters = [
    { value: "all",     label: "All Time" },
    { value: "1week",   label: "Last 7 Days" },
    { value: "1month",  label: "Last Month" },
    { value: "6months", label: "Last 6 Months" },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    getWalletSummaryAPI({ Authorization: `Bearer ${token}` })
      .then((res) => { if (res?.data) setSummary(res.data); 
         // Display all data
        console.log("Wallet Summary:", res.data);

        // Display payments only
        console.log("Payments:", res.data.payments);

        // Display refunds only
        console.log("Refunds:", res.data.refunds);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Merge payments + refunds into one timeline
  const allTransactions = () => {
    if (!summary) return [];
    const payments = (summary.payments || []).map((p) => ({
      _id:       p._id,
      type:      "payment",
      date:      p.paymentDate || p.createdAt,
      amount:    p.amount,
      label:     p.stationId?.stationName || "EV Station",
      sub:       p.stationId?.city ? `${p.stationId.city}` : "",
      detail:    p.bookingId ? `Booking #${p.bookingId.bookingId} · Slot ${p.bookingId.slotNumber} · ${p.bookingId.duration}h` : "",
      txnId:     p.transactionId,
    }));

    const refunds = (summary.refunds || []).map((r) => ({
      _id:    r._id,
      type:   "refund",
      date:   r.createdAt,
      amount: r.amount,
      label:  r.reason || "Refund",
      sub:    r.bookingId ? `Booking #${r.bookingId.bookingId}` : "",
      detail: "",
      txnId:  null,
    }));

    return [...payments, ...refunds].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filterByTime = (list) => {
    const now = new Date();
    switch (selectedFilter) {
      case "1week":   { const d = new Date(now); d.setDate(d.getDate() - 7);   return list.filter(t => new Date(t.date) >= d); }
      case "1month":  { const d = new Date(now); d.setMonth(d.getMonth() - 1); return list.filter(t => new Date(t.date) >= d); }
      case "6months": { const d = new Date(now); d.setMonth(d.getMonth() - 6); return list.filter(t => new Date(t.date) >= d); }
      default: return list;
    }
  };

  const getDisplayList = () => {
    const all = allTransactions();
    const byTab =
      activeTab === "payments" ? all.filter(t => t.type === "payment") :
      activeTab === "refunds"  ? all.filter(t => t.type === "refund")  : all;
    return filterByTime(byTab);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  const displayList = getDisplayList();

  return (
    <div className="min-h-screen bg-black p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">

        {/* ── Wallet Summary Card ── */}
        <div className="bg-gradient-to-br from-green-900 to-green-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden border border-green-800/30">
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-700/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-green-300/70 text-sm mb-1">Wallet Balance (Refunds)</p>
                <h1 className="text-5xl sm:text-6xl font-bold text-white">
                  {isLoading ? "—" : `₹${(summary?.walletBalance || 0).toFixed(2)}`}
                </h1>
              </div>
              <div className="w-14 h-14 bg-green-700/30 rounded-2xl flex items-center justify-center">
                <Wallet className="w-7 h-7 text-green-400" />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-xl px-4 py-3 border border-green-700/20">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowUpCircle className="w-4 h-4 text-red-400" />
                  <span className="text-green-300/60 text-xs">Total Spent</span>
                </div>
                <p className="text-white font-bold text-xl">
                  {isLoading ? "—" : `₹${(summary?.totalSpent || 0).toFixed(2)}`}
                </p>
                <p className="text-green-300/40 text-xs mt-0.5">
                  {summary?.payments?.length || 0} transaction
                </p>
              </div>
              <div className="bg-black/20 rounded-xl px-4 py-3 border border-green-700/20">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowDownCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-300/60 text-xs">Total Refunded</span>
                </div>
                <p className="text-white font-bold text-xl">
                  {isLoading ? "—" : `₹${(summary?.totalRefund || 0).toFixed(2)}`}
                </p>
                <p className="text-green-300/40 text-xs mt-0.5">
                  {summary?.refunds?.length || 0} refunds
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Transaction History ── */}
        <div className="bg-zinc-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-900">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <h2 className="text-2xl font-bold text-white">Transaction History</h2>

            {/* Time filter */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 border border-zinc-800 transition-all min-w-[170px]"
              >
                <span className="text-sm">{timeFilters.find(f => f.value === selectedFilter)?.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-10 shadow-xl">
                  {timeFilters.map(f => (
                    <button key={f.value}
                      onClick={() => { setSelectedFilter(f.value); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${selectedFilter === f.value ? "bg-green-900/30 text-green-400" : "text-white"}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5 bg-zinc-900 p-1 rounded-xl w-fit">
            {[
              { key: "all",      label: "All" },
              { key: "payments", label: "Payments" },
              { key: "refunds",  label: "Refunds" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 custom-scroll">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
              </div>
            ) : displayList.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No transactions found</p>
              </div>
            ) : (
              displayList.map((txn) => (
                <div key={txn._id}
                  className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-4">

                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    txn.type === "refund"
                      ? "bg-green-900/40"
                      : "bg-red-900/20"
                  }`}>
                    {txn.type === "refund"
                      ? <ArrowDownCircle className="w-5 h-5 text-green-400" />
                      : <ArrowUpCircle   className="w-5 h-5 text-red-400" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{txn.label}</p>
                    {txn.sub    && <p className="text-gray-500 text-xs">{txn.sub}</p>}
                    {txn.detail && <p className="text-gray-600 text-xs mt-0.5">{txn.detail}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-600 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{formatDate(txn.date)}
                      </span>
                      <span className="text-gray-600 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />{formatTime(txn.date)}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-lg ${txn.type === "refund" ? "text-green-400" : "text-red-400"}`}>
                      {txn.type === "refund" ? "+" : "-"}₹{txn.amount.toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      txn.type === "refund"
                        ? "bg-green-900/40 text-green-400"
                        : "bg-red-900/20 text-red-400"
                    }`}>
                      {txn.type === "refund" ? "Refund" : "Paid"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}