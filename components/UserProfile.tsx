
import React, { useState } from 'react';
import { User, Order, CartItem } from '../types';
import { InvoiceModal } from './InvoiceModal';

interface UserProfileProps {
  user: User;
  orders: Order[];
  onLogout: () => void;
  onBackToShop: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, orders, onLogout, onBackToShop }) => {
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Invoice Modal State
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const handleOpenInvoice = (order: Order) => {
    setSelectedOrderForInvoice(order);
    setIsInvoiceOpen(true);
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { id: 'pending', label: 'Confirmado' },
      { id: 'processing', label: 'Procesando' },
      { id: 'shipped', label: 'Enviado' },
      { id: 'delivered', label: 'Entregado' }
    ];
    
    // Cancelled handles differently
    if (currentStatus === 'cancelled') return { steps, activeIndex: -1, isCancelled: true };

    const activeIndex = steps.findIndex(s => s.id === currentStatus);
    return { steps, activeIndex: activeIndex === -1 ? 0 : activeIndex, isCancelled: false };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pending': return 'text-gray-600 bg-gray-100 dark:bg-white/10';
      case 'processing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'shipped': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const openReviewModal = (item: CartItem) => {
    setSelectedProduct(item);
    setRating(0);
    setReviewComment('');
    setShowSuccessMessage(false);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccessMessage(true);

    // Close modal after success
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setShowSuccessMessage(false);
      setSelectedProduct(null);
    }, 2000);
  };

  return (
    <div className="animate-fadeIn pb-20 relative">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBackToShop}
            className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Tienda
          </button>
          <h1 className="text-2xl font-black text-[#333333] dark:text-white ml-4">Mi Cuenta</h1>
        </div>
        <button 
          onClick={onLogout}
          className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-lg transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1a2c2c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-24">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl font-black mb-4">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-[#333333] dark:text-white">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Dirección Principal</p>
                <p className="text-sm text-[#333333] dark:text-gray-300 mt-1">
                  {user.address || 'No registrada'}<br/>
                  {user.city} {user.zipCode}<br/>
                  {user.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-[#333333] dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">history</span>
            Historial de Pedidos
          </h3>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-[#1a2c2c] rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">shopping_bag</span>
              <p className="text-gray-500 font-medium">Aún no tienes pedidos.</p>
              <button onClick={onBackToShop} className="mt-4 text-primary font-bold hover:underline">
                Empezar a comprar
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const { steps, activeIndex, isCancelled } = getStatusSteps(order.status);

              return (
              <div key={order.id} className="bg-white dark:bg-[#1a2c2c] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
                {/* Order Header */}
                <div className="bg-gray-50 dark:bg-[#223636] p-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:gap-6">
                    <div>
                      <span className="text-xs text-gray-500 uppercase block">Pedido #</span>
                      <span className="font-bold text-[#333333] dark:text-white text-sm">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase block">Fecha</span>
                      <span className="font-medium text-[#333333] dark:text-gray-300 text-sm">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase block">Total</span>
                      <span className="font-bold text-[#333333] dark:text-white text-sm">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleOpenInvoice(order)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#1a2c2c] border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">description</span>
                      Factura
                    </button>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                      {order.status === 'pending' ? 'Pendiente' : order.status === 'processing' ? 'Procesando' : order.status === 'shipped' ? 'Enviado' : order.status === 'delivered' ? 'Entregado' : 'Cancelado'}
                    </span>
                  </div>
                </div>

                {/* Status Stepper */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  {isCancelled ? (
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-lg text-sm font-bold text-center">
                      Este pedido ha sido cancelado.
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-between w-full">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 -translate-y-1/2 rounded-full"></div>
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                        style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                      ></div>
                      
                      {steps.map((step, idx) => {
                        const isCompleted = idx <= activeIndex;
                        return (
                          <div key={step.id} className="flex flex-col items-center bg-white dark:bg-[#1a2c2c] px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 z-10
                              ${isCompleted 
                                ? 'bg-primary border-primary text-white' 
                                : 'bg-white dark:bg-[#1a2c2c] border-gray-300 dark:border-gray-600 text-gray-400'}`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {idx < activeIndex ? 'check' : (idx === activeIndex ? 'radio_button_checked' : 'radio_button_unchecked')}
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold mt-2 uppercase tracking-wide ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex gap-4 items-center flex-1">
                          <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-[#333333] dark:text-gray-200 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500">x{item.quantity} {item.selectedSize !== 'Estándar' ? `| ${item.selectedSize}` : ''}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
                          
                          {/* Review Button - Only if delivered */}
                          {order.status === 'delivered' && (
                            <button 
                              onClick={() => openReviewModal(item)}
                              className="px-3 py-1.5 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all"
                            >
                              Escribir Reseña
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsReviewModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1a2c2c] rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <button 
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {showSuccessMessage ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-green-600">check</span>
                </div>
                <h3 className="text-xl font-black text-[#333333] dark:text-white mb-2">¡Gracias por tu opinión!</h3>
                <p className="text-gray-500">Tu reseña ha sido enviada correctamente y ayuda a otros usuarios.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                     <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Valorando</span>
                    <h3 className="font-bold text-[#333333] dark:text-white text-lg">{selectedProduct.name}</h3>
                  </div>
                </div>

                <div className="flex flex-col items-center py-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">¿Qué te pareció el producto?</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <span className={`material-symbols-outlined text-4xl ${(hoverRating || rating) >= star ? 'text-yellow-400 material-symbols-filled' : 'text-gray-300 dark:text-gray-600'}`}>
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-primary mt-1 h-4">
                    {rating === 1 && "Malo"}
                    {rating === 2 && "Regular"}
                    {rating === 3 && "Bueno"}
                    {rating === 4 && "Muy Bueno"}
                    {rating === 5 && "Excelente"}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tu Opinión</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Comparte detalles sobre la calidad, el diseño o tu experiencia..."
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary p-3 text-sm resize-none"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="mt-2 w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Enviar Reseña'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <InvoiceModal 
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          order={selectedOrderForInvoice}
          user={user}
        />
      )}
    </div>
  );
};
