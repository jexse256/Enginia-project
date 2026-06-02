import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Camera, Scan, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface QRScannerModalProps {
  products: Product[];
  onScanSuccess: (product: Product) => void;
  onClose: () => void;
  darkMode?: boolean;
}

export default function QRScannerModal({ 
  products, 
  onScanSuccess, 
  onClose,
  darkMode = false 
}: QRScannerModalProps) {
  const [cameraState, setCameraState] = useState<'requesting' | 'active' | 'success' | 'error'>('active');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Auto pick a random product for testing as a helper
  useEffect(() => {
    if (products.length > 0) {
      const idx = Math.floor(Math.random() * products.length);
      setSelectedProduct(products[idx]);
    }
  }, [products]);

  const handleSimulateScan = () => {
    if (!selectedProduct) return;
    setCameraState('requesting');
    setTimeout(() => {
      setCameraState('success');
      setTimeout(() => {
        onScanSuccess(selectedProduct);
      }, 1200);
    }, 800);
  };

  const cycleProduct = () => {
    const idx = Math.floor(Math.random() * products.length);
    setSelectedProduct(products[idx]);
    setCameraState('active');
  };

  return (
    <div className={`absolute inset-0 z-50 flex flex-col justify-between p-4 animate-fade-in transition-all duration-300 ${
      darkMode ? 'bg-[#0E1524]/95 text-slate-101' : 'bg-[#FAFCFF]/95 text-slate-850'
    }`}>
      {/* Header */}
      <div className={`p-3.5 rounded-2xl border flex justify-between items-center transition-all ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/60 shadow-3xs'
      }`}>
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-orange-500 animate-pulse" />
          <div className="text-left">
            <h3 className={`font-semibold text-xs ${darkMode ? 'text-slate-100' : 'text-blue-955 font-display'}`}>Industrial QR Scanner</h3>
            <span className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-505 font-medium'}`}>Aim at Enginia hardware label</span>
          </div>
        </div>
        <button id="close-qr-scanner" onClick={onClose} className={`p-1.5 rounded-lg transition cursor-pointer ${
          darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-550 hover:text-slate-900'
        }`}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Camera feed area */}
      <div className="flex-1 my-4 flex items-center justify-center relative">
        <div className={`w-64 h-64 border-2 border-dashed rounded-3xl relative flex flex-col items-center justify-center overflow-hidden transition duration-300 ${
          darkMode ? 'bg-slate-900/60 border-blue-500' : 'bg-white border-blue-600 shadow-2xs'
        } group`}>
          {/* Laser targeting line */}
          <div className="absolute left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_10px_#f97316] animate-bounce z-10" />

          {cameraState === 'active' && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center ${
              darkMode ? 'bg-slate-950/40' : 'bg-slate-50/40'
            }`}>
              <Camera className="w-10 h-10 text-slate-400 mb-2 animate-pulse" />
              <p className={`text-xs font-bold font-mono ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>STANDBY FOR DIAGNOSTICS</p>
              {selectedProduct ? (
                <div id="sim-qr-box" className={`mt-4 p-2.5 rounded-xl border w-11/12 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAFCFF] border-slate-205 shadow-3xs'
                }`}>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">SIMULATION LABELS</p>
                  <p className={`text-[10.5px] font-bold truncate mt-0.5 ${darkMode ? 'text-slate-200' : 'text-blue-955'}`}>{selectedProduct.name}</p>
                </div>
              ) : null}
            </div>
          )}

          {cameraState === 'requesting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-950/80 p-4">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-2" />
              <span className="text-[11px] font-mono text-blue-300 font-bold">DECODING DATAMATRIX...</span>
            </div>
          )}

          {cameraState === 'success' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-950/90 text-center p-4">
              <Sparkles className="w-10 h-10 text-green-400 animate-bounce mb-2" />
              <span className="text-sm font-bold text-green-300 font-display">DECODE MATCH!</span>
              <p className="text-[10px] text-slate-200 truncate mt-1 w-11/12">{selectedProduct?.name}</p>
            </div>
          )}
        </div>

        {/* Framing Corners */}
        <div className="absolute top-8 left-8 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl-lg" />
        <div className="absolute top-8 right-8 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr-lg" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl-lg" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br-lg" />
      </div>

      {/* Control Actions / Simulation instructions */}
      <div className={`p-4 rounded-3xl border space-y-3.5 transition-all ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        <div className="flex items-start gap-2.5 text-xs text-slate-300">
          <AlertCircle className={`w-4.5 h-4.5 shrink-0 mt-0.5 ${darkMode ? 'text-slate-400' : 'text-blue-600'}`} />
          <p className={`text-left ${darkMode ? 'text-slate-300' : 'text-slate-650'}`}>
            Every physical Enginia Cable roll or MCBs breaker comes with an embedded secure diagnostic QR tag. Simulating scans lets you fetch direct digital parameters.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5 select-none">
          <button 
            id="cycle-qr-product"
            onClick={cycleProduct} 
            className={`text-xs py-2.5 px-3 rounded-xl transition font-bold flex items-center justify-center gap-1.5 cursor-pointer border ${
              darkMode 
                ? 'bg-slate-800 border-slate-705 text-slate-200 hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Switch Label
          </button>
          <button 
            id="trigger-qr-scanner-sim"
            onClick={handleSimulateScan}
            disabled={cameraState === 'requesting' || cameraState === 'success'}
            className="bg-orange-500 hover:bg-orange-400 disabled:bg-slate-300 text-white text-xs py-2.5 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
          >
            <Scan className="w-3.5 h-3.5" />
            Trigger Scan
          </button>
        </div>
      </div>
    </div>
  );
}
