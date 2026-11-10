import { useState, useMemo } from 'react';
import { SlidersHorizontal, Grid, List, Check, Star, RefreshCw, ChevronRight, X } from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../data/mockData';
import ProductCard from '../components/ProductCard';

interface CategorySearchProps {
  products: Product[];
  initialCategory?: string;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onCompare: (p: Product) => void;
  onQuickView?: (p: Product) => void;
  wishlistedIds: number[];
  searchQuery?: string;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function CategorySearch({
  products,
  initialCategory = 'all',
  onAddToCart,
  onToggleWishlist,
  onSelectProduct,
  onCompare,
  onQuickView,
  wishlistedIds,
  searchQuery = '',
  showToast,
}: CategorySearchProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Derive unique brands in our catalog
  const allBrands = useMemo(() => {
    const list = products.map((p) => p.brand);
    return Array.from(new Set(list));
  }, [products]);

  // Clean filters when category changes
  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setMobileSidebarOpen(false);
  };

  const handleBrandToggle = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(100000);
    setSelectedBrands([]);
    setMinRating(null);
    setMinDiscount(null);
    setSortBy('relevance');
    showToast('Filters cleared successfully.', 'info');
  };

  // Filter products in memory
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'wholesale') {
            if (!p.isWholesale) return false;
          } else if (selectedCategory === 'luxury') {
            if (p.category !== 'luxury') return false;
          } else if (selectedCategory === 'delivery') {
            if (p.category !== 'delivery') return false;
          } else {
            if (p.category !== selectedCategory) return false;
          }
        }

        // Search Query Filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCat) return false;
        }

        // Price Filter
        if (p.price > maxPrice) return false;

        // Brand Filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;

        // Rating Filter
        if (minRating && p.rating < minRating) return false;

        // Discount Filter
        const discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
        if (minDiscount && discountPercent < minDiscount) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.id - a.id; // simulation
        return 0; // relevance
      });
  }, [products, selectedCategory, searchQuery, maxPrice, selectedBrands, minRating, minDiscount, sortBy]);

  return (
    <div id="category-search-root" className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium pb-6">
        <span className="hover:text-white cursor-pointer" onClick={() => handleCategorySelect('all')}>Alike Marketplace</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-700" />
        <span className="text-white uppercase tracking-wider font-semibold">
          {CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'All Items'}
        </span>
        {searchQuery && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-700" />
            <span className="text-neutral-400 italic">Searched: "{searchQuery}"</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Desktop Filter Panel Sidebar */}
        <aside
          id="filters-sidebar-desktop"
          className="hidden lg:block lg:col-span-3 bg-neutral-900 border border-solid border-neutral-850 p-5 rounded-2xl space-y-6 sticky top-28"
        >
          <div className="flex justify-between items-center border-b border-solid border-neutral-800 pb-3.5">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4.5 h-4.5 text-neutral-400" /> Product Filters
            </h3>
            <button
              id="desktop-reset-filters"
              onClick={handleResetFilters}
              className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 uppercase tracking-wider font-semibold transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Clear All
            </button>
          </div>

          {/* 1. Category Tree list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Catalog categories</h4>
            <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  id={`filter-cat-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex justify-between items-center transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#D1D1D1]/15 text-white border-l-2 border-solid border-[#D1D1D1] pl-2'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range Slider */}
          <div className="space-y-2.5 pt-4 border-t border-solid border-neutral-800">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-neutral-400 uppercase tracking-wider">Price ceiling</span>
              <span className="text-white font-bold">Under ₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              id="price-range-slider"
              type="range"
              min={100}
              max={100000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-neutral-400 bg-neutral-950 rounded-lg appearance-none h-1.5"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500 font-bold">
              <span>₹100</span>
              <span>₹100,000</span>
            </div>
          </div>

          {/* 3. Brands checklists */}
          <div className="space-y-2 pt-4 border-t border-solid border-neutral-800 animate-slide-in">
            <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Producer Brand</h4>
            <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
              {allBrands.map((bName) => {
                const checked = selectedBrands.includes(bName);
                return (
                  <label
                    key={bName}
                    className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBrandToggle(bName)}
                      className="rounded border-neutral-800 text-neutral-400 focus:ring-neutral-400/40 bg-neutral-950"
                    />
                    <span>{bName}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. Minimum Ratings list */}
          <div className="space-y-2 pt-4 border-t border-solid border-neutral-800">
            <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Minimum Rating</h4>
            <div className="space-y-1.5">
              {[4.5, 4.0, 3.5].map((rate) => (
                <button
                  key={rate}
                  id={`rating-filter-btn-${rate}`}
                  onClick={() => setMinRating(minRating === rate ? null : rate)}
                  className={`w-full text-left px-2.5 py-1 rounded text-xs font-semibold flex items-center justify-between ${
                    minRating === rate
                      ? 'bg-[#D1D1D1]/15 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-850/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4.5 h-4.5 text-neutral-400 fill-neutral-400" /> {rate.toFixed(1)} & Above
                  </span>
                  {minRating === rate && <Check className="w-3 h-3 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Discounts filter */}
          <div className="space-y-2 pt-4 border-t border-solid border-neutral-800">
            <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Min Discount %</h4>
            <div className="space-y-1.5">
              {[40, 20, 10].map((disc) => (
                <button
                  key={disc}
                  id={`discount-filter-btn-${disc}`}
                  onClick={() => setMinDiscount(minDiscount === disc ? null : disc)}
                  className={`w-full text-left px-2.5 py-1 rounded text-xs font-semibold flex items-center justify-between ${
                    minDiscount === disc
                      ? 'bg-green-500/10 text-green-400'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-850/50'
                  }`}
                >
                  <span>{disc}% OFF & Above</span>
                  {minDiscount === disc && <Check className="w-3 h-3 text-green-400" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: Search Results / Sorting & Grid list */}
        <section className="col-span-1 lg:col-span-9 space-y-6">
          <div className="p-4 bg-neutral-900 border border-solid border-neutral-850 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-md sm:text-lg font-bold text-white uppercase tracking-wide">
                Showing {filteredProducts.length} Luxury Item{filteredProducts.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-xs text-neutral-500">Curated specifically according to strict client preferences</p>
            </div>

            {/* Mobile Sidebar Trigger, Sorting and view option toggles */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="mobile-filters-trigger"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden px-3 py-2 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                title="Open mobile filters drawer"
              >
                <SlidersHorizontal className="w-4.5 h-4.5 text-neutral-400" /> Filters
              </button>

              <div className="relative">
                <select
                  id="sort-select-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3.5 py-2 bg-neutral-950 border border-solid border-neutral-850 rounded-xl text-xs font-bold text-neural-300 hover:text-white text-white focus:outline-none focus:border-[#D1D1D1] appearance-none pr-8 cursor-pointer"
                  title="Sort Order"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating: Highest Elite</option>
                  <option value="newest">Catalog: New Arrival</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-500">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Grid / List controls */}
              <div className="flex bg-neutral-950 p-1.5 rounded-xl border border-solid border-neutral-850">
                <button
                  id="toggle-grid-view"
                  onClick={() => setIsGridView(true)}
                  className={`p-1 rounded-md transition-colors ${
                    isGridView ? 'bg-[#D1D1D1]/20 text-[#D1D1D1]' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  title="Grid visual layout"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  id="toggle-list-view"
                  onClick={() => setIsGridView(false)}
                  className={`p-1 rounded-md transition-colors ${
                    !isGridView ? 'bg-[#D1D1D1]/20 text-[#D1D1D1]' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  title="List details layout"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty Search Fallback */}
          {filteredProducts.length === 0 ? (
            <div id="empty-search-state" className="p-16 border border-dashed border-neutral-800 rounded-3xl text-center space-y-4">
              <span className="inline-flex p-5 rounded-full bg-neutral-950 border border-solid border-neutral-850 text-neutral-600">
                <SlidersHorizontal className="w-8.5 h-8.5 animate-spin" />
              </span>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Matching Luxury Items Found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  We could not locate items meeting these exact parameters. Try widening the price boundary or resetting the brand checkers.
                </p>
              </div>
              <button
                id="reset-filters-empty"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-gradient-to-r from-white to-[#D1D1D1] text-black text-xs font-extrabold uppercase tracking-widest rounded-xl transition-transform active:scale-[0.98]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Products display based on layout view */
            <div
              id="marketplace-products-list"
              className={
                isGridView
                  ? 'grid grid-cols-2 md:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredProducts.map((p) => {
                const isWishlisted = wishlistedIds.includes(p.id);
                if (isGridView) {
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={onAddToCart}
                      onToggleWishlist={onToggleWishlist}
                      onSelectProduct={onSelectProduct}
                      onCompare={onCompare}
                      onQuickView={onQuickView}
                      isWishlisted={isWishlisted}
                    />
                  );
                } else {
                  // Interactive List view
                  const discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                  return (
                    <div
                      key={p.id}
                      id={`list-item-${p.id}`}
                      className="group p-4 bg-neutral-900 border border-solid border-neutral-850 hover:border-[#D1D1D1] rounded-2xl flex flex-col sm:flex-row gap-5 transition-all duration-300 hover:shadow-lg"
                      onClick={() => onSelectProduct(p)}
                    >
                      <div className="w-full sm:w-40 aspect-square rounded-xl overflow-hidden bg-neutral-950 cursor-pointer shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-104 transition-all" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[10px] text-neutral-500 font-mono tracking-widest font-extrabold block uppercase">{p.brand}</span>
                              <h3 className="text-md font-bold text-white group-hover:text-[#D1D1D1] mt-0.5 cursor-pointer leading-tight">{p.name}</h3>
                            </div>
                            <span className="text-[10px] font-black uppercase text-green-400 bg-green-500/10 border border-solid border-green-500/20 px-1.5 py-0.5 rounded">
                              {discountPercent}% OFF
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-white">₹{p.price.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-neutral-500 line-through">₹{p.mrp.toLocaleString('en-IN')}</span>
                          </div>
                          <button
                            id={`list-btn-add-${p.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(p);
                            }}
                            className="px-4 py-2 bg-[#D1D1D1] hover:bg-white text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-transform active:scale-[0.98]"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-1000 z-50 flex justify-end bg-black/80 backdrop-blur-xs lg:hidden animate-fade-in">
          <div className="w-80 max-w-full bg-neutral-900 h-full p-5 flex flex-col overflow-y-auto space-y-6 relative border-l border-solid border-[#D1D1D1]">
            <button
              id="close-mobile-filters"
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 bg-neutral-950 rounded-lg"
              title="Close filter drawer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-center border-b border-solid border-neutral-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                Narrow Catalogs
              </h3>
              <button
                id="mobile-reset-filters"
                onClick={handleResetFilters}
                className="text-[10px] text-white uppercase font-bold"
              >
                Clear
              </button>
            </div>

            {/* Same contents for mobile sidebar drawer */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-3 py-2 rounded-xl text-center text-xs font-semibold border border-solid truncate ${
                      selectedCategory === cat.id
                        ? 'border-[#D1D1D1] bg-[#D1D1D1]/20 text-[#D1D1D1]'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-solid border-neutral-800">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-400">Ceiling:</span>
                <span className="text-[#D1D1D1]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                id="mobile-price-slider"
                type="range"
                min={100}
                max={100000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-neutral-400 bg-neutral-950"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
