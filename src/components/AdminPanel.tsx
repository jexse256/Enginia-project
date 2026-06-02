import React, { useState } from 'react';
import { Product, Order, Category } from '../types';
import { BarChart3, Package, Layers, Users, PlusCircle, Trash2, Edit3, ArrowRight, ShieldCheck, DollarSign, Store, Activity, CheckSquare } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (prod: any) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (id: string, amount: number) => void;
  onUpdateOrderStatus: (id: string, status: string, description: string) => void;
  darkMode?: boolean;
}

export default function AdminPanel({
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onUpdateStock,
  onUpdateOrderStatus,
  darkMode = false
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics');
  
  // Forms for adding products
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electrical Wires & Cables');
  const [newProdPrice, setNewProdPrice] = useState('29.99');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSpecKey, setNewProdSpecKey] = useState('Voltage');
  const [newProdSpecValue, setNewProdSpecValue] = useState('240V AC');
  
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice || !newProdStock) return;

    const base64DefaultImage = 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&auto=format&fit=crop&q=60';
    const parsedPrice = parseFloat(newProdPrice) || 19.99;
    const parsedStock = parseInt(newProdStock) || 10;

    const createdProd = {
      name: newProdName,
      category: newProdCategory,
      price: parsedPrice,
      stock: parsedStock,
      image: base64DefaultImage,
      description: newProdDesc || 'High quality Enginia certified accessory backing standard safety configurations.',
      specifications: {
        [newProdSpecKey || 'Purity']: newProdSpecValue || '99.9% oxygen-free standard',
        'Compliance': 'BS ISO Standards'
      },
      rating: 4.5,
      reviews: []
    };

    onAddProduct(createdProd);
    setSuccessMsg('Product added successfully!');
    
    // reset form fields
    setNewProdName('');
    setNewProdDesc('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Math metrics for Analytics
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const totalVAT = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.vat : 0), 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.items.reduce((acc, i) => acc + i.quantity, 0) : 0), 0);

  // Categories distribution stats
  const categorySummary: Record<string, number> = {};
  products.forEach(p => {
    categorySummary[p.category] = (categorySummary[p.category] || 0) + 1;
  });

  return (
    <div className={`border transition-all duration-300 h-full flex flex-col rounded-3xl overflow-hidden font-sans ${
      darkMode 
        ? 'bg-[#0E1524] border-slate-800 text-slate-100 shadow-2xl' 
        : 'bg-white border-slate-200/80 text-slate-850 shadow-md'
    }`}>
      
      {/* Header Panel */}
      <div className={`p-5 border-b flex items-center justify-between select-none ${
        darkMode ? 'bg-slate-950/80 border-slate-850' : 'bg-slate-50/80 border-slate-200/80'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-orange-500 animate-pulse">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`font-display font-bold text-base leading-none ${darkMode ? 'text-slate-50' : 'text-blue-950'}`}>
              Enginia Control Room
            </h2>
            <p className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Merchant Terminal & Analytics
            </p>
          </div>
        </div>
        
        {/* Connection status tag */}
        <span className={`text-[9px] font-mono font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
          darkMode 
            ? 'bg-green-950/80 text-green-400 border-green-800/40' 
            : 'bg-green-50 text-green-600 border-green-200 shadow-2xs'
        }`}>
          <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
          FULL STACK PERSISTENT
        </span>
      </div>

      {/* Tabs navigation */}
      <div className={`flex border-b p-2 gap-2 text-xs select-none ${
        darkMode ? 'border-slate-850 bg-slate-950/40' : 'border-slate-200/80 bg-slate-100/50'
      }`}>
        <button
          id="admin-tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2.5 px-3 rounded-2xl font-semibold tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'analytics' 
              ? (darkMode ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-blue-950 shadow-sm border border-slate-200/60') 
              : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          }`}
        >
          <BarChart3 className="w-4 h-4 text-orange-500" />
          Revenues & Stats
        </button>
        <button
          id="admin-tab-products"
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2.5 px-3 rounded-2xl font-semibold tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'products' 
              ? (darkMode ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-blue-950 shadow-sm border border-slate-200/60') 
              : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          }`}
        >
          <Package className="w-4 h-4 text-blue-500" />
          Manage Catalog ({products.length})
        </button>
        <button
          id="admin-tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 px-3 rounded-2xl font-semibold tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'orders' 
              ? (darkMode ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-blue-950 shadow-sm border border-slate-200/60') 
              : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          }`}
        >
          <CheckSquare className="w-4 h-4 text-green-500" />
          Orders Board ({orders.length})
        </button>
      </div>

      {/* Content wrapper */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ----------------- REVENUES & ANALYTICS TAB ----------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Quick Metrics grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                darkMode ? 'bg-slate-950/80 border-slate-850 shadow-xs text-slate-100' : 'bg-slate-50 border-slate-200/80 text-slate-800 shadow-sm hover:shadow transition duration-200'
              }`}>
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Sales</span>
                  <p className={`text-xl font-bold tracking-tight ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>${totalSales.toFixed(2)}</p>
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-green-100 text-green-700 shadow-2xs font-semibold'
                }`}>
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                darkMode ? 'bg-slate-950/80 border-slate-850 shadow-xs text-slate-100' : 'bg-slate-50 border-slate-200/80 text-slate-800 shadow-sm hover:shadow transition duration-200'
              }`}>
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>tax & vat (12%)</span>
                  <p className={`text-xl font-bold tracking-tight ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>${totalVAT.toFixed(2)}</p>
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700 shadow-2xs font-semibold'
                }`}>
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                darkMode ? 'bg-slate-950/80 border-slate-850 shadow-xs text-slate-100' : 'bg-slate-50 border-slate-200/80 text-slate-800 shadow-sm hover:shadow transition duration-200'
              }`}>
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>total items sold</span>
                  <p className={`text-xl font-bold tracking-tight ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>{totalItemsSold} Units</p>
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-850 shadow-2xs font-semibold'
                }`}>
                  <Package className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                darkMode ? 'bg-slate-950/80 border-slate-850 shadow-xs text-slate-100' : 'bg-slate-50 border-slate-200/80 text-slate-800 shadow-sm hover:shadow transition duration-200'
              }`}>
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>registered clients</span>
                  <p className={`text-xl font-bold tracking-tight ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>42 Users</p>
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' : 'bg-amber-100 text-amber-700 shadow-2xs font-semibold'
                }`}>
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Sales Trends Chart Representation (SVG and D3 style graphics) */}
            <div className={`p-5 rounded-3xl border space-y-4 shadow-sm transition-all duration-300 ${
              darkMode ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200/80'
            }`}>
              <span className={`text-[11px] font-bold block uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Weekly Dispatch Trend - June 2026</span>
              <div className="h-36 relative flex items-end">
                {/* Visual grid lines */}
                <div className="absolute inset-x-0 bottom-0 top-0 border-b flex flex-col justify-between pointer-events-none" style={{ borderColor: darkMode ? '#1e293b' : '#f1f5f9' }}>
                  <div className="w-full border-t" style={{ borderColor: darkMode ? '#1e293b' : '#f1f5f9' }} />
                  <div className="w-full border-t" style={{ borderColor: darkMode ? '#1e293b' : '#f1f5f9' }} />
                  <div className="w-full border-t" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }} />
                </div>

                {/* SVG Line path represent analytics */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="chart-blue-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill area beneath the line */}
                  <path d="M 0,110 L 40,85 L 80,95 L 120,40 L 160,55 L 200,20 L 250,30 L 300,10 L 300,144 L 0,144 Z" fill="url(#chart-blue-gradient)" />
                  
                  {/* Main line path */}
                  <path d="M 0,110 L 40,85 L 80,95 L 120,40 L 160,55 L 200,20 L 250,30 L 300,10" stroke="#f97316" strokeWidth="2.5" fill="none" />
                  
                  {/* Dots over points */}
                  <circle cx="40" cy="85" r="4" fill="#3b82f6" />
                  <circle cx="120" cy="40" r="4" fill="#f97316" />
                  <circle cx="200" cy="20" r="4" fill="#3b82f6" />
                  <circle cx="300" cy="10" r="4" fill="#f97316" />
                </svg>

                {/* Date axis */}
                <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                  <span>Mon (01)</span>
                  <span>Tue (02)</span>
                  <span>Wed (03)</span>
                  <span>Thu (04)</span>
                </div>
              </div>
            </div>

            {/* Inventory Categories Shares */}
            <div className={`p-5 rounded-3xl border space-y-4 shadow-sm transition-all duration-300 ${
              darkMode ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200/80'
            }`}>
              <span className={`text-[11px] font-bold block uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Catalog Inventory Distribution</span>
              <div className="space-y-3">
                {Object.entries(categorySummary).map(([catName, qty]) => {
                  const sharePercent = Math.min(100, Math.floor((qty / products.length) * 100));
                  return (
                    <div key={catName} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{catName}</span>
                        <span className={`font-mono font-bold ${darkMode ? 'text-slate-200' : 'text-blue-900'}`}>{qty} items ({sharePercent}%)</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: `${sharePercent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ----------------- MANAGE PRODUCTS TAB ----------------- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Form to Create Product */}
            <form onSubmit={handleCreateProduct} className={`p-5 rounded-3xl border space-y-4 shadow-sm transition-all duration-300 ${
              darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200/80 shadow-2xs'
            }`}>
              <span className={`text-[11px] font-bold block uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-650'}`}>
                Deploy New Accessory item
              </span>
              
              {successMsg && <p className="text-xs bg-green-950/80 border border-green-800 text-green-400 p-2.5 rounded-xl font-semibold">{successMsg}</p>}

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className={`block mb-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Item Title *</label>
                  <input
                    id="admin-form-title"
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Enginia 4-Gang Touch Panel"
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-all duration-200 border ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-800 focus:border-orange-500 text-slate-105 placeholder:text-slate-500' 
                        : 'bg-white border-slate-200 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 shadow-2xs'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block mb-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Category Hub *</label>
                    <select
                      id="admin-form-category"
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className={`w-full rounded-xl px-2 py-2 text-xs focus:outline-none transition-all duration-200 border ${
                        darkMode 
                          ? 'bg-slate-900 border-slate-800 focus:border-orange-500 text-slate-105' 
                          : 'bg-white border-slate-200 focus:border-blue-500 text-slate-800'
                      }`}
                    >
                      <option>Electrical Wires & Cables</option>
                      <option>MCBs & Circuit Breakers</option>
                      <option>Switches & Sockets</option>
                      <option>LED Bulbs & Lighting</option>
                      <option>Extension Cables</option>
                      <option>Solar Products</option>
                      <option>CCTV Cameras</option>
                      <option>Electronics Accessories</option>
                      <option>Power Tools</option>
                      <option>Batteries & Inverters</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`block mb-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Price ($) *</label>
                      <input
                        id="admin-form-price"
                        type="number"
                        step="0.01"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-all duration-200 border ${
                          darkMode 
                            ? 'bg-slate-900 border-slate-800 focus:border-orange-500 text-slate-105' 
                            : 'bg-white border-slate-200 focus:border-blue-500 text-slate-800 shadow-2xs'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block mb-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Stock *</label>
                      <input
                        id="admin-form-stock"
                        type="number"
                        required
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-all duration-200 border ${
                          darkMode 
                            ? 'bg-slate-900 border-slate-800 focus:border-orange-500 text-slate-105' 
                            : 'bg-white border-slate-200 focus:border-blue-500 text-slate-800 shadow-2xs'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Specs input */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block mb-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-605'}`}>Spec Key</label>
                    <input
                      id="admin-form-spec-key"
                      type="text"
                      value={newProdSpecKey}
                      onChange={(e) => setNewProdSpecKey(e.target.value)}
                      placeholder="Voltage, Size, material"
                      className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-all duration-200 border ${
                        darkMode 
                          ? 'bg-slate-900 border-slate-800 text-slate-101 placeholder:text-slate-500' 
                          : 'bg-white border-slate-200 focus:border-blue-500 text-slate-800 placeholder:text-slate-450 shadow-2xs'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block mb-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-605'}`}>Spec Value</label>
                    <input
                      id="admin-form-spec-val"
                      type="text"
                      value={newProdSpecValue}
                      onChange={(e) => setNewProdSpecValue(e.target.value)}
                      placeholder="240V AC, 1.5 Sq mm"
                      className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none transition-all duration-200 border ${
                        darkMode 
                          ? 'bg-slate-900 border-slate-800 text-slate-101 placeholder:text-slate-500' 
                          : 'bg-white border-slate-200 focus:border-blue-500 text-slate-800 placeholder:text-slate-450 shadow-2xs'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-605'}`}>Product Description</label>
                  <textarea
                    id="admin-form-desc"
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Short summary of advantages..."
                    className={`w-full h-14 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none border ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-800 text-slate-101 focus:border-orange-500 placeholder:text-slate-550' 
                        : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500 placeholder:text-slate-400 shadow-2xs'
                    }`}
                  />
                </div>
              </div>

              <button
                id="admin-submit-new-product"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-2xl text-xs font-semibold text-white transition duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:shadow hover:scale-[1.01]"
              >
                <PlusCircle className="w-4 h-4" />
                Commit to Live Catalog Database
              </button>
            </form>

            {/* List products with rapid Stock updates and Deletion */}
            <div className="space-y-3">
              <span className={`text-[11px] font-bold block uppercase tracking-wider ${darkMode ? 'text-slate-305' : 'text-slate-600'}`}>
                Live Inventory Stocks
              </span>
              {products.map(prod => (
                <div key={prod.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs transition duration-200 ${
                  darkMode ? 'bg-slate-950/85 border-slate-850 text-slate-200' : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-slate-100/40 shadow-2xs'
                }`}>
                  <div className="truncate flex-1">
                    <p className={`font-bold truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{prod.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] uppercase font-mono font-bold tracking-wider ${darkMode ? 'text-orange-400' : 'text-orange-605'}`}>{prod.category}</span>
                      <span className={`text-[10px] font-mono font-bold ${darkMode ? 'text-slate-400' : 'text-blue-600'}`}>${prod.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Stock count controller */}
                  <div className="flex items-center gap-1.5 shrink-0 select-none">
                    <button
                      id={`dec-stock-${prod.id}`}
                      onClick={() => onUpdateStock(prod.id, -1)}
                      className={`w-7 h-7 rounded-lg border font-bold flex items-center justify-center transition cursor-pointer ${
                        darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-705 shadow-2xs'
                      }`}
                    >
                      -
                    </button>
                    <span className={`w-8 text-center font-mono font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{prod.stock}</span>
                    <button
                      id={`inc-stock-${prod.id}`}
                      onClick={() => onUpdateStock(prod.id, 1)}
                      className={`w-7 h-7 rounded-lg border font-bold flex items-center justify-center transition cursor-pointer ${
                        darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-750 shadow-2xs'
                      }`}
                    >
                      +
                    </button>
                  </div>

                  {/* Delete product */}
                  <button
                    id={`delete-prod-${prod.id}`}
                    onClick={() => onDeleteProduct(prod.id)}
                    className={`p-2 border rounded-xl transition cursor-pointer ${
                      darkMode ? 'bg-slate-900 border-slate-800 hover:bg-red-950/20 text-slate-400 hover:text-red-400' : 'bg-white border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-650 shadow-2xs'
                    }`}
                    title="Delete item from store"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ----------------- ORDERS PROCESSING TAB ----------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <span className={`text-[11px] font-bold block uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Operational Dispatch Orders
            </span>

            {orders.length === 0 ? (
              <p className={`text-xs text-center py-10 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                No orders registered yet. Simulate a checkout inside the mobile frame!
              </p>
            ) : (
              orders.map(order => (
                <div key={order.id} className={`p-4 rounded-3xl border space-y-4 text-xs transition duration-300 ${
                  darkMode ? 'bg-slate-950/85 border-slate-850' : 'bg-slate-50 border-slate-200/80 shadow-2xs'
                }`}>
                  
                  {/* Status header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`font-mono font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{order.id}</span>
                      <p className={`text-[10px] mt-0.5 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-550'}`}>{order.customerInfo.name} ({order.customerInfo.city})</p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                      order.status === 'Processing' ? (darkMode ? 'bg-amber-900/50 text-amber-400 border border-amber-800/40 animate-pulse' : 'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse') :
                      order.status === 'Shipped' ? (darkMode ? 'bg-blue-900/50 text-blue-400 border border-blue-800/40' : 'bg-blue-100 text-blue-700 border border-blue-200') :
                      order.status === 'Out for Delivery' ? (darkMode ? 'bg-orange-900/50 text-orange-400 border border-orange-800/40' : 'bg-orange-100 text-orange-700 border border-orange-200') :
                      order.status === 'Delivered' ? (darkMode ? 'bg-green-950 text-green-400 border border-green-800/40' : 'bg-green-100 text-green-700 border border-green-250') :
                      (darkMode ? 'bg-red-900/50 text-red-400 border border-red-800/40' : 'bg-red-100 text-red-700 border border-red-200')
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Purchased items list */}
                  <div className={`p-3 rounded-xl space-y-1.5 border ${
                    darkMode ? 'bg-slate-900/50 border-slate-850' : 'bg-white border-slate-200/60 shadow-2xs'
                  }`}>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[10px]">
                        <span className={`truncate max-w-44 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-705'}`}>{item.product.name}</span>
                        <span className={`font-mono font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>x{item.quantity}</span>
                      </div>
                    ))}
                    <div className={`text-[10px] font-bold text-right pt-2 border-t mt-1 ${
                      darkMode ? 'text-orange-450 border-slate-800/80' : 'text-orange-605 border-slate-100/80'
                    }`}>
                      Total Revenue: ${order.total.toFixed(2)}
                    </div>
                  </div>

                  {/* Dispatch routing controller */}
                  <div className="space-y-2">
                    <span className={`text-[10px] uppercase font-mono font-bold tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-550'}`}>Process dispatch routing status</span>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        id={`btn-status-process-${order.id}`}
                        onClick={() => onUpdateOrderStatus(order.id, 'Processing', 'Payment processing cleared.')}
                        className={`py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wider transition cursor-pointer ${
                          order.status === 'Processing' 
                            ? 'bg-amber-600 text-white shadow-xs' 
                            : (darkMode ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300')
                        }`}
                      >
                        Proc
                      </button>
                      <button
                        id={`btn-status-ship-${order.id}`}
                        onClick={() => onUpdateOrderStatus(order.id, 'Shipped', 'Handed over to Enginia transit courier')}
                        className={`py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wider transition cursor-pointer ${
                          order.status === 'Shipped' 
                            ? 'bg-blue-600 text-white shadow-xs' 
                            : (darkMode ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300')
                        }`}
                      >
                        Ship
                      </button>
                      <button
                        id={`btn-status-route-${order.id}`}
                        onClick={() => onUpdateOrderStatus(order.id, 'Out for Delivery', 'Local courier enroute to location delivery hubs')}
                        className={`py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wider transition cursor-pointer ${
                          order.status === 'Out for Delivery' 
                            ? 'bg-orange-500 text-white animate-pulse shadow-xs' 
                            : (darkMode ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300')
                        }`}
                      >
                        Route
                      </button>
                      <button
                        id={`btn-status-delivered-${order.id}`}
                        onClick={() => onUpdateOrderStatus(order.id, 'Delivered', 'Item loaded and verified at user customer address')}
                        className={`py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wider transition cursor-pointer ${
                          order.status === 'Delivered' 
                            ? 'bg-green-600 text-white shadow-xs' 
                            : (darkMode ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300')
                        }`}
                      >
                        Done
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}

          </div>
        )}

      </div>

    </div>
  );
}
