
import React, { useState, useEffect } from 'react';
import { Product, CartItem, WishlistItem } from '../types';
import { ReviewModal } from './ReviewModal';

interface ProductInfoProps {
  product: Product;
  selectedColor: string;
  isFavorite?: boolean;
  onColorChange: (color: string) => void;
  onAddToCart: (item: Omit<CartItem, 'uniqueId'>) => void;
  onToggleFavorite?: (item: WishlistItem) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ 
  product, 
  selectedColor, 
  isFavorite = false,
  onColorChange, 
  onAddToCart,
  onToggleFavorite
}) => {
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  
  // Controlled states for selects
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedLegs, setSelectedLegs] = useState<string>('');
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Initialize defaults when product loads
  useEffect(() => {
    if (product.sizes.length > 0) setSelectedSize(product.sizes[0]);
    if (product.legsOptions.length > 0) setSelectedLegs(product.legsOptions[0]);
  }, [product]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleAddToCartClick = () => {
    // Find the image associated with the selected color, or default to the first image
    const activeImage = product.images.find(img => img.associatedColor === selectedColor) || product.images[0];

    onAddToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: activeImage.src,
      quantity: quantity,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      selectedLegs: selectedLegs,
    });
    
    // Optional: Reset quantity after adding
    setQuantity(1);
  };

  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      // Create simplified item for wishlist
      const item: WishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0].src
      };
      onToggleFavorite(item);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#333333] dark:text-gray-100 text-4xl font-black leading-tight tracking-[-0.033em]">
          {product.name}
        </h1>
        
        {/* Rating Clickable Area */}
        <button 
          onClick={() => setIsReviewModalOpen(true)}
          className="w-fit flex items-center gap-4 group cursor-pointer transition-opacity hover:opacity-80"
          aria-label="Ver reseñas"
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map(i => (
              <span key={i} className="material-symbols-outlined text-yellow-500 material-symbols-filled group-hover:scale-110 transition-transform">star</span>
            ))}
            <span className="material-symbols-outlined text-yellow-500 group-hover:scale-110 transition-transform">star_half</span>
            <span className="text-sm text-[#888888] ml-1 underline-offset-4 group-hover:underline group-hover:text-primary transition-colors">
              ({product.reviewCount} reseñas)
            </span>
          </div>
        </button>

        <p className="text-[#333333] dark:text-gray-300 mt-2">
          {product.description}
        </p>
      </div>

      {/* Customization Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#333333] dark:text-gray-200 mb-2">
            Color: <span className="font-medium">Seleccionar</span>
          </h3>
          <div className="flex items-center gap-3">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`size-8 rounded-full ring-offset-2 dark:ring-offset-background-dark transition-all duration-200
                  ${selectedColor === color ? 'ring-2 ring-primary' : 'hover:ring-2 ring-primary/50'}`}
                style={{ backgroundColor: color }}
                aria-label={`Seleccionar color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-[#333333] dark:text-gray-200 mb-2 block" htmlFor="legs">
              Patas
            </label>
            <select 
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#1a2c2c] dark:text-gray-200 focus:border-primary focus:ring-primary" 
              id="legs"
              value={selectedLegs}
              onChange={(e) => setSelectedLegs(e.target.value)}
            >
              {product.legsOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-[#333333] dark:text-gray-200 mb-2 block" htmlFor="size">
              Tamaño
            </label>
            <select 
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#1a2c2c] dark:text-gray-200 focus:border-primary focus:ring-primary" 
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div>
        <label className="text-sm font-bold text-[#333333] dark:text-gray-200 mb-2 block">
          Tipo de Envío
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShippingMethod('standard')}
            className={`flex flex-col items-start p-3 rounded-lg border transition-all duration-200 text-left relative
              ${shippingMethod === 'standard' 
                ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'}`}
          >
            <div className="flex justify-between w-full items-center">
                <span className="text-sm font-bold text-[#333333] dark:text-gray-200">Estándar</span>
                {shippingMethod === 'standard' && <span className="material-symbols-outlined text-primary text-base">check_circle</span>}
            </div>
            <span className="text-xs text-[#888888] mt-1">Gratis • 5-7 días</span>
          </button>
          <button
            onClick={() => setShippingMethod('express')}
            className={`flex flex-col items-start p-3 rounded-lg border transition-all duration-200 text-left relative
              ${shippingMethod === 'express' 
                ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'}`}
          >
             <div className="flex justify-between w-full items-center">
                <span className="text-sm font-bold text-[#333333] dark:text-gray-200">Express</span>
                {shippingMethod === 'express' && <span className="material-symbols-outlined text-primary text-base">check_circle</span>}
             </div>
            <span className="text-xs text-[#888888] mt-1">$25.00 • 1-2 días</span>
          </button>
        </div>
      </div>

      <div>
        <p className="text-3xl font-black text-black dark:text-white">${product.price.toFixed(2)}</p>
      </div>

      {/* CTA Block */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
          <button 
            onClick={() => handleQuantityChange(-1)}
            className="px-3 py-2 text-[#888888] dark:text-gray-400 hover:text-primary transition-colors"
          >
            -
          </button>
          <input 
            className="w-12 text-center border-0 bg-transparent focus:ring-0 p-0 text-[#333333] dark:text-gray-200" 
            type="text" 
            value={quantity} 
            readOnly
          />
          <button 
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-2 text-[#888888] dark:text-gray-400 hover:text-primary transition-colors"
          >
            +
          </button>
        </div>
        <button 
          onClick={handleAddToCartClick}
          className="flex-1 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-black leading-normal tracking-[0.015em] min-w-0 px-6 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
          <span>Añadir al Carrito</span>
        </button>
        <button 
           onClick={handleFavoriteClick}
           className={`flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 w-12 border transition-colors
           ${isFavorite 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-500' 
              : 'border-gray-300 dark:border-gray-600 text-[#333333] dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'}`}
        >
          <span className={`material-symbols-outlined ${isFavorite ? 'material-symbols-filled' : ''}`}>
             favorite
          </span>
        </button>
      </div>

      {/* Accordion */}
      <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        {[
          { key: 'description', label: 'Descripción' },
          { key: 'specifications', label: 'Especificaciones' },
          { key: 'shipping', label: 'Envío y Devoluciones' }
        ].map((section) => {
           const isOpen = expandedSection === section.key;

           return (
            <div key={section.key} className={`${section.key !== 'description' ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}>
              <button 
                onClick={() => toggleSection(section.key)}
                className="w-full flex justify-between items-center py-3 text-left font-bold text-[#333333] dark:text-gray-200 hover:text-primary transition-colors"
              >
                <span>{section.label}</span>
                <span className={`material-symbols-outlined transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-3' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-[#333333] dark:text-gray-300 text-sm leading-relaxed">
                  {section.key === 'description' && (product.description || "Este mueble combina elegancia moderna con comodidad. Diseñado pensando en el estilo y la funcionalidad, su silueta invita al descanso.")}
                  {section.key === 'specifications' && "Dimensiones: 80cm Al x 70cm An x 75cm Pr. Material: Terciopelo 100% Poliéster, Patas de Roble Macizo. Peso Máximo: 130 kg. Requiere Ensamblaje: Sí (Solo patas)."}
                  {section.key === 'shipping' && "Envío gratuito en pedidos superiores a $500. Se aceptan devoluciones dentro de los 30 días posteriores a la entrega."}
                </p>
              </div>
            </div>
           );
        })}
      </div>
      
      {/* Modal Integration */}
      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productName={product.name}
        rating={product.rating}
        reviewCount={product.reviewCount}
      />
    </div>
  );
};