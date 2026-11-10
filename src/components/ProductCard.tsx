import { Eye, Heart, GitCompare, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onCompare: (p: Product) => void;
  onQuickView?: (p: Product) => void;
  isWishlisted: boolean;
  key?: number | string;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  onSelectProduct,
  onCompare,
  onQuickView,
  isWishlisted,
}: ProductCardProps) {
  const { id, name, brand, price, mrp, rating, reviewsCount, image, badge } = product;

  // Calculate discount percentage
  const discountPercent = Math.round(((mrp - price) / mrp) * 100);

  // 2.8 Stock Indicator logic
  const getStockStatus = (pId: number) => {
    if (pId % 6 === 0) return { label: 'Out of Stock', class: 'text-red-400 bg-red-500/10 border-red-500/25', isOut: true };
    if (pId % 4 === 0) return { label: 'Only 3 left!', class: 'text-amber-500 bg-amber-500/10 border-amber-500/25 animate-pulse', isOut: false };
    return { label: 'In Stock', class: 'text-green-400 bg-green-500/10 border-green-500/25', isOut: false };
  };
  const stock = getStockStatus(id);

  return (
    <div
      id={`product-card-${id}`}
      className={`group relative flex flex-col bg-neutral-900 border border-solid border-neutral-800 hover:border-[#D4AF37] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:-translate-y-1.5 ${
        stock.isOut ? 'opacity-70 grayscale-[20%]' : ''
      }`}
    >
      {/* Badge container */}
      {badge && (
        <span
          id={`product-badge-${id}`}
          className={`absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase rounded-full shadow-md text-black ${
            badge === 'HOT'
              ? 'bg-red-500'
              : badge === 'SALE'
              ? 'bg-[#D4AF37]'
              : badge === 'NEW'
              ? 'bg-green-500'
              : 'bg-[#D4AF37]'
          }`}
        >
          {badge}
        </span>
      )}

      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-neutral-950 cursor-pointer" onClick={() => !stock.isOut && onSelectProduct(product)}>
        <img
          id={`product-image-${id}`}
          src={image}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay of Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            id={`wishlist-btn-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2 rounded-full border border-solid border-neutral-800 bg-black/80 hover:bg-[#D4AF37] hover:border-[#D4AF37] text-neutral-300 hover:text-black transition-all shadow-md`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-[#D4AF37] text-[#D4AF37] hover:text-black' : ''}`} />
          </button>
          <button
            id={`quickview-btn-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) {
                onQuickView(product);
              } else {
                onSelectProduct(product);
              }
            }}
            className="p-2 rounded-full border border-solid border-neutral-800 bg-black/80 hover:bg-[#D4AF37] hover:border-[#D4AF37] text-neutral-300 hover:text-black transition-all shadow-md"
            title="Quick View"
          >
            <Eye className="w-4.5 h-4.5" />
          </button>
          <button
            id={`compare-btn-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              onCompare(product);
            }}
            className="p-2 rounded-full border border-solid border-neutral-800 bg-black/80 hover:bg-[#D4AF37] hover:border-[#D4AF37] text-neutral-300 hover:text-black transition-all shadow-md"
            title="Compare Product"
          >
            <GitCompare className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="flex flex-col flex-1 p-4 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold font-mono mb-1">
          {brand}
        </span>
        
        {/* Product Title (2-line clamp) */}
        <h3
          id={`product-title-${id}`}
          onClick={() => !stock.isOut && onSelectProduct(product)}
          className="text-sm font-semibold text-white group-hover:text-[#D4AF37] line-clamp-2 cursor-pointer h-10 transition-colors"
        >
          {name}
        </h3>

        {/* Rating and Reviews Row with Stock status */}
        <div className="flex items-center justify-between gap-1.5 mt-2.5 mb-3">
          <div className="flex items-center gap-1" id={`product-reviews-${id}`}>
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-white ml-1">{rating.toFixed(1)}</span>
            </div>
            <span className="text-neutral-500 text-xs">·</span>
            <span className="text-neutral-500 text-[11px]">({reviewsCount})</span>
          </div>

          {/* Stock Badge */}
          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border border-solid ${stock.class}`}>
            {stock.label}
          </span>
        </div>

        {/* Price & MRP Row */}
        <div className="mt-auto flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-white" id={`price-${id}`}>
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-neutral-500 line-through" id={`mrp-${id}`}>
              ₹{mrp.toLocaleString('en-IN')}
            </span>
          </div>
          {discountPercent > 0 && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-solid border-green-500/20">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Dynamic Add to Cart button */}
        <button
          id={`add-to-cart-card-${id}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!stock.isOut) onAddToCart(product);
          }}
          disabled={stock.isOut}
          className={`mt-4 w-full py-2 border border-solid rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md active:scale-98 text-xs uppercase tracking-wider font-semibold active:scale-[0.97] ${
            stock.isOut
              ? 'bg-neutral-850 border-neutral-800 text-neutral-500 cursor-not-allowed'
              : 'bg-neutral-800 border-neutral-700 hover:border-[#D4AF37] hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#F59E0B] text-neutral-200 hover:text-black shadow-inner hover:shadow-[0_0_15px_rgba(212,175,55,0.25)]'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {stock.isOut ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
