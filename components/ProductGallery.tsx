import React from 'react';
import { ProductImage } from '../types';

interface ProductGalleryProps {
  images: ProductImage[];
  activeIndex: number;
  onImageSelect: (index: number) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, activeIndex, onImageSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white dark:bg-background-dark rounded-xl min-h-80 aspect-[4/3] border border-gray-100 dark:border-gray-800">
        <img 
          className="w-full h-full object-cover rounded-xl transition-opacity duration-300" 
          src={images[activeIndex].src} 
          alt={images[activeIndex].alt} 
        />
      </div>

      {/* Thumbnails */}
      <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch p-1 gap-3">
          {images.map((img, index) => (
            <div 
              key={index}
              onClick={() => onImageSelect(index)}
              className={`flex h-full flex-1 flex-col gap-4 rounded-lg min-w-24 cursor-pointer transition-all duration-200
                ${activeIndex === index 
                  ? 'border-2 border-primary opacity-100' 
                  : 'border-2 border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img 
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-md flex flex-col object-cover" 
                src={img.src} 
                alt={`Thumbnail ${index + 1}`} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};