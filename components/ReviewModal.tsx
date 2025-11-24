
import React from 'react';
import { Review } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  rating: number;
  reviewCount: number;
}

// Mock data for positive reviews
const positiveReviews: Review[] = [
  {
    id: '1',
    author: 'María García',
    rating: 5,
    date: 'Hace 2 días',
    title: '¡Me encanta este sofá!',
    content: 'La calidad de la tela es impresionante, mucho más suave de lo que esperaba. El color verde es profundo y elegante, exactamente como en las fotos. El envío fue muy rápido y los repartidores muy amables.',
    avatar: 'MG',
    verified: true
  },
  {
    id: '2',
    author: 'Carlos Ruiz',
    rating: 5,
    date: 'Hace 1 semana',
    title: 'Diseño y comodidad',
    content: 'Buscaba algo moderno pero cómodo para mi sala y este sillón cumplió con todo. El asiento es firme pero acogedor. Muy fácil de montar las patas. 100% recomendado.',
    verified: true
  },
  {
    id: '3',
    author: 'Ana P.',
    rating: 4,
    date: 'Hace 2 semanas',
    title: 'Excelente relación calidad-precio',
    content: 'Por el precio, no creo que encuentres nada mejor. Se ve muy lujoso. Le doy 4 estrellas solo porque la caja llegó un poco golpeada, pero el producto estaba intacto.',
    avatar: 'AP',
    verified: true
  },
  {
    id: '4',
    author: 'Javier Mendez',
    rating: 5,
    date: 'Hace 3 semanas',
    title: 'Servicio impecable',
    content: 'Tuve dudas con el tamaño y el servicio al cliente me ayudó al instante. El mueble llegó antes de lo previsto. Queda perfecto en mi estudio.',
    verified: false
  }
];

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, productName, rating, reviewCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a2c2c] rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50 dark:bg-[#223636]">
          <div>
            <h2 className="text-xl font-black text-[#333333] dark:text-white mb-1">Reseñas de Clientes</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Opiniones destacadas sobre <span className="font-bold">{productName}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Overall Rating Summary */}
        <div className="px-6 py-4 bg-white dark:bg-[#1a2c2c] border-b border-gray-100 dark:border-gray-700 flex items-center gap-6">
          <div className="flex flex-col items-center justify-center px-4 border-r border-gray-100 dark:border-gray-700">
             <span className="text-4xl font-black text-[#333333] dark:text-white">{rating}</span>
             <div className="flex text-yellow-400 text-sm">
               {[1, 2, 3, 4, 5].map(star => (
                 <span key={star} className="material-symbols-outlined material-symbols-filled text-[16px]">star</span>
               ))}
             </div>
             <span className="text-xs text-gray-400 mt-1">{reviewCount} reseñas</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-green-600 mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">thumb_up</span>
              98% Recomienda este producto
            </div>
            <p className="text-xs text-gray-500">Basado en las opiniones de compradores verificados.</p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {positiveReviews.map((review) => (
            <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
              <div className="flex-shrink-0">
                {review.avatar ? (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {review.avatar}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-[#333333] dark:text-white text-sm">{review.author}</h4>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400 text-xs">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined material-symbols-filled text-[14px]">star</span>
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-[10px] text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[10px]">check_circle</span> Compra Verificada
                    </span>
                  )}
                </div>
                <h5 className="font-bold text-sm text-[#333333] dark:text-gray-200 mb-1">{review.title}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">"{review.content}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#223636] border-t border-gray-100 dark:border-gray-700 text-center">
          <button className="text-primary text-sm font-bold hover:underline">
            Ver todas las {reviewCount} reseñas
          </button>
        </div>
      </div>
    </div>
  );
};