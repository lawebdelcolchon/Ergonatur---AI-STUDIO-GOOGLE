
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';

interface CatalogPageProps {
  initialCategory?: string | null;
  onNavigateToProduct: (productId: string) => void;
  onBackToShop: () => void;
}

const API_URL = 'https://decorlujo.com/server_api/api/products';
const API_KEY = '9c70933aff6b2a6d08c687a6cbb6b765';

export const CatalogPage: React.FC<CatalogPageProps> = ({ initialCategory, onNavigateToProduct, onBackToShop }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter drawer

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ min: 0, max: 2000 });
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);

  // Derived options for filters
  const materialsOptions = ['Madera', 'Metal', 'Terciopelo', 'Tela', 'Roble', 'Cristal', 'Viscoelástica'];
  const dimensionsOptions = ['90 cm', '105 cm', '135 cm', '150 cm', '160 cm', '180 cm', '200 cm'];
  const categoriesOptions = ['Cabeceros', 'Mesitas', 'Colchones', 'Sofás', 'Espejos', 'Accesorios'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
     if (initialCategory) {
         const matched = categoriesOptions.find(c => c.toLowerCase().includes(initialCategory.toLowerCase()));
         if (matched) setSelectedCategories([matched]);
     }
  }, [initialCategory]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const rawProducts = Array.isArray(data) ? data : (data.data || []);
      
      const normalized = rawProducts.map((p: any) => ({
        id: p.id || p._id,
        name: p.name || p.title,
        price: parseFloat(p.price) || 0,
        image: Array.isArray(p.images) ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url) : p.image,
        category: p.category || 'General',
        description: p.description || '',
        materials: materialsOptions.filter(m => (p.description + p.name).toLowerCase().includes(m.toLowerCase())),
        dimensions: dimensionsOptions.filter(d => (p.description + p.name).includes(d.split(' ')[0]))
      }));

      setProducts(normalized);
    } catch (error) {
      console.error("Error loading catalog:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Category Filter
      if (selectedCategories.length > 0) {
         const matchesCategory = selectedCategories.some(cat => 
            (product.category && product.category.toLowerCase().includes(cat.toLowerCase())) ||
            product.name.toLowerCase().includes(cat.toLowerCase().slice(0, -1)) 
         );
         if (!matchesCategory) return false;
      }

      // 2. Price Filter
      if (product.price < priceRange.min || product.price > priceRange.max) return false;

      // 3. Material Filter
      if (selectedMaterials.length > 0) {
        const hasMaterial = selectedMaterials.some(m => product.materials.includes(m));
        const looseMatch = selectedMaterials.some(m => (product.description + product.name).toLowerCase().includes(m.toLowerCase()));
        if (!hasMaterial && !looseMatch) return false;
      }

      // 4. Dimension Filter
      if (selectedDimensions.length > 0) {
         const hasDimension = selectedDimensions.some(d => product.dimensions.includes(d));
         const looseMatch = selectedDimensions.some(d => (product.description + product.name).includes(d.split(' ')[0]));
         if (!hasDimension && !looseMatch) return false;
      }

      return true;
    });
  }, [products, selectedCategories, priceRange, selectedMaterials, selectedDimensions]);

  const toggleFilter = (set: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    set(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <div className="animate-fadeIn min-h-screen bg-white dark:bg-[#111]">
      
      {/* Header Banner - Fluid Full Width */}
      <div className="bg-gray-100 dark:bg-[#1a2c2c] border-b border-gray-200 dark:border-gray-700 py-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
                <button onClick={onBackToShop} className="text-xs font-bold text-gray-500 hover:text-primary mb-2 flex items-center gap-1">
                   <span className="material-symbols-outlined text-sm">arrow_back</span> Volver al Inicio
                </button>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Catálogo Completo
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Explora nuestra colección de {products.length} productos exclusivos.
                </p>
             </div>
             <button 
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-bold"
                onClick={() => setIsFilterOpen(true)}
             >
                <span className="material-symbols-outlined">filter_list</span> Filtros
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Fluid Layout with Responsive Margins */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 mx-auto py-8 flex gap-8">
        
        {/* Sidebar Filters (Desktop) */}
        <aside className={`
            fixed inset-0 z-50 bg-white dark:bg-[#1a2c2c] p-6 w-80 transform transition-transform duration-300 overflow-y-auto shadow-2xl lg:shadow-none lg:translate-x-0 lg:static lg:block lg:w-64 lg:p-0 lg:bg-transparent lg:dark:bg-transparent lg:z-auto flex-shrink-0
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
           <div className="flex justify-between items-center lg:hidden mb-6">
              <h2 className="text-xl font-bold dark:text-white">Filtros</h2>
              <button onClick={() => setIsFilterOpen(false)}><span className="material-symbols-outlined">close</span></button>
           </div>

           <div className="space-y-8 sticky top-24">
              
              {/* Categories */}
              <div>
                 <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Categoría</h3>
                 <div className="space-y-2">
                    {categoriesOptions.map(cat => (
                       <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-brand-teal border-brand-teal' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent'}`}>
                             {selectedCategories.includes(cat) && <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>}
                          </div>
                          <input 
                             type="checkbox" 
                             className="hidden" 
                             checked={selectedCategories.includes(cat)}
                             onChange={() => toggleFilter(setSelectedCategories, cat)}
                          />
                          <span className={`text-sm ${selectedCategories.includes(cat) ? 'font-bold text-brand-teal' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary'}`}>{cat}</span>
                       </label>
                    ))}
                 </div>
              </div>

              {/* Price Range */}
              <div>
                 <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Precio (€)</h3>
                 <div className="px-2">
                    <input 
                       type="range" 
                       min="0" 
                       max="2000" 
                       step="10"
                       value={priceRange.max}
                       onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                       className="w-full accent-brand-teal h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
                       <span>{priceRange.min}€</span>
                       <span>{priceRange.max}€</span>
                    </div>
                 </div>
              </div>

              {/* Materials */}
              <div>
                 <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Materiales</h3>
                 <div className="flex flex-wrap gap-2">
                    {materialsOptions.map(mat => (
                       <button
                          key={mat}
                          onClick={() => toggleFilter(setSelectedMaterials, mat)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${selectedMaterials.includes(mat) ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary'}`}
                       >
                          {mat}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Dimensions */}
              <div>
                 <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Medidas</h3>
                 <div className="space-y-2">
                    {dimensionsOptions.map(dim => (
                       <label key={dim} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                             type="checkbox" 
                             className="hidden"
                             checked={selectedDimensions.includes(dim)}
                             onChange={() => toggleFilter(setSelectedDimensions, dim)}
                          />
                          <span className={`text-sm transition-colors ${selectedDimensions.includes(dim) ? 'font-bold text-brand-teal underline' : 'text-gray-600 dark:text-gray-400'}`}>
                             {dim}
                          </span>
                       </label>
                    ))}
                 </div>
              </div>

              <button 
                onClick={() => { setSelectedCategories([]); setSelectedMaterials([]); setSelectedDimensions([]); setPriceRange({min:0, max:2000}); }}
                className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-colors"
              >
                 LIMPIAR FILTROS
              </button>

           </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isFilterOpen && (
           <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
        )}

        {/* Product Grid - Full Width Responsive Grid */}
        <main className="flex-1 min-w-0">
           {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                 {[1,2,3,4,5,6,7,8].map(n => (
                    <div key={n} className="animate-pulse">
                       <div className="bg-gray-200 dark:bg-gray-800 aspect-square rounded-lg mb-2"></div>
                       <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-1"></div>
                       <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    </div>
                 ))}
              </div>
           ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6 gap-6">
                 {filteredProducts.map(product => (
                    <div 
                       key={product.id}
                       onClick={() => onNavigateToProduct(product.id)}
                       className="group bg-white dark:bg-[#1a2c2c] border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
                    >
                       <div className="relative aspect-square overflow-hidden bg-gray-50">
                          <img 
                             src={product.image} 
                             alt={product.name} 
                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                          {/* Hover Actions */}
                          <div className="absolute bottom-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2">
                             <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 hover:text-primary hover:scale-110 transition-all">
                                <span className="material-symbols-outlined">visibility</span>
                             </button>
                          </div>
                       </div>
                       
                       <div className="p-4 flex flex-col flex-1">
                          <span className="text-xs font-bold text-gray-400 uppercase mb-1 truncate">{product.category}</span>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-2 text-sm">{product.name}</h3>
                          
                          {/* Simulated Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                             {product.materials.slice(0, 2).map((m: string) => (
                                <span key={m} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded">{m}</span>
                             ))}
                          </div>

                          <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50 dark:border-gray-700">
                             <span className="text-base font-black text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                             <span className="text-[10px] font-bold text-brand-teal uppercase group-hover:underline">Ver detalle</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-[#1a2c2c] rounded-lg border border-dashed border-gray-300 dark:border-gray-700 h-96">
                 <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">filter_alt_off</span>
                 <h2 className="text-lg font-bold text-gray-900 dark:text-white">No se encontraron productos</h2>
                 <p className="text-gray-500 mb-6">Prueba a ajustar tus filtros de búsqueda.</p>
                 <button 
                    onClick={() => { setSelectedCategories([]); setSelectedMaterials([]); setSelectedDimensions([]); setPriceRange({min:0, max:2000}); }}
                    className="text-primary font-bold hover:underline"
                 >
                    Limpiar todos los filtros
                 </button>
              </div>
           )}
        </main>
      </div>
    </div>
  );
};
