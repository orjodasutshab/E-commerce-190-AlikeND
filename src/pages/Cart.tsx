import { useState, FormEvent } from 'react';
import { Trash2, ShieldCheck, Tag, ArrowRight, Minus, Plus, Bookmark, RefreshCw, ShoppingCart, ShoppingBag } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartProps {
  cartItems: CartItem[];
  allProducts: Product[];
  onUpdateQuantity: (id: number, qty: number, color?: string, size?: string) => void;
  onRemoveItem: (id: number, color?: string, size?: string) => void;
  onSelectProduct: (p: Product) => void;
  onProceedToCheckout: (couponCode?: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function Cart({
  cartItems,
  allProducts,
  onUpdateQuantity,
  onRemoveItem,
  onSelectProduct,
  onProceedToCheckout,
  showToast,
}: CartProps) {
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'ALIKE10') {
      setAppliedCoupon('ALIKE10');
      showToast('Offer Applied! 10% off coupon code ALIKE10 is validated.', 'success');
    } else {
      showToast('Invalid promo code. Try ALIKE10 for a demo discount.', 'error');
    }
  };

  const handleSaveForLater = (item: CartItem) => {
    setSavedForLater((prev) => [...prev, item]);
    onRemoveItem(item.product.id, item.selectedColor, item.selectedSize);
    showToast(`Saved "${item.product.name}" for later purchase.`, 'info');
  };

  const handleMoveToCart = (item: CartItem) => {
    onUpdateQuantity(item.product.id, item.quantity, item.selectedColor, item.selectedSize);
    setSavedForLater((prev) =>
      prev.filter(
        (i) =>
          !(
            i.product.id === item.product.id &&
            i.selectedColor === item.selectedColor &&
            i.selectedSize === item.selectedSize
          )
      )
    );
    showToast(`Moved "${item.product.name}" to your shopping basket!`, 'success');
  };

  const handleRemoveSaved = (item: CartItem) => {
    setSavedForLater((prev) =>
      prev.filter(
        (i) =>
          !(
            i.product.id === item.product.id &&
            i.selectedColor === item.selectedColor &&
            i.selectedSize === item.selectedSize
          )
      )
    );
    showToast('Removed saved catalog draft.', 'info');
  };

  // Math aggregates
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const gst = Math.round((subtotal - discount) * 0.18);
  const delivery = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const totalAmount = subtotal - discount + gst + delivery;

  // Recommendations
  const cartRecs = allProducts.filter((p) => !cartItems.some((item) => item.product.id === p.id)).slice(0, 3);

  return (
    <div id="cart-root" className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] bg-clip-text text-transparent flex items-center gap-2 mb-8 select-none">
        <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 text-[#D1D1D1]" /> Review Client Shopping Bag
      </h1>

      {cartItems.length === 0 ? (
        <div id="empty-cart-view" className="text-center py-16 border border-dashed border-neutral-800 rounded-3xl space-y-5">
          <span className="inline-flex p-6 rounded-full bg-neutral-950 text-neutral-600 border border-solid border-neutral-850">
            <ShoppingCart className="w-10 h-10" />
          </span>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Your Shopping Basket is Empty</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              Explore our physical stock drops, gold chronographs, tech catalogs or wholesale options to populate your basket.
            </p>
          </div>
          <button
            id="cart-empty-shop-now-btn"
            onClick={() => onProceedToCheckout()} 
            className="px-6 py-3 bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-[0.98]"
          >
            Explore marketplace
          </button>
        </div>
      ) : (
        /* Split view columns */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart items table lists */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-neutral-900 border border-solid border-neutral-850 rounded-2xl overflow-hidden shadow-md">
              {/* Desktop Headers */}
              <div className="hidden sm:grid grid-cols-12 gap-4 bg-neutral-950 p-4 border-b border-solid border-neutral-800 text-[10px] uppercase tracking-wider font-extrabold text-neutral-500">
                <div className="col-span-6">Luxury Item</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Aggregate</div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-solid divide-neutral-800">
                {cartItems.map((item) => {
                  const itemKey = `${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`;
                  return (
                    <div
                      key={itemKey}
                      id={`cart-item-row-${item.product.id}`}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center"
                    >
                      {/* Product Thumbnail Info */}
                      <div className="col-span-1 sm:col-span-6 flex gap-4">
                        <div
                          className="w-16 h-16 rounded-xl bg-neutral-950 overflow-hidden border border-solid border-neutral-800 cursor-pointer shrink-0"
                          onClick={() => onSelectProduct(item.product)}
                        >
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-neutral-500 font-mono tracking-widest font-extrabold block">
                            {item.product.brand}
                          </span>
                          <h3
                            onClick={() => onSelectProduct(item.product)}
                            className="text-xs font-bold text-white hover:text-[#D1D1D1] cursor-pointer line-clamp-1 truncate"
                          >
                            {item.product.name}
                          </h3>
                          <div className="flex gap-2 text-[10px] text-neutral-400 font-semibold" id="cart-item-configs">
                            {item.selectedColor && (
                              <span>Color: <strong className="text-[#D1D1D1]">{item.selectedColor}</strong></span>
                            )}
                            {item.selectedSize && (
                              <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                            )}
                          </div>
                          
                          {/* Mobile Actions block */}
                          <div className="flex sm:hidden gap-3.5 pt-1.5" id="cart-mobile-actions">
                            <button
                              id={`save-item-${item.product.id}`}
                              onClick={() => handleSaveForLater(item)}
                              className="text-[10px] text-[#D1D1D1] hover:underline uppercase tracking-wider font-extrabold"
                            >
                              Save Draft
                            </button>
                            <button
                              id={`remove-item-${item.product.id}`}
                              onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                              className="text-[10px] text-red-500 hover:underline uppercase tracking-wider font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Price */}
                      <div className="hidden sm:block col-span-2 text-center font-bold text-xs text-white">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="col-span-12 sm:col-span-2 flex justify-center">
                        <div className="flex items-center bg-neutral-950 border border-solid border-neutral-800 rounded-lg p-1 text-white">
                          <button
                            id={`qty-dec-${item.product.id}`}
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                            className="p-1 hover:bg-neutral-850 rounded"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold font-mono inline-block">
                            {item.quantity}
                          </span>
                          <button
                            id={`qty-inc-${item.product.id}`}
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                            className="p-1 hover:bg-neutral-850 rounded"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal & Action buttons */}
                      <div className="col-span-12 sm:col-span-2 text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <span className="sm:hidden text-neutral-500 text-xs font-bold uppercase mr-1">Row Subtotal:</span>
                        <div className="font-extrabold text-xs text-white" id={`item-subtotal-${item.product.id}`}>
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </div>

                        {/* Save drafts actions list */}
                        <div className="hidden sm:flex items-center gap-2 pt-0.5">
                          <button
                            onClick={() => handleSaveForLater(item)}
                            className="p-1 border border-solid border-neutral-800 rounded bg-neutral-950 text-neutral-400 hover:text-[#D1D1D1] hover:border-[#D1D1D1]"
                            title="Save for Later"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                            className="p-1 border border-solid border-neutral-800 rounded bg-neutral-950 text-neutral-400 hover:text-red-500 hover:border-red-500"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Saved for Later Section if any */}
            {savedForLater.length > 0 && (
              <div id="saved-for-later-section" className="p-5 rounded-2xl bg-neutral-900/60 border border-solid border-neutral-850 space-y-4">
                <span className="text-[10px] uppercase font-black text-[#D1D1D1] tracking-widest block">Saved drafts stack</span>
                <h3 className="text-md font-bold text-white">Purchase Drafts Saved for Later ({savedForLater.length})</h3>
                <div className="divide-y divide-solid divide-neutral-850">
                  {savedForLater.map((sItem) => (
                    <div key={sItem.product.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex gap-3">
                        <img src={sItem.product.image} alt={sItem.product.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{sItem.product.name}</h4>
                          <span className="text-[11px] text-[#D1D1D1] font-mono leading-tight">₹{sItem.product.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMoveToCart(sItem)}
                          className="px-3 py-1.5 bg-[#D1D1D1] hover:bg-[#ffffff] text-black text-[10px] uppercase font-extrabold rounded-lg transition-colors"
                        >
                          Draft back to Wallet
                        </button>
                        <button
                          onClick={() => handleRemoveSaved(sItem)}
                          className="px-2.5 py-1.5 bg-neutral-950 border border-solid border-neutral-800 text-neutral-400 hover:text-red-500 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky checkout bill aggregates */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="p-6 bg-neutral-900 border border-solid border-[#D1D1D1]/40 rounded-2xl shadow-xl space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-extrabold text-white pb-3 border-b border-solid border-neutral-800">
                Consolidated Invoice
              </h3>

              {/* Promo input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Secure Promo Voucher
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon-input"
                    type="text"
                    placeholder="Enter ALIKE10"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-neutral-950 border border-solid border-neutral-850 rounded-xl text-xs text-white uppercase focus:outline-none focus:border-[#D1D1D1]"
                  />
                  <button
                    id="apply-coupon-btn"
                    type="submit"
                    className="px-4.5 bg-neutral-800 text-[#D1D1D1] hover:bg-[#D1D1D1] hover:text-black hover:border-[#D1D1D1] font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-solid border-neutral-700"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-1">
                    <Tag className="w-3.5 h-3.5 fill-current" /> Promo Coupon applied: ALIKE10 (10% off)
                  </p>
                )}
              </form>

              {/* Price Details */}
              <div className="space-y-3.5 text-xs font-semibold text-neutral-400 border-t border-b border-solid border-neutral-800 py-4">
                <div className="flex justify-between">
                  <span>Standard Subtotal:</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500 font-bold">
                    <span>10% Club Coupon Discount:</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Transit Courier:</span>
                  <span className="text-white">
                    {delivery === 0 ? <strong className="text-green-500 uppercase">FREE OVER ₹5,000</strong> : `₹${delivery}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Regulated GST (18%):</span>
                  <span className="text-white">₹{gst.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Total Aggregate */}
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-widest text-[#D1D1D1] font-extrabold">Final Outlay:</span>
                <span className="text-2xl font-black text-white" id="final-total-cart">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Actions trigger */}
              <button
                id="cart-proceed-checkout"
                onClick={() => onProceedToCheckout(appliedCoupon || undefined)}
                className="w-full py-4 bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] hover:shadow-lg text-black font-extrabold text-xs uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer shadow-neutral-500/10"
              >
                Safe Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-neutral-500 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D1D1D1]" /> 🔒 Fully Secure Checkout & Safe Platinum Payments
              </p>
            </div>

            {/* Side Accompaniment Suggestions */}
            {cartRecs.length > 0 && (
              <div className="p-4 rounded-2xl bg-neutral-900 border border-solid border-neutral-850 space-y-3.5">
                <p className="text-[10px] uppercase font-black text-neutral-500 tracking-widest block">Bag Additions</p>
                <div className="divide-y divide-solid divide-neutral-850">
                  {cartRecs.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => onSelectProduct(rec)}
                      className="py-2.5 flex items-center gap-3 cursor-pointer group"
                    >
                      <img src={rec.image} alt={rec.name} className="w-10 h-10 rounded-lg object-cover bg-neutral-950" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-white group-hover:text-[#D1D1D1] truncate">{rec.name}</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">₹{rec.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
