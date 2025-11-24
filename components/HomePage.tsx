import React, { useState } from 'react';
import { RelatedProduct, WishlistItem } from '../types';
import { HeroSlider } from './HeroSlider';

interface HomePageProps {
  onNavigateToProduct: (productId: string) => void;
  onToggleFavorite?: (item: WishlistItem) => void;
  isFavorite?: (id: string) => boolean;
}

const featuredCategories = {
  'cabeceros': [
    { id: 'c1', name: 'Cabecero Tapizado Gris', price: 149.99, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRYCBXsnSjRy54vJoM39TjHN5ikWJuGVXEu8-7V9d_4Dw9wywFJ7SlUGcSpvwfD4yeUNU_yxri6ywvHGU5XTHNpk6jcmJBubg1xE8sCYx6cHNFhA71WpDBwTRxnh3Tw0FqxyAZqX-c-XQ_-noXbafoV_d1gusSm9ByJ0e-Momd-AGFrRg5QyJX7athcqJBXpjfi-qcwlSmtML7eYRQW2xoeQEKyLCAUaFXvj3ZWvcnj4YNb0ijHRL7Kb4o915wuceSb49QhrLP7X0' },
    { id: 'c2', name: 'Cabecero de Madera Nórdico', price: 189.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcna-zb2tS9lZc4VuM744fXna8T6tjpU9GWLHdlNLgkvbuSq9Wh7tJydGqvo54s17YSBjQfn8XKs7juBTtLWKTm_WNBehgaey73ftFG_hLUkLbKV7Sz_Vnl-J53oB5GRLp6Yf7aGZq5jbBohXObFn0zYl3t1J3TkcSilcQgySFCggzhaxbEDAR_dNF3GYQ_1NUZHht_2Nf9NPT0JGelRL4GiPSpVvmvk9X5nBlWDelh50rJ1mvzcR77wvaLLKledd-UaotxqURVtU' },
    { id: 'c3', name: 'Cabecero de Ratán', price: 220.50, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtH1MIVCVR_b-OrjXYkEIvpA7IDcI_WlU2Ul-z1dwKDr-6Ds9fEW-y8tVQF_hO2AUFUJDoIBg2xHXZCHzdYadwrVeOOU5ZQfvhSOOC8FkuN93mhUdbQlDFOVbfVjmCraaSgqeeCFPAOxLth0spaDtveBjNhe04fOruip0spLMUMIYJmFuemw5xTJfUohT8ee-pNbco_qTcDJPTVSzVV-7UsWEVXicSssEEhPGjJ6wByO3c5030ECShTIAaGIUv6wpadQCNgGkSixA' },
    { id: 'c4', name: 'Cabecero Terciopelo Azul', price: 199.99, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhXFZ3raa8QJygNwDr5gPuOkzf-KQME9YwugS3t0Qjx7FkZEQZTjeqt3ON5VuwEVYCj79nWJoXVMzqqs-HZWfqAqM6vKEDMk-6ouZYrP8Idt_ITruDiVUtSe7XZ4I46mLhRcxZuYtTGBGkwbAdKE18jmIapoxKf23aIvzYOH7y6jBzzQ_KilqiGmO0zyHAcoukfkPN68QzqHHvGGbOO-hXMCWABe4ewJNtiH-LMxjNM0N0S-FSWa026HQpN58H--wzsvfxWQOKeqM' },
  ],
  'colchones': [
    { id: 'm1', name: 'Colchón Viscoelástico Royal', price: 399.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWOLrtbh5JamVCINeXiu9l83BNjHDnU7D2GltxPre95pd3qCHxVhu5itpM30J9hE3anWV7HobS8i2Xy6hAPUBDNlSmxsiQn_u3-odIEsqR7caGJoCv1wSX9xStXLSz07PBwpKPhj88JfLaFHCs7zI5PJMcaN2bUxXynaCuEvVvPcdSh4-wdNrSXbLW14OwWQC0qpM1bpKNHfBTywc90tP65JlJBorbHzk3pTGQOyCiPJvfjdzSnQzrekcrIFF62PAqvH_DbxTLy1s' },
    { id: 'm2', name: 'Colchón Ortopédico', price: 250.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWnhNrnbdqsQee0_uxyXhSL8AiuUniSXZTWbuhXS7ncFbauGk0fbG8LqpDv1GaBWIDv8lIW2rJROmGvE9qXwBfn55sO5jbo76vwHNmtj-QSUvkiZFIylJA-fvSewD13JLXrNOyUCcQm9HHi6gW3pU0iD8V0b6uErFRPGF-CTEqC-LBNBB9afWLGxpQMTJiQLriJmrThJr1rOOrLb2OjdQGZmDfBG8KEv5YDHJfpW4nYYUd0tpTozo3hrhqipK3wv3kPt83FgV2UIs' },
    { id: 'm3', name: 'Colchón Híbrido Premium', price: 550.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeyp-qa-L1d3MZTsBn8oHmCUkHI_JQ9xt4sNOy2_GXOSe_7C5_VDmQ8XDWX0U7FJ2zM9_VQVZCK5czDvGmR9Dg3VaLT51O2xUEsiAIW32YLNrbvkyso7xuz_Oa26YD-9UOBJLNa-A0Sd2dZy001UogrjTW0T9kYtbX28-LHQnlWitq_aegYfNuhHhOBVeTEBUTHr7GidptRVplaF5cQqT3Od6_oAcMq9doAoGodj0ldkhm62Ki0OSRfF5pUKdDqAzIXFQvTsPT0A0' },
    { id: 'm4', name: 'Colchón Infantil', price: 150.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdMDR0PhXqwSJz3utdL9NQ9FGSjSmGy8nUvBp6NVoEqszii-YQPfmscR57qtorSt-IpuXbj2vygxnrOfMenjuOwilP_eCqOF1Nbbssya9ZWbvazACtl7zm1vOUZUJLslDC5-pBux0vLhHUtQCKAl7wcj17B1jc5c6DWzFp87bPcov3XulfFLcIewcabDD2Kc0s6L0_5N3SBj7NgxGS4vVLdSy3EHov9Syua9Ln_DvbFXd0YmLwBiNGKG0Kg0StgOcnDCrMkb9CTrY' },
  ],
  'mesitas': [
    { id: 't1', name: 'Mesita de Noche Moderna', price: 89.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY49ElfaJvr3IhV9rYMIeklkY0d7JXya7CCtxfEuydWL_kMCCrD5ssh4nD79fiM9cgZaBkq9t1091K5PQkdEI2X56mlBk6tG2jMm3_WG51o3kjO3c1NB-gqYiXAZ85ussNdHdJ6wGCYu0QtIlD_9vlYPFbntvqkdQtVI1F-nfolqPJlLzNPMl_AWIuDf5KwvpSoJUiuLX2oSA3qgtwtxfzIqNuSQ4Xrdlu8RAD38H0X7lbUbYYMwdGq56j-7NWkv3QJKeeM_gTw7E' },
    { id: 't2', name: 'Mesita Vintage', price: 120.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzmM_96Gj_xfPlT2V4gOtDTc8s17dNiHpUbOQA1l4sN6AYjuDvZSeLJiozeqqsEr2LJSQ-052Ox19DhxedKkHfqshnDaOZkerqACPg1L2tK5oWz4l2cWhV0FyVz72svHIRBRlaeNzxrBQMgzkkbtLk35WpvCBoIiRol0OdFtelfbMPl6zEVPHuJpQB3yrw6bB7QdmHsHmnZCU_OPcS5pNoGyutKoph7FKP6JIDLCh0hr2QWiqCG8-3pEffw0AQlSksO-j6pzQnHm4' },
    { id: 't3', name: 'Mesita Flotante', price: 65.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI1krNedjT3HfNBh7MlRx8KLK-tnHGP5btCR5SHgXzT9hyHNXfWh3Z3vk5AhDQB75FVz_IiXV-lb_xvmniEeoTObsPQKfAspz6HGAn5Waey3hIAMuO8iQMzYgV5fYu-hVSxiA1LjyFa_u9JRvKSFKOzm-1Z0bii_rOSeOQNUA02f8ty6bFmg-h3rfaAqlFe-AAEHXshfdJ4ZoP5e7_FHRpGH1gET2csPxlj5CH1h0e8RaZbbHYA1V1LN5Rl3i9IhXAxHRxr_I3xt4' },
    { id: 't4', name: 'Mesita Industrial', price: 95.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVfN0eUqxUhxugX31yoKdoPmXpa0aXeM0lXDBUWPrRgh3VR98twQ8UqubS7DZhg4vf1fKPkZr_blHvs2pCw51O6VyMHe9bMy2_It7gPYwOh9AA4BaojgTJfkidgf0FaEzDtZUDWV-JGtV4rTHed8ar0MNDLQeY9YXG0WSXbFkf9GvHOiBYYrsVXYdhzO-heKOGB5QnIoMAMbYpTlq_Qk2LAdNZhmsTLzGI85QMuHVlIUaX_VxJZL_vI7sch6n7oHFdzPaxCJPL4R4' },
  ]
};

const recommendedProducts: RelatedProduct[] = [
  { id: 101, name: 'Almohada Visco Premium', price: 45.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzmM_96Gj_xfPlT2V4gOtDTc8s17dNiHpUbOQA1l4sN6AYjuDvZSeLJiozeqqsEr2LJSQ-052Ox19DhxedKkHfqshnDaOZkerqACPg1L2tK5oWz4l2cWhV0FyVz72svHIRBRlaeNzxrBQMgzkkbtLk35WpvCBoIiRol0OdFtelfbMPl6zEVPHuJpQB3yrw6bB7QdmHsHmnZCU_OPcS5pNoGyutKoph7FKP6JIDLCh0hr2QWiqCG8-3pEffw0AQlSksO-j6pzQnHm4' },
  { id: 102, name: 'Juego de Sábanas Algodón', price: 69.90, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWOLrtbh5JamVCINeXiu9l83BNjHDnU7D2GltxPre95pd3qCHxVhu5itpM30J9hE3anWV7HobS8i2Xy6hAPUBDNlSmxsiQn_u3-odIEsqR7caGJoCv1wSX9xStXLSz07PBwpKPhj88JfLaFHCs7zI5PJMcaN2bUxXynaCuEvVvPcdSh4-wdNrSXbLW14OwWQC0qpM1bpKNHfBTywc90tP65JlJBorbHzk3pTGQOyCiPJvfjdzSnQzrekcrIFF62PAqvH_DbxTLy1s' },
  { id: 103, name: 'Sillón de Lectura', price: 299.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVfN0eUqxUhxugX31yoKdoPmXpa0aXeM0lXDBUWPrRgh3VR98twQ8UqubS7DZhg4vf1fKPkZr_blHvs2pCw51O6VyMHe9bMy2_It7gPYwOh9AA4BaojgTJfkidgf0FaEzDtZUDWV-JGtV4rTHed8ar0MNDLQeY9YXG0WSXbFkf9GvHOiBYYrsVXYdhzO-heKOGB5QnIoMAMbYpTlq_Qk2LAdNZhmsTLzGI85QMuHVlIUaX_VxJZL_vI7sch6n7oHFdzPaxCJPL4R4' },
  { id: 104, name: 'Canapé Abatible Madera', price: 350.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWnhNrnbdqsQee0_uxyXhSL8AiuUniSXZTWbuhXS7ncFbauGk0fbG8LqpDv1GaBWIDv8lIW2rJROmGvE9qXwBfn55sO5jbo76vwHNmtj-QSUvkiZFIylJA-fvSewD13JLXrNOyUCcQm9HHi6gW3pU0iD8V0b6uErFRPGF-CTEqC-LBNBB9afWLGxpQMTJiQLriJmrThJr1rOOrLb2OjdQGZmDfBG8KEv5YDHJfpW4nYYUd0tpTozo3hrhqipK3wv3kPt83FgV2UIs' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToProduct, onToggleFavorite, isFavorite }) => {
  const [activeTab, setActiveTab] = useState<'cabeceros' | 'colchones' | 'mesitas'>('cabeceros');

  const handleCtaClick = (link: string) => {
    const element = document.getElementById('recommended-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full">
      
      {/* Hero Section */}
      <section className="w-full">
         <HeroSlider onCtaClick={handleCtaClick} />
      </section>

      {/* Categories Tabs */}
      <section className="mt-16 container mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide mb-6">Nuestras Categorías</h2>
          <div className="flex gap-4 overflow-x-auto max-w-full">
              {['cabeceros', 'colchones', 'mesitas'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 font-bold text-sm uppercase tracking-wide transition-all
                    ${activeTab === tab 
                      ? 'bg-brand-teal text-white shadow-md' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-teal hover:text-brand-teal'}`}
                >
                  {tab === 'cabeceros' ? 'Cabeceros' : tab === 'colchones' ? 'Colchones' : 'Mesitas'}
                </button>
              ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories[activeTab].map((item) => (
            <div key={item.id} className="group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
              <div 
                 className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-gray-50"
                 onClick={() => onNavigateToProduct(item.id)}
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                  <button className="text-white hover:text-primary">
                     <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 
                  onClick={() => onNavigateToProduct(item.id)}
                  className="font-semibold text-sm text-gray-800 mb-1 cursor-pointer hover:text-brand-teal truncate"
                >
                  {item.name}
                </h3>
                <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Section */}
      <section id="recommended-section" className="mt-20 pb-12 container mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Recomendados</h2>
          <a href="#" className="text-sm font-bold text-primary hover:underline">Ver Todo</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => {
            const item: WishlistItem = { id: product.id.toString(), name: product.name, price: product.price, image: product.image };
            const isFav = isFavorite ? isFavorite(item.id) : false;

            return (
            <div key={product.id} className="group bg-white border border-gray-200 hover:border-gray-300 flex flex-col">
              <div className="relative aspect-square overflow-hidden cursor-pointer bg-gray-50" onClick={() => onNavigateToProduct(product.id.toString())}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                   <button 
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(item); }}
                      className="w-8 h-8 bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm"
                   >
                      <span className={`material-symbols-outlined text-lg ${isFav ? 'material-symbols-filled text-red-500' : ''}`}>favorite</span>
                   </button>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-1 flex-1">
                <h3 
                   onClick={() => onNavigateToProduct(product.id.toString())}
                   className="font-semibold text-sm text-gray-800 hover:text-brand-teal cursor-pointer line-clamp-2"
                >
                   {product.name}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                   <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                   <button className="text-xs font-bold text-primary uppercase">Añadir</button>
                </div>
              </div>
            </div>
          )})}
        </div>
      </section>

    </div>
  );
};