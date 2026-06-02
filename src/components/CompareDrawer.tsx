import React from 'react';
import { Product } from '../types';
import { X, ArrowRightLeft, Scale } from 'lucide-react';

interface CompareDrawerProps {
  products: Product[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  darkMode?: boolean;
}

export default function CompareDrawer({ 
  products, 
  onRemove, 
  onClose, 
  onAddToCart,
  darkMode = false
}: CompareDrawerProps) {
  if (products.length === 0) return null;

  // Compile all unique specification keys across both products
  const allSpecKeys = Array.from(
    new Set(products.flatMap(p => Object.keys(p.specifications)))
  );

  return (
    <div className={`absolute inset-x-0 bottom-0 top-16 z-50 rounded-t-3xl border-t flex flex-col overflow-hidden transition-all duration-300 ${
      darkMode ? 'bg-[#0E1524] border-slate-800 text-slate-101 shadow-2xl' : 'bg-[#FAFCFF] border-slate-200 text-slate-850 shadow-2xl'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between transition-all ${
        darkMode ? 'border-slate-800 bg-slate-950/90' : 'border-slate-150 bg-slate-50/90'
      }`}>
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-orange-500 animate-pulse" />
          <h3 className={`font-semibold text-sm ${darkMode ? 'text-slate-150' : 'text-blue-950 font-display'}`}>Compare Products</h3>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            darkMode ? 'bg-blue-950 text-blue-400 border border-blue-900/30' : 'bg-blue-600 text-white shadow-xs'
          }`}>
            {products.length}/2 Selected
          </span>
        </div>
        <button id="close-compare-drawer" onClick={onClose} className="p-1.5 hover:bg-slate-200/50 rounded-full transition cursor-pointer">
          <X className="w-5 h-5 text-slate-400 hover:text-slate-650" />
        </button>
      </div>

      {/* Content wrapper */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {products.length === 1 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3.5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center animate-pulse ${
              darkMode ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-500 border border-slate-200/50 shadow-3xs'
            }`}>
              <Scale className="w-6 h-6" />
            </div>
            <p className={`text-xs font-semibold max-w-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Select one more product from the catalog to compare specifications.
            </p>
          </div>
        ) : null}

        {/* Product Cards Row */}
        <div className="grid grid-cols-2 gap-3.5 animate-fade-in_delay">
          {products.map(product => (
            <div key={product.id} className={`rounded-2xl p-3 border flex flex-col justify-between relative transition duration-200 ${
              darkMode ? 'bg-[#0A0D14] border-slate-850' : 'bg-white border-slate-200 shadow-2xs'
            }`}>
              <button 
                id={`remove-compare-${product.id}`}
                onClick={() => onRemove(product.id)}
                className={`absolute top-2 right-2 p-1.5 rounded-full text-xs transition cursor-pointer ${
                  darkMode ? 'bg-slate-900/80 hover:bg-red-950 text-slate-300 hover:text-white' : 'bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-650 shadow-3xs'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  referrerPolicy="no-referrer"
                  className={`w-full h-24 object-cover rounded-xl mb-2.5 border ${
                    darkMode ? 'bg-slate-900 border-slate-850' : 'bg-slate-50 border-slate-100'
                  }`} 
                />
                <span className={`text-[9px] uppercase font-mono font-extrabold tracking-wider ${darkMode ? 'text-orange-400' : 'text-orange-650'}`}>
                  {product.category}
                </span>
                <h4 className={`text-xs font-bold line-clamp-2 mt-1 h-8 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {product.name}
                </h4>
                <div className={`text-xs font-black mt-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  ${product.price.toFixed(2)}
                  {product.originalPrice && (
                    <span className="text-[10px] text-slate-450 line-through ml-1">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <button
                id={`add-compare-cart-${product.id}`}
                onClick={() => onAddToCart(product)}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-xl shadow-xs transition cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* Specifications Comparison Table */}
        {products.length === 2 && (
          <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
            darkMode ? 'bg-slate-950/60 border-slate-850' : 'bg-white border-slate-205 shadow-2xs'
          }`}>
            <div className={`p-3 font-semibold text-xs uppercase tracking-wider font-display border-b ${
              darkMode ? 'bg-slate-900/60 text-slate-300 border-slate-850' : 'bg-slate-100/50 text-blue-950 border-slate-150'
            }`}>
              Technical Specifications Comparison
            </div>
            
            <div className={`divide-y text-xs ${darkMode ? 'divide-slate-850' : 'divide-slate-100'}`}>
              {/* Rating */}
              <div className="grid grid-cols-3 p-3 items-center">
                <span className={`font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Customer Rating</span>
                <span className="font-bold text-center text-amber-500">{products[0].rating} ★</span>
                <span className="font-bold text-center text-amber-500">{products[1].rating} ★</span>
              </div>
              {/* Stock */}
              <div className="grid grid-cols-3 p-3 items-center">
                <span className={`font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Stock Availability</span>
                <span className={`text-center font-extrabold ${products[0].stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {products[0].stock > 0 ? `${products[0].stock} units` : 'Out of Stock'}
                </span>
                <span className={`text-center font-extrabold ${products[1].stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {products[1].stock > 0 ? `${products[1].stock} units` : 'Out of Stock'}
                </span>
              </div>

              {/* Dynamic specs rows */}
              {allSpecKeys.map(key => (
                <div key={key} className="grid grid-cols-3 p-3 items-center">
                  <span className={`font-mono font-medium text-[10px] capitalize ${darkMode ? 'text-slate-400' : 'text-slate-550'}`}>{key}</span>
                  <span className={`text-center break-words px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                    darkMode ? 'text-slate-200 bg-[#0E1524] border border-slate-850' : 'text-slate-800 bg-slate-50 border border-slate-100'
                  }`}>
                    {products[0].specifications[key] || 'N/A'}
                  </span>
                  <span className={`text-center break-words px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                    darkMode ? 'text-slate-200 bg-[#0E1524] border border-slate-850' : 'text-slate-800 bg-slate-50 border border-slate-100'
                  }`}>
                    {products[1].specifications[key] || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
