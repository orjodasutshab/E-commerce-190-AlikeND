import { useState, useRef, useEffect, FormEvent } from 'react';
import {
  Search,
  MessageSquare,
  Bell,
  Heart,
  ShoppingCart,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Sliders,
  Menu,
  X,
  CreditCard,
  Briefcase,
  Store,
  Wallet,
  Sun,
  Moon
} from 'lucide-react';
import { PRODUCTS } from '../data/mockData';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, categoryFilter?: string) => void;
  cartCount: number;
  wishlistCount: number;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  user: { name: string; email: string; phone: string } | null;
  onLogout: () => void;
  onOpenAuthModal: (tab?: 'password' | 'otp' | 'register') => void;
  onSearch: (query: string) => void;
  isLightMode?: boolean;
  onToggleTheme?: () => void;
}

export default function Header({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  unreadMessagesCount,
  unreadNotificationsCount,
  user,
  onLogout,
  onOpenAuthModal,
  onSearch,
  isLightMode = false,
  onToggleTheme = () => {},
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('alike_recent_searches');
    return saved ? JSON.parse(saved) : ['Watch', 'iPhone', 'Gold Chronograph', 'Leather', 'Atelier Ghee'];
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (!recentSearches.includes(searchQuery.trim())) {
        const updated = [searchQuery.trim(), ...recentSearches.slice(0, 4)];
        setRecentSearches(updated);
        localStorage.setItem('alike_recent_searches', JSON.stringify(updated));
      }
    }
    onSearch(searchQuery);
    onNavigate('category_search');
    setShowAutocomplete(false);
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    onNavigate('category_search');
    setShowAutocomplete(false);
  };

  const handleSubnavClick = (view: string, category?: string) => {
    if (view === 'category_search') {
      onNavigate('category_search', category || 'all');
    } else {
      onNavigate(view);
    }
  };

  // Autocomplete Suggestions logic
  const filteredSuggestions = searchQuery.trim() === ''
    ? []
    : PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const defaultHeaderNotifications = [
    { id: 'n1', title: 'Luxury Dispatch Confirmed', desc: 'Your Aurelia Gold Watch is dispatched via high-efficiency segment 200.', time: '10 mins ago', unread: true },
    { id: 'n2', title: 'Atelier Coupon Unlocked', desc: 'Use premium code ALIKE10 to avail 10% loyalty discount on your cart.', time: '2 hours ago', unread: true },
    { id: 'n3', title: 'Secure Wallet Credit Active', desc: '₹15,000 complimentary segmented reserve is ready to checkout items.', time: '1 day ago', unread: false }
  ];

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0B1B32]/95 via-[#0D1E4C]/92 to-[#0B1B32]/95 backdrop-blur-xl border-b border-solid border-[#D4AF37]/35 shadow-[0_4px_25px_rgba(212,175,55,0.12)]">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          id="alike-logo-container"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#ffffff] via-[#f5e6c4] to-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.45)] group-hover:scale-105 transition-all">
            <span className="text-xl font-serif font-extrabold text-black">A</span>
            <div className="absolute inset-0 border border-solid border-white/20 rounded-lg"></div>
          </div>
          <span className="text-xl md:text-2xl font-serif font-semibold bg-gradient-to-r from-[#ffffff] via-[#f5e6c4] to-[#D4AF37] bg-clip-text text-transparent tracking-[0.16em] uppercase">
            ALIKE-ND
          </span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg relative" ref={searchRef}>
          <form
            onSubmit={handleSearchSubmit}
            className="w-full relative animate-fade-in"
            id="search-form-header"
          >
            <input
              id="search-input-header"
              type="text"
              placeholder="Search luxury products, wholesale deals..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAutocomplete(true);
              }}
              onFocus={() => setShowAutocomplete(true)}
              className="w-full px-5 py-2.5 pl-5 pr-12 bg-neutral-950/80 border border-solid border-[#26415E]/40 focus:border-[#D4AF37] rounded-full text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 shadow-[inset_0_2px_5px_rgba(0,0,0,0.6)] font-sans tracking-wide transition-all"
            />
            <button
              id="search-submit-btn-header"
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8.5 h-8.5 flex items-center justify-center bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:brightness-110 text-black rounded-full transition-all font-bold cursor-pointer"
              title="Search button"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Autocomplete suggestions dropdown */}
          {showAutocomplete && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-950 border border-solid border-[#D1D1D1]/30 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs py-3 animate-fade-in divide-y divide-neutral-900 border-t-2">
              {searchQuery.trim() === '' ? (
                <div className="px-4 pb-2 space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-extrabold pb-0.5">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <span
                        key={i}
                        onClick={() => handleSuggestionClick(term)}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-850 border border-solid border-neutral-800 hover:border-[#D1D1D1]/50 rounded-lg text-neutral-300 hover:text-[#D1D1D1] cursor-pointer transition-colors"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-extrabold">Hot categories suggestions</div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5 font-semibold text-neutral-400">
                    <span onClick={() => handleSuggestionClick('Watch')} className="hover:text-[#D1D1D1] cursor-pointer py-1 block">⌚ Luxury Chronographs</span>
                    <span onClick={() => handleSuggestionClick('Atelier')} className="hover:text-[#D1D1D1] cursor-pointer py-1 block">🍯 Organic Sourced Foods</span>
                    <span onClick={() => handleSuggestionClick('iPhone')} className="hover:text-[#D1D1D1] cursor-pointer py-1 block">📱 Smartphones & Tech</span>
                    <span onClick={() => handleSuggestionClick('Gold')} className="hover:text-[#D1D1D1] cursor-pointer py-1 block">💎 Elite Custom Jewellery</span>
                  </div>
                </div>
              ) : (
                <div className="py-1">
                  <div className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-extrabold pb-2">Matching Atelier segment items</div>
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onNavigate('product_' + item.id);
                          setShowAutocomplete(false);
                        }}
                        className="px-4 py-2 hover:bg-neutral-900/60 cursor-pointer flex items-center justify-between gap-3 text-neutral-300 hover:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover bg-neutral-900" referrerPolicy="no-referrer" />
                          <div className="truncate max-w-[220px]">
                            <p className="font-semibold truncate">{item.name}</p>
                            <p className="text-[10px] text-neutral-500 font-sans">{item.brand}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#D1D1D1] shrink-0">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-neutral-500 text-center italic">No luxury creations matched your query.</div>
                  )}
                  <div
                    onClick={() => handleSuggestionClick(searchQuery)}
                    className="mt-2 pt-2 px-4 border-t border-[#D1D1D1]/10 text-center text-[#D1D1D1] hover:underline cursor-pointer font-bold"
                  >
                    Examine wholesale matches for "{searchQuery}"
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

         {/* Right Side Icons & Auth Actions */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          
          {/* Messenger */}
          <button
            id="nav-messenger-btn"
            onClick={() => onNavigate('messenger')}
            className={`premium-nav-icon-btn text-neutral-400 hover:text-[#D4AF37] relative ${
              currentView === 'messenger' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : ''
            }`}
            title="Messenger"
          >
            <MessageSquare className="w-[22px] h-[22px]" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-solid border-[#0B1B32]">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications with interactive Dropdown panel */}
          <div className="relative" ref={notificationRef}>
            <button
              id="nav-notifications-btn"
              onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
              className={`premium-nav-icon-btn text-neutral-400 hover:text-[#D4AF37] relative ${
                notificationsDropdownOpen ? 'text-[#D4AF37] bg-[#D4AF37]/10' : ''
              }`}
              title="Notifications Panel"
            >
              <Bell className="w-[22px] h-[22px]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#D4AF37] text-black font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-solid border-[#0B1B32]">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notificationsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-neutral-950 border border-solid border-[#D1D1D1]/30 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs py-1 animate-fade-in divide-y divide-neutral-900 border-t-2">
                <div className="px-4 py-2.5 bg-neutral-950 flex justify-between items-center">
                  <span className="font-extrabold uppercase text-[10px] tracking-wider text-neutral-400 font-mono">My Notifications</span>
                  <span className="px-1.5 py-0.5 bg-[#D1D1D1]/20 text-[#D1D1D1] text-[9px] rounded font-bold">{unreadNotificationsCount} New</span>
                </div>
                <div className="max-h-[240px] overflow-y-auto divide-y divide-neutral-900">
                  {defaultHeaderNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 hover:bg-neutral-900/40 transition-colors cursor-pointer space-y-1 ${notif.unread ? 'bg-neutral-900/10' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <p className={`font-bold text-white transition-all ${notif.unread ? 'text-[#D1D1D1]' : ''}`}>{notif.title}</p>
                        <span className="text-[8px] text-neutral-500 shrink-0 font-mono mt-0.5">{notif.time}</span>
                      </div>
                      <p className="text-neutral-400 text-[10px] leading-relaxed">{notif.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 bg-neutral-950/70 text-center">
                  <button
                    onClick={() => {
                      onNavigate('notifications');
                      setNotificationsDropdownOpen(false);
                    }}
                    className="w-full py-1 text-xs text-[#D1D1D1] font-black hover:underline tracking-wide"
                  >
                    Enter Premium Log Book
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <button
            id="nav-wishlist-btn"
            onClick={() => onNavigate('wishlist')}
            className={`premium-nav-icon-btn text-neutral-400 hover:text-[#D4AF37] relative ${
              currentView === 'wishlist' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : ''
            }`}
            title="Wishlist"
          >
            <Heart className="w-[22px] h-[22px]" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#D4AF37] text-black font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-solid border-[#0B1B32]">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            id="nav-cart-btn"
            onClick={() => onNavigate('cart')}
            className={`premium-nav-icon-btn text-neutral-400 hover:text-[#D4AF37] relative ${
              currentView === 'cart' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : ''
            }`}
            title="Cart"
          >
            <ShoppingCart className="w-[22px] h-[22px]" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-green-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-solid border-[#0B1B32]">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Widget / authentication */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                id="user-menu-dropdown-trigger"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-solid border-[#D4AF37]/40 hover:border-[#D4AF37] bg-neutral-900/60 hover:bg-neutral-850 uppercase text-xs tracking-wider font-semibold transition-all text-[#D4AF37]"
                title="Account Settings"
              >
                <UserIcon className="w-4 h-4 text-neutral-300" />
                <span className="hidden sm:inline max-w-[80px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {/* Dropdown Box */}
              {userDropdownOpen && (
                <div
                  id="user-menu-dropdown"
                  className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-solid border-[#D1D1D1] rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-fade-in"
                >
                  <div className="px-4 py-2.5 border-b border-solid border-neutral-800 bg-neutral-950">
                    <p className="text-xs text-neutral-500">Logged in client</p>
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                  </div>
                  <button
                    id="menu-btn-profile"
                    onClick={() => {
                      onNavigate('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#D1D1D1]" />
                    My Luxury Profile
                  </button>
                  <button
                    id="menu-btn-orders"
                    onClick={() => {
                      onNavigate('orders');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#D1D1D1]" />
                    Order Book
                  </button>
                  <button
                    id="menu-btn-wallet"
                    onClick={() => {
                      onNavigate('wallet');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2"
                  >
                    <Wallet className="w-3.5 h-3.5 text-[#D1D1D1]" />
                    Alike Secure Wallet
                  </button>
                  <button
                    id="menu-btn-seller-dash"
                    onClick={() => {
                      onNavigate('seller_dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2"
                  >
                    <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Seller Dashboard
                  </button>
                  <button
                    id="menu-btn-theme-toggle"
                    onClick={() => {
                      onToggleTheme();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2"
                  >
                    {isLightMode ? (
                      <>
                        <Moon className="w-3.5 h-3.5 text-[#C48CB3]" />
                        <span>Switch to Dark/Blue Mode</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Switch to Light/Rose Mode</span>
                      </>
                    )}
                  </button>
                  <div className="border-t border-solid border-neutral-800 my-1"></div>
                  <button
                    id="menu-btn-logout"
                    onClick={() => {
                      onLogout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-950/20 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out Client
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={() => onOpenAuthModal('password')}
              className="px-4 py-1.5 uppercase font-extrabold text-[11px] tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:brightness-110 text-black rounded-lg shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Sub-navbar */}
      <div className="bg-[#050B14]/90 border-t border-solid border-[#26415E]/30 px-4 py-2 select-none animate-fade-in shadow-lg">
        <div className="max-w-7xl mx-auto flex gap-10 sm:gap-16 md:gap-20 justify-center items-center text-center whitespace-nowrap text-[13px] md:text-[14px] font-semibold px-4 py-1.5 tracking-wider">
          <button
            onClick={() => handleSubnavClick('home')}
            className={`nav-underline-anim hover:text-[#D4AF37] cursor-pointer py-1 transition-all duration-300 hover:scale-105 ${
              currentView === 'home' ? 'text-[#D4AF37] active font-bold' : 'text-neutral-100 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleSubnavClick('category_search', 'luxury')}
            className="nav-underline-anim text-[#D4AF37] font-bold py-1 transition-all duration-300 hover:scale-105 hover:brightness-110 active cursor-pointer"
          >
            ✨ Luxury Edition
          </button>
          <button
            onClick={() => handleSubnavClick('category_search', 'delivery')}
            className="nav-underline-anim text-amber-500 font-bold py-1 transition-all duration-300 hover:scale-105 hover:brightness-110 cursor-pointer"
          >
            ⚡ 20 Min Delivery
          </button>
        </div>
      </div>
    </header>
  );
}
