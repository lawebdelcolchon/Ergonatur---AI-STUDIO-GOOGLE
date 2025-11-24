import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#111] mt-24 border-t border-gray-200 dark:border-gray-800 text-sm">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-1">
             <a href="#" className="inline-block mb-6">
               <span className="font-black text-2xl tracking-tight text-brand-teal dark:text-white">
                 Ergo<span className="text-primary">natur</span>
               </span>
             </a>
             <p className="text-gray-500 leading-relaxed mb-6">
               Especialistas en sistemas de descanso y mobiliario moderno. Calidad, diseño y confort para tu hogar.
             </p>
             <div className="flex gap-4">
               <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors"><span className="material-symbols-outlined">public</span></a>
               <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors"><span className="material-symbols-outlined">photo_camera</span></a>
             </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Empresa</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Quiénes Somos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Nuestras Tiendas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trabaja con Nosotros</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sostenibilidad</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Ayuda</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Envíos y Entregas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Devoluciones</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Garantía</a></li>
            </ul>
          </div>

          <div>
             <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Newsletter</h3>
             <p className="text-gray-500 mb-4">Suscríbete para recibir novedades y ofertas exclusivas.</p>
             <form className="flex flex-col gap-2">
               <input 
                 type="email" 
                 placeholder="Tu correo electrónico" 
                 className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-brand-teal focus:ring-0 outline-none text-gray-700"
               />
               <button className="w-full px-4 py-2 bg-brand-teal text-white font-bold hover:bg-opacity-90 transition-colors uppercase text-xs tracking-wide">
                 Suscribirse
               </button>
             </form>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© 2024 Ergonatur Sistemas de Descanso S.L. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600">Privacidad</a>
            <a href="#" className="hover:text-gray-600">Términos</a>
            <a href="#" className="hover:text-gray-600">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};