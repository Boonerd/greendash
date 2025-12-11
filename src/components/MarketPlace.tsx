import React, { useState } from 'react';
import { MOCK_MARKET_DATA, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { TrendingUp, TrendingDown, Minus, LineChart, X } from 'lucide-react';
import { Button } from './Button';

interface MarketPlaceProps {
  lang: Language;
}

export const MarketPlace: React.FC<MarketPlaceProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewingChart, setViewingChart] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleBuy = (id: string) => {
    setSelectedItem(id);
    setPaymentSuccess(false);
  };

  const confirmPayment = () => {
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setSelectedItem(null);
        setPaymentSuccess(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="animate-fade-in pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-forest mb-4">{t.market}</h2>
      
      <div className="grid gap-4">
        {MOCK_MARKET_DATA.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-md shadow-forest/5 border border-forest/10 hover:shadow-lg hover:border-forest/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-forest text-lg">{item.name[lang]}</h3>
                <p className="text-sm text-gray-600 font-medium">
                  KES {item.price} / {item.unit}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border ${
                  item.trend === 'up' ? 'bg-lime/20 text-forest border-lime/30' :
                  item.trend === 'down' ? 'bg-red-100 text-red-700 border-red-200' :
                  'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {item.trend === 'up' && <TrendingUp size={12} />}
                  {item.trend === 'down' && <TrendingDown size={12} />}
                  {item.trend === 'stable' && <Minus size={12} />}
                  {item.change}
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex gap-2 mt-3">
               <button 
                 onClick={() => setViewingChart(viewingChart === item.id ? null : item.id)}
                 className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-cream text-forest hover:bg-cream/80 hover:shadow-sm transition-all flex items-center justify-center gap-2 border border-forest/10"
               >
                 <LineChart size={14} />
                 {viewingChart === item.id ? "Hide Trends" : "View Trends"}
               </button>
               <Button 
                  variant="primary" 
                  className="py-2.5! px-5! text-xs rounded-xl! font-bold"
                  onClick={() => handleBuy(item.id)}
                >
                  Buy Now
                </Button>
            </div>

            {/* Expandable Chart Section */}
            {viewingChart === item.id && (
              <div className="mt-4 pt-4 border-t border-forest/10 animate-fade-in">
                <div className="h-32 w-full bg-cream/50 rounded-xl p-3">
                  <SimpleSparkline trend={item.trend} />
                </div>
                <p className="text-xs text-center text-gray-500 mt-3 font-medium">Price history (Last 7 Days)</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Payment Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-forest/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            {!paymentSuccess ? (
              <>
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xl font-bold text-forest">{t.mpesa_pay}</h3>
                   <button 
                     onClick={() => setSelectedItem(null)} 
                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                   >
                     <X size={20} className="text-gray-600" />
                   </button>
                </div>
                
                <p className="text-gray-600 mb-6 text-sm">
                  Complete purchase for {MOCK_MARKET_DATA.find(i => i.id === selectedItem)?.name[lang]}.
                </p>
                <div className="bg-cream p-4 rounded-xl mb-6 flex justify-between items-center border border-forest/10">
                   <span className="text-sm font-bold text-gray-700">Total:</span>
                   <span className="text-xl font-bold text-forest">KES {MOCK_MARKET_DATA.find(i => i.id === selectedItem)?.price}</span>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedItem(null)} 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="mpesa" 
                    onClick={confirmPayment} 
                    isLoading={processingPayment}
                    className="flex-1"
                  >
                    Pay Now
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-6">
                 <div className="h-16 w-16 bg-lime/20 border-2 border-lime rounded-full flex items-center justify-center mb-4 text-forest">
                    <CheckIcon />
                 </div>
                 <h3 className="text-xl font-bold text-forest mb-2">Payment Sent!</h3>
                 <p className="text-sm text-gray-600">M-Pesa message will arrive shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

// A lightweight SVG Chart component
const SimpleSparkline = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  // Simulate data points based on trend
  const points = [20, 40, 30, 50, 40, 60, 80]; 
  // Reverse or flatten based on trend for visual effect
  const finalPoints = trend === 'down' ? points.reverse() : points;
  if (trend === 'stable') finalPoints.fill(50);

  const max = Math.max(...finalPoints);
  const min = Math.min(...finalPoints);
  
  // Convert points to SVG coordinate string
  const polylinePoints = finalPoints.map((p, i) => {
    const x = (i / (finalPoints.length - 1)) * 100;
    const y = 100 - ((p - min) / (max - min || 1)) * 80 - 10; // simple normalization
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = trend === 'up' ? '#2d6a4f' : trend === 'down' ? '#EF4444' : '#9CA3AF';
  const fillColor = trend === 'up' ? '#a3d977' : trend === 'down' ? '#FCA5A5' : '#D1D5DB';

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
      {/* Grid lines */}
      <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
      <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
      
      {/* Area under curve */}
      <polygon 
        points={`0,100 ${polylinePoints} 100,100`} 
        fill={fillColor} 
        fillOpacity="0.2" 
      />
      
      {/* The Chart Line */}
      <polyline 
        points={polylinePoints} 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};