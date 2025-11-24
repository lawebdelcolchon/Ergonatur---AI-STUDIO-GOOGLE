
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (uniqueId: string, delta: number) => void;
  onRemoveItem: (uniqueId: string) => void;
  onCheckout: () => void;
  onNavigateToProduct: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout,
  onNavigateToProduct
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleProductClick = (productId: string) => {
    onClose();
    onNavigateToProduct(productId);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-[#1a2c2c] shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-black text-[#333333] dark:text-white">Tu Carrito ({cartItems.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <span className="material-symbols-outlined text-6xl mb-4">production_quantity_limits</span>
              <p className="font-medium">Tu carrito está vacío</p>
              <button onClick={onClose} className="mt-4 text-primary font-bold hover:underline">Continuar comprando</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.uniqueId} className="flex gap-4 animate-fadeIn group">
                <div 
                  onClick={() => handleProductClick(item.productId)}
                  className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 
                        onClick={() => handleProductClick(item.productId)}
                        className="font-bold text-sm text-[#333333] dark:text-gray-200 line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                      >
                        {item.name}
                      </h3>
                      <button onClick={() => onRemoveItem(item.uniqueId)} className="text-gray-400 hover:text-red-500">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.selectedSize} • {item.selectedLegs}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Color:</span>
                      <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.selectedColor }}></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md h-8">
                      <button 
                        onClick={() => onUpdateQuantity(item.uniqueId, -1)}
                        className="px-2 text-gray-500 hover:text-primary disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-6 text-center dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.uniqueId, 1)}
                        className="px-2 text-gray-500 hover:text-primary"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#152222]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-xl font-black text-[#333333] dark:text-white">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-6 text-center">Impuestos y envío calculados en el pago</p>
            <button 
              onClick={onCheckout}
              className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Proceder al Pago</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
