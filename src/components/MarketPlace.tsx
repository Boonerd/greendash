import React, { useState } from 'react';
import { MOCK_MARKET_DATA, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface MarketPlaceProps {
  lang: Language;
}

export const MarketPlace: React.FC<MarketPlaceProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
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
      <h2 className="text-2xl font-bold text-forest dark:text-cream mb-4">{t.market}</h2>
      
      <div className="grid gap-4">
        {MOCK_MARKET_DATA.map((item) => (
          <div key={item.id} className="bg-white dark:bg-forest-light/20 p-4 rounded-xl shadow-sm border border-forest/5 dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-forest dark:text-cream text-lg">{item.name[lang]}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                KES {item.price} / {item.unit}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
                item.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                item.trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {item.trend === 'up' && <TrendingUp size={12} />}
                {item.trend === 'down' && <TrendingDown size={12} />}
                {item.trend === 'stable' && <Minus size={12} />}
                {item.change}
              </div>
              <Button 
                variant="outline" 
                className="!py-1 !px-3 text-xs !rounded-lg h-8"
                onClick={() => handleBuy(item.id)}
              >
                Buy
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-forest-dark border border-gray-200 dark:border-gray-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            {!paymentSuccess ? (
              <>
                <h3 className="text-xl font-bold mb-2 text-forest dark:text-cream">{t.mpesa_pay}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  Complete purchase for {MOCK_MARKET_DATA.find(i => i.id === selectedItem)?.name[lang]}.
                </p>
                <div className="bg-gray-100 dark:bg-black/30 p-3 rounded-lg mb-6 flex justify-between items-center">
                   <span className="text-sm font-medium">Total:</span>
                   <span className="text-lg font-bold text-forest dark:text-lime">KES {MOCK_MARKET_DATA.find(i => i.id === selectedItem)?.price}</span>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedItem(null)} className="flex-1">
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
                 <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                    <CheckIcon />
                 </div>
                 <h3 className="text-xl font-bold text-forest dark:text-cream mb-2">Payment Sent!</h3>
                 <p className="text-sm text-gray-500">M-Pesa message will arrive shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promo Card */}
      <div className="bg-gradient-to-r from-forest to-forest-light text-cream p-6 rounded-2xl shadow-xl mt-8">
        <h3 className="text-lg font-bold mb-2">Premium Market Insights</h3>
        <p className="text-sm opacity-90 mb-4">Get weekly SMS alerts for coffee auction prices in Nairobi.</p>
        <button className="flex items-center gap-2 text-sm font-bold text-lime hover:text-white transition-colors">
          Subscribe (KES 50/mo) <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);