import React, { useState } from 'react';
import { Wallet, CreditCard, Battery, Clock, Calendar, X, Plus, ChevronDown } from 'lucide-react';

export default function EVPaymentPage() {
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(125.50);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8888',
      expiry: '08/26',
      isDefault: false
    }
  ]);

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

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
      id: 2,
      location: 'ChargePoint Station - Mall Parking',
      date: '2024-11-28',
      time: '09:15',
      amount: 32.50,
      energy: '48 kWh',
      status: 'Completed'
    },
    {
      id: 3,
      location: 'EVgo Fast Charger - Highway Rest Stop',
      date: '2024-11-15',
      time: '18:45',
      amount: 28.75,
      energy: '42 kWh',
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
    {
      id: 5,
      location: 'Electrify America - City Center',
      date: '2024-09-18',
      time: '16:20',
      amount: 41.25,
      energy: '60 kWh',
      status: 'Completed'
    },
    {
      id: 6,
      location: 'ChargePoint - Airport Terminal',
      date: '2024-07-10',
      time: '08:00',
      amount: 35.00,
      energy: '52 kWh',
      status: 'Completed'
    },
    {
      id: 7,
      location: 'Tesla Supercharger - Beach Road',
      date: '2024-06-05',
      time: '15:30',
      amount: 42.00,
      energy: '58 kWh',
      status: 'Completed'
    },
    {
      id: 8,
      location: 'EVgo - Mountain View Station',
      date: '2023-12-20',
      time: '11:00',
      amount: 30.00,
      energy: '45 kWh',
      status: 'Completed'
    }
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleAddFunds = () => {
    const amount = parseFloat(fundAmount);
    if (amount && amount > 0) {
      setWalletBalance(walletBalance + amount);
      setFundAmount('');
      setShowAddFundsModal(false);
    }
  };

  const handleAddCard = () => {
    if (newCard.cardNumber && newCard.cardName && newCard.expiry && newCard.cvv) {
      const cardType = newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
      const last4 = newCard.cardNumber.slice(-4);
      
      setCards([...cards, {
        id: cards.length + 1,
        type: cardType,
        last4: last4,
        expiry: newCard.expiry,
        isDefault: false
      }]);

      setNewCard({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
      setShowAddCardModal(false);
    }
  };

  const handleRemoveCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
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
                <p className="text-gray-300 text-xs sm:text-sm mb-2">Wallet Balance</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
                  ${walletBalance.toFixed(2)}
                </h1>
                <button 
                  onClick={() => setShowAddFundsModal(true)}
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-black font-bold px-6 sm:px-8 py-3 rounded-xl transition-all transform hover:scale-105"
                >
                  Add Funds
                </button>
              </div>
              <div className="hidden sm:flex w-14 h-14 sm:w-16 sm:h-16 bg-green-700/30 rounded-2xl items-center justify-center">
                <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-zinc-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-900">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 sm:mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Payment Methods</h2>
              <p className="text-gray-500 text-sm">Manage your saved payment cards</p>
            </div>
            <button 
              onClick={() => setShowAddCardModal(true)}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-black font-bold px-5 sm:px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add Card
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
            {cards.map((card) => (
              <div key={card.id} className="bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border border-zinc-800 hover:border-green-900 transition-all">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                      <span className="text-white font-semibold text-base sm:text-lg">{card.type}</span>
                      {card.isDefault && (
                        <span className="bg-green-900/50 text-green-400 text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm truncate">•••• •••• •••• {card.last4} • Expires {card.expiry}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveCard(card.id)}
                  className="text-red-500 hover:text-red-400 font-semibold transition-colors text-sm sm:text-base self-end sm:self-auto"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-zinc-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-zinc-900">
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
                <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-10 shadow-xl">
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

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
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
                    <button className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                      View Receipt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setShowAddFundsModal(false)}>
          <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-zinc-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add Funds</h3>
              <button onClick={() => setShowAddFundsModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl">$</span>
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-800 text-white pl-10 pr-4 py-3 rounded-xl border border-zinc-700 focus:border-green-500 focus:outline-none text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[25, 50, 100].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setFundAmount(amount.toString())}
                    className="bg-zinc-800 hover:bg-green-900/30 text-white py-3 rounded-xl border border-zinc-700 hover:border-green-500 transition-all"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAddFunds}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-all transform hover:scale-105"
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setShowAddCardModal(false)}>
          <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-zinc-800 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Card</h3>
              <button onClick={() => setShowAddCardModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Card Number</label>
                <input
                  type="text"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({...newCard, cardNumber: formatCardNumber(e.target.value)})}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={newCard.cardName}
                  onChange={(e) => setNewCard({...newCard, cardName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700 focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({...newCard, expiry: formatExpiry(e.target.value)})}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700 focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">CVV</label>
                  <input
                    type="text"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({...newCard, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                    placeholder="123"
                    maxLength="3"
                    className="w-full bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700 focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAddCard}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-all transform hover:scale-105"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}