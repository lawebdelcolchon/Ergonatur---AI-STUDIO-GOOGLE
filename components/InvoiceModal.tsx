
import React, { useRef } from 'react';
import { Order } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  user?: { firstName: string; lastName: string; email: string; address?: string; city?: string; zipCode?: string; country?: string } | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order, user }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printContents = printContent.innerHTML;
      
      // Create a temporary container for printing to avoid losing event listeners on the main app
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Factura #${order.id}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: 'Inter', sans-serif; padding: 20px; }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContents}
              <script>
                window.onload = function() { window.print(); window.close(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = order.total - subtotal; // Simplified calculation
  const taxRate = 0.21; // 21% IVA
  const taxAmount = subtotal * taxRate;
  const subtotalExTax = subtotal - taxAmount;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Toolbar */}
        <div className="bg-gray-100 p-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="font-bold text-lg">Vista Previa de Factura</h3>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
            >
              <span className="material-symbols-outlined">print</span>
              Imprimir
            </button>
            <button 
              onClick={onClose}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
              Cerrar
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="overflow-y-auto p-8 bg-white" ref={printRef}>
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
               <img 
                 src="https://mueblescantero.com/wp-content/uploads/2018/05/logo-muebles-cantero.png" 
                 alt="Muebles Cantero" 
                 className="h-12 w-auto object-contain mb-4" 
               />
               <p className="text-gray-500 text-sm">
                 Av. del Diseño 123<br/>
                 Ciudad Creativa, 28000<br/>
                 España<br/>
                 CIF: B-12345678
               </p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-black text-gray-800 mb-2">FACTURA</h1>
              <p className="text-gray-600 font-medium">#FAC-{order.id}</p>
              <p className="text-gray-500 text-sm mt-1">Fecha: {new Date(order.date).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Facturar a:</h3>
            <p className="font-bold text-lg text-gray-800">{user ? `${user.firstName} ${user.lastName}` : 'Cliente Invitado'}</p>
            <p className="text-gray-600 text-sm mt-1">
              {order.shippingAddress}<br/>
              {user?.email}
            </p>
            <p className="text-gray-600 text-sm mt-1 capitalize">
              Método de Pago: {order.paymentMethod.replace('_', ' ')}
            </p>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase">Descripción</th>
                <th className="text-center py-3 text-xs font-bold text-gray-500 uppercase">Cant.</th>
                <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase">Precio Unit.</th>
                <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.selectedSize} - {item.selectedLegs}</p>
                  </td>
                  <td className="text-center py-4 text-gray-600">{item.quantity}</td>
                  <td className="text-right py-4 text-gray-600">${item.price.toFixed(2)}</td>
                  <td className="text-right py-4 font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal (sin IVA)</span>
                <span>${subtotalExTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>IVA (21%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Envío</span>
                <span>{shipping <= 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-primary pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center text-gray-400 text-xs border-t border-gray-100 pt-8">
            <p>Gracias por confiar en Muebles Cantero.</p>
            <p>Si tiene alguna duda sobre esta factura, póngase en contacto con soporte@mueblescantero.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
