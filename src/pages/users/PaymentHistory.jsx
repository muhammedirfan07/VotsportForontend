import React, { useState } from 'react';
import { Wallet, CreditCard, Battery, Clock, Calendar, X, Plus, ChevronDown } from 'lucide-react';

export default function EVPaymentPage() {
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const allPaymentHistory = [
    {
      id: 1,
      location: 'Tesla Supercharger - Downtown Plaza',
      date: '2024-12-01',
      time: '14:30',
      amount: 45.00,
      energy: '65 kWh',
      status: 'Completed'
    },
    
    {
      id: 4,
      location: 'Tesla Supercharger - Shopping Center',
      date: '2024-10-22',
      time: '12:00',
      amount: 38.00,
      energy: '55 kWh',
      status: 'Completed'
    },
   
   
  ];

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: '1week', label: 'Last 7 Days' },
    { value: '1month', label: 'Last Month' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' }
  ];

  const filterPaymentsByTime = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    switch (selectedFilter) {
      case 'all':
        return allPaymentHistory;
      
      case '1week':
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return allPaymentHistory.filter(payment => {
          const paymentDate = new Date(payment.date);
          return paymentDate >= oneWeekAgo;
        });
      
      case '1month':
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return allPaymentHistory.filter(payment => {
          const paymentDate = new Date(payment.date);
          return paymentDate >= oneMonthAgo;
        });
      
      case '6months':
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        return allPaymentHistory.filter(payment => {
          const paymentDate = new Date(payment.date);
          return paymentDate >= sixMonthsAgo;
        });
      
      case '2024':
        return allPaymentHistory.filter(payment => {
          const paymentDate = new Date(payment.date);
          return paymentDate.getFullYear() === 2024;
        });
      
      case '2023':
        return allPaymentHistory.filter(payment => {
          const paymentDate = new Date(payment.date);
          return paymentDate.getFullYear() === 2023;
        });
      
      default:
        return allPaymentHistory;
    }
  };

  const filteredPaymentHistory = filterPaymentsByTime();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ind', { month: 'short', day: 'numeric', year: 'numeric' });
  };


  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-black p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Wallet Balance */}
        <div className="bg-gradient-to-br from-green-800 to-green-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-700/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="w-full sm:w-auto">
                <p className="text-gray-300 text-xs sm:text-sm mb-2">Total Transition </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
                  ₹ 1239.50
                </h1>
                
              </div>
              <div className="hidden sm:flex w-14 h-14 sm:w-16 sm:h-16 bg-green-700/30 rounded-2xl items-center justify-center">
                <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" />
              </div>
            </div>
          </div>
        </div>
        {/* Payment History */}
        <div className="bg-zinc-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-900 ">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 sm:mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Payment History</h2>
              <p className="text-gray-500 text-sm">Recent transactions and invoices</p>
            </div>
            
            {/* Time Filter Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-3 rounded-xl flex items-center justify-between gap-3 border border-zinc-800 transition-all min-w-[200px]"
              >
                <span>{timeFilters.find(f => f.value === selectedFilter)?.label}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden  z-10 shadow-xl">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setSelectedFilter(filter.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-5 py-3 hover:bg-zinc-800 transition-colors ${
                        selectedFilter === filter.value ? 'bg-green-900/30 text-green-400' : 'text-white'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 max-h-[600px]  pr-2 overflow-y-auto custom-scroll">
            {filteredPaymentHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Battery className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No transactions found for this month</p>
              </div>
            ) : (
              filteredPaymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-800 hover:border-green-900 transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Battery className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-base sm:text-lg mb-2 break-words">
                          {payment.location}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(payment.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {payment.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">
                        ${payment.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">{payment.energy}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-zinc-800 gap-3">
                    <span className="text-xs bg-green-900/50 text-green-400 px-3 py-1 rounded-full font-medium">
                      {payment.status}
                    </span>
                   <div className=' flex gap-4'>
                      <button className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                        Re-booking
                      </button>
                       <button 
                    className="text-red-500 hover:text-red-400 font-semibold transition-colors text-sm sm:text-base self-end sm:self-auto"
                  >
                    Cancel
                  </button>
                    </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}

      {/* Add Card Modal */}
  
    </div>
  );
}