import { useState } from 'react';
import { Star, ShieldCheck, Truck, RotateCcw, Heart, ShoppingBag, ShoppingCart, Plus, Minus, Check, Users } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (p: Product, qty: number, color?: string, size?: string) => void;
  onAddToCartAndCheckout: (p: Product, qty: number, color?: string, size?: string) => void;
  onToggleWishlist: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  isWishlisted: boolean;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function ProductDetail({
  product,
  allProducts,
  onAddToCart,
  onAddToCartAndCheckout,
  onToggleWishlist,
  onSelectProduct,
  isWishlisted,
  showToast,
}: ProductDetailProps) {
  const { id, name, brand, price, mrp, rating, reviewsCount, image, images = [image], description, specifications, colors = ['Standard'], sizes = ['Fits All'] } = product;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Related products under same category
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discountPercent = Math.round(((mrp - price) / mrp) * 100);

  const handleQtyChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    showToast(`Added ${quantity}x ${name} to your cart successfully!`, 'success');
  };

  const handleBuyNow = () => {
    onAddToCartAndCheckout(product, quantity, selectedColor, selectedSize);
  };

  // Mock Reviews
  const mockReviews = [
    { id: 1, name: 'Kunal Sen', rating: 5, date: '2026-06-15', comment: 'Undeniably the premier luxury purchase I have made here! Precision is incredible.' },
    { id: 2, name: 'Ankita Roy', rating: 4, date: '2026-06-10', comment: 'Extremely stunning packaging and finish. Highly satisfied, came in pristine order.' },
    { id: 3, name: 'Nikhil Mehta', rating: 5, date: '2026-06-02', comment: 'Absolutely authentic! Hand-checked seal was intact. Customer support was incredibly swift.' }
  ];

  return (
    <div id="product-detail-root" className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {/* 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Side: Photo Showcase */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-2xl bg-neutral-950 border border-solid border-neutral-800 overflow-hidden shadow-lg">
            <img
              id="main-product-display-image"
              src={images[activeImageIndex] || image}
              alt={name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-black tracking-wider bg-green-500 rounded-full text-black">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex gap-3 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  id={`thumb-image-btn-${idx}`}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 border-solid bg-neutral-950 focus:outline-none transition-colors ${
                    idx === activeImageIndex ? 'border-[#D1D1D1]' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                  title={`View image ${idx + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Configuration & Pricing */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#D1D1D1] font-black font-mono">
              {brand} Atelier
            </span>
            <h1 id="product-detail-name" className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {name}
            </h1>

            {/* Ratings, reviews link */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-[#D1D1D1] gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 fill-current ${
                      i < Math.floor(rating) ? 'text-[#D1D1D1]' : 'text-neutral-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-white">{rating}</span>
              <span className="text-neutral-500 text-xs">·</span>
              <span className="text-[#D1D1D1] hover:underline cursor-pointer text-xs" onClick={() => setActiveTab('reviews')}>
                 {reviewsCount} Verified Client Reviews
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-solid border-neutral-850 space-y-2.5">
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Offer price</p>
            <div className="flex items-baseline gap-3.5">
              <span id="detail-price-tag" className="text-3xl font-black text-white">
                ₹{price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-neutral-500 line-through">
                MRP ₹{mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-black bg-green-500/10 text-green-400 px-2 py-0.5 border border-solid border-green-500/20 rounded">
                You Save ₹{(mrp - price).toLocaleString('en-IN')} ({discountPercent}% Off)
              </span>
            </div>
            <div className="text-[11px] text-green-500 font-semibold flex items-center gap-1">
              ✓ Fully Instock near your region · Immediate delivery available
            </div>
          </div>

          {/* Luxury Color Selector */}
          {colors && colors.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold">
                Selected Material Color: <span className="text-[#D1D1D1] font-sans ml-1 text-sm">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((col) => (
                  <button
                    key={col}
                    id={`color-pill-${col}`}
                    onClick={() => setSelectedColor(col)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl border border-solid transition-all ${
                      col === selectedColor
                        ? 'bg-[#D1D1D1]/15 border-[#D1D1D1] text-white'
                        : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes Selector */}
          {sizes && sizes.length > 0 && (
            <div className="space-y-2.5">
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold">
                Choose Size Framework: <span className="text-white ml-1 text-sm">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    id={`size-pill-${sz}`}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4.5 py-2 text-xs font-bold rounded-xl border border-solid transition-all ${
                      sz === selectedSize
                        ? 'border-[#D1D1D1] bg-white text-black'
                        : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stepper counter & buttons */}
          <div className="flex flex-wrap items-center gap-5 pt-3">
            <div className="space-y-1.5 shrink-0">
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold">
                Order Quantity
              </label>
              <div className="flex items-center bg-neutral-950 border border-solid border-neutral-800 rounded-xl px-1.5 py-1 text-white">
                <button
                  id="qty-minus"
                  onClick={() => handleQtyChange(quantity - 1)}
                  className="p-1.5 hover:bg-neutral-850 rounded text-neutral-400 hover:text-white"
                  title="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span id="qty-text" className="px-5 font-bold font-mono text-sm inline-block">
                  {quantity}
                </span>
                <button
                  id="qty-plus"
                  onClick={() => handleQtyChange(quantity + 1)}
                  className="p-1.5 hover:bg-neutral-850 rounded text-neutral-400 hover:text-white"
                  title="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex gap-3 h-[48px] self-end min-w-[280px]">
              <button
                id="add-to-cart-action-btn"
                onClick={handleAddToCart}
                className="flex-1 rounded-xl bg-neutral-900 border border-solid border-[#D1D1D1] hover:bg-neutral-800 text-white p-1.5 uppercase tracking-wider font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>

              <button
                id="buy-now-action-btn"
                onClick={handleBuyNow}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] hover:opacity-95 text-black p-1.5 uppercase tracking-widest font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" /> Buy Now
              </button>
            </div>
          </div>

          {/* Heart toggle & assurances */}
          <div className="flex items-center gap-4 pt-1">
            <button
              id="detail-wishlist-toggle"
              onClick={() => onToggleWishlist(product)}
              className="px-4 py-2 border border-solid border-neutral-800 rounded-xl text-neutral-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist Book'}
            </button>
          </div>

          {/* Safe Checklists */}
          <div className="border-t border-solid border-neutral-850 pt-5 grid grid-cols-3 gap-4 text-xs text-neutral-500 font-medium">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold">Certified Authentic</p>
                <p className="text-[10px] mt-0.5 leading-relaxed">Direct dispatch factory certifications.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Truck className="w-5 h-5 text-[#D1D1D1] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold">20 Min Express</p>
                <p className="text-[10px] mt-0.5 leading-relaxed">Swift transit corridors, tracked GPS.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <RotateCcw className="w-5 h-5 text-[#D1D1D1] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold">Elegant Return</p>
                <p className="text-[10px] mt-0.5 leading-relaxed">7-day free pickup directly at home.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description Specifications / Tabs Section */}
      <div className="border border-solid border-neutral-850 rounded-2xl bg-neutral-900/40 overflow-hidden">
        <div className="flex border-b border-solid border-neutral-850 bg-neutral-950/40 p-1">
          <button
            id="tab-btn-desc"
            onClick={() => setActiveTab('desc')}
            className={`px-6 py-3 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'desc' ? 'bg-neutral-900 text-[#D1D1D1]' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Product Narrative
          </button>
          <button
            id="tab-btn-specs"
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-3 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'specs' ? 'bg-neutral-900 text-[#D1D1D1]' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Technical Specs
          </button>
          <button
            id="tab-btn-reviews"
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'reviews' ? 'bg-neutral-900 text-[#D1D1D1]' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Verified Reviews ({reviewsCount})
          </button>
        </div>

        <div className="p-6 md:p-8 min-h-[160px]">
          {activeTab === 'desc' && (
            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-4xl" id="tab-content-desc">
              <p>{description}</p>
              <p>
                Manufactured to absolute perfection, this product has passed rigid tier evaluations. Sourcing relies completely on certified boutique warehouses ensuring we delivery authentic luxury with high-efficiency routes.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-xl" id="tab-content-specs">
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  {Object.entries(specifications || {}).map(([key, val]) => (
                    <tr key={key} className="border-b border-solid border-neutral-850">
                      <td className="py-2.5 font-bold uppercase text-[#D1D1D1] text-[10px] w-1/3">{key}</td>
                      <td className="py-2.5 text-neutral-300 font-medium">{val}</td>
                    </tr>
                  ))}
                  {(!specifications || Object.keys(specifications).length === 0) && (
                    <tr>
                      <td className="py-4 text-neutral-500">Standard specifications applied to this item catalog.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6" id="tab-content-reviews">
              {mockReviews.map((rev) => (
                <div key={rev.id} className="border-b border-solid border-neutral-850 pb-5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-extrabold text-white">{rev.name}</h5>
                    <span className="text-[10px] text-neutral-500">{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5 text-neutral-300 my-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 fill-current ${i < rev.rating ? 'text-[#D1D1D1]' : 'text-neutral-850'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-300 font-medium leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="space-y-6">
          <div className="border-b border-solid border-neutral-800 pb-3">
            <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-[#D1D1D1] bg-clip-text text-transparent">
              Recommended Accompaniments
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Complete your luxury outfit look</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => {
              const discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="group cursor-pointer bg-neutral-900 border border-solid border-neutral-850 hover:border-[#D1D1D1] rounded-xl overflow-hidden transition-all"
                >
                  <div className="aspect-square bg-neutral-950 overflow-hidden relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-104 transition-all" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-3.5">
                    <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono font-bold block">{p.brand}</span>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#D1D1D1] truncate mt-0.5">{p.name}</h4>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-sm font-black text-white">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-neutral-500 line-through">₹{p.mrp.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
