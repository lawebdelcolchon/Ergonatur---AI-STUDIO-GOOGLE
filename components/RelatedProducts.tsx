import React from 'react';
import { RelatedProduct } from '../types';

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold text-[#333333] dark:text-gray-100 mb-6">También te podría gustar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col gap-3 group cursor-pointer">
            <div className="overflow-hidden rounded-lg relative">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
              <img 
                className="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" 
                src={product.image} 
                alt={product.name} 
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-[#333333] dark:text-gray-200 group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-primary font-semibold">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};