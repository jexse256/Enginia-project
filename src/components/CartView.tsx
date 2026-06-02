import React, { useState } from 'react';
import { CartItem } from '../types';
import { Trash2, ShieldCheck, Ticket, PackageOpen, ArrowRight, Heart, BookmarkCheck } from 'lucide-react';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onToggleSaveForLater: (productId: string) => void;
  onCheckoutTrigger: (subtotal: number, vat: number, discount: number, total: number, discountCode: string) => void;
  darkMode?: boolean;
}

export default function CartView({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onToggleSaveForLater,
  onCheckoutTrigger,
  darkMode = false
}: CartViewProps) {
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const activeItems = cartItems.filter(item => !item.savedForLater);
  const savedItems = cartItems.filter(item => item.savedForLater);

  // Subtotal calculations
  const subtotal = activeItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const vatPercent = 0.12; // 12% standard VAT
  const vatAmount = subtotal * vatPercent;
  
  const discountAmount = appliedDiscount 
    ? (subtotal * (appliedDiscount.percent / 100)) 
    : 0;
  
  const finalTotal = Math.max(0, subtotal + vatAmount - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = coupon.trim().toUpperCase();
    if (code === 'ENGINIA10') {
      setAppliedDiscount({ code: 'ENGINIA10', percent: 10 });
    } else if (code === 'POWERUP20') {
      setAppliedDiscount({ code: 'POWERUP20', percent: 20 });
    } else if (code) {
      setCouponError('Invalid Enginia voucher coupon code');
    }
  };

  return (
    <div className={`flex flex-col h-full select-none transition-all duration-300 ${
      darkMode ? 'bg-[#0E1524] text-slate-100' : 'bg-[#FAFCFF] text-slate-800'
    }`}>
      
      {/* Title block */}
      <div className={`p-4 border-b flex justify-between items-center transition-all ${
        darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200/60 bg-white'
      }`}>
        <h3 className={`font-semibold text-sm tracking-tight ${darkMode ? 'text-slate-100' : 'text-blue-950 font-display'}`}>
          Your Shipping Basket
        </h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          darkMode 
            ? 'bg-blue-900/30 text-blue-300 border-blue-800/40' 
            : 'bg-blue-50 text-blue-600 border-blue-200/80 shadow-2xs'
        }`}>
          {activeItems.length} active items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Active Cart List */}
        {activeItems.length === 0 ? (
          <div className={`flex flex-col items-center justify-center p-10 text-center space-y-3.5 rounded-3xl border ${
            darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200/80 shadow-3xs'
          }`}>
            <div className={`p-3 rounded-full border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}>
              <PackageOpen className="w-8 h-8" />
            </div>
            <div>
              <p className={`text-xs font-semibold ${darkMode ? 'text-slate-350' : 'text-slate-700'}`}>Your basket is empty</p>
              <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Browse the catalog to add electronic components, wiring switches or inverters!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activeItems.map(item => (
              <div key={item.product.id} className={`p-3 rounded-2xl border flex gap-3.5 h-30 relative transition-all duration-200 ${
                darkMode 
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200' 
                  : 'bg-white border-slate-200/60 hover:border-slate-300 text-slate-800 shadow-2xs'
              }`}>
                
                {/* Trash Deletion */}
                <button
                  id={`remove-cart-${item.product.id}`}
                  onClick={() => onRemoveItem(item.product.id)}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg transition-all ${
                    darkMode ? 'text-slate-500 hover:text-red-400 hover:bg-slate-950' : 'text-slate-450 hover:text-red-650 hover:bg-slate-50 shadow-3xs'
                  }`}
                  title="Remove Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  referrerPolicy="no-referrer"
                  className={`w-18 h-18 object-cover rounded-xl shrink-0 self-center border ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-3xs'
                  }`} 
                />

                <div className="flex-1 flex flex-col justify-between py-1 pr-6">
                  <div>
                    <h4 className={`text-[11px] font-bold line-clamp-1 ${darkMode ? 'text-slate-200' : 'text-blue-950'}`}>
                      {item.product.name}
                    </h4>
                    <p className={`text-[9px] font-semibold mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-450'}`}>{item.product.category}</p>
                    <div className={`text-[11px] font-extrabold mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      ${item.product.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Qty count */}
                    <div className={`flex items-center rounded-lg border py-0.5 px-2 ${
                      darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-3xs'
                    }`}>
                      <button
                        id={`dec-qty-${item.product.id}`}
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className={`font-extrabold px-1.5 text-xs transition cursor-pointer ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-blue-950'}`}
                      >
                        -
                      </button>
                      <span className={`text-xs font-mono font-bold px-2.5 ${darkMode ? 'text-slate-100' : 'text-slate-850'}`}>{item.quantity}</span>
                      <button
                        id={`inc-qty-${item.product.id}`}
                        onClick={() => onUpdateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                        className={`font-extrabold px-1.5 text-xs transition cursor-pointer ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-blue-950'}`}
                      >
                        +
                      </button>
                    </div>

                    {/* Move to save for later */}
                    <button
                      id={`save-later-${item.product.id}`}
                      onClick={() => onToggleSaveForLater(item.product.id)}
                      className={`text-[10px] font-semibold hover:underline flex items-center gap-1 cursor-pointer transition ${
                        darkMode ? 'text-slate-400 hover:text-orange-400' : 'text-slate-500 hover:text-orange-605'
                      }`}
                    >
                      <Heart className="w-3 h-3 text-red-500/60" />
                      Save for later
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Saved for Later List */}
        {savedItems.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className={`flex items-center gap-1.5 text-xs font-bold border-b pb-2 ${
              darkMode ? 'text-orange-400 border-slate-800' : 'text-orange-605 border-slate-200'
            }`}>
              <BookmarkCheck className="w-4 h-4 text-orange-500" />
              <span>Saved for Later ({savedItems.length})</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {savedItems.map(item => (
                <div key={item.product.id} className={`border rounded-2xl p-3 flex flex-col justify-between transition duration-200 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs animate-fade-in'
                }`}>
                  <div>
                    <h5 className={`text-[10px] font-bold line-clamp-1 ${darkMode ? 'text-slate-200' : 'text-blue-950'}`}>{item.product.name}</h5>
                    <div className={`text-[11px] font-extrabold mt-15 ${darkMode ? 'text-slate-400' : 'text-blue-600'}`}>${item.product.price.toFixed(2)}</div>
                  </div>
                  <div className={`flex justify-between items-center mt-2.5 pt-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <button
                      id={`delete-saved-${item.product.id}`}
                      onClick={() => onRemoveItem(item.product.id)}
                      className={`p-1.5 rounded-lg transition ${
                        darkMode ? 'hover:bg-slate-950 text-slate-400 hover:text-red-400' : 'hover:bg-slate-50 text-slate-500 hover:text-red-650'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`move-active-cart-${item.product.id}`}
                      onClick={() => onToggleSaveForLater(item.product.id)}
                      className="text-[9px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer shadow-xs"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voucher section */}
        {activeItems.length > 0 && (
          <div className={`p-4 rounded-3xl border space-y-3 transition duration-300 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Ticket className="w-4 h-4 text-orange-400" />
                <span className={darkMode ? 'text-slate-300' : 'text-blue-950 font-semibold'}>Enginia Coupon Code</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">ENGINIA10, POWERUP20</span>
            </div>

            <div className="flex gap-2">
              <input
                id="coupon-input"
                type="text"
                placeholder="PROMO CODE"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className={`flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none transition-all border ${
                  darkMode 
                    ? 'bg-slate-950 border-slate-850 focus:border-blue-500 text-slate-100 placeholder:text-slate-600' 
                    : 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-850 placeholder:text-slate-400 shadow-3xs'
                } uppercase font-mono`}
              />
              <button
                id="apply-coupon-btn"
                onClick={handleApplyCoupon}
                className={`font-semibold text-xs px-4 py-2 rounded-xl transition shrink-0 cursor-pointer ${
                  darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                }`}
              >
                Apply
              </button>
            </div>

            {couponError && <p className="text-[10px] text-red-500 font-bold">{couponError}</p>}
            {appliedDiscount && (
              <p className="text-[10px] text-green-500 font-bold">
                ✓ Coupon "{appliedDiscount.code}" Applied: {appliedDiscount.percent}% OFF Subtotal!
              </p>
            )}
          </div>
        )}

      </div>

      {/* Calculations & Order triggers */}
      {activeItems.length > 0 && (
        <div className={`p-4 border-t space-y-4 shrink-0 transition duration-350 ${
          darkMode ? 'bg-slate-900 border-slate-850' : 'bg-slate-50 border-slate-200/80 shadow-2xs'
        }`}>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Items Total (Subtotal)</span>
              <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-850'}`}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>VAT / Sales Tax (12%)</span>
              <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-850'}`}>${vatAmount.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-500 font-bold">
                <span>Voucher Savings ({appliedDiscount?.percent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <hr className={darkMode ? 'border-slate-805' : 'border-slate-200'} />
            <div className="flex justify-between text-sm font-bold">
              <span className={darkMode ? 'text-slate-100' : 'text-slate-900'}>Grand Total</span>
              <span className="text-blue-500 font-display text-base font-extrabold">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            id="proceed-to-checkout"
            onClick={() => onCheckoutTrigger(subtotal, vatAmount, discountAmount, finalTotal, appliedDiscount?.code || '')}
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-2xl text-xs font-semibold text-white transition duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg cursor-pointer transform hover:scale-[1.01]"
          >
            Proceed to Secure Checkout
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <p className={`text-[9.5px] font-sans text-center flex items-center justify-center gap-1 select-none font-semibold ${
            darkMode ? 'text-slate-500' : 'text-slate-450'
          }`}>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            Secured checkout backed by continuous SSL certificates.
          </p>
        </div>
      )}

    </div>
  );
}
