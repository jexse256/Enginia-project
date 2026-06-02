import React, { useState, useEffect } from 'react';
import { Order, CartItem } from '../types';
import { ShieldCheck, ArrowLeft, Truck, Landmark, Wallet, CreditCard, Banknote, Sparkles, CheckCircle2, Navigation } from 'lucide-react';

interface CheckoutViewProps {
  items: CartItem[];
  subtotal: number;
  vat: number;
  discount: number;
  total: number;
  appliedCoupon: string;
  onBack: () => void;
  onCheckoutSuccess: (order: Order) => void;
  darkMode?: boolean;
}

export default function CheckoutView({
  items,
  subtotal,
  vat,
  discount,
  total,
  appliedCoupon,
  onBack,
  onCheckoutSuccess,
  darkMode = false
}: CheckoutViewProps) {
  // Customer info fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Tech City');
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'Mobile Money' | 'Credit/Debit Card' | 'Cash on Delivery' | 'Bank Transfer'>('Mobile Money');
  
  // Form submission / simulation status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<Order | null>(null);
  const [validationError, setValidationError] = useState('');

  // Map tracking coordinates for order delivery tracking
  const [truckPos, setTruckPos] = useState({ x: 10, y: 75 });
  const [deliveryFinished, setDeliveryFinished] = useState(false);

  // Auto-fill template button helper
  const handleQuickFill = () => {
    setName('Jethro Tenyi');
    setEmail('jethrotenyi@gmail.com');
    setPhone('+233 (55) 124-9583');
    setAddress('Avenue 12, Innovation Tech Hub');
    setCity('Accra');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setValidationError('Please complete all delivery profile forms.');
      return;
    }

    setIsSubmitting(true);

    // Simulate contacting API
    setTimeout(() => {
      const generatedOrder: Order = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000) + '-ENG',
        date: new Date().toISOString(),
        items: [...items],
        subtotal: subtotal,
        vat: vat,
        discount: discount,
        total: total,
        status: 'Processing',
        paymentMethod: paymentMethod,
        customerInfo: {
          name: name,
          email: email,
          phone: phone,
          address: address,
          city: city
        },
        trackingLogs: [
          { time: new Date().toLocaleTimeString(), status: 'Processing', description: 'Order checked out and paid via ' + paymentMethod },
          { time: new Date().toLocaleTimeString(), status: 'Processing', description: 'Under verification by billing experts' }
        ]
      };

      // Notify server about new order
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedOrder)
      })
      .then(res => res.json())
      .then(() => {
        setIsSubmitting(false);
        setOrderConfirmed(generatedOrder);
        onCheckoutSuccess(generatedOrder);
      })
      .catch(() => {
        // Fallback inside sandboxed environment
        setIsSubmitting(false);
        setOrderConfirmed(generatedOrder);
        onCheckoutSuccess(generatedOrder);
      });

    }, 1500);
  };

  // Animate delivery map truck pos
  useEffect(() => {
    if (!orderConfirmed) return;

    const timer = setInterval(() => {
      setTruckPos(prev => {
        if (prev.x >= 78) {
          clearInterval(timer);
          setDeliveryFinished(true);
          return { x: 78, y: 25 };
        }
        // Move truck towards center destination city Accra/Tech city
        return {
          x: prev.x + 3.5,
          y: prev.y - 2.5
        };
      });
    }, 400);

    return () => clearInterval(timer);
  }, [orderConfirmed]);

  if (orderConfirmed) {
    // ----------------- SUCCESS / GPS TRACKER SCREEN -----------------
    return (
      <div className={`flex flex-col h-full p-4 justify-between select-none animate-fade-in overflow-y-auto max-h-screen transition-all duration-300 ${
        darkMode ? 'bg-[#0E1524] text-slate-100' : 'bg-white text-slate-800'
      }`}>
        
        {/* Banner Success header */}
        <div className="text-center space-y-2 mt-4">
          <div className={`inline-flex p-3 rounded-full border ${
            darkMode ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-green-50 border-green-200 shadow-2xs'
          }`}>
            <CheckCircle2 className="w-10 h-10 animate-pulse" />
          </div>
          <h3 className={`font-semibold text-base ${darkMode ? 'text-slate-100' : 'text-blue-955 font-display'}`}>Payment Dispatched!</h3>
          <p className="text-xs text-slate-400">Order <span className={`font-mono font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{orderConfirmed.id}</span> generated.</p>
        </div>

        {/* GPS MAP SIMULATOR container */}
        <div className={`border rounded-3xl overflow-hidden p-4 space-y-3 shadow-inner my-4 shrink-0 transition ${
          darkMode ? 'bg-slate-900 border-slate-850' : 'bg-slate-50 border-slate-205 shadow-3xs'
        }`}>
          <div className="flex justify-between items-center text-xs">
            <span className={`font-bold flex items-center gap-1.5 ${darkMode ? 'text-slate-300' : 'text-blue-955 font-display'}`}>
              <Truck className="w-4.5 h-4.5 text-orange-500" />
              Enginia Dispatch GPS Live
            </span>
            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
              deliveryFinished 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-blue-50 text-blue-600 border border-blue-200 animate-pulse'
            }`}>
              {deliveryFinished ? 'Arrived at City' : 'On Route'}
            </span>
          </div>

          {/* Graphical vector representation map */}
          <div className={`h-32 rounded-2xl relative border overflow-hidden shadow-inner ${
            darkMode ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200/50'
          }`}>
            {/* Background elements */}
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,20 L 300,50 M 50,0 L 250,150 M 10,75 C 50,75 100,50 150,55 C 200,60 250,30 280,25" stroke={darkMode ? "#1E293B" : "#E2E8F0"} strokeWidth="4" fill="none" />
              <path d="M 10,75 C 50,75 100,50 150,55 C 200,60 250,30 280,25" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
              
              {/* Central city marker */}
              <circle cx="280" cy="25" r="5" fill="#f97316" />
              <circle cx="280" cy="25" r="10" fill="none" stroke="#f97316" strokeWidth="1" className="animate-ping" />
            </svg>

            {/* Hub markers */}
            <span className={`absolute top-16 left-2 text-[8px] uppercase font-mono font-bold p-0.5 rounded border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-blue-400' : 'bg-slate-100 border-slate-205 text-blue-700'
            }`}>Warehouse</span>
            <span className="absolute top-1.5 right-6 text-[8px] uppercase font-mono font-bold bg-orange-95/80 border border-orange-500/45 p-0.5 rounded text-orange-600 font-display">
              {orderConfirmed.customerInfo.city} Hub
            </span>

            {/* Dynamic moving truck icon wrapper */}
            <div 
              className="absolute shrink-0 "
              style={{ left: `${truckPos.x}%`, top: `${truckPos.y}%`, transform: 'translate(-50%, -50%)', transition: 'left 0.4s ease, top 0.4s ease' }}
            >
              <div className="bg-orange-500 text-white rounded-full p-1.5 shadow-[0_0_15px_#f97316] relative animate-bounce">
                <Navigation className="w-3.5 h-3.5 transform rotate-45" />
              </div>
            </div>
          </div>

          <p className={`text-[10px] leading-relaxed font-sans p-2.5 rounded-xl border ${
            darkMode ? 'bg-slate-950/60 border-slate-850 text-slate-400' : 'bg-white border-slate-100 text-slate-600'
          }`}>
            {deliveryFinished 
              ? `⚡ Courier has arrived safely at the central ${orderConfirmed.customerInfo.city} depot! Preparing local delivery dispatch logs.`
              : '⚡ Truck has bypassed Accra high-voltage terminal and is transferring wires & MCBs. Est: Same-day delivery.'
            }
          </p>
        </div>

        {/* Invoice Summary Details */}
        <div className={`rounded-2xl p-4.5 text-xs space-y-2 border ${
          darkMode ? 'bg-slate-900 border-slate-855' : 'bg-slate-50 border-slate-200 shadow-2xs'
        }`}>
          <div className="flex justify-between">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-500 font-semibold'}>Shipping Client:</span>
            <span className={`font-bold ${darkMode ? 'text-slate-250' : 'text-slate-800'}`}>{orderConfirmed.customerInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-500 font-semibold'}>Delivery Address:</span>
            <span className={`font-semibold truncate max-w-44 ${darkMode ? 'text-slate-250' : 'text-slate-805'}`}>{orderConfirmed.customerInfo.address}</span>
          </div>
          <div className="flex justify-between">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-550 font-semibold'}>Payment Channel:</span>
            <span className="font-extrabold text-blue-600">{orderConfirmed.paymentMethod}</span>
          </div>
          <div className={`flex justify-between pt-2.5 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200/60'}`}>
            <span className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Total Paid Amount:</span>
            <span className="font-extrabold text-orange-500 font-display text-sm">${orderConfirmed.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action controls */}
        <button
          id="checkout-confirm-continue"
          onClick={onBack}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 py-3.5 rounded-2xl text-white font-bold text-xs transition uppercase tracking-wide cursor-pointer shadow-md hover:scale-[1.01]"
        >
          Return to Marketplace
        </button>

      </div>
    );
  }

  // ----------------- FORM FILLER SCREEN -----------------
  return (
    <div className={`flex flex-col h-full select-none transition-all duration-300 ${
      darkMode ? 'bg-[#0E1524] text-slate-101' : 'bg-[#FAFCFF] text-slate-850'
    }`}>
      
      {/* Title bar */}
      <div className={`p-3 border-b flex items-center justify-between shrink-0 transition-all duration-305 ${
        darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200/60 bg-white'
      }`}>
        <button id="checkout-cancel-back" onClick={onBack} className={`p-1.5 rounded-lg transition cursor-pointer ${
          darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900 shadow-3xs'
        }`}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className={`font-semibold text-sm ${darkMode ? 'text-slate-100' : 'text-blue-950 font-display'}`}>Secure Dispatch Checkout</span>
        <div className="w-5" /> {/* balancing box */}
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Fill demo profiles */}
        <div className={`flex justify-between items-center p-4 border rounded-3xl transition ${
          darkMode ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50/50 border-blue-105 shadow-3xs'
        }`}>
          <div>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              First Time Checkout?
            </span>
            <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>Skip manual forms and click Quick-Fill.</p>
          </div>
          <button
            type="button"
            id="quick-fill-checkout-profile"
            onClick={handleQuickFill}
            className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-2xs"
          >
            Quick-Fill
          </button>
        </div>

        {/* Validation Notification banner */}
        {validationError && (
          <p className="text-xs font-bold bg-red-955 border border-red-900/40 p-2.5 rounded-xl text-red-500">{validationError}</p>
        )}

        {/* Inputs */}
        <div className="space-y-4 text-xs font-sans">
          <div>
            <label className={`block font-semibold mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Customer Full Name *</label>
            <input
              id="checkout-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jethro Tenyi"
              className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none transition-all border ${
                darkMode 
                  ? 'bg-slate-900 border-slate-800 focus:border-blue-500 text-slate-100 placeholder:text-slate-600'
                  : 'bg-slate-50 border-slate-205 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 shadow-3xs'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-semibold mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Email Address *</label>
              <input
                id="checkout-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jethro@gmail.com"
                className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none transition-all border ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-800 focus:border-blue-500 text-slate-100 placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-205 focus:border-blue-500 text-slate-805 placeholder:text-slate-400 shadow-3xs'
                }`}
              />
            </div>
            <div>
              <label className={`block font-semibold mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Phone Number *</label>
              <input
                id="checkout-phone-input"
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +233 55 124 9583"
                className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none transition-all border ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-800 focus:border-blue-500 text-slate-100 placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-205 focus:border-blue-500 text-slate-805 placeholder:text-slate-400 shadow-3xs'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className={`block font-semibold mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Delivery Address *</label>
              <input
                id="checkout-address-input"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Block C, Spintex"
                className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none transition-all border ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-800 focus:border-blue-500 text-slate-100 placeholder:text-slate-600'
                    : 'bg-slate-50 border-slate-205 focus:border-blue-500 text-slate-805 placeholder:text-slate-400 shadow-3xs'
                }`}
              />
            </div>
            <div>
              <label className={`block font-semibold mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>City Hub *</label>
              <input
                id="checkout-city-input"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full rounded-xl px-3 py-2.5 text-xs focus:outline-none transition-all border ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-800 focus:border-blue-500 text-slate-101'
                    : 'bg-slate-50 border-slate-205 focus:border-blue-500 text-slate-805 shadow-3xs'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Payment Channels Grid */}
        <div className="space-y-3">
          <label className={`block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-705'}`}>Select Payment Channel</label>
          <div className="grid grid-cols-2 gap-3">
            {/* Mobile Money */}
            <button
              type="button"
              id="payment-method-momo"
              onClick={() => setPaymentMethod('Mobile Money')}
              className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left transition duration-200 cursor-pointer ${
                paymentMethod === 'Mobile Money' 
                  ? (darkMode ? 'bg-orange-950/40 border-orange-500/80 text-white' : 'bg-orange-50 border-orange-500 text-slate-850 shadow-2xs') 
                  : (darkMode ? 'bg-[#0E1524] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')
              }`}
            >
              <Wallet className="w-5 h-5 text-orange-500 shrink-0" />
              <div className="text-xs font-sans">
                <span className="font-bold block text-[11px] tracking-tight">Mobile Money</span>
                <span className="text-[9px] text-slate-500 font-medium">M-Pesa, MTN Momo</span>
              </div>
            </button>

            {/* Cards */}
            <button
              type="button"
              id="payment-method-card"
              onClick={() => setPaymentMethod('Credit/Debit Card')}
              className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left transition duration-200 cursor-pointer ${
                paymentMethod === 'Credit/Debit Card' 
                  ? (darkMode ? 'bg-blue-950/40 border-blue-500/80 text-white' : 'bg-blue-55 border-blue-500 text-slate-850 shadow-2xs') 
                  : (darkMode ? 'bg-[#0E1524] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')
              }`}
            >
              <CreditCard className="w-5 h-5 text-blue-505 shrink-0" />
              <div className="text-xs font-sans">
                <span className="font-bold block text-[11px] tracking-tight">Credit/Debit Cards</span>
                <span className="text-[9px] text-slate-500 font-medium">Visa, Mastercard</span>
              </div>
            </button>

            {/* COD */}
            <button
              type="button"
              id="payment-method-cod"
              onClick={() => setPaymentMethod('Cash on Delivery')}
              className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left transition duration-200 cursor-pointer ${
                paymentMethod === 'Cash on Delivery' 
                  ? (darkMode ? 'bg-green-950/45 border-green-500/80 text-white' : 'bg-green-50 border-green-550 text-slate-855 shadow-2xs') 
                  : (darkMode ? 'bg-[#0E1524] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')
              }`}
            >
              <Banknote className="w-5 h-5 text-green-500 shrink-0" />
              <div className="text-xs font-sans">
                <span className="font-bold block text-[11px] tracking-tight">Cash on Delivery</span>
                <span className="text-[9px] text-slate-500 font-medium font-medium">COD, Local Pay</span>
              </div>
            </button>

            {/* Bank Transfer */}
            <button
              type="button"
              id="payment-method-bank"
              onClick={() => setPaymentMethod('Bank Transfer')}
              className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left transition duration-200 cursor-pointer ${
                paymentMethod === 'Bank Transfer' 
                  ? (darkMode ? 'bg-yellow-950/40 border-amber-500/80 text-white' : 'bg-amber-55 border-amber-500 text-slate-855 shadow-2xs') 
                  : (darkMode ? 'bg-[#0E1524] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')
              }`}
            >
              <Landmark className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs font-sans">
                <span className="font-bold block text-[11px] tracking-tight">Bank Transfer</span>
                <span className="text-[9px] text-slate-500 font-medium">Direct Wire Swift</span>
              </div>
            </button>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className={`p-4 rounded-3xl border text-xs space-y-1.5 transition ${
          darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-105 border-slate-200/80 shadow-3xs'
        }`}>
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>12% VAT Applied</span>
            <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-850'}`}>${vat.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-500 font-bold">
              <span>Applied savings</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <hr className={darkMode ? 'border-slate-800' : 'border-slate-200'} />
          <div className="flex justify-between text-sm font-bold pt-1">
            <span className={darkMode ? 'text-slate-100' : 'text-slate-900'}>Payable Total:</span>
            <span className="text-blue-600 font-display font-extrabold text-[#115EC9]">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Submission Button CTA */}
        <button
          id="checkout-submit-form"
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 py-3.5 rounded-2xl text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transform hover:scale-[1.01]"
        >
          {isSubmitting ? 'Securing Transaction Gateway...' : `Authorize Payment ($${total.toFixed(2)})`}
        </button>

      </form>
    </div>
  );
}
