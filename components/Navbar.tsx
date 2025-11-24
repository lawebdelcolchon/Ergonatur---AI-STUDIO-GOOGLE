
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface MenuItem {
  name: string;
  price: string;
  dimensions: string;
  image: string;
}

interface MenuCategory {
  id: string;
  label: string;
  items: MenuItem[];
}

interface NavbarProps {
  cartCount?: number;
  favoritesCount?: number;
  onOpenCart?: () => void;
  onOpenFavorites?: () => void;
  onUserClick?: () => void;
  onNavigateHome?: () => void;
  onNavigateToProduct?: (productId: string) => void;
  onNavigateToCatalog?: (category?: string) => void;
  onSearch?: (query: string) => void;
  user?: User | null;
}

// Search Database Interface
interface SearchItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  dimensions: string; 
}

const API_URL = 'https://decorlujo.com/server_api/api/products';
const API_KEY = '9c70933aff6b2a6d08c687a6cbb6b765';

// Helper to get random image
const getImg = (index: number) => {
    const images = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCRYCBXsnSjRy54vJoM39TjHN5ikWJuGVXEu8-7V9d_4Dw9wywFJ7SlUGcSpvwfD4yeUNU_yxri6ywvHGU5XTHNpk6jcmJBubg1xE8sCYx6cHNFhA71WpDBwTRxnh3Tw0FqxyAZqX-c-XQ_-noXbafoV_d1gusSm9ByJ0e-Momd-AGFrRg5QyJX7athcqJBXpjfi-qcwlSmtML7eYRQW2xoeQEKyLCAUaFXvj3ZWvcnj4YNb0ijHRL7Kb4o915wuceSb49QhrLP7X0',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDcna-zb2tS9lZc4VuM744fXna8T6tjpU9GWLHdlNLgkvbuSq9Wh7tJydGqvo54s17YSBjQfn8XKs7juBTtLWKTm_WNBehgaey73ftFG_hLUkLbKV7Sz_Vnl-J53oB5GRLp6Yf7aGZq5jbBohXObFn0zYl3t1J3TkcSilcQgySFCggzhaxbEDAR_dNF3GYQ_1NUZHht_2Nf9NPT0JGelRL4GiPSpVvmvk9X5nBlWDelh50rJ1mvzcR77wvaLLKledd-UaotxqURVtU',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDtH1MIVCVR_b-OrjXYkEIvpA7IDcI_WlU2Ul-z1dwKDr-6Ds9fEW-y8tVQF_hO2AUFUJDoIBg2xHXZCHzdYadwrVeOOU5ZQfvhSOOC8FkuN93mhUdbQlDFOVbfVjmCraaSgqeeCFPAOxLth0spaDtveBjNhe04fOruip0spLMUMIYJmFuemw5xTJfUohT8ee-pNbco_qTcDJPTVSzVV-7UsWEVXicSssEEhPGjJ6wByO3c5030ECShTIAaGIUv6wpadQCNgGkSixA',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBhXFZ3raa8QJygNwDr5gPuOkzf-KQME9YwugS3t0Qjx7FkZEQZTjeqt3ON5VuwEVYCj79nWJoXVMzqqs-HZWfqAqM6vKEDMk-6ouZYrP8Idt_ITruDiVUtSe7XZ4I46mLhRcxZuYtTGBGkwbAdKE18jmIapoxKf23aIvzYOH7y6jBzzQ_KilqiGmO0zyHAcoukfkPN68QzqHHvGGbOO-hXMCWABe4ewJNtiH-LMxjNM0N0S-FSWa026HQpN58H--wzsvfxWQOKeqM',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAzmM_96Gj_xfPlT2V4gOtDTc8s17dNiHpUbOQA1l4sN6AYjuDvZSeLJiozeqqsEr2LJSQ-052Ox19DhxedKkHfqshnDaOZkerqACPg1L2tK5oWz4l2cWhV0FyVz72svHIRBRlaeNzxrBQMgzkkbtLk35WpvCBoIiRol0OdFtelfbMPl6zEVPHuJpQB3yrw6bB7QdmHsHmnZCU_OPcS5pNoGyutKoph7FKP6JIDLCh0hr2QWiqCG8-3pEffw0AQlSksO-j6pzQnHm4',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBY49ElfaJvr3IhV9rYMIeklkY0d7JXya7CCtxfEuydWL_kMCCrD5ssh4nD79fiM9cgZaBkq9t1091K5PQkdEI2X56mlBk6tG2jMm3_WG51o3kjO3c1NB-gqYiXAZ85ussNdHdJ6wGCYu0QtIlD_9vlYPFbntvqkdQtVI1F-nfolqPJlLzNPMl_AWIuDf5KwvpSoJUiuLX2oSA3qgtwtxfzIqNuSQ4Xrdlu8RAD38H0X7lbUbYYMwdGq56j-7NWkv3QJKeeM_gTw7E',
    ];
    return images[index % images.length];
}

const menuCategories: MenuCategory[] = [
  {
    id: 'cabeceros',
    label: 'Cabeceros',
    items: [
      // Serie Julie
      { name: 'Cabecero Tapizado Juvenil Julie', price: '145€', dimensions: '90 cm / 105 cm', image: getImg(0) },
      { name: 'Cabecero Tapizado Julie', price: '165€', dimensions: '135 cm / 150 cm', image: getImg(1) },
      { name: 'Cabecero Tapizado Julie Madera', price: '185€', dimensions: '150 cm', image: getImg(2) },
      { name: 'Cabecero Tapizado Julie Enmarcado', price: '195€', dimensions: '160 cm', image: getImg(3) },
      
      // Serie Corfú
      { name: 'Cabecero Tapizado Corfú', price: '179€', dimensions: '150 cm', image: getImg(4) },
      { name: 'Cabecero Tapizado Corfú Tex', price: '189€', dimensions: '160 cm', image: getImg(5) },
      { name: 'Cabecero Tapizado Corfú Big', price: '210€', dimensions: '180 cm / 200 cm', image: getImg(0) },

      // Rústicos de Madera
      { name: 'Cabecero Rústico Vintage', price: '245€', dimensions: '150 cm', image: getImg(1) },
      { name: 'Cabecero Rústico Toscana', price: '255€', dimensions: '160 cm', image: getImg(2) },
      { name: 'Cabecero Rústico Provenza', price: '265€', dimensions: '150 cm', image: getImg(3) },
      { name: 'Cabecero Rústico Córcega', price: '235€', dimensions: '140 cm', image: getImg(4) },
      { name: 'Cabecero Rústico Véneto', price: '275€', dimensions: '180 cm', image: getImg(5) },
      { name: 'Cabecero Rústico Campagne', price: '249€', dimensions: '150 cm', image: getImg(0) },
      { name: 'Cabecero Rústico Lombardía', price: '289€', dimensions: '160 cm', image: getImg(1) },

      // Tapizados Modernos (Macedonia, Paros, Siros)
      { name: 'Cabecero Tapizado Macedonia', price: '199€', dimensions: '150 cm', image: getImg(2) },
      { name: 'Cabecero Tapizado Macedonia Big', price: '229€', dimensions: '190 cm', image: getImg(3) },
      { name: 'Cabecero Tapizado Paros', price: '169€', dimensions: '140 cm', image: getImg(4) },
      { name: 'Cabecero Tapizado Paros Big', price: '199€', dimensions: '180 cm', image: getImg(5) },
      { name: 'Cabecero Tapizado Siros', price: '175€', dimensions: '150 cm', image: getImg(0) },
      { name: 'Cabecero Tapizado Siros Big', price: '205€', dimensions: '180 cm', image: getImg(1) },

      // Serie Camile, Melania, Atenas
      { name: 'Cabecero Tapizado Camile', price: '185€', dimensions: '150 cm', image: getImg(2) },
      { name: 'Cabecero Tapizado Melania', price: '195€', dimensions: '160 cm', image: getImg(3) },
      { name: 'Cabecero Tapizado Melania Big', price: '225€', dimensions: '190 cm', image: getImg(4) },
      { name: 'Cabecero Tapizado Atenas', price: '210€', dimensions: '150 cm', image: getImg(5) },
      { name: 'Cabecero Tapizado Atenas Big', price: '240€', dimensions: '180 cm', image: getImg(0) },
      { name: 'Cabecero Tapizado Brigitte', price: '230€', dimensions: '160 cm', image: getImg(1) },

      // Serie Manhattan & Urban
      { name: 'Cabecero Tapizado Manhattan', price: '220€', dimensions: '150 cm', image: getImg(2) },
      { name: 'Cabecero Tapizado Manhattan Big', price: '250€', dimensions: '180 cm', image: getImg(3) },
      { name: 'Cabecero Tapizado Miconos', price: '189€', dimensions: '150 cm', image: getImg(4) },
      { name: 'Cabecero Tapizado Miconos Big', price: '219€', dimensions: '180 cm', image: getImg(5) },
      { name: 'Cabecero Tapizado Tachuelas', price: '245€', dimensions: '160 cm', image: getImg(0) },
      { name: 'Cabecero Tapizado Tachuelas Big', price: '275€', dimensions: '190 cm', image: getImg(1) },
      
      // Colección USA/Internacional
      { name: 'Cabecero Tapizado Florida', price: '255€', dimensions: '160 cm', image: getImg(2) },
      { name: 'Cabecero Tapizado California', price: '265€', dimensions: '180 cm', image: getImg(3) },
      { name: 'Cabecero Tapizado Naxos', price: '195€', dimensions: '150 cm', image: getImg(4) },
      
      // Serie J (Judy, Janna, etc)
      { name: 'Cabecero Tapizado Judy', price: '155€', dimensions: '140 cm', image: getImg(5) },
      { name: 'Cabecero Tapizado Janna', price: '165€', dimensions: '150 cm', image: getImg(0) },
      { name: 'Cabecero Tapizado Jules', price: '175€', dimensions: '160 cm', image: getImg(1) },
      { name: 'Cabecero Tapizado Juline', price: '185€', dimensions: '150 cm', image: getImg(2) },
      { name: 'Cabecero Tapizado Jenna', price: '195€', dimensions: '160 cm', image: getImg(3) },
      { name: 'Cabecero Tapizado Jessa', price: '175€', dimensions: '150 cm', image: getImg(4) },
      
      // Serie Y
      { name: 'Cabecero Tapizado Yulian', price: '180€', dimensions: '150 cm', image: getImg(5) },
      { name: 'Cabecero Tapizado Yuriel', price: '190€', dimensions: '160 cm', image: getImg(0) },
    ]
  },
  {
    id: 'espejos',
    label: 'Espejos',
    items: [
      { name: 'Espejo de madera con cristal', price: '120€', dimensions: '80x180 cm', image: getImg(1) },
      { name: 'Espejo de madera sin cristal', price: '95€', dimensions: '80x180 cm', image: getImg(2) },
      { name: 'Espejo Redondo Metal', price: '65€', dimensions: '80 cm Ø', image: getImg(3) },
      { name: 'Espejo Pie Nórdico', price: '89€', dimensions: '50x160 cm', image: getImg(4) },
    ]
  },
  {
    id: 'mesitas',
    label: 'Mesitas de Noche',
    items: [
      { name: 'Mesita Vintage Doha', price: '110€', dimensions: '45x50 cm', image: getImg(5) },
      { name: 'Mesita Vintage Damman', price: '115€', dimensions: '45x50 cm', image: getImg(0) },
      { name: 'Mesita Vintage Damasco', price: '120€', dimensions: '45x55 cm', image: getImg(1) },
      { name: 'Mesita Vintage Alepo', price: '118€', dimensions: '45x50 cm', image: getImg(2) },
      { name: 'Mesita Vintage Arabia', price: '125€', dimensions: '50x60 cm', image: getImg(3) },
      { name: 'Mesita Vintage Lombardía', price: '130€', dimensions: '50x55 cm', image: getImg(4) },
      { name: 'Mesita 2 Cajones', price: '120€', dimensions: '45x40x55 cm', image: getImg(5) },
      { name: 'Mesita Flotante', price: '65€', dimensions: '40x35x20 cm', image: getImg(0) },
    ]
  },
  {
    id: 'comodas',
    label: 'Cómodas',
    items: [
      { name: 'Cómoda 1 cajón Vintage (100cm)', price: '180€', dimensions: '100x40x45 cm', image: getImg(1) },
      { name: 'Sinfonier 1 cajón Vintage (70cm)', price: '150€', dimensions: '70x40x110 cm', image: getImg(2) },
      { name: 'Cómoda 6 Cajones', price: '299€', dimensions: '120x45x80 cm', image: getImg(3) },
      { name: 'Sinfonier Alto', price: '180€', dimensions: '60x40x110 cm', image: getImg(4) },
      { name: 'Cómoda Blanca', price: '250€', dimensions: '100x45x90 cm', image: getImg(5) },
      { name: 'Mesa de escritorio Vintage', price: '210€', dimensions: '120x60 cm', image: getImg(0) },
    ]
  },
  {
    id: 'muestrarios',
    label: 'Muestrarios',
    items: [
      { name: 'Pack Tejidos Premium', price: '25€', dimensions: '30x30 cm', image: getImg(1) },
      { name: 'Muestras Maderas', price: '15€', dimensions: '15x10 cm', image: getImg(2) },
    ]
  },
  {
    id: 'accesorios',
    label: 'Accesorios',
    items: [
      { name: 'Almohada Visco', price: '45€', dimensions: '70 cm / 90 cm', image: getImg(3) },
      { name: 'Protector Colchón', price: '30€', dimensions: '150x190 cm', image: getImg(4) },
      { name: 'Relleno Nórdico', price: '55€', dimensions: '220x240 cm', image: getImg(5) },
    ]
  }
];

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount = 0, 
  favoritesCount = 0,
  onOpenCart, 
  onOpenFavorites,
  onUserClick, 
  onNavigateHome,
  onNavigateToProduct,
  onNavigateToCatalog,
  onSearch,
  user 
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.data || []);
        
        // Filter logic on client side as API search param is not defined in spec
        const filtered = products.filter((item: any) => 
          (item.name || '').toLowerCase().includes(query.toLowerCase()) ||
          (item.category || '').toLowerCase().includes(query.toLowerCase())
        ).map((item: any) => ({
           id: item.id || item._id,
           name: item.name || item.title,
           category: item.category || 'General',
           price: parseFloat(item.price) || 0,
           image: Array.isArray(item.images) ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url) : item.image,
           dimensions: item.dimensions || ''
        }));
        
        setSearchResults(filtered);
        setIsSearchOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleViewAllResults = () => {
     if (onSearch && searchQuery.trim()) {
        onSearch(searchQuery);
        setIsSearchOpen(false);
     }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleViewAllResults();
    }
  };

  const handleCatalogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToCatalog) {
       const label = menuCategories.find(c => c.id === hoveredCategory)?.label;
       onNavigateToCatalog(label);
       setHoveredCategory(null);
    }
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#f5f5f5] dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 h-9 flex items-center justify-between px-4 lg:px-8 text-[11px] font-medium tracking-wide text-gray-600 dark:text-gray-400">
        <div className="hidden sm:flex items-center gap-4">
          <span>Envío gratuito pedidos +500€</span>
          <span className="w-px h-3 bg-gray-300"></span>
          <span>Garantía 3 años</span>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <a href="#" className="hover:text-brand-teal transition-colors">Contacto</a>
          <a href="#" className="hover:text-brand-teal transition-colors">Ayuda</a>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white dark:bg-[#1a2c2c] sticky top-0 z-50 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          
          {/* Logo */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-gray-700">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateHome?.(); }} className="flex items-center group">
               <span className="font-black text-3xl tracking-tight text-brand-teal dark:text-white">
                 Ergo<span className="text-primary">natur</span>
               </span>
            </a>
          </div>

          {/* Search Bar - Rectangular & Clean */}
          <div className="hidden sm:flex flex-1 max-w-2xl z-50 relative" ref={searchRef}>
            <div className="flex w-full group bg-gray-100 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-all border border-gray-200 rounded-sm">
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Buscar cabeceros, mesitas, colchones..."
                className="flex-1 h-11 px-4 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-500 text-gray-800 outline-none"
              />
              <button 
                onClick={handleViewAllResults}
                className="px-4 bg-brand-teal hover:bg-[#003835] text-white transition-colors flex items-center justify-center w-12"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
            </div>

            {/* Smart Search Results Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full mt-0 left-0 w-full bg-white dark:bg-[#1a2c2c] shadow-xl border border-t-0 border-gray-200 dark:border-gray-700 max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => { onNavigateToProduct?.(item.id); setIsSearchOpen(false); }}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50"
                      >
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover bg-gray-100 border border-gray-200" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 dark:text-white truncate">{item.name}</h4>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                        <span className="text-brand-teal font-bold text-sm">${item.price}</span>
                      </div>
                    ))}
                    <button 
                      onClick={handleViewAllResults}
                      className="w-full py-3 text-xs font-bold text-center text-brand-teal hover:bg-gray-50 border-t border-gray-100"
                    >
                      VER TODOS LOS RESULTADOS ({searchResults.length})
                    </button>
                  </div>
                ) : (
                   <div className="p-4 text-center text-sm text-gray-500">No se encontraron resultados.</div>
                )}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-300">
             <button className="sm:hidden p-2" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <span className="material-symbols-outlined">search</span>
             </button>
             <button onClick={onUserClick} className="p-2 hover:text-brand-teal flex flex-col items-center gap-0.5">
                <span className="material-symbols-outlined">person</span>
                <span className="text-[10px] font-medium hidden lg:block">Cuenta</span>
             </button>
             <button onClick={onOpenFavorites} className="p-2 hover:text-brand-teal flex flex-col items-center gap-0.5 relative">
                <span className="material-symbols-outlined">favorite</span>
                <span className="text-[10px] font-medium hidden lg:block">Favoritos</span>
                {favoritesCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>}
             </button>
             <button onClick={onOpenCart} className="p-2 hover:text-brand-teal flex flex-col items-center gap-0.5 relative">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="text-[10px] font-medium hidden lg:block">Carrito</span>
                {cartCount > 0 && <span className="absolute top-0 right-0 bg-brand-teal text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
             </button>
          </div>
        </div>

        {/* Mega Menu Bar */}
        <div className="hidden lg:block border-t border-gray-100 bg-white dark:bg-[#1a2c2c] relative z-40">
          <div className="container mx-auto max-w-7xl px-8" onMouseLeave={() => setHoveredCategory(null)}>
             <div className="flex justify-center">
                {menuCategories.map((cat) => (
                    <div key={cat.id} className="px-6">
                       <button 
                           className={`py-4 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors ${hoveredCategory === cat.id ? 'border-brand-teal text-brand-teal' : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-brand-teal'}`}
                           onMouseEnter={() => setHoveredCategory(cat.id)}
                       >
                           {cat.label}
                       </button>
                    </div>
                ))}
                {/* Offer Link */}
                <div className="px-6">
                    <a href="#" className="block py-4 text-sm font-bold uppercase tracking-wide text-red-600 hover:text-red-700 border-b-2 border-transparent hover:border-red-600 transition-all">
                        Ofertas
                    </a>
                </div>
             </div>

             {/* The Mega Menu Dropdown - SCROLLABLE IMPLEMENTATION */}
             <div 
                 className={`absolute left-0 top-full w-full bg-white dark:bg-[#1a2c2c] shadow-xl border-t border-gray-100 dark:border-gray-700 transition-all duration-300 origin-top max-h-[70vh] overflow-y-auto custom-scrollbar ${hoveredCategory ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                 onMouseEnter={() => {/* keep open */}}
             >
                 {hoveredCategory && (
                     <div className="p-8 container mx-auto">
                          <div className="grid grid-cols-4 gap-x-8 gap-y-10 animate-fadeIn">
                            {menuCategories.find(c => c.id === hoveredCategory)?.items.map((item, idx) => (
                                <a key={idx} href="#" className="group block">
                                    <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-3 relative rounded-sm border border-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-bold">Ver Detalle</span>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-brand-teal transition-colors line-clamp-2 h-10 leading-tight">{item.name}</h4>
                                    <div className="flex justify-between items-center mt-1 border-t border-gray-50 pt-2">
                                        <span className="text-[10px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded truncate max-w-[60%]">{item.dimensions}</span>
                                        <span className="font-bold text-primary text-sm">{item.price}</span>
                                    </div>
                                </a>
                            ))}
                          </div>
                          
                          <div className="col-span-4 text-center mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                              <button 
                                 onClick={handleCatalogClick}
                                 className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-brand-teal hover:text-white text-xs font-bold uppercase tracking-widest text-brand-teal transition-all rounded-full"
                              >
                                 <span>Ver catálogo completo de {menuCategories.find(c => c.id === hoveredCategory)?.label}</span>
                                 <span className="material-symbols-outlined text-sm">arrow_forward</span>
                              </button>
                          </div>
                     </div>
                 )}
             </div>
          </div>
        </div>

        {/* CSS for Custom Scrollbar in Mega Menu */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #aaa;
          }
        `}</style>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-[#1a2c2c] p-4">
           <div className="flex justify-between items-center mb-6">
              <span className="font-black text-xl text-brand-teal dark:text-white">Ergo<span className="text-primary">natur</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="dark:text-white"><span className="material-symbols-outlined">close</span></button>
           </div>
           <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
              {menuCategories.map(cat => (
                 <div key={cat.id} className="border-b border-gray-100 dark:border-gray-700 pb-4">
                    <p className="font-bold text-lg mb-3 text-brand-teal dark:text-primary">{cat.label}</p>
                    <div className="grid grid-cols-2 gap-3">
                       {cat.items.slice(0, 6).map((item, i) => (
                         <div key={i} className="flex flex-col gap-1">
                           <img src={item.image} className="w-full h-24 object-cover rounded bg-gray-50" alt={item.name} />
                           <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                         </div>
                       ))}
                    </div>
                    {cat.items.length > 6 && (
                        <button className="text-xs text-primary font-bold mt-2">Ver {cat.items.length - 6} más...</button>
                    )}
                 </div>
              ))}
              <a href="#" className="font-bold text-lg text-red-600 mt-2">Ofertas</a>
           </div>
        </div>
      )}
    </>
  );
};
