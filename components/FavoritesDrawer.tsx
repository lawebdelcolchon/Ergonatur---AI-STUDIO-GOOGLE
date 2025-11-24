
import React from 'react';
import { WishlistItem, CartItem } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: WishlistItem[];
  onRemoveFavorite: (id: string) => void;
  onAddToCart: (item: Omit<CartItem, 'uniqueId'>) => void;
  onNavigateToProduct: (productId: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({ 
  isOpen, 
  onClose, 
  favorites, 
  onRemoveFavorite,
  onAddToCart,
  onNavigateToProduct
}) => {
  
  const handleMoveToCart = (item: WishlistItem) => {
    // Add to cart with default options
    onAddToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      selectedColor: '#000000', // Default, user might change later
      selectedSize: 'Estándar',
      selectedLegs: 'Estándar'
    });
    onRemoveFavorite(item.id); // Optional: remove from favorites after adding to cart
  };

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
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#152222]">
          <div className="flex items-center gap-2">
             <span className="material-symbols-outlined text-red-500 material-symbols-filled">favorite</span>
             <h2 className="text-xl font-black text-[#333333] dark:text-white">Mis Favoritos ({favorites.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">heart_broken</span>
              <p className="font-medium text-lg">Tu lista de deseos está vacía</p>
              <p className="text-sm text-gray-500 mt-2">Guarda los productos que te encantan para comprarlos más tarde.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-colors">
                Explorar productos
              </button>
            </div>
          ) : (
            favorites.map((item) => (
              <div key={item.id} className="flex gap-4 animate-fadeIn group">
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative cursor-pointer" onClick={() => handleProductClick(item.id)}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemoveFavorite(item.id); }}
                    className="absolute top-1 right-1 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div onClick={() => handleProductClick(item.id)} className="cursor-pointer">
                    <h3 className="font-bold text-[#333333] dark:text-gray-200 leading-tight hover:text-primary transition-colors">{item.name}</h3>
                    <p className="font-black text-lg text-primary mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-bold hover:border-primary hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">shopping_cart</span>
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
           <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#152222]">
              <button 
                onClick={onClose}
                className="w-full py-3 rounded-lg bg-white dark:bg-[#1a2c2c] border border-gray-200 dark:border-gray-600 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Seguir Mirando
              </button>
           </div>
        )}
      </div>
    </>
  );
};
