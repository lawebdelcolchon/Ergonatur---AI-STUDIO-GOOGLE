
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductGallery } from './components/ProductGallery';
import { ProductInfo } from './components/ProductInfo';
import { RelatedProducts } from './components/RelatedProducts';
import { CartDrawer } from './components/CartDrawer';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { HomePage } from './components/HomePage';
import { Footer } from './components/Footer';
import { NotificationToast, Notification } from './components/NotificationToast';
import { SearchResultsPage } from './components/SearchResultsPage';
import { CatalogPage } from './components/CatalogPage';
import { Product, RelatedProduct, CartItem, User, Order, WishlistItem } from './types';

// API Config
const API_URL = 'https://decorlujo.com/server_api/api/products';
const API_KEY = '9c70933aff6b2a6d08c687a6cbb6b765';

// Fallback data in case API fails
const fallbackProductData: Product = {
  id: 'velvet-chair-001',
  name: 'Sillón de Terciopelo',
  price: 299.00,
  rating: 4.5,
  reviewCount: 125,
  description: 'Una mezcla perfecta de diseño moderno y confort atemporal. Tapizado en terciopelo suave, este sillón añade un toque de sofisticación a cualquier habitación.',
  images: [
    { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVfN0eUqxUhxugX31yoKdoPmXpa0aXeM0lXDBUWPrRgh3VR98twQ8UqubS7DZhg4vf1fKPkZr_blHvs2pCw51O6VyMHe9bMy2_It7gPYwOh9AA4BaojgTJfkidgf0FaEzDtZUDWV-JGtV4rTHed8ar0MNDLQeY9YXG0WSXbFkf9GvHOiBYYrsVXYdhzO-heKOGB5QnIoMAMbYpTlq_Qk2LAdNZhmsTLzGI85QMuHVlIUaX_VxJZL_vI7sch6n7oHFdzPaxCJPL4R4', alt: 'Vista Principal', associatedColor: '#2E4636' },
    { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeyp-qa-L1d3MZTsBn8oHmCUkHI_JQ9xt4sNOy2_GXOSe_7C5_VDmQ8XDWX0U7FJ2zM9_VQVZCK5czDvGmR9Dg3VaLT51O2xUEsiAIW32YLNrbvkyso7xuz_Oa26YD-9UOBJLNa-A0Sd2dZy001UogrjTW0T9kYtbX28-LHQnlWitq_aegYfNuhHhOBVeTEBUTHr7GidptRVplaF5cQqT3Od6_oAcMq9doAoGodj0ldkhm62Ki0OSRfF5pUKdDqAzIXFQvTsPT0A0', alt: 'Vista Frontal', associatedColor: '#E2725B' },
    { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdMDR0PhXqwSJz3utdL9NQ9FGSjSmGy8nUvBp6NVoEqszii-YQPfmscR57qtorSt-IpuXbj2vygxnrOfMenjuOwilP_eCqOF1Nbbssya9ZWbvazACtl7zm1vOUZUJLslDC5-pBux0vLhHUtQCKAl7wcj17B1jc5c6DWzFp87bPcov3XulfFLcIewcabDD2Kc0s6L0_5N3SBj7NgxGS4vVLdSy3EHov9Syua9Ln_DvbFXd0YmLwBiNGKG0Kg0StgOcnDCrMkb9CTrY', alt: 'Vista Lateral', associatedColor: '#4682B4' },
    { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWnhNrnbdqsQee0_uxyXhSL8AiuUniSXZTWbuhXS7ncFbauGk0fbG8LqpDv1GaBWIDv8lIW2rJROmGvE9qXwBfn55sO5jbo76vwHNmtj-QSUvkiZFIylJA-fvSewD13JLXrNOyUCcQm9HHi6gW3pU0iD8V0b6uErFRPGF-CTEqC-LBNBB9afWLGxpQMTJiQLriJmrThJr1rOOrLb2OjdQGZmDfBG8KEv5YDHJfpW4nYYUd0tpTozo3hrhqipK3wv3kPt83FgV2UIs', alt: 'Detalle Textura', associatedColor: '#C0C0C0' },
    { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWbiy8TTxD2bq7-Yw8bGpIKudQwFmXK5lmB0rg2VY_t401X4nahVJWuvcnW5mq_8cA2y5p4XvOC_uP8DnQcI7OvRC8Z5jPvYwmFwvmV0WBkdmfMphY6K4pHm8OmAOyeFHhaoc9-N23OfX5YLfBhxBy_h--78TUgFKRXk12ymxKCe6Y5ezdqQ7VMjUWCNTPjsJ_o2h6TgYCkLHnlDurnCLw5leGbCiR-u1oX0kNpPPN_VsBpqCkZAFhK1QfSgnTlWE-8JXLczETd5M', alt: 'Estilo de Vida' },
  ],
  colors: ['#2E4636', '#E2725B', '#4682B4', '#C0C0C0'],
  legsOptions: ['Con Patas', 'Sin Patas'],
  sizes: ['Estándar', 'Grande', 'Extra Grande'],
};

const relatedProductsData: RelatedProduct[] = [
  { id: 1, name: 'Sofá Minimalista', price: 799.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI1krNedjT3HfNBh7MlRx8KLK-tnHGP5btCR5SHgXzT9hyHNXfWh3Z3vk5AhDQB75FVz_IiXV-lb_xvmniEeoTObsPQKfAspz6HGAn5Waey3hIAMuO8iQMzYgV5fYu-hVSxiA1LjyFa_u9JRvKSFKOzm-1Z0bii_rOSeOQNUA02f8ty6bFmg-h3rfaAqlFe-AAEHXshfdJ4ZoP5e7_FHRpGH1gET2csPxlj5CH1h0e8RaZbbHYA1V1LN5Rl3i9IhXAxHRxr_I3xt4' },
  { id: 2, name: 'Mesa de Café Roble', price: 149.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY49ElfaJvr3IhV9rYMIeklkY0d7JXya7CCtxfEuydWL_kMCCrD5ssh4nD79fiM9cgZaBkq9t1091K5PQkdEI2X56mlBk6tG2jMm3_WG51o3kjO3c1NB-gqYiXAZ85ussNdHdJ6wGCYu0QtIlD_9vlYPFbntvqkdQtVI1F-nfolqPJlLzNPMl_AWIuDf5KwvpSoJUiuLX2oSA3qgtwtxfzIqNuSQ4Xrdlu8RAD38H0X7lbUbYYMwdGq56j-7NWkv3QJKeeM_gTw7E' },
  { id: 3, name: 'Lámpara Escandinava', price: 99.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWOLrtbh5JamVCINeXiu9l83BNjHDnU7D2GltxPre95pd3qCHxVhu5itpM30J9hE3anWV7HobS8i2Xy6hAPUBDNlSmxsiQn_u3-odIEsqR7caGJoCv1wSX9xStXLSz07PBwpKPhj88JfLaFHCs7zI5PJMcaN2bUxXynaCuEvVvPcdSh4-wdNrSXbLW14OwWQC0qpM1bpKNHfBTywc90tP65JlJBorbHzk3pTGQOyCiPJvfjdzSnQzrekcrIFF62PAqvH_DbxTLy1s' },
  { id: 4, name: 'Alfombra Suave', price: 249.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzmM_96Gj_xfPlT2V4gOtDTc8s17dNiHpUbOQA1l4sN6AYjuDvZSeLJiozeqqsEr2LJSQ-052Ox19DhxedKkHfqshnDaOZkerqACPg1L2tK5oWz4l2cWhV0FyVz72svHIRBRlaeNzxrBQMgzkkbtLk35WpvCBoIiRol0OdFtelfbMPl6zEVPHuJpQB3yrw6bB7QdmHsHmnZCU_OPcS5pNoGyutKoph7FKP6JIDLCh0hr2QWiqCG8-3pEffw0AQlSksO-j6pzQnHm4' },
];

const App: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // View State
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'checkout' | 'profile' | 'search-results' | 'catalog'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<string | null>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Favorites State
  const [favorites, setFavorites] = useState<WishlistItem[]>([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // User & Auth State
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.data || []);
        const mainProductData = products.length > 0 ? products[0] : null;

        if (mainProductData) {
          // Map API data to Product interface
          const mappedProduct: Product = {
            id: mainProductData.id || mainProductData._id || 'api-prod-1',
            name: mainProductData.name || mainProductData.title || 'Producto Sin Nombre',
            price: parseFloat(mainProductData.price) || 299.00,
            rating: mainProductData.rating || 4.5,
            reviewCount: mainProductData.reviewCount || 12,
            description: mainProductData.description || mainProductData.body || 'Descripción no disponible.',
            images: Array.isArray(mainProductData.images) && mainProductData.images.length > 0 
              ? mainProductData.images.map((img: any) => ({
                  src: typeof img === 'string' ? img : (img.url || img.src),
                  alt: mainProductData.name || 'Product Image',
                  associatedColor: img.associatedColor
                }))
              : fallbackProductData.images,
            colors: mainProductData.colors || fallbackProductData.colors,
            legsOptions: mainProductData.legsOptions || fallbackProductData.legsOptions,
            sizes: mainProductData.sizes || fallbackProductData.sizes,
          };
          
          setProduct(mappedProduct);
          setSelectedColor(mappedProduct.colors.length > 0 ? mappedProduct.colors[0] : '');
        } else {
           throw new Error("No products found");
        }
      } catch (error) {
        console.error("Error fetching data, using fallback:", error);
        setProduct(fallbackProductData);
        setSelectedColor(fallbackProductData.colors[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // Simulate Order Status Updates
  useEffect(() => {
    if (orders.length === 0) return;

    const statusInterval = setInterval(() => {
      setOrders(prevOrders => {
        let hasChanged = false;
        const updatedOrders = prevOrders.map(order => {
          // Only update recent pending or processing orders for simulation
          if (order.status === 'pending' && Math.random() > 0.7) {
            hasChanged = true;
            addNotification(`El pedido #${order.id} está siendo procesado.`, 'info', 'Actualización de Estado');
            return { ...order, status: 'processing' as const };
          }
          if (order.status === 'processing' && Math.random() > 0.8) {
            hasChanged = true;
            addNotification(`¡Tu pedido #${order.id} ha sido enviado!`, 'success', 'Enviado');
            return { ...order, status: 'shipped' as const };
          }
          return order;
        });
        return hasChanged ? updatedOrders : prevOrders;
      });
    }, 8000); // Check every 8 seconds

    return () => clearInterval(statusInterval);
  }, [orders]);

  const addNotification = (message: string, type: 'success' | 'info' | 'warning' = 'info', title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type, title }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (product) {
      const imageIndex = product.images.findIndex(img => img.associatedColor === color);
      if (imageIndex !== -1) {
        setActiveImageIndex(imageIndex);
      }
    }
  };

  const handleImageSelect = (index: number) => {
    setActiveImageIndex(index);
    if (product) {
      const associatedColor = product.images[index].associatedColor;
      if (associatedColor) {
        setSelectedColor(associatedColor);
      }
    }
  };

  // Cart Logic
  const addToCart = (newItem: Omit<CartItem, 'uniqueId'>) => {
    const uniqueId = `${newItem.productId}-${newItem.selectedColor}-${newItem.selectedSize}-${newItem.selectedLegs}`;
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.uniqueId === uniqueId);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        return [...prevItems, { ...newItem, uniqueId }];
      }
    });
    
    setIsCartOpen(true); 
    addNotification(`Has añadido ${newItem.name} al carrito`, 'success');
  };

  const updateCartQuantity = (uniqueId: string, delta: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.uniqueId === uniqueId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (uniqueId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.uniqueId !== uniqueId));
  };

  // Favorites Logic
  const toggleFavorite = (item: WishlistItem) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === item.id);
      if (exists) {
        addNotification(`${item.name} eliminado de favoritos`, 'info');
        return prev.filter(fav => fav.id !== item.id);
      } else {
        addNotification(`${item.name} añadido a favoritos`, 'success');
        return [...prev, item];
      }
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  // Navigation Logic
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };

  const handleBackToShop = () => {
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  const handleNavigateToProduct = (productId: string) => {
    setCurrentView('product');
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search-results');
    window.scrollTo(0, 0);
  };
  
  const handleNavigateToCatalog = (category?: string) => {
     setCatalogCategory(category || null);
     setCurrentView('catalog');
     window.scrollTo(0, 0);
  };

  const handlePlaceOrder = (orderData: any) => {
    const orderId = Math.floor(Math.random() * 1000000).toString();
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'pending',
      total: orderData.total,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod
    };

    if (user) {
      setOrders(prev => [newOrder, ...prev]);
    }

    setCartItems([]);
    addNotification(`Pedido #${orderId} realizado con éxito`, 'success', '¡Gracias por tu compra!');
    
    if (user) {
      setCurrentView('profile');
    } else {
      setCurrentView('home');
    }
    window.scrollTo(0, 0);
  };

  // Auth Logic
  const handleUserClick = () => {
    if (user) {
      setCurrentView('profile');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    addNotification(`Bienvenido, ${userData.firstName}`, 'success');
    setOrders([
      {
        id: '982374',
        date: new Date(Date.now() - 86400000 * 5).toISOString(), 
        status: 'delivered',
        total: 149.00,
        paymentMethod: 'credit_card',
        shippingAddress: 'Calle Principal 123, Madrid',
        items: [
          {
            uniqueId: 'item-old-1',
            productId: '2',
            name: 'Mesa de Café Roble',
            price: 149.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY49ElfaJvr3IhV9rYMIeklkY0d7JXya7CCtxfEuydWL_kMCCrD5ssh4nD79fiM9cgZaBkq9t1091K5PQkdEI2X56mlBk6tG2jMm3_WG51o3kjO3c1NB-gqYiXAZ85ussNdHdJ6wGCYu0QtIlD_9vlYPFbntvqkdQtVI1F-nfolqPJlLzNPMl_AWIuDf5KwvpSoJUiuLX2oSA3qgtwtxfzIqNuSQ4Xrdlu8RAD38H0X7lbUbYYMwdGq56j-7NWkv3QJKeeM_gTw7E',
            quantity: 1,
            selectedColor: '#8B4513',
            selectedSize: 'Estándar',
            selectedLegs: 'Madera'
          }
        ]
      }
    ]);
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    setCurrentView('home');
    addNotification('Has cerrado sesión correctamente', 'info');
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-primary text-xl font-bold animate-pulse">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar 
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          favoritesCount={favorites.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onUserClick={handleUserClick}
          onNavigateHome={() => { setCurrentView('home'); window.scrollTo(0,0); }}
          onNavigateToProduct={handleNavigateToProduct}
          onNavigateToCatalog={handleNavigateToCatalog}
          onSearch={handleSearch}
          user={user}
        />
        
        {/* Adjusted Main Container to allow Full Width for Home and Catalog */}
        <main className={`w-full mx-auto ${['home', 'catalog'].includes(currentView) ? 'flex-1' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-8'}`}>
          
          {currentView === 'home' && (
             <HomePage 
               onNavigateToProduct={handleNavigateToProduct} 
               onToggleFavorite={toggleFavorite}
               isFavorite={isFavorite}
             />
          )}

          {currentView === 'search-results' && (
            <SearchResultsPage 
              query={searchQuery}
              onNavigateToProduct={handleNavigateToProduct}
              onBackToShop={handleBackToShop}
              onSearch={handleSearch}
            />
          )}

          {currentView === 'catalog' && (
            <CatalogPage 
               initialCategory={catalogCategory}
               onNavigateToProduct={handleNavigateToProduct}
               onBackToShop={handleBackToShop}
            />
          )}

          {currentView === 'product' && product && (
            <div className="animate-fadeIn">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap gap-2 py-4">
                <button onClick={handleBackToShop} className="text-[#888888] text-sm font-medium leading-normal hover:text-primary transition-colors">Inicio</button>
                <span className="text-[#888888] text-sm font-medium leading-normal">/</span>
                <span className="text-[#888888] text-sm font-medium leading-normal">Productos</span>
                <span className="text-[#888888] text-sm font-medium leading-normal">/</span>
                <span className="text-[#333333] dark:text-gray-200 text-sm font-medium leading-normal">{product.name}</span>
              </div>

              {/* Product Detail Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
                <ProductGallery 
                  images={product.images} 
                  activeIndex={activeImageIndex}
                  onImageSelect={handleImageSelect}
                />
                <ProductInfo 
                  product={product} 
                  selectedColor={selectedColor}
                  isFavorite={isFavorite(product.id)}
                  onColorChange={handleColorChange}
                  onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite}
                />
              </div>

              <RelatedProducts products={relatedProductsData} />
            </div>
          )}

          {currentView === 'checkout' && (
            <CheckoutPage 
              cartItems={cartItems} 
              onBackToShop={handleBackToShop}
              onPlaceOrder={handlePlaceOrder}
              user={user}
            />
          )}

          {currentView === 'profile' && user && (
            <UserProfile 
              user={user}
              orders={orders}
              onLogout={handleLogout}
              onBackToShop={handleBackToShop}
            />
          )}
        </main>

        <Footer />
      </div>

      {/* Cart Drawer Overlay */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleProceedToCheckout}
        onNavigateToProduct={handleNavigateToProduct}
      />

      {/* Favorites Drawer Overlay */}
      <FavoritesDrawer 
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={removeFromFavorites}
        onAddToCart={addToCart}
        onNavigateToProduct={handleNavigateToProduct}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin}
      />

      {/* Notification Toasts */}
      <NotificationToast 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default App;
