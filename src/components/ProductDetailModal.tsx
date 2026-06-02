import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShieldAlert, ShoppingBag, Heart, ArrowRightLeft, Share2, ClipboardCheck } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onAddToWishlist: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  isInWishlist: boolean;
  isInCompare: boolean;
  darkMode?: boolean;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare,
  isInWishlist,
  isInCompare,
  darkMode = false
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    // Copy a dummy shareable link to current clipboard
    const shareText = `Check out Enginia Electronics "${product.name}" for $${product.price}! Powering Your Electrical Solutions.`;
    navigator.clipboard.writeText(shareText);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-40 flex flex-col justify-end">
      {/* Detail panel */}
      <div className={`border-t rounded-t-3xl h-[88%] flex flex-col justify-between overflow-hidden animate-slide-up shadow-2xl relative transition-all duration-300 ${
        darkMode ? 'bg-[#0E1524] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-850'
      }`}>
        
        {/* Header Close Trigger */}
        <button 
          id="close-product-detail"
          onClick={onClose} 
          className={`absolute top-4 right-4 z-50 p-2 rounded-full transition border ${
            darkMode 
              ? 'bg-slate-950/75 hover:bg-slate-800 border-slate-800 text-slate-300' 
              : 'bg-slate-100/90 hover:bg-slate-200 border-slate-200 text-slate-600'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className={`relative h-48 sm:h-56 shrink-0 flex items-center justify-center border-b ${darkMode ? 'bg-slate-950 border-slate-900' : 'bg-slate-50 border-slate-100'}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90" 
          />
          <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${darkMode ? 'from-[#0E1524]' : 'from-white'}`} />
          
          {/* Status badge & categories */}
          <div className="absolute bottom-3 left-4 flex gap-1.5 flex-wrap">
            {product.bestSeller && (
              <span className="text-[9px] font-mono tracking-widest uppercase bg-orange-500 text-white font-bold px-2.5 py-1 rounded-md shadow-2xs">
                Best Seller
              </span>
            )}
            {product.newArrival && (
              <span className="text-[9px] font-mono tracking-widest uppercase bg-blue-600 text-white font-bold px-2.5 py-1 rounded-md shadow-2xs">
                New Arrival
              </span>
            )}
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${
              darkMode ? 'bg-slate-900/95 text-slate-300 border-slate-800' : 'bg-white/95 text-blue-950 border-slate-200'
            }`}>
              {product.category}
            </span>
          </div>
        </div>

        {/* Info detail content body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className={`font-semibold text-base leading-snug tracking-tight ${darkMode ? 'text-slate-100' : 'text-blue-950 font-display'}`}>
              {product.name}
            </h2>
            
            {/* Quick rating & pricing row */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className={`text-xs font-bold ml-1 ${darkMode ? 'text-slate-200' : 'text-slate-850'}`}>{product.rating}</span>
                </div>
                <span className="text-[10px] text-slate-500">({product.reviews.length} Verified Reviews)</span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-605'}`}>${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>

          <hr className={darkMode ? 'border-slate-805' : 'border-slate-150'} />

          {/* Sub-tabs selectors */}
          <div className={`flex p-1 rounded-xl border text-xs text-slate-450 ${
            darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100/80 border-slate-155'
          }`}>
            <button
              id="tab-detail-overview"
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
                activeTab === 'details' 
                  ? (darkMode ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-blue-950 shadow-xs') 
                  : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
              }`}
            >
              Overview
            </button>
            <button
              id="tab-detail-specs"
              onClick={() => setActiveTab('specs')}
              className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
                activeTab === 'specs' 
                  ? (darkMode ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-blue-955 shadow-xs') 
                  : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
              }`}
            >
              Specs
            </button>
            <button
              id="tab-detail-reviews"
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
                activeTab === 'reviews' 
                  ? (darkMode ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-blue-955 shadow-xs') 
                  : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
              }`}
            >
              Reviews ({product.reviews.length})
            </button>
          </div>

          {/* Tab contents */}
          <div className="min-h-24">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <p className={`text-xs leading-relaxed font-sans ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{product.description}</p>
                
                {/* Stock alert panel */}
                <div className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-xs ${
                  darkMode ? 'bg-slate-950/65 border-slate-850' : 'bg-slate-50 border-slate-150 shadow-3xs'
                }`}>
                  <ShieldAlert className={`w-4.5 h-4.5 shrink-0 ${product.stock > 10 ? 'text-blue-500' : 'text-orange-500'}`} />
                  <div className="flex-1">
                    <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Temporarily Out of Stock'}
                    </span>
                    <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-450'}`}>Dispatched within 24 hours. ISO safety certified quality.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className={`rounded-2xl overflow-hidden border divide-y text-xs ${
                darkMode ? 'bg-slate-950/80 border-slate-850 divide-slate-850' : 'bg-white border-slate-200 divide-slate-100 shadow-3xs'
              }`}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-5 p-3">
                    <span className={`col-span-2 font-mono font-bold text-[10px] capitalize ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{key}</span>
                    <span className={`col-span-3 font-sans font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3.5">
                {product.reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No client reviews registered for this item yet. Be the first to try!</p>
                ) : (
                  product.reviews.map(review => (
                    <div key={review.id} className={`p-4 rounded-2xl border space-y-1.5 text-xs ${
                      darkMode ? 'bg-slate-950/70 border-slate-850' : 'bg-slate-50 border-[#E5E9F0] shadow-3xs'
                    }`}>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-blue-950'}`}>{review.userName}</span>
                        <span className="text-[10px] text-slate-500">{review.date}</span>
                      </div>
                      <div className="flex items-center text-amber-500 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : (darkMode ? 'text-slate-800' : 'text-slate-200')}`} 
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-sans ${darkMode ? 'text-slate-400' : 'text-slate-655'}`}>{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lower Controls Strip */}
        <div className={`p-4 border-t space-y-4 shrink-0 transition-all ${
          darkMode ? 'bg-slate-950 border-slate-855' : 'bg-[#FAFCFF] border-slate-200 shadow-2xs'
        }`}>
          
          {/* Action Tools: Wishlist, Compare, Share */}
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            {/* Wishlist */}
            <button
              id="toggle-detail-wishlist"
              onClick={() => onAddToWishlist(product)}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-semibold transition cursor-pointer ${
                isInWishlist 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                  : (darkMode ? 'bg-[#0E1524] text-slate-350 border border-slate-800 hover:text-white' : 'bg-white border border-slate-200 text-slate-600 shadow-3xs')
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
              Wishlist
            </button>

            {/* Compare Drawer addition */}
            <button
              id="toggle-detail-compare"
              onClick={() => onAddToCompare(product)}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-semibold transition cursor-pointer ${
                isInCompare 
                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                  : (darkMode ? 'bg-[#0E1524] text-slate-350 border border-slate-800 hover:text-white' : 'bg-white border border-slate-200 text-slate-600 shadow-3xs')
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              Compare
            </button>

            {/* Share link generator */}
            <button
              id="share-detail-product"
              onClick={handleShare}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-semibold transition cursor-pointer ${
                shared 
                  ? 'bg-green-500/10 text-green-550 border border-green-500/20' 
                  : (darkMode ? 'bg-[#0E1524] text-slate-355 border border-slate-800 hover:text-white' : 'bg-white border border-slate-200 text-slate-600 shadow-3xs')
              }`}
            >
              {shared ? <ClipboardCheck className="w-4 h-4 text-green-550 scroll-py-1" /> : <Share2 className="w-4 h-4" />}
              {shared ? 'Copied' : 'Share'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 select-none">
            {/* Quantity Selector */}
            <div className={`flex items-center rounded-2xl border py-1.5 px-3 shrink-0 ${
              darkMode ? 'bg-[#0E1524] border-slate-800' : 'bg-white border-slate-200 shadow-3xs'
            }`}>
              <button 
                id="dec-detail-qty"
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="text-slate-400 hover:text-blue-500 font-extrabold px-2 transition cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold w-6 text-center">{quantity}</span>
              <button 
                id="inc-detail-qty"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
                className="text-slate-400 hover:text-blue-500 font-extrabold px-2 transition cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              id="add-detail-to-cart"
              onClick={() => onAddToCart(product, quantity)}
              disabled={product.stock <= 0}
              className="flex-1 bg-blue-605 hover:bg-blue-500 disabled:bg-slate-100 disabled:text-slate-405 py-3.5 rounded-2xl text-xs font-bold text-white transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer hover:scale-[1.01]"
            >
              <ShoppingBag className="w-4 h-4" />
              {product.stock > 0 ? 'Add to Shipping Cart' : 'Out of Stock'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
