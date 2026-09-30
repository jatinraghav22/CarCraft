import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/currency';
import { handleImageError } from '../utils/imageFallback';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 0 ? (subtotal > 3000 ? 0 : 150) : 0;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      onClearCart();
      setCheckoutComplete(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-md bg-[#0d1015] border-l border-white/10 h-full flex flex-col justify-between p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#bef264]" />
            <h3 className="font-display font-extrabold text-lg text-white uppercase tracking-wider">
              YOUR CART ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {checkoutComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <CheckCircle2 size={54} className="text-[#bef264] animate-bounce" />
            <h4 className="text-2xl font-display font-black text-white uppercase tracking-tight">
              ORDER CONFIRMED
            </h4>
            <p className="text-xs font-mono text-[#bef264]">
              ORDER ID: ORD-{Math.floor(1000 + Math.random() * 9000)}
            </p>
            <p className="text-xs text-slate-300 font-body">
              Your performance hardware has been dispatched to our priority dispatch queue. Tracking telemetry has been sent to your email.
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <ShoppingBag size={48} className="text-slate-600" />
            <p className="text-sm font-mono text-slate-400 uppercase tracking-wider">
              YOUR CART IS CURRENTLY EMPTY
            </p>
            <p className="text-xs text-slate-500 max-w-xs">
              Explore our performance hardware, carbon aerodynamics, and forged wheels.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {cartItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/5"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  onError={handleImageError}
                  className="w-16 h-16 rounded-lg object-cover bg-black"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-display font-bold text-white truncate">
                    {item.name}
                  </h5>
                  <span className="text-[10px] font-mono text-[#bef264]">
                    {formatINR(item.price)}
                  </span>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center text-xs hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono text-white px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center text-xs hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer & Checkout */}
        {cartItems.length > 0 && !checkoutComplete && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="space-y-1.5 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="text-white">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>ESTIMATED TAX</span>
                <span className="text-white">{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>SECURE FREIGHT</span>
                <span className="text-[#bef264]">
                  {shipping === 0 ? 'FREE (VIP TIER)' : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white">
                <span>TOTAL</span>
                <span className="text-[#bef264]">{formatINR(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl bg-[#bef264] hover:bg-[#ccff00] text-black font-display font-extrabold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(190,242,100,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              PROCEED TO SECURE CHECKOUT
              <ArrowRight size={15} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
