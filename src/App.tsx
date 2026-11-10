import { useState, useEffect } from 'react';
import { Product, CartItem, Order, Notification, WalletTransaction, Contact } from './types';
import { PRODUCTS, JOBS, TESTIMONIALS, INITIAL_NOTIFICATIONS, INITIAL_TRANSACTIONS, INITIAL_CONTACTS } from './data/mockData';

// Shared Layout Components
import Toast from './components/Toast';
import LoginModal from './components/LoginModal';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CategorySearch from './pages/CategorySearch';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Messenger from './pages/Messenger';
import JobsPortal from './pages/JobsPortal';
import SellerDashboard from './pages/SellerDashboard';
import SellerRegister from './pages/SellerRegister';
import NotificationsPage from './pages/Notifications';
import AIRecommendations from './pages/AIRecommendations';

import { X, ShoppingCart, Star } from 'lucide-react';

export default function App() {

  // Core Persistent State
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(() => {
    const saved = localStorage.getItem('alike_user');
    if (saved) return JSON.parse(saved);
    // Cold entry: provide an elegant default pre-authenticating entry so they check premium corridors instantly
    return { name: 'Vikram Malhotra', email: 'vikram.malhotra@alikeluxury.com', phone: '9999999999' };
  });

  const [isSeller, setIsSeller] = useState<boolean>(() => {
    return localStorage.getItem('alike_is_seller') === 'true';
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('alike_wallet_balance');
    return saved ? Number(saved) : 15000; // Cold credit to experiment checkout
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('alike_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('alike_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('alike_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('alike_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('alike_contacts_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_CONTACTS;
  });

  const [lastNonMessengerView, setLastNonMessengerView] = useState('home');
  const [lastNonMessengerScroll, setLastNonMessengerScroll] = useState(0);

  const [toastList, setToastList] = useState<{ id: string; msg: string; type: 'success' | 'error' | 'warning' | 'info' }[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);

  // 2.1 Quick View & 2.5 Product Compare state layers
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Standard Gold');

  // App Routing Visibility state
  const [currentView, setCurrentView] = useState('home');

  // 3.3 Theme & 1.4 Scroll Reveal Hooks
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return localStorage.getItem('alike_theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark');
    } else {
      document.body.classList.remove('light-mode');
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('alike_theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, { threshold: 0.08 });

      const elts = document.querySelectorAll('.product-card, .category-card, .section-header, .reveal-entry');
      elts.forEach(el => {
        el.classList.add('reveal-entry');
        observer.observe(el);
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [currentView]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCoupon, setActiveCoupon] = useState<string | undefined>(undefined);

  // Persists states in localStorage upon state updates
  useEffect(() => {
    localStorage.setItem('alike_user', user ? JSON.stringify(user) : '');
    localStorage.setItem('alike_is_seller', String(isSeller));
    localStorage.setItem('alike_wallet_balance', String(walletBalance));
    localStorage.setItem('alike_products', JSON.stringify(products));
    localStorage.setItem('alike_cart', JSON.stringify(cart));
    localStorage.setItem('alike_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('alike_orders', JSON.stringify(orders));
    localStorage.setItem('alike_contacts_v2', JSON.stringify(contacts));
  }, [user, isSeller, walletBalance, products, cart, wishlist, orders, contacts]);

  // Global Toast Dispatcher
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const freshToken = { id: Date.now().toString(), msg, type };
    setToastList((prev) => [...prev, freshToken]);
  };

  const removeToast = (id: string) => {
    setToastList((prev) => prev.filter((t) => t.id !== id));
  };

  // State mutation wrappers
  const handleAddToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    // Check if combined key exists
    const index = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor === color &&
        item.selectedSize === size
    );

    if (index > -1) {
      const fresh = [...cart];
      fresh[index].quantity += quantity;
      setCart(fresh);
    } else {
      setCart([...cart, { product, quantity, selectedColor: color, selectedSize: size }]);
    }
    showToast(`Added ${quantity}x ${product.name} to checkout bag!`, 'success');
  };

  const handleUpdateQuantity = (id: number, qty: number, color?: string, size?: string) => {
    if (qty < 1) {
      handleRemoveFromCart(id, color, size);
      return;
    }
    setCart(
      cart.map((item) =>
        item.product.id === id && item.selectedColor === color && item.selectedSize === size
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const handleRemoveFromCart = (id: number, color?: string, size?: string) => {
    setCart(
      cart.filter(
        (item) =>
          !(item.product.id === id && item.selectedColor === color && item.selectedSize === size)
      )
    );
    showToast('Removed item from shopping bag.', 'info');
  };

  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter((p) => p.id !== product.id));
      showToast('Removed product from wishlist.', 'info');
    } else {
      setWishlist([...wishlist, product]);
      showToast('Starred item into your saved wishlist.', 'success');
    }
  };

  const handleToggleCompare = (product: Product) => {
    const exists = comparedProducts.some((p) => p.id === product.id);
    if (exists) {
      setComparedProducts(comparedProducts.filter((p) => p.id !== product.id));
      showToast(`Removed "${product.name}" from compare matrix.`, 'info');
    } else {
      if (comparedProducts.length >= 3) {
        showToast('Maximum of 3 creations can be compared at once!', 'warning');
        return;
      }
      setComparedProducts([...comparedProducts, product]);
      showToast(`Added "${product.name}" to compare matrix.`, 'success');
    }
  };

  const handleAddMultipleToCart = (items: Product[]) => {
    const freshCart = [...cart];
    items.forEach((p) => {
      const index = freshCart.findIndex((item) => item.product.id === p.id);
      if (index > -1) {
        freshCart[index].quantity += 1;
      } else {
        freshCart.push({ product: p, quantity: 1 });
      }
    });
    setCart(freshCart);
  };

  const handleDeductWallet = (amt: number): boolean => {
    if (walletBalance < amt) return false;
    setWalletBalance((prev) => prev - amt);
    return true;
  };

  const handleAddWalletBalance = (amt: number) => {
    setWalletBalance((prev) => prev + amt);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setCart([]); // Reset basket
    setActiveCoupon(undefined);
  };

  // Navigations wrapper
  const handleNavigate = (view: string, categoryFilter?: string) => {
    if (view === 'messenger') {
      if (currentView === 'messenger') {
        const targetView = lastNonMessengerView;
        setCurrentView(targetView);
        setTimeout(() => {
          window.scrollTo({ top: lastNonMessengerScroll, behavior: 'smooth' });
        }, 100);
        return;
      } else {
        setLastNonMessengerView(currentView);
        setLastNonMessengerScroll(window.scrollY);
        setCurrentView('messenger');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (view !== 'search' && view !== 'category_search' && !view.startsWith('category_') && view !== 'detail' && !view.startsWith('product_')) {
      setSearchQuery('');
    }

    if (view === 'category_search') {
      setSelectedCategory(categoryFilter || 'all');
      setCurrentView('search');
    } else if (view.startsWith('product_')) {
      const pId = Number(view.replace('product_', ''));
      setSelectedProductId(pId);
      setCurrentView('detail');
    } else if (view.startsWith('category_')) {
      const catId = view.replace('category_', '');
      setSelectedCategory(catId);
      setCurrentView('search');
    } else {
      setCurrentView(view);
    }
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId) || products[0]
    : products[0];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-neutral-200 font-sans selection:bg-[#D1D1D1] selection:text-black antialiased relative">

      {/* 2. Global Toast and Login overlays */}
      <Toast toasts={toastList} onDismiss={removeToast} />
      
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={(userData) => {
          // Setup active session
          setUser({ name: userData.name, email: userData.email, phone: userData.phone });
          setLoginOpen(false);
          showToast(`Welcome inside Alike luxury corridors, ${userData.name}!`, 'success');
        }}
        onShowForgotPassword={() => {
          setLoginOpen(false);
          showToast('An OTP check corridor link has been triggered to coordinates.', 'info');
        }}
        showToast={showToast}
        isLightMode={isLightMode}
        onToggleTheme={() => setIsLightMode(!isLightMode)}
      />

      {/* 3. Sticky top navigational Header block */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        unreadMessagesCount={1}
        unreadNotificationsCount={2}
        user={user}
        onLogout={() => {
          setUser(null);
          setIsSeller(false);
          setCart([]);
          setWishlist([]);
          setOrders([]);
          showToast('Logged out of luxury segment session.', 'info');
          handleNavigate('home');
        }}
        onOpenAuthModal={(tab) => {
          setLoginOpen(true);
        }}
        onSearch={(q) => {
          setSearchQuery(q);
          if (currentView !== 'search') {
            setCurrentView('search');
          }
        }}
        isLightMode={isLightMode}
        onToggleTheme={() => setIsLightMode(!isLightMode)}
      />

      {/* 4. Sub-page router dispatcher */}
      <main className="flex-grow pt-0 pb-16 relative z-10" id="main-spa-body">
        <div key={currentView} className="animate-page-in">
          {currentView === 'home' && (
          <Home
            products={products}
            jobs={JOBS}
            testimonials={TESTIMONIALS}
            onSelectProduct={(p) => handleNavigate('product_' + p.id)}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onToggleWishlist={handleToggleWishlist}
            wishlistedIds={wishlist.map((p) => p.id)}
            onNavigate={handleNavigate}
            onCompare={handleToggleCompare}
            onQuickView={setQuickViewProduct}
          />
        )}

        {currentView === 'detail' && (
          <ProductDetail
            product={activeProduct}
            allProducts={products}
            onAddToCart={handleAddToCart}
            onAddToCartAndCheckout={(p, qty, color, size) => {
              handleAddToCart(p, qty, color, size);
              handleNavigate('checkout');
            }}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={(p) => handleNavigate('product_' + p.id)}
            isWishlisted={wishlist.some((p) => p.id === activeProduct.id)}
            showToast={showToast}
          />
        )}

        {currentView === 'search' && (
          <CategorySearch
            products={products}
            initialCategory={selectedCategory}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={(p) => handleNavigate('product_' + p.id)}
            onCompare={handleToggleCompare}
            onQuickView={setQuickViewProduct}
            wishlistedIds={wishlist.map((p) => p.id)}
            searchQuery={searchQuery}
            showToast={showToast}
          />
        )}

        {currentView === 'cart' && (
          <Cart
            cartItems={cart}
            allProducts={products}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onSelectProduct={(p) => handleNavigate('product_' + p.id)}
            onProceedToCheckout={(coupon) => {
              if (coupon) setActiveCoupon(coupon);
              handleNavigate('checkout');
            }}
            showToast={showToast}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout
            cartItems={cart}
            couponCode={activeCoupon}
            walletBalance={walletBalance}
            onDeductWallet={handleDeductWallet}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        )}

        {currentView === 'profile' && (
          <Profile
            user={user}
            onUpdateUser={(u) => setUser(u)}
            orders={orders}
            wishlist={wishlist}
            onRemoveWishlistItem={handleToggleWishlist}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onNavigate={handleNavigate}
            walletBalance={walletBalance}
            transactions={INITIAL_TRANSACTIONS}
            onAddWalletBalance={handleAddWalletBalance}
            showToast={showToast}
          />
        )}

        {currentView === 'messenger' && (
          <Messenger
            contacts={contacts}
            setContacts={setContacts}
            showToast={showToast}
            user={user}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'jobs' && (
          <JobsPortal
            jobs={JOBS}
            showToast={showToast}
          />
        )}

        {currentView === 'seller_register' && (
          <SellerRegister
            onRegisterSuccess={() => {
              setIsSeller(true);
              handleNavigate('seller_dashboard');
            }}
            showToast={showToast}
          />
        )}

        {currentView === 'seller_dashboard' && (
          <SellerDashboard
            products={products}
            onAddProduct={(p) => setProducts([p, ...products])}
            onRemoveProduct={(id) => setProducts(products.filter((p) => p.id !== id))}
            showToast={showToast}
          />
        )}

        {currentView === 'notifications' && (
          <NotificationsPage
            notifications={INITIAL_NOTIFICATIONS}
            showToast={showToast}
          />
        )}

        {currentView === 'ai_recs' && (
          <AIRecommendations
            products={products}
            onAddMultipleToCart={handleAddMultipleToCart}
            onSelectProduct={(p) => handleNavigate('product_' + p.id)}
            showToast={showToast}
          />
        )}
        </div>
      </main>

      {/* 5. Elegant footer of the unified platform */}
      <Footer onNavigate={handleNavigate} />

      {/* 2.1 Product Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-neutral-950 border-2 border-solid border-[#D1D1D1]/40 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl glass-panel relative p-6 md:p-8 flex flex-col md:flex-row gap-8 scale-in animate-page-in" onClick={(e) => e.stopPropagation()}>
            
            {/* Close button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 bg-neutral-900 border border-solid border-neutral-850 hover:bg-[#D1D1D1] text-neutral-400 hover:text-black rounded-full transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image section */}
            <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-neutral-950 border border-solid border-neutral-850">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info details */}
            <div className="w-full md:w-1/2 flex flex-col justify-between py-1 space-y-4">
              <div>
                <span className="text-[10px] text-[#D1D1D1] uppercase tracking-widest font-black font-mono">
                  {quickViewProduct.brand}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white leading-snug mt-1.5 font-sans">
                  {quickViewProduct.name}
                </h2>

                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex items-center text-[#D1D1D1] bg-neutral-900 px-2 py-0.5 border border-solid border-neutral-800 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold text-white ml-2">{quickViewProduct.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-neutral-500 text-xs">·</span>
                  <span className="text-neutral-400 text-xs font-medium">({quickViewProduct.reviewsCount} premium reviews)</span>
                </div>

                <div className="mt-4 pt-3 border-t border-solid border-neutral-900 space-y-1">
                  <p className="text-[10px] text-neutral-500 uppercase font-mono tracking-widest">Atelier Description</p>
                  <p className="text-neutral-300 text-xs leading-relaxed font-sans mt-0.5">
                    {quickViewProduct.description}
                  </p>
                </div>
              </div>

              {/* Options selection */}
              <div className="space-y-4 pt-4 border-t border-solid border-[#D1D1D1]/10">
                <div className="space-y-2">
                  <p className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider font-extrabold">Grade Choice</p>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-1 text-xs font-bold rounded-lg border border-solid transition-colors cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#D1D1D1] border-[#D1D1D1] text-black font-extrabold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider font-extrabold">Surface Polish</p>
                  <div className="flex gap-2">
                    {['Standard Gold', 'Sterling Silver', 'Imperial Amber'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border border-solid transition-colors cursor-pointer ${
                          selectedColor === color
                            ? 'bg-[#D1D1D1] border-[#D1D1D1] text-black font-extrabold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price block */}
              <div className="pt-4 border-t border-solid border-neutral-900">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-black text-[#D1D1D1]">₹{quickViewProduct.price.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-neutral-500 line-through">₹{quickViewProduct.mrp.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      handleAddToCart(quickViewProduct, 1, selectedColor, selectedSize);
                      setQuickViewProduct(null);
                    }}
                    className="flex-grow py-3 bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black hover:opacity-90 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-black" />
                    Reserve Signature Copy
                  </button>
                  <button
                    onClick={() => {
                      setQuickViewProduct(null);
                      handleNavigate('product_' + quickViewProduct.id);
                    }}
                    className="px-4 py-3 bg-neutral-900 hover:bg-neutral-850 hover:text-[#D1D1D1] rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-400 border border-solid border-neutral-800 transition-colors cursor-pointer"
                  >
                    Deep View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2.5 Compare Sticky Bottom Drawer Panel */}
      {comparedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-950/95 border-t-2 border-solid border-[#D1D1D1]/40 backdrop-blur-lg p-4 z-40 shadow-2xl flex items-center justify-between gap-4 max-w-7xl mx-auto rounded-t-3xl animate-page-in">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <p className="text-xs font-black text-white uppercase tracking-wider">Comparison Corridor</p>
              <p className="text-[10px] text-neutral-500">{comparedProducts.length} premium creations selected</p>
            </div>
            <div className="flex gap-2">
              {comparedProducts.map((p) => (
                <div key={p.id} className="relative group w-12 h-12 rounded-lg overflow-hidden border border-solid border-neutral-800">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    onClick={() => setComparedProducts(comparedProducts.filter((item) => item.id !== p.id))}
                    className="absolute -top-1 -right-1 bg-neutral-900 border border-solid border-[#D1D1D1]/30 p-0.5 rounded-full text-neutral-400 hover:text-[#D1D1D1] shadow transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setComparedProducts([])}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-[#D1D1D1] rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              Purge Matrix
            </button>
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-5 py-2 bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black font-black uppercase rounded-xl text-[10px] tracking-wider transition-all shadow-lg cursor-pointer"
            >
              Compare Specs ({comparedProducts.length})
            </button>
          </div>
        </div>
      )}

      {/* 2.5 Detailed Attribute Compare Specification Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={() => setShowCompareModal(false)}>
          <div className="bg-neutral-950 border-2 border-solid border-[#D1D1D1]/40 rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-2xl glass-panel relative p-6 scale-in animate-page-in" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 p-2 bg-neutral-900 border border-solid border-neutral-850 hover:bg-[#D1D1D1] text-neutral-400 hover:text-black rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-mono uppercase tracking-wider mb-6 bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] bg-clip-text text-transparent font-extrabold">Detailed Spec Comparison Matrix</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300 border-collapse">
                <thead>
                  <tr className="border-b border-solid border-neutral-900">
                    <th className="py-4 pr-4 uppercase text-[10px] tracking-wider text-neutral-500 font-extrabold font-mono w-48">Spec Key</th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="py-4 px-4 w-64 min-w-[200px]">
                        <div className="space-y-2">
                          <img src={p.image} alt={p.name} className="w-24 h-24 rounded-lg object-cover bg-neutral-900 border border-solid border-neutral-800" referrerPolicy="no-referrer" />
                          <h4 className="font-bold text-white font-sans text-sm line-clamp-1">{p.name}</h4>
                          <span className="text-[9px] uppercase font-mono tracking-wider text-[#D1D1D1] bg-[#D1D1D1]/20 px-2 py-0.5 rounded-full">{p.brand}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  <tr>
                    <td className="py-4 pr-4 uppercase text-[10px] tracking-wider text-neutral-500 font-extrabold font-mono">Price Point</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-4 text-sm font-black text-[#D1D1D1]">₹{p.price.toLocaleString('en-IN')}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 uppercase text-[10px] tracking-wider text-neutral-500 font-extrabold font-mono">MRP Value</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-4 text-xs text-neutral-400 line-through">₹{p.mrp.toLocaleString('en-IN')}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 uppercase text-[10px] tracking-wider text-neutral-500 font-extrabold font-mono font-black">Atelier Rating</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-4">
                        <div className="flex items-center text-[#D1D1D1] font-bold">
                          <Star className="w-3.5 h-3.5 fill-current mr-1" />
                          {p.rating.toFixed(1)} / 5.0
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 uppercase text-[10px] tracking-wider text-neutral-500 font-extrabold font-mono font-black">Reviews Count</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-4">{p.reviewsCount} buyers</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 uppercase text-[10px] tracking-wider text-neutral-500 font-extrabold font-mono font-black">Level Layer</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-4 capitalize font-mono text-[11px] text-[#D1D1D1]">{p.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 uppercase text-[10px] tracking-wider text-neutral-500 font-extrabold font-mono font-black">Description notes</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-4 text-neutral-400 text-[11px] leading-relaxed max-w-[200px] line-clamp-3">{p.description}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 uppercase text-[10px] tracking-wider text-neutral-500 font-extrabold font-mono">Action Corridor</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-4 px-4">
                        <button
                          onClick={() => {
                            handleAddToCart(p);
                            setShowCompareModal(false);
                            setComparedProducts([]);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] hover:opacity-90 text-black font-black uppercase text-[10px] tracking-wider rounded-lg transition-all shadow cursor-pointer"
                        >
                          Add to Bag
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
