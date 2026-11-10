import { useState, useMemo, FormEvent } from 'react';
import {
  AlertTriangle,
  Sparkles,
  Search,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  Package,
  ShoppingBag,
  TrendingDown,
  X,
  MapPin,
  CheckCircle,
  Tag
} from 'lucide-react';
import { Product } from '../types';

interface SellerDashboardProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onRemoveProduct: (id: number) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function SellerDashboard({
  products,
  onAddProduct,
  onRemoveProduct,
  showToast,
}: SellerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  
  // Tab - Add New Product Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('Zenith');
  const [newPrice, setNewPrice] = useState<number>(35000);
  const [newMrp, setNewMrp] = useState<number>(45000);
  const [newCategory, setNewCategory] = useState('luxury');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&auto=format&fit=crop&q=60');
  const [newDesc, setNewDesc] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products by seller's imaginary boutique brand (we show items that are luxury or matched brand)
  const myBoutiqueBrand = 'Zenith';
  const myBoutiqueItems = useMemo(() => {
    return products.filter((p) => {
      // Find my products or matching Zenith
      if (searchQuery) {
        return p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.brand === myBoutiqueBrand;
      }
      return p.brand === myBoutiqueBrand;
    });
  }, [products, searchQuery]);

  // Calculations for dashboard
  const aggregateRevenue = 482500;
  const marginPercentage = 31.2;
  const deliveryFulfillCount = 2;

  const handleAddNewProductSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc) {
      showToast('Please complete mandatory specifications lines.', 'warning');
      return;
    }

    const created: Product = {
      id: Math.floor(1000 + Math.random() * 9000),
      name: newName,
      brand: myBoutiqueBrand,
      price: newPrice,
      mrp: newMrp,
      rating: 4.8,
      reviewsCount: 1,
      image: newImage,
      category: newCategory,
      description: newDesc,
      specifications: {
        'Crafted Origin': 'Switzerland Atelier',
        'Material Core': '18K Roseline Gold',
        'Chronograph Node': 'Zenith Calibre 301',
      },
      colors: ['Venetian Roseline Gold', 'Cosmic Platinum'],
      sizes: ['Standard Dial 40mm', 'Custom Atelier Dial 42mm'],
    };

    onAddProduct(created);
    setAddModalOpen(false);
    showToast(`Successfully listed [${newName}] on the collective market catalog!`, 'success');

    // Reset fields
    setNewName('');
    setNewPrice(35000);
    setNewMrp(45000);
    setNewDesc('');
  };

  return (
    <div id="seller-dashboard-root" className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* 1. Header welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-solid border-neutral-800 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#D1D1D1] font-black font-mono">
            merchant control center
          </span>
          <h1 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Atelier Zenith Boardroom
          </h1>
          <p className="text-xs text-neutral-500 font-semibold mt-0.5">
            Registered IRS partner · Active high-speed trade corridors
          </p>
        </div>

        <button
          id="list-product-trigger"
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-white via-[#E5E5E5] to-[#D1D1D1] hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> List Luxury Product
        </button>
      </div>

      {/* 2. Analytical Sales Stat Blocks Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 bg-neutral-900/40 backdrop-blur-md border border-solid border-[#D1D1D1]/30 rounded-2xl relative overflow-hidden text-xs">
          <span className="text-neutral-500 block text-[9px] uppercase font-bold tracking-wider">Gross Outlay Revenue</span>
          <div className="text-lg sm:text-xl font-black text-white mt-1.5">₹{aggregateRevenue.toLocaleString('en-IN')}</div>
          <div className="text-green-500 flex items-center gap-1 mt-2 font-bold font-mono text-[10px]">
            <TrendingUp className="w-3.5 h-3.5" /> +14.6% this cycle
          </div>
          <div className="absolute right-4 bottom-4 p-2.5 bg-[#D1D1D1]/10 text-[#D1D1D1] rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-neutral-900/40 backdrop-blur-md border border-solid border-[#D1D1D1]/10 rounded-2xl relative overflow-hidden text-xs">
          <span className="text-neutral-500 block text-[9px] uppercase font-bold tracking-wider font-mono">Boutique Listing count</span>
          <div className="text-lg sm:text-xl font-black text-white mt-1.5">{myBoutiqueItems.length} listed</div>
          <div className="text-[#D1D1D1] flex items-center gap-1 mt-2 font-bold font-mono text-[10px]">
            ✓ Live inside general catalogs
          </div>
          <div className="absolute right-4 bottom-4 p-2.5 bg-[#D1D1D1]/10 text-[#D1D1D1] rounded-xl">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-neutral-900/40 backdrop-blur-md border border-solid border-neutral-850 rounded-2xl text-xs relative overflow-hidden">
          <span className="text-neutral-500 block text-[9px] uppercase font-bold tracking-wider">Fulfill queue</span>
          <div className="text-lg sm:text-xl font-black text-white mt-1.5">{deliveryFulfillCount} pending</div>
          <div className="text-blue-500 flex items-center gap-1 mt-2 font-bold text-[10px]">
            Ready at closest corridor
          </div>
          <div className="absolute right-4 bottom-4 p-2.5 bg-neutral-950 text-blue-400 border border-solid border-neutral-850 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-neutral-900/40 backdrop-blur-md border border-solid border-neutral-850 rounded-2xl text-xs relative overflow-hidden">
          <span className="text-neutral-500 block text-[9px] uppercase font-bold tracking-wider">Margin margin balance</span>
          <div className="text-lg sm:text-xl font-black text-[#D1D1D1] mt-1.5">{marginPercentage}%</div>
          <div className="text-green-500 flex items-center gap-1 mt-2 font-bold text-[10px]">
            High yield optimization
          </div>
          <div className="absolute right-4 bottom-4 p-2.5 bg-neutral-950 text-green-400 border border-solid border-neutral-850 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Visual Responsive Line Chart Block (Custom Premium SVG visual instead of Recharts dependencies to prevent startup build failures!) */}
      <div className="p-6 bg-neutral-900/40 backdrop-blur-md border border-solid border-neutral-850 rounded-2xl space-y-4 shadow-md">
        <div className="flex justify-between items-center border-b border-solid border-neutral-850 pb-3">
          <div className="space-y-0.5">
            <h4 className="text-xs uppercase font-extrabold text-white tracking-widest flex items-center gap-2"><TrendingUp className="w-4.5 h-4.5 text-[#D1D1D1]" /> sales and visitor performance</h4>
            <p className="text-[10px] text-neutral-500">Continuous 7-month high-tier volume chart</p>
          </div>
          <div className="flex gap-4 text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
            <span className="flex items-center gap-1.5 text-white">● Gross Outplay</span>
            <span className="flex items-center gap-1.5 text-[#D1D1D1]">● Organic Traffic</span>
          </div>
        </div>

        {/* Custom High-Fidelity SVG Line Graph */}
        <div className="relative h-44 bg-neutral-950 rounded-xl border border-solid border-neutral-900 overflow-hidden flex flex-col justify-end p-2">
          
          <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 400 100" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="25" x2="400" y2="25" stroke="#1c1c1c" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="#1c1c1c" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="400" y2="75" stroke="#1c1c1c" strokeWidth="0.5" strokeDasharray="3 3" />

            {/* Area gradients fill */}
            <defs>
              <linearGradient id="silver-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D1D1D1" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#8E909A" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M 0 100 L 0 70 L 60 55 L 120 75 L 180 40 L 240 45 L 300 20 L 360 15 L 400 10 L 400 100 Z" fill="url(#silver-grad)" />

            {/* Sales Line (silver) */}
            <path
              d="M 0 70 Q 30 60 60 55 T 120 75 T 180 40 T 240 45 T 300 20 T 360 15 T 400 10"
              fill="none"
              stroke="#D1D1D1"
              strokeWidth="2.5"
            />

            {/* Traffic Line (Platinum) */}
            <path
              d="M 0 85 Q 30 75 60 80 T 120 60 T 180 65 T 240 40 T 300 50 T 360 40 T 400 35"
              fill="none"
              stroke="#8e909a"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          </svg>

          {/* X Axis human parameters label */}
          <div className="flex justify-between text-[8px] uppercase tracking-widest text-neutral-500 font-mono font-bold pt-1 z-10">
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun (Recent)</span>
          </div>
        </div>
      </div>

      {/* 4. Tab selection: INVENTORY MATRIX vs PENDING ORDERS */}
      <div className="border border-solid border-neutral-850 rounded-2xl overflow-hidden bg-neutral-950/40">
        <div className="flex p-1.5 border-b border-solid border-neutral-850 bg-neutral-900/60 font-black">
          <button
            id="seller-tab-inv"
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors ${
              activeTab === 'inventory' ? 'bg-neutral-900 text-[#D1D1D1]' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Manage inventory ({myBoutiqueItems.length})
          </button>
          <button
            id="seller-tab-ord"
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors ${
              activeTab === 'orders' ? 'bg-neutral-900 text-[#D1D1D1]' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Atelier Outbound orders ({deliveryFulfillCount})
          </button>
        </div>

        <div className="p-5">
          {activeTab === 'inventory' && (
            /* TAB BODY A: PRODUCTS INVENTORY DATA TABLE LIST */
            <div className="space-y-4" id="seller-panel-inventory">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                  <input
                    id="sell-inv-search"
                    type="text"
                    placeholder="Search listed items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">My brand: <strong>Atelier Zenith</strong></span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-solid border-neutral-850 rounded-xl" id="inventory-data-table">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-950 text-neutral-500 text-[9px] uppercase tracking-wider font-extrabold border-b border-solid border-neutral-850">
                      <th className="p-3.5">Product Information</th>
                      <th className="p-3.5 text-center">Category</th>
                      <th className="p-3.5 text-right">Offer Price</th>
                      <th className="p-3.5 text-right font-mono">Market MRP</th>
                      <th className="p-3.5 text-center">Rating</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-solid divide-neutral-900">
                    {myBoutiqueItems.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-950/60 font-semibold text-neutral-200">
                        {/* Title and Thumbnail */}
                        <td className="p-3 flex items-center gap-3 min-w-[220px]">
                          <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover bg-neutral-900" referrerPolicy="no-referrer" />
                          <div className="truncate py-1">
                            <span className="text-[#D1D1D1] text-[9px] uppercase font-mono block">Zenith Chronometers</span>
                            <h5 className="font-extrabold text-white text-[11px] truncate">{item.name}</h5>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3 text-center uppercase tracking-widest text-[9px] text-[#D1D1D1]">
                          {item.category}
                        </td>

                        {/* Price */}
                        <td className="p-3 text-right font-black text-white">
                          ₹{item.price.toLocaleString('en-IN')}
                        </td>

                        {/* MRP */}
                        <td className="p-3 text-right text-neutral-500 line-through">
                          ₹{item.mrp.toLocaleString('en-IN')}
                        </td>

                        {/* Rating stars */}
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#D1D1D1]/10 text-[#D1D1D1] text-[10px] font-black">
                            ★ {item.rating}
                          </span>
                        </td>

                        {/* Actions delete */}
                        <td className="p-3 text-center">
                          <button
                            id={`del-listed-item-${item.id}`}
                            onClick={() => {
                              onRemoveProduct(item.id);
                              showToast(`Removed product index ${item.id} from market`, 'info');
                            }}
                            className="p-1.5 rounded hover:bg-red-500/10 text-neutral-500 hover:text-red-500 transition-colors border border-solid border-transparent hover:border-red-500/20"
                            title="Delete listed product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {myBoutiqueItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-neutral-500">
                          No listed items for Zenith Atelier. Click List Luxury Product to begin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            /* TAB BODY B: OUTBOUND RECENT ORDERS FOR WORKSHOPS */
            <div className="space-y-4" id="seller-panel-orders">
              <div className="p-4 rounded-xl border border-solid border-[#D1D1D1]/20 bg-[#D1D1D1]/5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#D1D1D1] shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-400 font-medium">
                  <p className="text-white font-bold">Unpacked Transport Items detected</p>
                  <p className="mt-1">Please verify serial tags to coordinate courier delivery drops safely. High-consequence orders require custom lockboxes.</p>
                </div>
              </div>

              {/* Orders row list */}
              <div className="space-y-4">
                {[
                  { id: 'TXN-9021', name: 'Zenith Master Chronometer Gold', client: 'Vikram Malhotra', price: 90000, date: '2026-06-18', address: 'Juhu Gold Hill Penthouse, Mumbai' },
                  { id: 'TXN-1120', name: 'Atelier Venetian Gold Chain Dial', client: 'Samar Singhania', price: 65000, date: '2026-06-17', address: 'Bandra Kurla Business block, Mumbai' }
                ].map((sOrd) => (
                  <div key={sOrd.id} className="p-4 rounded-xl border border-solid border-neutral-850 bg-neutral-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <div className="flex gap-2 items-center">
                        <span className="font-extrabold text-[#D1D1D1] uppercase text-[9px] tracking-wider">{sOrd.id}</span>
                        <span className="text-neutral-500">· {sOrd.date}</span>
                      </div>
                      <h4 className="text-md font-bold text-white uppercase">{sOrd.name}</h4>
                      <p className="text-neutral-500 text-[10px]">Client: <strong className="text-white">{sOrd.client}</strong></p>
                      <p className="text-neutral-500 text-[10px]">Destination: <strong className="text-white">{sOrd.address}</strong></p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0 self-stretch sm:self-auto">
                      <span className="text-md font-black text-white">₹{sOrd.price.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => showToast(`Consignment tag ${sOrd.id} cleared for dispatcher!`, 'success')}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-black font-extrabold text-[10px] uppercase rounded-lg"
                      >
                        ✓ Release Tag Dispatcher
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. ADD NEW PRODUCT MODAL (COMMONLY EXECUTED COMPONENT IN DRAWER DESIGN) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs text-white animate-fade-in">
          <div className="bg-neutral-900 border border-solid border-[#D1D1D1] rounded-2xl p-6 max-w-sm sm:max-w-md w-full relative space-y-4 shadow-2xl">
            <button
              id="close-add-product-modal"
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-neutral-950 p-1.5 rounded-lg border border-solid border-neutral-800"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[#D1D1D1] font-black font-mono block">Dossier upload unit</span>
              <h3 className="text-sm font-black text-white uppercase mr-6">
                List Product to Luxury Marketplace
              </h3>
              <p className="text-xs text-neutral-500">Listed under brand: Zenith Atelier</p>
            </div>

            <form onSubmit={handleAddNewProductSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-neutral-400">Exclusive product name</label>
                <input
                  id="add-p-name"
                  type="text"
                  required
                  placeholder="e.g. Zenith El Primero Gold Edition"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-lg text-white font-semibold focus:border-[#D1D1D1] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400">Offer Price (₹)</label>
                  <input
                    id="add-p-price"
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-lg text-white font-mono focus:border-[#D1D1D1] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400">Market Reference MRP (₹)</label>
                  <input
                    id="add-p-mrp"
                    type="number"
                    required
                    value={newMrp}
                    onChange={(e) => setNewMrp(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-lg text-white font-mono focus:border-[#D1D1D1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400">Section category</label>
                  <select
                    id="add-p-cat"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-lg focus:outline-none focus:border-[#D1D1D1]"
                  >
                    <option value="luxury">Luxury Watches</option>
                    <option value="wholesale">Bulk wholesale</option>
                    <option value="jewels">Bespoke Jewelry</option>
                    <option value="delivery">Boutique Drops</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400">Catalogue image url</label>
                  <input
                    id="add-p-img"
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-neutral-400">Narrative description</label>
                <textarea
                  id="add-p-desc"
                  rows={3}
                  required
                  placeholder="Authentic 18K gold hand-finishing, certified precision chronological lines..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-lg focus:outline-none focus:border-[#D1D1D1] resize-none"
                />
              </div>

              <button
                id="add-p-submit-btn"
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-white via-[#E5E5E5] to-[#D1D1D1] text-black font-extrabold uppercase tracking-widest rounded-xl transition-all font-mono"
              >
                Launch Listed Product <Sparkles className="w-4 h-4 inline-block ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
