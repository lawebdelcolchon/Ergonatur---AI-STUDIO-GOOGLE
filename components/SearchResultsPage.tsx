
import React, { useState } from 'react';
import { ImagePreviewModal } from './ImagePreviewModal';

interface SearchResultsPageProps {
  query: string;
  onNavigateToProduct: (productId: string) => void;
  onBackToShop: () => void;
  onSearch?: (term: string) => void;
}

// Extended Database for the full search page with mock image arrays
const allProductsDatabase = [
  { 
    id: 'velvet-chair-001', 
    name: 'Sillón de Terciopelo', 
    category: 'Sillones', 
    price: 299.00, 
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVfN0eUqxUhxugX31yoKdoPmXpa0aXeM0lXDBUWPrRgh3VR98twQ8UqubS7DZhg4vf1fKPkZr_blHvs2pCw51O6VyMHe9bMy2_It7gPYwOh9AA4BaojgTJfkidgf0FaEzDtZUDWV-JGtV4rTHed8ar0MNDLQeY9YXG0WSXbFkf9GvHOiBYYrsVXYdhzO-heKOGB5QnIoMAMbYpTlq_Qk2LAdNZhmsTLzGI85QMuHVlIUaX_VxJZL_vI7sch6n7oHFdzPaxCJPL4R4',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeyp-qa-L1d3MZTsBn8oHmCUkHI_JQ9xt4sNOy2_GXOSe_7C5_VDmQ8XDWX0U7FJ2zM9_VQVZCK5czDvGmR9Dg3VaLT51O2xUEsiAIW32YLNrbvkyso7xuz_Oa26YD-9UOBJLNa-A0Sd2dZy001UogrjTW0T9kYtbX28-LHQnlWitq_aegYfNuhHhOBVeTEBUTHr7GidptRVplaF5cQqT3Od6_oAcMq9doAoGodj0ldkhm62Ki0OSRfF5pUKdDqAzIXFQvTsPT0A0'
    ] 
  },
  { 
    id: '1', 
    name: 'Sofá Minimalista', 
    category: 'Sofás', 
    price: 799.00, 
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCI1krNedjT3HfNBh7MlRx8KLK-tnHGP5btCR5SHgXzT9hyHNXfWh3Z3vk5AhDQB75FVz_IiXV-lb_xvmniEeoTObsPQKfAspz6HGAn5Waey3hIAMuO8iQMzYgV5fYu-hVSxiA1LjyFa_u9JRvKSFKOzm-1Z0bii_rOSeOQNUA02f8ty6bFmg-h3rfaAqlFe-AAEHXshfdJ4ZoP5e7_FHRpGH1gET2csPxlj5CH1h0e8RaZbbHYA1V1LN5Rl3i9IhXAxHRxr_I3xt4',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVfN0eUqxUhxugX31yoKdoPmXpa0aXeM0lXDBUWPrRgh3VR98twQ8UqubS7DZhg4vf1fKPkZr_blHvs2pCw51O6VyMHe9bMy2_It7gPYwOh9AA4BaojgTJfkidgf0FaEzDtZUDWV-JGtV4rTHed8ar0MNDLQeY9YXG0WSXbFkf9GvHOiBYYrsVXYdhzO-heKOGB5QnIoMAMbYpTlq_Qk2LAdNZhmsTLzGI85QMuHVlIUaX_VxJZL_vI7sch6n7oHFdzPaxCJPL4R4'
    ] 
  },
  { 
    id: '2', 
    name: 'Mesa de Café Roble', 
    category: 'Mesas', 
    price: 149.00, 
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBY49ElfaJvr3IhV9rYMIeklkY0d7JXya7CCtxfEuydWL_kMCCrD5ssh4nD79fiM9cgZaBkq9t1091K5PQkdEI2X56mlBk6tG2jMm3_WG51o3kjO3c1NB-gqYiXAZ85ussNdHdJ6wGCYu0QtIlD_9vlYPFbntvqkdQtVI1F-nfolqPJlLzNPMl_AWIuDf5KwvpSoJUiuLX2oSA3qgtwtxfzIqNuSQ4Xrdlu8RAD38H0X7lbUbYYMwdGq56j-7NWkv3QJKeeM_gTw7E'
    ]
  },
  { 
    id: '3', 
    name: 'Lámpara Escandinava', 
    category: 'Iluminación', 
    price: 99.00, 
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBWOLrtbh5JamVCINeXiu9l83BNjHDnU7D2GltxPre95pd3qCHxVhu5itpM30J9hE3anWV7HobS8i2Xy6hAPUBDNlSmxsiQn_u3-odIEsqR7caGJoCv1wSX9xStXLSz07PBwpKPhj88JfLaFHCs7zI5PJMcaN2bUxXynaCuEvVvPcdSh4-wdNrSXbLW14OwWQC0qpM1bpKNHfBTywc90tP65JlJBorbHzk3pTGQOyCiPJvfjdzSnQzrekcrIFF62PAqvH_DbxTLy1s']
  },
  { 
    id: 'c1', 
    name: 'Cabecero Tapizado Gris', 
    category: 'Dormitorio', 
    price: 149.99, 
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCRYCBXsnSjRy54vJoM39TjHN5ikWJuGVXEu8-7V9d_4Dw9wywFJ7SlUGcSpvwfD4yeUNU_yxri6ywvHGU5XTHNpk6jcmJBubg1xE8sCYx6cHNFhA71WpDBwTRxnh3Tw0FqxyAZqX-c-XQ_-noXbafoV_d1gusSm9ByJ0e-Momd-AGFrRg5QyJX7athcqJBXpjfi-qcwlSmtML7eYRQW2xoeQEKyLCAUaFXvj3ZWvcnj4YNb0ijHRL7Kb4o915wuceSb49QhrLP7X0']
  },
  { 
    id: 'm1', 
    name: 'Colchón Viscoelástico Royal', 
    category: 'Descanso', 
    price: 399.00, 
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBWOLrtbh5JamVCINeXiu9l83BNjHDnU7D2GltxPre95pd3qCHxVhu5itpM30J9hE3anWV7HobS8i2Xy6hAPUBDNlSmxsiQn_u3-odIEsqR7caGJoCv1wSX9xStXLSz07PBwpKPhj88JfLaFHCs7zI5PJMcaN2bUxXynaCuEvVvPcdSh4-wdNrSXbLW14OwWQC0qpM1bpKNHfBTywc90tP65JlJBorbHzk3pTGQOyCiPJvfjdzSnQzrekcrIFF62PAqvH_DbxTLy1s']
  },
  { 
    id: 't2', 
    name: 'Mesita Vintage', 
    category: 'Dormitorio', 
    price: 120.00, 
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAzmM_96Gj_xfPlT2V4gOtDTc8s17dNiHpUbOQA1l4sN6AYjuDvZSeLJiozeqqsEr2LJSQ-052Ox19DhxedKkHfqshnDaOZkerqACPg1L2tK5oWz4l2cWhV0FyVz72svHIRBRlaeNzxrBQMgzkkbtLk35WpvCBoIiRol0OdFtelfbMPl6zEVPHuJpQB3yrw6bB7QdmHsHmnZCU_OPcS5pNoGyutKoph7FKP6JIDLCh0hr2QWiqCG8-3pEffw0AQlSksO-j6pzQnHm4']
  },
  { 
    id: '4', 
    name: 'Alfombra Suave', 
    category: 'Textil', 
    price: 249.00, 
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAzmM_96Gj_xfPlT2V4gOtDTc8s17dNiHpUbOQA1l4sN6AYjuDvZSeLJiozeqqsEr2LJSQ-052Ox19DhxedKkHfqshnDaOZkerqACPg1L2tK5oWz4l2cWhV0FyVz72svHIRBRlaeNzxrBQMgzkkbtLk35WpvCBoIiRol0OdFtelfbMPl6zEVPHuJpQB3yrw6bB7QdmHsHmnZCU_OPcS5pNoGyutKoph7FKP6JIDLCh0hr2QWiqCG8-3pEffw0AQlSksO-j6pzQnHm4']
  },
  { 
    id: 'c2', 
    name: 'Cabecero de Madera', 
    category: 'Dormitorio', 
    price: 189.00, 
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDcna-zb2tS9lZc4VuM744fXna8T6tjpU9GWLHdlNLgkvbuSq9Wh7tJydGqvo54s17YSBjQfn8XKs7juBTtLWKTm_WNBehgaey73ftFG_hLUkLbKV7Sz_Vnl-J53oB5GRLp6Yf7aGZq5jbBohXObFn0zYl3t1J3TkcSilcQgySFCggzhaxbEDAR_dNF3GYQ_1NUZHht_2Nf9NPT0JGelRL4GiPSpVvmvk9X5nBlWDelh50rJ1mvzcR77wvaLLKledd-UaotxqURVtU']
  },
  { 
    id: 'c4', 
    name: 'Cabecero Terciopelo Azul', 
    category: 'Dormitorio', 
    price: 199.99, 
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBhXFZ3raa8QJygNwDr5gPuOkzf-KQME9YwugS3t0Qjx7FkZEQZTjeqt3ON5VuwEVYCj79nWJoXVMzqqs-HZWfqAqM6vKEDMk-6ouZYrP8Idt_ITruDiVUtSe7XZ4I46mLhRcxZuYtTGBGkwbAdKE18jmIapoxKf23aIvzYOH7y6jBzzQ_KilqiGmO0zyHAcoukfkPN68QzqHHvGGbOO-hXMCWABe4ewJNtiH-LMxjNM0N0S-FSWa026HQpN58H--wzsvfxWQOKeqM']
  }
];

const trendingSearches = [
  "Cabeceros Madera", "Colchón Visco", "Sofá Cama", "Mesita Noche", "Espejo Vestidor", "Almohadas"
];

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, onNavigateToProduct, onBackToShop, onSearch }) => {
  const [modalData, setModalData] = useState<{ isOpen: boolean; images: string[]; name: string }>({ isOpen: false, images: [], name: '' });

  const results = allProductsDatabase.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleQuickView = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    setModalData({
      isOpen: true,
      images: product.images,
      name: product.name
    });
  };

  return (
    <div className="animate-fadeIn min-h-screen bg-[#f9f9f9] flex flex-col md:flex-row">
      
      {/* Sidebar / Trending Menu */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex-shrink-0">
         <div className="sticky top-24">
            <button onClick={onBackToShop} className="text-sm font-bold text-gray-500 hover:text-primary mb-6 flex items-center gap-1 md:hidden">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Volver
            </button>
            
            <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-4 flex items-center gap-2">
               <span className="material-symbols-outlined text-brand-teal">trending_up</span>
               Palabras más buscadas
            </h3>
            <ul className="space-y-2">
               {trendingSearches.map((term, idx) => (
                  <li key={idx}>
                     <button 
                        onClick={() => onSearch?.(term)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${term.toLowerCase() === query.toLowerCase() ? 'bg-brand-teal text-white font-bold' : 'text-gray-600 hover:bg-gray-100 hover:text-brand-teal'}`}
                     >
                        {term}
                     </button>
                  </li>
               ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-100">
               <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-4">Categorías Populares</h3>
               <div className="flex flex-wrap gap-2">
                  {['Cabeceros', 'Colchones', 'Mesitas'].map(cat => (
                     <button key={cat} onClick={() => onSearch?.(cat)} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200">
                        {cat}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </aside>

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="max-w-4xl">
            <div className="flex items-center text-xs text-gray-500 mb-4 gap-2">
                <button onClick={onBackToShop} className="hover:text-primary">Inicio</button>
                <span>/</span>
                <span>Búsqueda</span>
            </div>
            <div className="flex items-end justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Resultados para "{query}"</h1>
                <span className="text-sm text-gray-500">{results.length} productos</span>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white border border-gray-200 group hover:border-gray-300 transition-all duration-200 flex flex-col"
                >
                  <div 
                    className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => onNavigateToProduct(product.id)}
                  >
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Quick View Trigger */}
                    <button 
                      onClick={(e) => handleQuickView(e, product)}
                      className="absolute bottom-2 right-2 w-9 h-9 bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200"
                      title="Vista Rápida"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 bg-brand-teal text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                      Nuevo
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{product.category}</p>
                    <h3 
                      onClick={() => onNavigateToProduct(product.id)}
                      className="text-sm font-semibold text-gray-900 hover:text-brand-teal cursor-pointer line-clamp-2"
                    >
                      {product.name}
                    </h3>
                    <div className="mt-auto pt-3 flex items-baseline justify-between">
                      <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <button className="text-xs font-bold text-primary hover:underline">Ver detalles</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">search_off</span>
              <h2 className="text-lg font-bold text-gray-900 mb-2">No encontramos resultados</h2>
              <p className="text-gray-500 mb-6">Intenta con otros términos o navega por nuestras categorías.</p>
              <button 
                onClick={onBackToShop}
                className="px-6 py-2 bg-brand-teal text-white font-bold text-sm hover:bg-opacity-90 transition-colors"
              >
                Volver a la tienda
              </button>
            </div>
          )}
        </div>
      </div>

      <ImagePreviewModal 
        isOpen={modalData.isOpen}
        onClose={() => setModalData(prev => ({ ...prev, isOpen: false }))}
        images={modalData.images}
        productName={modalData.name}
      />
    </div>
  );
};
