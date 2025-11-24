import React, { useState, useEffect } from 'react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  startIndex?: number;
  productName?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  images, 
  startIndex = 0,
  productName = "Vista Previa"
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, startIndex]);

  if (!isOpen) return null;

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Content */}
      <div className="relative w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/10 to-transparent">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white hidden sm:block">{productName}</h3>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </span>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors text-gray-800"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Image Area */}
        <div className="flex-1 flex items-center justify-center relative px-4 sm:px-16 py-4">
          <button 
            onClick={prev}
            className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-800 hover:scale-110 transition-transform"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <img 
            src={images[currentIndex]} 
            alt={`View ${currentIndex + 1}`} 
            className="max-h-full max-w-full object-contain drop-shadow-2xl animate-fadeIn"
          />

          <button 
            onClick={next}
            className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-800 hover:scale-110 transition-transform"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Thumbnails Footer */}
        <div className="h-24 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 flex items-center justify-center gap-2 px-4 overflow-x-auto z-20">
          {images.map((img, idx) => (
            <button 
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 transition-all duration-200 
                ${idx === currentIndex 
                  ? 'ring-2 ring-primary opacity-100 scale-105' 
                  : 'opacity-50 hover:opacity-100 hover:scale-105'}`}
            >
              <img src={img} className="w-full h-full object-cover" alt="thumb" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};