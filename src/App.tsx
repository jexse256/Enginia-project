import React, { useState, useEffect } from 'react';
import { Product, Order, CartItem, Notification } from './types';
import { TRANSLATIONS } from './data/translations';
import { CATEGORIES } from './data/products';

import AdminPanel from './components/AdminPanel';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import ChatbotView from './components/ChatbotView';
import QRScannerModal from './components/QRScannerModal';
import CompareDrawer from './components/CompareDrawer';
import ProductDetailModal from './components/ProductDetailModal';

// Lucide Icons
import {
  Smartphone,
  Cpu,
  Tv,
  Cable,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Heart,
  Search,
  Bell,
  User,
  Star,
  Settings,
  X,
  Sparkles,
  RefreshCw,
  Moon,
  Sun,
  LayoutDashboard,
  Volume2,
  BookmarkCheck,
  Flame,
  ArrowRight,
  Info,
  QrCode,
  Languages,
  CheckCircle2,
  MapPin,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // Config & Localization State
  const [lang, setLang] = useState<'EN' | 'FR' | 'SW'>('EN');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Database States (Synced with Live Express server)
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Screen/View Controls inside Phone
  const [activeScreen, setActiveScreen] = useState<'home' | 'categories' | 'wishlist' | 'notifications' | 'profile' | 'chatbot' | 'cart' | 'checkout'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Filtering & Interaction States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);

  // Cart & checkout temporary states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [checkoutParams, setCheckoutParams] = useState({ subtotal: 0, vat: 0, discount: 0, total: 0, coupon: '' });

  // Addition Features Open modals
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Audio / voice search simulated triggers
  const [systemVoiceActive, setSystemVoiceActive] = useState(false);

  // Banner Slides
  const promos = [
    { title: '⚡ Monsoon Solar Offer ⚡', sub: 'Sol-Gen 150W panel starting at $125.00!', color: 'from-orange-600 to-amber-500' },
    { title: '🔌 Safe Breakers Pro-Tect 🔌', sub: 'Up to 20% savings on 32A/63A circuit protections.', color: 'from-blue-600 to-indigo-700' },
    { title: '💡 Hue LED Smart Living 💡', sub: 'Convert your ceilings instantly. From $12.99 A++', color: 'from-purple-600 to-pink-500' }
  ];

  const t = TRANSLATIONS[lang];

  // Load Data on Mount
  useEffect(() => {
    fetchData();
    // Auto slide banners
    const interval = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % promos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      const ordersRes = await fetch('/api/orders');
      const notifRes = await fetch('/api/notifications');

      if (prodRes.ok && ordersRes.ok && notifRes.ok) {
        const prodData = await prodRes.json();
        const ordersData = await ordersRes.json();
        const notifData = await notifRes.json();
        
        setProducts(prodData);
        setOrders(ordersData);
        setNotifications(notifData);
      }
    } catch (err) {
      console.warn('Backend server cold boot, operating on integrated modules gracefully.');
    } finally {
      setLoading(false);
    }
  };

  // Sync / write product or order helpers
  const handleAddProductAdmin = async (newProd: any) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (res.ok) {
        fetchData();
        triggerAlert('Product Committed to Live Catalog.');
      }
    } catch (err) {
      setProducts(prev => [...prev, { ...newProd, id: 'temp-' + Date.now() }]);
    }
  };

  const handleDeleteProductAdmin = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        triggerAlert('Product removed.');
      }
    } catch (err) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateStockAdmin = async (id: string, amount: number) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const nextStock = Math.max(0, prod.stock + amount);
    
    handleAddProductAdmin({ ...prod, stock: nextStock });
  };

  const handleUpdateOrderStatusAdmin = async (id: string, status: string, description: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, description })
      });
      if (res.ok) {
        fetchData();
        triggerAlert(`Order dispatch status set: ${status}`);
      }
    } catch {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as any } : o));
    }
  };

  // Helper alert popup trigger
  const triggerAlert = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Live Suggestion filter on Search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id 
          ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } 
          : item
        );
      }
      return [...prev, { product, quantity, savedForLater: false }];
    });
    triggerAlert(`Added ${quantity}x "${product.name.substring(0, 18)}..."`);
    setSelectedProduct(null); // Close detail modal
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const handleToggleSaveForLater = (productId: string) => {
    setCartItems(prev => prev.map(item => item.product.id === productId ? { ...item, savedForLater: !item.savedForLater } : item));
  };

  // Wishlist and comparisons
  const handleAddToWishlist = (product: Product) => {
    setWishlist(prev => {
      const has = prev.some(p => p.id === product.id);
      if (has) {
        triggerAlert('Removed from Wishlist');
        return prev.filter(p => p.id !== product.id);
      }
      triggerAlert('Saved in Wishlist');
      return [...prev, product];
    });
  };

  const handleAddToCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 2) {
        triggerAlert('Compare list is full (Max 2 item details).');
        return prev;
      }
      triggerAlert('Added to Compare Sheet.');
      return [...prev, product];
    });
    setCompareDrawerOpen(true);
  };

  const handleQRScanSuccess = (scannedProduct: Product) => {
    setQrScannerOpen(false);
    setSelectedProduct(scannedProduct); // Open details modal instantly
    triggerAlert('QR Code parsed successfully!');
  };

  const handleNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/read', { method: 'POST' });
    } catch {}
  };

  // Clear cart upon formal checkout success
  const handleCheckoutSuccess = (order: Order) => {
    setCartItems(prev => prev.filter(item => item.savedForLater)); // Keep saved items
    fetchData(); // pull fresh orders
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cable': return <Cable className="w-5 h-5 text-blue-400" />;
      case 'ShieldAlert': return <Zap className="w-5 h-5 text-orange-400" />;
      case 'ToggleLeft': return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'Lightbulb': return <LightbulbIcon />;
      case 'Power': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Sun': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'Camera': return <Tv className="w-5 h-5 text-orange-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-500" />;
      case 'Wrench': return <Cpu className="w-5 h-5 text-slate-400" />;
      case 'BatteryCharging': return <Zap className="w-5 h-5 text-green-400" />;
      default: return <Cpu className="w-5 h-5 text-slate-400" />;
    }
  };

  function LightbulbIcon() {
    return <Zap className="w-5 h-5 text-yellow-400" />;
  }

  // Filter Catalog
  const filteredProducts = products.filter(p => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             p.category.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'bg-[#0B0F19] text-white' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Top Professional Header Bar in Bento Style */}
      <header className={`border-b px-8 py-5 flex items-center justify-between select-none ${darkMode ? 'bg-[#0E1524]/90 border-slate-850 backdrop-blur-md' : 'bg-white border-slate-200/80 shadow-xs'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-display font-semibold text-xl shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:rotate-6 transition duration-300">
            ⚡
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight uppercase flex items-center gap-2 leading-none">
              <span className={darkMode ? 'text-blue-400' : 'text-blue-900'}>Enginia</span>
              <span className="text-orange-500">Electronics</span>
              <span className={`text-[9px] font-mono tracking-wide px-2 py-0.5 rounded-full border uppercase ${
                darkMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-500/5 text-orange-600 border-orange-500/20 font-bold'
              }`}>PRO</span>
            </h1>
            <p className={`text-[10px] font-mono tracking-wider uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              "{t.tagline}"
            </p>
          </div>
        </div>

        {/* Global Controls: Language, Theme, Status */}
        <div className="flex items-center gap-4">
          
          {/* Language select popup inline */}
          <div className={`p-1 rounded-xl border flex items-center gap-1.5 text-[11px] ${
            darkMode ? 'bg-slate-950/40 border-slate-800/80 text-slate-400' : 'bg-slate-100/90 border-slate-200 text-slate-600'
          }`}>
            <Languages className={`w-3.5 h-3.5 ml-1 shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <button id="lang-en" onClick={() => setLang('EN')} className={`px-2 py-0.5 rounded-lg transition-all duration-200 ${lang === 'EN' ? (darkMode ? 'bg-blue-600 text-white font-bold' : 'bg-blue-600 text-white font-bold shadow-xs') : 'hover:text-amber-500 cursor-pointer'}`}>EN</button>
            <button id="lang-fr" onClick={() => setLang('FR')} className={`px-2 py-0.5 rounded-lg transition-all duration-200 ${lang === 'FR' ? (darkMode ? 'bg-blue-600 text-white font-bold' : 'bg-blue-600 text-white font-bold shadow-xs') : 'hover:text-amber-500 cursor-pointer'}`}>FR</button>
            <button id="lang-sw" onClick={() => setLang('SW')} className={`px-2 py-0.5 rounded-lg transition-all duration-200 ${lang === 'SW' ? (darkMode ? 'bg-blue-600 text-white font-bold' : 'bg-blue-600 text-white font-bold shadow-xs') : 'hover:text-amber-500 cursor-pointer'}`}>SW</button>
          </div>

          <button
            id="toggle-dark-theme-top"
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
              darkMode ? 'bg-slate-950/40 border-slate-800 hover:text-orange-400' : 'bg-slate-100 border-slate-200 hover:bg-slate-200/80 hover:text-orange-500 text-slate-700 shadow-2xs'
            }`}
            title="Toggle theme preset"
          >
            {darkMode ? <Sun className="w-4 h-4 text-orange-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>
        </div>
      </header>

      {/* Main Two-Column Panel (Smartphone shell mockup left, Merchant central right) */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-12 gap-8 items-start h-[calc(100vh-100px)] overflow-hidden">
        
        {/* LEFT COLUMN: THE ENGINIA SMARTPHONE FRAME SIMULATOR (5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-5 flex justify-center h-full relative">
          
          {/* Flash operational alerts messages */}
          {feedbackMsg && (
            <div className="absolute top-12 z-50 bg-blue-600 border border-blue-400/30 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs animate-slide-up">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="font-semibold">{feedbackMsg}</span>
            </div>
          )}

          {/* Smartphone structure block */}
          <div className="w-[360px] h-[640px] bg-[#111827] rounded-[44px] p-3 border-4 border-slate-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative flex flex-col overflow-hidden glow-blue select-none ring-12 ring-slate-800/20">
            
            {/* Speaker recess & front camera notch */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-slate-950 rounded-full z-50 flex items-center justify-between px-4">
              <div className="w-14 h-1 bg-slate-800 rounded-full" /> {/* ear receiver */}
              <div className="w-2.5 h-2.5 bg-blue-900 rounded-full border border-slate-700/80 animate-pulse" /> {/* Camera hole */}
            </div>

            {/* Mobile virtual screen shell (holds actual app states client) */}
            <div className={`flex-1 rounded-[32px] overflow-hidden border relative flex flex-col justify-between pt-6 font-sans transition-all duration-300 ${
              darkMode ? 'bg-[#0E1524] text-white border-slate-950' : 'bg-[#FAFCFF] text-slate-800 border-slate-205'
            }`}>
              
              {/* Status Bar line */}
              <div className="absolute top-1.5 inset-x-5 flex justify-between items-center text-[9px] font-mono font-bold text-slate-400 z-50 pointer-events-none">
                <span>08:42</span>
                <div className="flex items-center gap-1.5">
                  <span>5G WiFi</span>
                  {/* Battery visual slider */}
                  <div className="w-5 h-2.5 border border-slate-500 rounded-sm p-0.5 flex items-center">
                    <div className="w-full h-full bg-green-500 rounded-xs animate-pulse" />
                  </div>
                </div>
              </div>

              {/* View components routing controller */}
              <div id="phone-virtual-render-viewport" className="flex-1 overflow-hidden relative flex flex-col">
                
                {activeScreen === 'home' && (
                  <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col space-y-4">
                    
                    {/* Floating promotion coupon banner slider */}
                    <div className="px-4 pt-2">
                      <div className={`rounded-3xl p-4 bg-gradient-to-br ${promos[bannerIndex].color} relative overflow-hidden flex flex-col justify-between h-28 border border-white/10 transition duration-500 shadow-lg`}>
                        <div className="absolute top-1 right-2 opacity-15">
                          <Zap className="w-20 h-10" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono bg-white/20 px-2 py-0.5 rounded-full text-white font-extrabold">PROMO DISPATCH</span>
                          <h3 className="font-display font-semibold text-xs leading-tight text-white mt-1 h-8">{promos[bannerIndex].title}</h3>
                        </div>
                        <p className="text-[10px] text-white/80 font-mono font-bold">{promos[bannerIndex].sub}</p>
                      </div>
                    </div>

                    {/* Integrated Search Bar with predictive suggestions */}
                    <div className="px-4 space-y-1 relative">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute top-2.5 left-3" />
                        <input
                          id="market-search-bar"
                          type="text"
                          placeholder={t.searchPlaceholder}
                          value={searchQuery}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className={`w-full rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none transition-all duration-200 border ${
                            darkMode 
                              ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-orange-500' 
                              : 'bg-white border-slate-205 text-slate-805 placeholder:text-slate-400 focus:border-orange-500 shadow-3xs'
                          }`}
                        />
                        {/* QR and OCR shortcut buttons */}
                        <button
                          id="shortcut-qr-scanner"
                          onClick={() => setQrScannerOpen(true)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white transition cursor-pointer"
                          title="Open physical QR Scanner"
                        >
                          <QrCode className="w-4 h-4 text-blue-505" />
                        </button>
                      </div>

                      {/* Predictive suggestions drop overlay */}
                      {suggestions.length > 0 && (
                        <div className={`absolute left-4 right-4 rounded-xl mt-1 p-2.5 z-50 divide-y shadow-2xl backdrop-blur-md border ${
                          darkMode 
                            ? 'bg-slate-900/95 border-slate-800 divide-slate-800 text-slate-200' 
                            : 'bg-white/95 border-slate-205 divide-slate-150 text-slate-805 shadow-2xl'
                        }`}>
                          <span className="text-[9px] text-slate-550 uppercase tracking-widest block mb-1 font-mono font-bold">Predictive Matches</span>
                          {suggestions.map(s => (
                            <div
                              key={s.id}
                              id={`suggest-item-${s.id}`}
                              onClick={() => {
                                setSelectedProduct(s);
                                setSuggestions([]);
                                setSearchQuery('');
                              }}
                              className={`py-1.5 flex justify-between items-center cursor-pointer rounded px-1 transition ${
                                darkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                              }`}
                            >
                              <span className="text-xs truncate pr-4">{s.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Grid Category lists shortcut indicators */}
                    <div className="px-4 space-y-2">
                      <div className="flex justify-between items-center text-xs select-none">
                        <span className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-blue-955'}`}>{t.gridTitle}</span>
                        <button 
                          id="view-all-categories-shortcut"
                          onClick={() => { setActiveScreen('categories'); setSelectedCategory(null); }} 
                          className="text-[10px] text-orange-500 font-bold cursor-pointer"
                        >
                          See All
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {CATEGORIES.slice(0, 4).map(cat => (
                          <div 
                            key={cat.id} 
                            id={`shortcut-cat-${cat.id}`}
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setActiveScreen('categories');
                            }}
                            className={`border p-2.5 rounded-2xl text-center cursor-pointer transition-all duration-200 ${
                              darkMode 
                                ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900' 
                                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-3xs'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                              darkMode ? 'bg-[#1e293b]' : 'bg-slate-100'
                            }`}>
                              {getCategoryIcon(cat.iconName)}
                            </div>
                            <p className={`text-[9px] font-bold line-clamp-1 ${darkMode ? 'text-slate-300' : 'text-slate-705'}`}>{cat.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic catalogue lists (featured & best sellers) */}
                    <div className="px-4 space-y-3 pb-8">
                      <div className="flex items-center gap-1.5 select-none">
                        <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-blue-955 font-display'}`}>{t.featuredTitle}</span>
                        <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {filteredProducts.slice(0, 4).map(product => (
                          <div 
                            key={product.id} 
                            id={`product-card-${product.id}`}
                            className={`border rounded-2xl p-2.5 flex flex-col justify-between transition duration-200 group relative ${
                              darkMode 
                                ? 'bg-slate-900 border-slate-800/80 hover:border-slate-700' 
                                : 'bg-white border-slate-205 hover:border-slate-300 shadow-3xs'
                            }`}
                          >
                            <div onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                              <div className={`h-22 overflow-hidden rounded-xl mb-2 relative ${
                                darkMode ? 'bg-slate-950' : 'bg-slate-100/50'
                              }`}>
                                <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                {product.bestSeller && (
                                  <span className="absolute top-1.5 left-1.5 font-mono text-[8px] bg-orange-500 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase">Best</span>
                                )}
                              </div>
                              <span className="text-[8px] uppercase tracking-wider font-mono font-bold text-orange-500">{product.category}</span>
                              <h4 className={`text-[10px] font-bold line-clamp-1 h-4 mt-0.5 ${
                                darkMode ? 'text-slate-205' : 'text-slate-800'
                              }`}>{product.name}</h4>
                            </div>

                            <div className={`flex justify-between items-center mt-2 pt-2 border-t ${
                              darkMode ? 'border-slate-800/80' : 'border-slate-100'
                            }`}>
                              <span className="text-xs font-extrabold text-blue-600">${product.price.toFixed(2)}</span>
                              <button
                                id={`quick-cart-${product.id}`}
                                onClick={() => handleAddToCart(product, 1)}
                                className="bg-blue-600 hover:bg-blue-500 p-1.5 rounded-xl text-white transition cursor-pointer"
                                title="Add to Cart"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Categories View Screen */}
                {activeScreen === 'categories' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                    <div className={`flex items-center gap-2 border-b pb-2 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                      <ChevronRight className="w-4 h-4 text-orange-505 shrink-0" />
                      <span className={`font-semibold text-xs uppercase tracking-wider font-mono ${darkMode ? 'text-slate-200' : 'text-blue-955'}`}>Hardware Categories List</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id="category-filter-all"
                        onClick={() => setSelectedCategory(null)}
                        className={`text-xs py-2 px-3 rounded-xl border font-bold text-left transition duration-200 cursor-pointer ${
                          !selectedCategory 
                            ? 'bg-orange-500 hover:bg-orange-400 text-white border-transparent shadow-xs' 
                            : (darkMode ? 'bg-[#1a2336] border-slate-805 text-slate-400' : 'bg-white border-slate-250 text-slate-600')
                        }`}
                      >
                        All Categories ({products.length})
                      </button>
                      
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          id={`category-filter-${cat.id}`}
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`text-xs py-2 px-3 rounded-xl border font-bold text-left transition duration-200 cursor-pointer truncate ${
                            selectedCategory === cat.name 
                              ? 'bg-orange-500 hover:bg-orange-400 text-white border-transparent shadow-xs' 
                              : (darkMode ? 'bg-[#1a2336] border-slate-805 text-slate-400' : 'bg-white border-slate-250 text-slate-600')
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 mt-2 flex-1 pb-10">
                      {filteredProducts.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => setSelectedProduct(p)} 
                          className={`border p-3 rounded-2xl flex gap-3 cursor-pointer transition ${
                            darkMode 
                              ? 'bg-slate-900/60 hover:bg-slate-900 border-slate-850' 
                              : 'bg-white hover:bg-slate-50 border-slate-205 shadow-3xs'
                          }`}
                        >
                          <img src={p.image} referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-xl shrink-0" />
                          <div className="truncate flex-1 self-center">
                            <h5 className={`text-[11px] font-bold truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{p.name}</h5>
                            <span className="text-[9px] uppercase font-mono font-bold text-orange-500">{p.category}</span>
                            <span className="text-[10.5px] font-extrabold text-blue-600 block mt-0.5">${p.price.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wishlist View Screen */}
                {activeScreen === 'wishlist' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <span className={`font-semibold text-sm block border-b pb-2 ${darkMode ? 'border-slate-800 text-slate-200 font-display' : 'border-slate-200 text-[#115EC9] font-display'}`}>Saved Wishlist</span>
                    {wishlist.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-10 font-medium">{t.emptyWishlist}</p>
                    ) : (
                      wishlist.map(p => (
                        <div 
                          key={p.id} 
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition duration-200 ${
                            darkMode ? 'bg-slate-900 border-slate-850 text-slate-200' : 'bg-white border-slate-205 text-slate-800 shadow-3xs'
                          }`}
                        >
                          <img src={p.image} referrerPolicy="no-referrer" className="w-11 h-11 object-cover rounded-xl shrink-0" />
                          <div className="truncate flex-1">
                            <p className={`font-bold truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{p.name}</p>
                            <span className="text-blue-606 font-extrabold">${p.price.toFixed(2)}</span>
                          </div>
                          <button
                            id={`wishlist-cart-${p.id}`}
                            onClick={() => handleAddToCart(p, 1)}
                            className="bg-blue-600 hover:bg-blue-500 p-2 rounded-xl text-white transition cursor-pointer flex items-center justify-center"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Notifications Panel */}
                {activeScreen === 'notifications' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 fn-read" onLoad={handleNotificationsRead}>
                    <div className={`flex justify-between items-center border-b pb-2 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                      <span className={`font-semibold text-sm ${darkMode ? 'text-slate-200' : 'text-[#115EC9] font-display'}`}>System Alerts</span>
                      <button id="notif-mark-read" onClick={handleNotificationsRead} className={`text-[9px] px-2 py-1 rounded-md border ${
                        darkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 font-bold' : 'bg-slate-50 border-slate-205 text-slate-600 hover:bg-slate-100 font-bold'
                      }`}>Mark all read</button>
                    </div>

                    <div className="space-y-2.5 pb-10 select-none">
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-3.5 rounded-2xl border flex gap-2.5 transition duration-200 ${
                            n.read 
                              ? (darkMode ? 'bg-slate-900/20 border-slate-850 text-slate-500 font-mono text-[10px]' : 'bg-slate-50/50 border-slate-205/60 text-slate-500 font-mono text-[10px]') 
                              : (darkMode ? 'bg-slate-900 border-slate-855 text-slate-100 font-medium' : 'bg-white border-[#E6EAF2] text-slate-750 shadow-3xs')
                          }`}
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0 self-center" />
                          <div>
                            <span className={`text-[8.5px] uppercase font-mono font-extrabold block pb-0.5 border-b mb-1 ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-450'}`}>
                              {new Date(n.date).toLocaleDateString()}
                            </span>
                            <h5 className="font-bold text-xs leading-tight">{n.title}</h5>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">{n.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Account / User profile Screen */}
                {activeScreen === 'profile' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    
                    {/* Logged in Card */}
                    <div className={`border p-4 rounded-3xl flex items-center gap-3 transition duration-200 ${
                      darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-205 text-slate-805 shadow-2xs'
                    }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition ${
                        darkMode ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-105 shadow-3xs'
                      }`}>
                        <User className="w-5 h-5 text-blue-505" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${darkMode ? 'text-slate-100' : 'text-blue-955'}`}>Jethro Tenyi</h4>
                        <span className="text-[9px] text-orange-550 font-mono font-bold">GOLD ELECTRICIAN MEMBER</span>
                        <p className="text-[9px] text-slate-400">Member since 2026</p>
                      </div>
                    </div>

                    {/* Order histories checklist */}
                    <div className="space-y-2 pb-10">
                      <span className={`text-[10px] uppercase font-mono font-extrabold tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Your Order Logs</span>
                      {orders.map(o => (
                        <div 
                          key={o.id} 
                          className={`p-3 border rounded-2xl space-y-2 text-xs transition duration-200 ${
                            darkMode ? 'bg-slate-900/60 border-slate-855 text-slate-202' : 'bg-white border-slate-205 shadow-3xs text-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold">{o.id}</span>
                            <span className={`text-[8.5px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                              o.status === 'Delivered' 
                                ? 'bg-green-105 text-green-700 border-green-200' 
                                : 'bg-blue-105 text-blue-700 border-blue-200 animate-pulse'
                            }`}>{o.status}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>{new Date(o.date).toLocaleDateString()}</span>
                            <span className="font-extrabold text-blue-605">${o.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* Sub View: Shopping Cart page */}
                {activeScreen === 'cart' && (
                  <CartView
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveCartItem}
                    onToggleSaveForLater={handleToggleSaveForLater}
                    onCheckoutTrigger={(subtotal, vat, discount, total, coupon) => {
                      setCheckoutParams({ subtotal, vat, discount, total, coupon });
                      setActiveScreen('checkout');
                    }}
                    darkMode={darkMode}
                  />
                )}

                {/* Sub View: Checkout page */}
                {activeScreen === 'checkout' && (
                  <CheckoutView
                    items={cartItems.filter(i => !i.savedForLater)}
                    subtotal={checkoutParams.subtotal}
                    vat={checkoutParams.vat}
                    discount={checkoutParams.discount}
                    total={checkoutParams.total}
                    appliedCoupon={checkoutParams.coupon}
                    onBack={() => setActiveScreen('cart')}
                    onCheckoutSuccess={handleCheckoutSuccess}
                    darkMode={darkMode}
                  />
                )}

                {/* Sub View: AI Chatbot assistant tab */}
                {activeScreen === 'chatbot' && (
                  <ChatbotView orderHistory={orders} darkMode={darkMode} />
                )}

              </div>

              {/* Product details popover modal */}
              {selectedProduct && (
                <ProductDetailModal
                  product={selectedProduct}
                  onClose={() => setSelectedProduct(null)}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onAddToCompare={handleAddToCompare}
                  isInWishlist={wishlist.some(p => p.id === selectedProduct.id)}
                  isInCompare={compareList.some(p => p.id === selectedProduct.id)}
                  darkMode={darkMode}
                />
              )}

              {/* Product Comparison Drawer overlay inside phone */}
              {compareDrawerOpen && compareList.length > 0 && (
                <CompareDrawer
                  products={compareList}
                  onRemove={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
                  onClose={() => setCompareDrawerOpen(false)}
                  onAddToCart={handleAddToCart}
                  darkMode={darkMode}
                />
              )}

              {/* QR Scanner camera code preview modal */}
              {qrScannerOpen && (
                <QRScannerModal
                  products={products}
                  onScanSuccess={handleQRScanSuccess}
                  onClose={() => setQrScannerOpen(false)}
                  darkMode={darkMode}
                />
              )}

              {/* Phone Simulated Bottom Navigation bar (Home, Categories, Chatbot, Alerts, Account) */}
              <nav className={`py-2 px-5 flex justify-between items-center text-[10px] select-none shrink-0 rounded-b-[28px] h-14 border-t transition-all duration-300 ${
                darkMode ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-[#FAFCFF] border-slate-205 text-slate-500'
              }`}>
                <button
                  id="nav-btn-home"
                  onClick={() => setActiveScreen('home')}
                  className={`flex flex-col items-center gap-1.5 transition duration-200 cursor-pointer ${
                    activeScreen === 'home' 
                      ? (darkMode ? 'text-white font-extrabold scale-105' : 'text-blue-600 font-extrabold scale-105') 
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{t.homeNav}</span>
                </button>
                <button
                  id="nav-btn-categories"
                  onClick={() => setActiveScreen('categories')}
                  className={`flex flex-col items-center gap-1.5 transition duration-200 cursor-pointer ${
                    activeScreen === 'categories' 
                      ? (darkMode ? 'text-white font-extrabold scale-105' : 'text-blue-600 font-extrabold scale-105') 
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>{t.catNav}</span>
                </button>
                <button
                  id="nav-btn-chatbot"
                  onClick={() => setActiveScreen('chatbot')}
                  className={`flex flex-col items-center gap-1.5 transition duration-200 cursor-pointer ${
                    activeScreen === 'chatbot' 
                      ? (darkMode ? 'text-blue-400 font-extrabold scale-105' : 'text-blue-605 font-extrabold scale-105') 
                      : 'hover:text-slate-900'
                  }`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border transition ${
                    darkMode ? 'bg-blue-600/10 border-blue-500/30' : 'bg-blue-50 border-blue-200 shadow-3xs'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-blue-505 animate-pulse" />
                  </div>
                  <span>Asst</span>
                </button>
                <button
                  id="nav-btn-notifications"
                  onClick={() => setActiveScreen('notifications')}
                  className={`flex flex-col items-center gap-1.5 transition relative duration-200 cursor-pointer ${
                    activeScreen === 'notifications' 
                      ? (darkMode ? 'text-white font-extrabold scale-105' : 'text-blue-600 font-extrabold scale-105') 
                      : 'hover:text-slate-900'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-505 text-[7px] text-white flex items-center justify-center font-bold rounded-full">{unreadCount}</span>
                  )}
                  <span>{t.notifNav}</span>
                </button>
                <button
                  id="nav-btn-profile"
                  onClick={() => setActiveScreen('profile')}
                  className={`flex flex-col items-center gap-1.5 transition relative duration-200 cursor-pointer ${
                    activeScreen === 'profile' 
                      ? (darkMode ? 'text-white font-extrabold scale-105' : 'text-blue-600 font-extrabold scale-105') 
                      : 'hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-blue-600 rounded-full text-[8.5px] font-black text-white flex items-center justify-center shadow-xs">{cartItems.length}</span>
                  )}
                  <span>{t.profileNav}</span>
                </button>
              </nav>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE COMPREHENSIVE ADMIN & SALES ANALYTICS INTERFACES (7 Cols) */}
        <div className="lg:col-span-7 h-full flex flex-col justify-between">
          <div className="h-full">
            <AdminPanel
              products={products}
              orders={orders}
              onAddProduct={handleAddProductAdmin}
              onDeleteProduct={handleDeleteProductAdmin}
              onUpdateStock={handleUpdateStockAdmin}
              onUpdateOrderStatus={handleUpdateOrderStatusAdmin}
              darkMode={darkMode}
            />
          </div>
        </div>

      </main>

    </div>
  );
}
