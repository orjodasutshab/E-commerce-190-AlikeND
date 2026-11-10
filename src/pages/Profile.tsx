import { useState, FormEvent } from 'react';
import {
  User,
  ShoppingBag,
  Heart,
  ChevronRight,
  Settings,
  CreditCard,
  MapPin,
  Plus,
  Trash2,
  Lock,
  Gift,
  Calendar,
  Phone,
  Mail,
  Truck,
  Sparkles,
  Award
} from 'lucide-react';
import { Address, Order, Product, WalletTransaction } from '../types';

interface ProfileProps {
  user: { name: string; email: string; phone: string } | null;
  onUpdateUser: (userData: { name: string; email: string; phone: string }) => void;
  orders: Order[];
  wishlist: Product[];
  onRemoveWishlistItem: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onNavigate: (view: string) => void;
  walletBalance: number;
  transactions: WalletTransaction[];
  onAddWalletBalance: (amt: number) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function Profile({
  user,
  onUpdateUser,
  orders,
  wishlist,
  onRemoveWishlistItem,
  onAddToCart,
  onNavigate,
  walletBalance,
  transactions,
  onAddWalletBalance,
  showToast,
}: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings' | 'wishlist' | 'payments'>('orders');

  // Account Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState('1990-11-20');
  
  // Password change states
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Top-up modal states
  const [topupAmount, setTopupAmount] = useState<number>(5000);

  // Address catalog states
  const [addrs, setAddrs] = useState<Address[]>([
    { id: 'addr-1', name: user?.name || 'Vikram Malhotra', phone: user?.phone || '9999999999', street: 'Penthouse 1202, Royal Residency, Juhu Gold Hill', city: 'Mumbai', state: 'Maharashtra', zip: '400049', isDefault: true }
  ]);

  // Payment credit cards list states
  const [cards, setCards] = useState([
    { id: 'card-1', last4: '9481', holder: user?.name || 'VIKRAM MALHOTRA', brand: 'Visa Platinum', expiry: '12/29' }
  ]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-4">
        <div className="p-4 bg-neutral-900 border border-solid border-neutral-850 rounded-2xl">
          <p className="text-sm text-neutral-400">Please authenticate to inspect your luxury dashboard.</p>
        </div>
      </div>
    );
  }

  const handleUpdateAccount = (e: FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, email, phone });
    showToast('Your Luxury Client account settings has updated!', 'success');
  };

  const handleAddBalance = () => {
    onAddWalletBalance(topupAmount);
    showToast(`Successfully added ₹${topupAmount.toLocaleString('en-IN')} to Secure Wallet!`, 'success');
  };

  const handleRemoveAddress = (id: string) => {
    setAddrs(addrs.filter(a => a.id !== id));
    showToast('Delivery destination address deleted.', 'info');
  };

  const handleAddAddress = () => {
    const fresh: Address = {
      id: `addr-${Date.now()}`,
      name: user.name,
      phone: user.phone,
      street: 'New High Rise Complex 8th Boulevard',
      city: 'Delhi',
      state: 'NCR',
      zip: '110001'
    };
    setAddrs([...addrs, fresh]);
    showToast('Added quick Delhi companion address placeholder!', 'success');
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    showToast('Credit card token unlinked.', 'info');
  };

  const handleAddCard = () => {
    const fCard = {
      id: `card-${Date.now()}`,
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      holder: user.name.toUpperCase(),
      brand: 'Mastercard Elite',
      expiry: '09/30'
    };
    setCards([...cards, fCard]);
    showToast('Linked virtual Mastercard Elite checkout token!', 'success');
  };

  return (
    <div id="profile-root" className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* 1. Profile Elegant Header Card */}
      <div className="bg-neutral-900 border border-solid border-[#D1D1D1] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden" id="profile-header-card">
        <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
          {/* Avatar initial circle */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] flex items-center justify-center border-2 border-solid border-neutral-950 shadow-lg text-black font-black text-3xl shrink-0 uppercase select-none">
            {user.name.charAt(0)}
            <span className="absolute bottom-0 right-0 p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-solid border-neutral-700 text-[#D1D1D1] hover:text-white rounded-full cursor-pointer" title="Edit avatar">
              <Settings className="w-3.5 h-3.5 animate-spin-slow" />
            </span>
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5 justify-center sm:justify-start">
              {user.name} <Award className="w-4.5 h-4.5 text-neutral-300 hover:animate-bounce cursor-pointer" />
            </h2>
            <p className="text-xs text-neutral-400 font-semibold">{user.email} · {user.phone}</p>
            <div className="flex gap-2 justify-center sm:justify-start">
              <span className="px-2.5 py-0.5 bg-[#D1D1D1]/10 text-neutral-400 border border-solid border-[#D1D1D1]/30 rounded-full text-[9px] uppercase font-mono font-bold">
                Level 3 Platinum Vault Account
              </span>
            </div>
          </div>
        </div>

        {/* Aggregate Stats bar inside Header */}
        <div className="grid grid-cols-3 gap-5 text-center z-10 shrink-0 self-stretch sm:self-auto" id="profile-stats-grid">
          <div className="bg-neutral-950/60 p-3 rounded-xl border border-solid border-neutral-850">
            <span className="font-extrabold text-white text-lg block">{orders.length}</span>
            <span className="text-[9px] text-[#D1D1D1] uppercase font-bold tracking-wider">Orders</span>
          </div>
          <div className="bg-neutral-950/60 p-3 rounded-xl border border-solid border-neutral-850">
            <span className="font-extrabold text-white text-lg block">{wishlist.length}</span>
            <span className="text-[9px] text-[#D1D1D1] uppercase font-bold tracking-wider">Wishlist</span>
          </div>
          <div className="bg-neutral-950/60 p-3 rounded-xl border border-solid border-neutral-850">
            <span className="font-extrabold text-[#D1D1D1] text-lg block">₹{walletBalance.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-[#D1D1D1] uppercase font-bold tracking-wider">Wallet</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D1D1D1]/5 blur-3xl rounded-full"></div>
      </div>

      {/* 2. Grid for Tabs Navigation and Panel Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Tab pills */}
        <nav className="col-span-1 lg:col-span-3 space-y-1.5 bg-neutral-900 border border-solid border-neutral-850 p-3 rounded-2xl">
          <button
            id="prof-tab-btn-orders"
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-colors ${
              activeTab === 'orders' ? 'bg-neutral-800 text-white border-l-2 border-solid border-[#D1D1D1]' : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> My Orders Tracker
          </button>
          <button
            id="prof-tab-btn-addresses"
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-colors ${
              activeTab === 'addresses' ? 'bg-neutral-800 text-white border-l-2 border-solid border-[#D1D1D1]' : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <MapPin className="w-4 h-4" /> saved Destinations
          </button>
          <button
            id="prof-tab-btn-settings"
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-colors ${
              activeTab === 'settings' ? 'bg-neutral-800 text-white border-l-2 border-solid border-[#D1D1D1]' : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Settings className="w-4 h-4" /> Account Credentials
          </button>
          <button
            id="prof-tab-btn-wishlist"
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-colors ${
              activeTab === 'wishlist' ? 'bg-neutral-800 text-white border-l-2 border-solid border-[#D1D1D1]' : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Heart className="w-4 h-4" /> Saved Wishlist ({wishlist.length})
          </button>
          <button
            id="prof-tab-btn-payments"
            onClick={() => setActiveTab('payments')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-colors ${
              activeTab === 'payments' ? 'bg-neutral-800 text-white border-l-2 border-solid border-[#D1D1D1]' : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Card Vault Locker
          </button>
        </nav>

        {/* Right Side Panel Body context */}
        <section className="col-span-1 lg:col-span-9 bg-neutral-900 border border-solid border-neutral-850 p-6 rounded-2xl min-h-[350px]">
          
          {/* TAB 1: MY ORDERS TRACKER */}
          {activeTab === 'orders' && (
            <div className="space-y-6" id="profile-panel-orders">
              <h3 className="text-sm font-extrabold uppercase text-white tracking-widest border-b border-solid border-neutral-850 pb-3">My Luxury Order History</h3>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-xs text-neutral-500">
                  <ShoppingBag className="w-8 h-8 mx-auto text-neutral-700 mb-2.5" />
                  No orders processed yet. Explore our gold chronographs or electronic catalogs to begin.
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((o) => (
                    <div key={o.id} className="p-5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl space-y-4 animate-fade-in relative">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-solid border-neutral-900 pb-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-neutral-500 uppercase tracking-widest text-[9px] font-extrabold">Invoice Ref</span>
                          <h4 className="font-extrabold text-[#D1D1D1] tracking-wider">{o.id}</h4>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-right">
                            <span className="text-neutral-500 block text-[9px] uppercase font-bold">Placed Date</span>
                            <span className="font-bold text-white">{o.date}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-neutral-500 block text-[9px] uppercase font-bold">Total Bill</span>
                            <span className="font-extrabold text-white">₹{o.total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="space-y-3">
                        {o.items.map((i) => (
                          <div key={i.product.id} className="flex gap-3 justify-between items-center text-xs">
                            <div className="flex gap-3 min-w-0">
                              <img src={i.product.image} alt={i.product.name} className="w-10 h-10 rounded-lg object-cover bg-neutral-905" referrerPolicy="no-referrer" />
                              <div className="truncate">
                                <h5 className="font-bold text-white truncate text-[11px] leading-tight-normal select-none">{i.product.name}</h5>
                                <span className="text-neutral-500 text-[10px] block">Qty: {i.quantity} | {o.paymentMethod} Payment</span>
                              </div>
                            </div>
                            <span className="font-bold text-white">₹{(i.product.price * i.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>

                      {/* ORDER SHIPPED MILESTONES REAL TRACKING TIMELINE */}
                      <div className="pt-4 border-t border-solid border-neutral-900 space-y-3">
                        <span className="text-[9px] uppercase text-[#D1D1D1] font-extrabold tracking-widest block">Real-time Sector Tracker</span>
                        <div className="grid grid-cols-4 gap-2 relative border-b border-solid border-neutral-900/60 pb-1" id={`tracker-steps-${o.id}`}>
                          {[
                            { num: 1, label: 'Placed' },
                            { num: 2, label: 'Packing' },
                            { num: 3, label: 'In Transit' },
                            { num: 4, label: 'Delivered' }
                          ].map((stepMap) => {
                            const active = o.trackingStep >= stepMap.num;
                            return (
                              <div key={stepMap.num} className="text-center relative">
                                <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center text-black font-extrabold text-[10px] mb-1.5 transition-all ${
                                  active ? 'bg-gradient-to-r from-[#ffffff] to-[#D1D1D1]' : 'bg-neutral-800 text-neutral-400'
                                }`}>
                                  {active ? '✓' : stepMap.num}
                                </div>
                                <span className={`text-[9px] uppercase font-bold tracking-wider ${active ? 'text-white' : 'text-neutral-600'}`}>
                                  {stepMap.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED DESTINATIONS */}
          {activeTab === 'addresses' && (
            <div className="space-y-6" id="profile-panel-addresses">
              <div className="flex justify-between items-center border-b border-solid border-neutral-850 pb-3">
                <h3 className="text-sm font-extrabold uppercase text-white tracking-widest">Saved Delivery Destinations</h3>
                <button
                  id="add-addr-profile-btn"
                  onClick={handleAddAddress}
                  className="px-3 py-1.5 bg-neutral-950 hover:bg-[#D1D1D1] border border-solid border-[#D1D1D1] hover:text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 text-[#D1D1D1]"
                >
                  <Plus className="w-3.5 h-3.5" /> Quick Add
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addrs.map((a) => (
                  <div key={a.id} className="p-4 rounded-xl border border-solid border-neutral-800 bg-neutral-950 flex justify-between items-start gap-3">
                    <div className="text-xs space-y-1.5">
                      <div className="flex gap-2.5 items-center">
                        <h4 className="font-bold text-white uppercase text-[10px] tracking-wide">{a.name}</h4>
                        {a.isDefault && (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-solid border-green-500/20 rounded text-[8px] font-black uppercase">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-300 mt-1.5 font-medium">{a.street}</p>
                      <p className="text-neutral-500">{a.city}, {a.state} - {a.zip}</p>
                      <p className="text-neutral-500">📞 {a.phone}</p>
                    </div>
                    <button
                      id={`del-addr-btn-${a.id}`}
                      onClick={() => handleRemoveAddress(a.id)}
                      className="p-1.5 hover:bg-red-950/20 rounded border border-solid border-transparent hover:border-red-500/20 text-neutral-500 hover:text-red-500 transition-colors shrink-0"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT CREDENTIALS */}
          {activeTab === 'settings' && (
            <div className="space-y-6" id="profile-panel-settings">
              <h3 className="text-sm font-extrabold uppercase text-white tracking-widest border-b border-solid border-neutral-850 pb-3">Client Credentials Settings</h3>
              
              <form onSubmit={handleUpdateAccount} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-white">
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold">Client Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="prof-edit-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl focus:border-[#D1D1D1] focus:outline-none focus:ring-1 focus:ring-[#D1D1D1]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold">VIP Mail Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="prof-edit-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl focus:border-[#D1D1D1] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold">Mobile Device Identification</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      id="prof-edit-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl focus:border-[#D1D1D1] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold">Date of Birth</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <input
                      id="prof-edit-dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl focus:border-[#D1D1D1] focus:outline-none text-white tracking-widest"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-3 flex justify-end">
                  <button
                    id="prof-save-account-btn"
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-95 text-center active:scale-95 transition-all"
                  >
                    Commit account configurations
                  </button>
                </div>
              </form>

              {/* Password update segment */}
              <div className="pt-6 border-t border-solid border-neutral-850 space-y-4">
                <span className="text-[10px] uppercase font-black text-rose-500 tracking-widest block">Password Key Reset</span>
                <div className="grid grid-cols-2 gap-4 text-xs text-white">
                  <input
                    id="prof-cur-pass"
                    type="password"
                    placeholder="Current Password Key"
                    value={curPass}
                    onChange={(e) => setCurPass(e.target.value)}
                    className="p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl"
                  />
                  <input
                    id="prof-new-pass"
                    type="password"
                    placeholder="New Secure Password Key"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    id="prof-reset-pass-btn"
                    onClick={() => {
                      if (!curPass || !newPass) {
                        showToast('Please insert credentials fully.', 'warning');
                        return;
                      }
                      showToast('Your security credentials has reset successfully.', 'success');
                      setCurPass('');
                      setNewPass('');
                    }}
                    className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-solid border-neutral-800 text-white rounded-xl text-xs font-bold"
                  >
                    Update Security Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SAVED WISHLIST ITEMS */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6" id="profile-panel-wishlist">
              <h3 className="text-sm font-extrabold uppercase text-white tracking-widest border-b border-solid border-neutral-850 pb-3">My Saved Product Wishlist</h3>
              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-xs text-neutral-500">
                  <Heart className="w-8 h-8 mx-auto text-neutral-700 mb-2.5" />
                  Your catalog books are empty. Tap Heart icon on luxury item sliders to populate.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" id="wishlist-profile-grid">
                  {wishlist.map((p) => {
                    const discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                    return (
                      <div key={p.id} className="group bg-neutral-950 rounded-xl p-3 border border-solid border-neutral-850 hover:border-[#D1D1D1] relative transition-transform">
                        <button
                          id={`wish-del-btn-${p.id}`}
                          onClick={() => onRemoveWishlistItem(p)}
                          className="absolute top-2.5 right-2.5 p-1 bg-black/85 rounded-full border border-solid border-neutral-800 text-neutral-500 hover:text-red-500 z-10"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="aspect-square bg-neutral-900 rounded-lg overflow-hidden cursor-pointer" onClick={() => onNavigate('product_' + p.id)}>
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <h4 className="text-[11px] font-bold text-white truncate mt-2 leading-tight">{p.name}</h4>
                        <div className="flex justify-between items-baseline mt-1.5">
                          <span className="font-extrabold text-white text-xs">₹{p.price.toLocaleString('en-IN')}</span>
                          <span className="text-[9px] text-[#D1D1D1] hover:underline cursor-pointer" onClick={() => onAddToCart(p)}>+ Add Bag</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SAVED CREDIT CARDS / WALLET LOGS */}
          {activeTab === 'payments' && (
            <div className="space-y-8" id="profile-panel-payments">
              {/* Wallet Top Up option */}
              <div className="p-5 bg-neutral-950 border border-solid border-[#D1D1D1]/40 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-black text-[#D1D1D1] tracking-widest block">Alike Secure Balance</span>
                    <h4 className="text-md font-bold text-white uppercase tracking-wide">Wallet reserves</h4>
                  </div>
                  <div className="text-2xl font-black text-white">₹{walletBalance.toLocaleString('en-IN')}</div>
                </div>

                <div className="flex items-center gap-3 pt-2 text-xs">
                  <div className="relative flex-1 text-white">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D1D1D1] font-black mr-1">₹</span>
                    <input
                      id="wallet-topup-input"
                      type="number"
                      step={500}
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 bg-neutral-900 border border-solid border-neutral-800 rounded-xl focus:border-[#D1D1D1] focus:outline-none"
                    />
                  </div>
                  <button
                    id="add-money-wallet-btn"
                    onClick={handleAddBalance}
                    className="px-5 py-2 bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black font-extrabold rounded-xl"
                  >
                    Load Reserves
                  </button>
                </div>
              </div>

              {/* Cards locker list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-solid border-neutral-850 pb-2.5">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-white">Linked Virtual Credit Cards</h4>
                  <button
                    id="add-card-locker-btn"
                    onClick={handleAddCard}
                    className="text-[11px] text-[#D1D1D1] hover:underline font-bold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Link Card Account
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cards.map((c) => (
                    <div key={c.id} className="p-4 bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-xl border border-solid border-[#D1D1D1]/30 flex flex-col justify-between h-36 relative overflow-hidden shadow-md">
                      <div className="flex justify-between items-start text-xs text-white">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-extrabold">{c.brand}</span>
                          <h5 className="font-extrabold font-mono text-gray-200">•••• •••• •••• {c.last4}</h5>
                        </div>
                        <button
                          id={`del-card-btn-${c.id}`}
                          onClick={() => handleRemoveCard(c.id)}
                          className="p-1 hover:bg-neutral-800 rounded border border-solid border-transparent text-neutral-500 hover:text-red-500 transition-colors"
                          title="Delete card locker token"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-end text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                        <div>
                          <p className="text-neutral-500 text-[9px]">Cardholder</p>
                          <p className="text-white mt-0.5">{c.holder}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-neutral-500 text-[9px]">Expires</p>
                          <p className="text-white mt-0.5">{c.expiry}</p>
                        </div>
                      </div>
                      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#D1D1D1]/5 blur-xl rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}
