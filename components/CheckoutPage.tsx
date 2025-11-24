
import React, { useState, useEffect } from 'react';
import { CartItem, CheckoutFormData, PaymentMethod, User } from '../types';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onBackToShop: () => void;
  onPlaceOrder: (orderData: any) => void;
  user: User | null;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, onBackToShop, onPlaceOrder, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    identityDocument: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'ES',
    paymentMethod: 'credit_card',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvc: '',
    bizumPhone: ''
  });

  // Pre-fill data if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
        country: user.country || 'ES',
      }));
    }
  }, [user]);

  const isPickup = formData.paymentMethod === 'pickup';
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Shipping is 0 if pickup is selected, otherwise standard rules apply
  const shipping = isPickup ? 0 : (subtotal > 500 ? 0 : 25);
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Wait a moment before clearing cart (handled by parent)
    setTimeout(() => {
      onPlaceOrder({
        total: total,
        items: [...cartItems],
        shippingAddress: isPickup ? 'Retiro en Tienda' : `${formData.address}, ${formData.city}`,
        paymentMethod: formData.paymentMethod
      });
    }, 3500); // Slightly longer delay to read the success message
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
        </div>
        <h2 className="text-3xl font-black text-[#333333] dark:text-white mb-2">¡Pedido Confirmado!</h2>
        <div className="bg-gray-50 dark:bg-[#1a2c2c] p-4 rounded-lg max-w-md mb-6 border border-gray-200 dark:border-gray-700">
           <p className="text-gray-800 dark:text-white font-bold mb-2 flex items-center justify-center gap-2">
             <span className="material-symbols-outlined text-primary">receipt_long</span>
             Factura Generada Correctamente
           </p>
           <p className="text-sm text-gray-500">
             Hemos generado la factura #FAC-{Math.floor(Math.random() * 10000)} automáticamente.
             Podrás descargarla en tu área de cliente.
           </p>
        </div>
        <p className="text-gray-500 mb-8 max-w-md">
          {formData.paymentMethod === 'pickup' 
            ? `Gracias ${formData.firstName}. Recibirás una notificación cuando tu pedido esté listo para retirar.`
            : `Gracias por tu compra, ${formData.firstName}. Te notificaremos cada cambio de estado en tu envío.`
          }
        </p>
        <button 
          disabled
          className="px-8 py-3 bg-gray-200 text-gray-500 font-bold rounded-lg cursor-wait flex items-center gap-2"
        >
          <span className="material-symbols-outlined animate-spin text-sm">sync</span>
          Redirigiendo a tu cuenta...
        </button>
      </div>
    );
  }

  const paymentMethods: { id: PaymentMethod; label: string; icon: string }[] = [
    { id: 'credit_card', label: 'Tarjeta', icon: 'credit_card' },
    { id: 'paypal', label: 'PayPal', icon: 'account_balance_wallet' }, 
    { id: 'bizum', label: 'Bizum', icon: 'smartphone' },
    { id: 'cod', label: 'Contra Entrega', icon: 'payments' },
    { id: 'pickup', label: 'Retiro en Local', icon: 'store' },
  ];

  return (
    <div className="animate-fadeIn pb-20">
      <div className="mb-8 flex items-center gap-2">
        <button 
          onClick={onBackToShop}
          className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver
        </button>
        <h1 className="text-2xl font-black text-[#333333] dark:text-white ml-4">Finalizar Compra</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-8">
          <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Contact Info */}
            <section className="bg-white dark:bg-[#1a2c2c] p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold text-[#333333] dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </section>

            {/* Address Info */}
            <section className="bg-white dark:bg-[#1a2c2c] p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold text-[#333333] dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                {isPickup ? 'Datos Personales' : 'Dirección de Envío y Facturación'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nombre</label>
                  <input 
                    type="text" name="firstName" required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                    value={formData.firstName} onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Apellidos</label>
                  <input 
                    type="text" name="lastName" required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                    value={formData.lastName} onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">DNI / Identificación (Para Factura)</label>
                  <input 
                    type="text" name="identityDocument" required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                    value={formData.identityDocument} onChange={handleInputChange}
                    placeholder="Documento de identidad"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Dirección</label>
                  <input 
                    type="text" name="address" required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                    value={formData.address} onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Ciudad</label>
                  <input 
                    type="text" name="city" required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                    value={formData.city} onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Código Postal</label>
                  <input 
                    type="text" name="zipCode" required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                    value={formData.zipCode} onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">País</label>
                   <select 
                      name="country" 
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                      value={formData.country} onChange={handleInputChange}
                   >
                      <option value="ES">España</option>
                      <option value="MX">México</option>
                      <option value="AR">Argentina</option>
                      <option value="CO">Colombia</option>
                      <option value="US">Estados Unidos</option>
                   </select>
                </div>
              </div>
            </section>

            {/* Payment Method Selection */}
            <section className="bg-white dark:bg-[#1a2c2c] p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold text-[#333333] dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
                Método de Pago
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => handlePaymentMethodChange(method.id)}
                    className={`cursor-pointer rounded-lg border p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200
                      ${formData.paymentMethod === method.id 
                        ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'}`}
                  >
                    <span className="material-symbols-outlined text-2xl">{method.icon}</span>
                    <span className="text-xs font-bold text-center">{method.label}</span>
                  </div>
                ))}
              </div>

              {/* Conditional Payment Fields */}
              <div className="animate-fadeIn bg-gray-50 dark:bg-[#152222] p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                
                {formData.paymentMethod === 'credit_card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="md:col-span-2 flex items-center gap-2 mb-2">
                       <span className="material-symbols-outlined text-gray-400">lock</span>
                       <span className="text-xs text-gray-500">Transacción encriptada de extremo a extremo.</span>
                     </div>
                     <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nombre en la Tarjeta</label>
                      <input 
                        type="text" name="cardName" required
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#1a2c2c] dark:text-gray-200 focus:ring-primary focus:border-primary"
                        value={formData.cardName} onChange={handleInputChange}
                      />
                     </div>
                     <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Número de Tarjeta</label>
                      <div className="relative">
                        <input 
                          type="text" name="cardNumber" required placeholder="0000 0000 0000 0000"
                          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#1a2c2c] dark:text-gray-200 focus:ring-primary focus:border-primary pl-10"
                          value={formData.cardNumber} onChange={handleInputChange}
                        />
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">credit_card</span>
                      </div>
                     </div>
                     <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Expiración</label>
                      <input 
                        type="text" name="expDate" required placeholder="MM/AA"
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#1a2c2c] dark:text-gray-200 focus:ring-primary focus:border-primary"
                        value={formData.expDate} onChange={handleInputChange}
                      />
                     </div>
                     <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">CVC</label>
                      <input 
                        type="text" name="cvc" required placeholder="123"
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#1a2c2c] dark:text-gray-200 focus:ring-primary focus:border-primary"
                        value={formData.cvc} onChange={handleInputChange}
                      />
                     </div>
                  </div>
                )}

                {formData.paymentMethod === 'paypal' && (
                  <div className="flex flex-col items-center text-center py-4">
                    <span className="material-symbols-outlined text-4xl text-[#003087] mb-2">account_balance_wallet</span>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Serás redirigido a PayPal para completar tu compra de forma segura.</p>
                    <span className="text-xs text-gray-500">Puedes pagar con tu saldo PayPal o tarjeta vinculada.</span>
                  </div>
                )}

                {formData.paymentMethod === 'bizum' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="material-symbols-outlined text-primary">smartphone</span>
                       <p className="text-sm text-gray-600 dark:text-gray-300">Introduce tu número de móvil asociado a Bizum.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Teléfono Móvil</label>
                      <input 
                        type="tel" name="bizumPhone" required
                        placeholder="+34 600 000 000"
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#1a2c2c] dark:text-gray-200 focus:ring-primary focus:border-primary"
                        value={formData.bizumPhone} onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'cod' && (
                  <div className="flex flex-col items-center text-center py-4 gap-2">
                    <span className="material-symbols-outlined text-4xl text-green-600">payments</span>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">Pago Contra Entrega</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                      Pagarás en efectivo al repartidor cuando recibas tu pedido en la dirección indicada.
                    </p>
                  </div>
                )}

                {formData.paymentMethod === 'pickup' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1a2c2c] rounded border border-gray-200 dark:border-gray-600">
                      <span className="material-symbols-outlined text-primary mt-1">store</span>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800 dark:text-white">Muebles Cantero - Tienda Central</h4>
                        <p className="text-xs text-gray-500 mt-1">Av. del Diseño 123, Ciudad Creativa.</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Sin gastos de envío. Listo en 24 horas.
                    </p>
                  </div>
                )}

              </div>
            </section>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 dark:bg-[#223636] p-6 rounded-xl sticky top-24">
            <h3 className="text-lg font-bold text-[#333333] dark:text-white mb-6">Resumen del Pedido</h3>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.uniqueId} className="flex gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0 bg-white">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-[#333333] dark:text-gray-200">{item.name}</span>
                      <span className="font-medium text-gray-600 dark:text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="text-gray-500 text-xs">
                       Cant: {item.quantity} | {item.selectedSize} | {item.selectedLegs}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Envío</span>
                {isPickup ? (
                   <span className="text-green-600 font-bold">Retiro en Tienda (GRATIS)</span>
                ) : (
                   <span>{shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}</span>
                )}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                <span className="text-lg font-black text-[#333333] dark:text-white">Total</span>
                <span className="text-xl font-black text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full mt-6 bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">
                    {formData.paymentMethod === 'cod' ? 'payments' : 'lock'}
                  </span>
                  <span>
                    {formData.paymentMethod === 'cod' 
                      ? 'Confirmar Pedido' 
                      : `Pagar $${total.toFixed(2)}`
                    }
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
