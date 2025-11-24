
import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock User Data
    const mockUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email: email,
      firstName: mode === 'login' ? 'Usuario' : firstName,
      lastName: mode === 'login' ? 'Demo' : lastName,
      address: mode === 'login' ? 'Calle Principal 123' : '',
      city: mode === 'login' ? 'Madrid' : '',
      country: 'ES',
      zipCode: '28001'
    };

    onLogin(mockUser);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a2c2c] rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#333333] dark:text-white mb-2">
              {mode === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === 'login' 
                ? 'Ingresa tus datos para acceder a tu historial' 
                : 'Regístrate para gestionar tus pedidos fácilmente'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nombre</label>
                  <input 
                    type="text" required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                    value={firstName} onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Apellido</label>
                  <input 
                    type="text" required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                    value={lastName} onChange={e => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email</label>
              <input 
                type="email" required
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Contraseña</label>
              <input 
                type="password" required
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#152222] dark:text-gray-200 focus:ring-primary focus:border-primary"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {mode === 'login' ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
              <button 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-primary font-bold hover:underline"
              >
                {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
