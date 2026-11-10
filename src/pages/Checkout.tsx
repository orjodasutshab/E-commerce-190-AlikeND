import { useState, FormEvent } from 'react';
import { ShieldCheck, ArrowLeft, Check, Compass, Plus, CreditCard, Banknote, User, CheckCircle2 } from 'lucide-react';
import { Address, CartItem, Order } from '../types';

interface CheckoutProps {
  cartItems: CartItem[];
  couponCode?: string;
  walletBalance: number;
  onDeductWallet: (amt: number) => boolean;
  onPlaceOrder: (order: Order) => void;
  onNavigate: (view: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const PRE_SAVED_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: 'Vikram Malhotra',
    phone: '9999999999',
    street: 'Penthouse 1202, Royal Residency, Juhu Gold Hill',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400049',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'Vikram Malhotra Office',
    phone: '9999900011',
    street: 'Atelier Creative Studios, Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400051',
  },
];

export default function Checkout({
  cartItems,
  couponCode,
  walletBalance,
  onDeductWallet,
  onPlaceOrder,
  onNavigate,
  showToast,
}: CheckoutProps) {
  const [step, setStep] = useState<number>(2); // Start at Step 2 (Address selection after Cart)
  const [addresses, setAddresses] = useState<Address[]>(PRE_SAVED_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(PRE_SAVED_ADDRESSES[0].id);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');

  // New Address Form States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');

  // Card input states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // UPI mobile
  const [upiId, setUpiId] = useState('');

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = couponCode === 'ALIKE10' ? Math.round(subtotal * 0.1) : 0;
  const gst = Math.round((subtotal - discount) * 0.18);
  const delivery = subtotal > 5000 ? 0 : 250;
  const totalAmount = subtotal - discount + gst + delivery;

  const handleAddAddress = (e: FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newStreet || !newCity || !newZip) {
      showToast('Please complete mandatory address lines.', 'error');
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      name: newName,
      phone: newPhone,
      street: newStreet,
      city: newCity,
      state: newState || 'Maharashtra',
      zip: newZip,
    };

    setAddresses([...addresses, newAddr]);
    setSelectedAddressId(newAddr.id);
    setShowAddressForm(false);
    showToast('New checkout delivery destination saved!', 'success');
  };

  const handlePlaceOrderSubmit = () => {
    const deliveryAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!deliveryAddress) {
      showToast('Please select a valid delivery address.', 'warning');
      return;
    }

    // Wallet transaction check
    if (paymentMethod === 'wallet') {
      const success = onDeductWallet(totalAmount);
      if (!success) {
        showToast('Insufficient wallet balance. Please top-up via UPI or choose credit card.', 'error');
        return;
      }
    }

    // Card parameter validation
    if (paymentMethod === 'card') {
      if (cardNumber.length < 16 || !cardExpiry || cardCVV.length < 3) {
        showToast('Please fill out card details.', 'error');
        return;
      }
    }

    // Generate standard order
    const orderId = `ALK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items: cartItems,
      subtotal,
      tax: gst,
      discount,
      delivery,
      total: totalAmount,
      status: 'Pending',
      address: deliveryAddress,
      paymentMethod: paymentMethod.toUpperCase(),
      trackingStep: 1, // Order Placed
    };

    onPlaceOrder(newOrder);
    setStep(4); // Advance to completion view
    showToast(`Order Placed Success! Invoice Ref: ${orderId}`, 'success');
  };

  return (
    <div id="checkout-root" className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* 4-Step Progress Navigation Header */}
      <div className="flex justify-between items-center max-w-xl mx-auto border-b border-solid border-neutral-800 pb-5" id="checkout-progress-bar">
        {[
          { num: 1, label: 'Cart' },
          { num: 2, label: 'Address' },
          { num: 3, label: 'Payment' },
          { num: 4, label: 'Confirm' },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border border-solid/40 transition-all ${
                s.num === step
                  ? 'bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black border-[#D1D1D1] shadow-md'
                  : s.num < step
                  ? 'bg-green-500 text-black border-green-500'
                  : 'bg-neutral-950 text-neutral-500 border-neutral-800'
              }`}
            >
              {s.num < step ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-[10px] uppercase tracking-wider font-extrabold ${
                s.num === step ? 'text-[#D1D1D1]' : 'text-neutral-500'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {step === 4 ? (
        /* SUCCESS ORDER COMPLETE VIEW REPRESENTATION */
        <div id="checkout-completion-view" className="max-w-lg mx-auto text-center p-8 bg-neutral-900 border border-solid border-[#D1D1D1] rounded-2xl shadow-2xl space-y-6">
          <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-500 shadow-inner">
            <CheckCircle2 className="w-12 h-12 animate-bounce" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
              Order Dispatched
            </h2>
            <p className="text-xs text-neutral-400">
              Your signature luxury items are packaging at our closest atelier terminal. Progress tracks inside your order tracker.
            </p>
          </div>

          <div className="bg-neutral-950 p-4 border border-solid border-neutral-850 rounded-xl divide-y divide-solid divide-neutral-900 text-xs">
            <div className="pb-2.5 flex justify-between">
              <span className="text-neutral-500">Destination Address:</span>
              <span className="font-extrabold text-white text-right">
                {addresses.find((a) => a.id === selectedAddressId)?.street}
              </span>
            </div>
            <div className="pt-2.5 flex justify-between">
              <span className="text-neutral-500">Method applied:</span>
              <span className="font-extrabold text-[#D1D1D1] uppercase">{paymentMethod}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              id="success-track-orders-btn"
              onClick={() => onNavigate('orders')}
              className="flex-1 py-3 bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              Track Order book
            </button>
            <button
              id="success-homepage-btn"
              onClick={() => onNavigate('home')}
              className="px-5 py-3 border border-solid border-neutral-700 hover:border-[#D1D1D1] text-xs font-bold text-white uppercase tracking-wider rounded-xl hover:bg-neutral-950 transition-colors"
            >
              Back Home
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2 & 3 DOUBLE INTERACTIVE AREA */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel context */}
          <div className="lg:col-span-8 space-y-6">
            {step === 2 && (
              /* PANEL A: ADDRESS SELECT */
              <div className="p-6 bg-neutral-900 border border-solid border-neutral-850 rounded-2xl space-y-5" id="address-selection-panel">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Select Dispatch Destination
                  </h3>
                  <button
                    id="add-new-address-toggle"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-xs text-[#D1D1D1] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Address
                  </button>
                </div>

                {/* Form to insert custom address */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="p-4 bg-neutral-950 border border-solid border-[#D1D1D1]/40 rounded-xl space-y-3 animate-fade-in text-xs">
                    <p className="font-bold text-[#D1D1D1] uppercase tracking-wider text-[10px]">Add physical destination</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        id="addr-form-name"
                        type="text"
                        required
                        placeholder="Receiver Full Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="p-2.5 bg-neutral-900 border border-solid border-neutral-850 rounded text-black focus:outline-none focus:border-[#D1D1D1] text-xs text-white"
                      />
                      <input
                        id="addr-form-phone"
                        type="tel"
                        required
                        placeholder="Mobile Phone"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="p-2.5 bg-neutral-900 border border-solid border-neutral-850 rounded text-black focus:outline-none focus:border-[#D1D1D1] text-xs text-white"
                      />
                    </div>
                    <input
                      id="addr-form-street"
                      type="text"
                      required
                      placeholder="Street line and Apartment number"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full p-2.5 bg-neutral-900 border border-solid border-neutral-850 rounded text-black focus:outline-none focus:border-[#D1D1D1] text-xs text-white"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        id="addr-form-city"
                        type="text"
                        required
                        placeholder="City"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="p-2.5 bg-neutral-900 border border-solid border-neutral-850 rounded text-black focus:outline-none focus:border-[#D1D1D1] text-xs text-white"
                      />
                      <input
                        id="addr-form-state"
                        type="text"
                        placeholder="State"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="p-2.5 bg-neutral-900 border border-solid border-neutral-850 rounded text-black focus:outline-none focus:border-[#D1D1D1] text-xs text-white"
                      />
                      <input
                        id="addr-form-zip"
                        type="text"
                        required
                        placeholder="Pincode/ZIP"
                        value={newZip}
                        onChange={(e) => setNewZip(e.target.value)}
                        className="p-2.5 bg-neutral-900 border border-solid border-neutral-850 rounded text-black focus:outline-none focus:border-[#D1D1D1] text-xs text-white"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        id="addr-form-cancel"
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 bg-neutral-900 border border-solid border-neutral-800 rounded text-neutral-400 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        id="addr-form-save"
                        type="submit"
                        className="px-4 py-2 bg-[#D1D1D1] text-black font-extrabold rounded"
                      >
                        Save & Dispatch
                      </button>
                    </div>
                  </form>
                )}

                {/* Pre-saved list */}
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex gap-4 p-4 rounded-xl border border-solid cursor-pointer transition-all select-none ${
                        selectedAddressId === addr.id
                          ? 'border-[#D1D1D1] bg-[#D1D1D1]/5'
                          : 'border-neutral-850 bg-neutral-950 hover:bg-neutral-900/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="checkout_destination"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-[#D1D1D1] focus:ring-[#D1D1D1] accent-[#D1D1D1]"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex justify-between font-bold text-white uppercase text-[10px] tracking-wide">
                          <span>{addr.name}</span>
                          <span className="text-neutral-500">📞 {addr.phone}</span>
                        </div>
                        <p className="text-neutral-300 mt-2 font-medium">{addr.street}</p>
                        <p className="text-neutral-500 mt-1">
                          {addr.city}, {addr.state} — {addr.zip}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    id="address-proceed-payment"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:opacity-95"
                  >
                    Select Secured Payments
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              /* PANEL B: METHOD SELECT */
              <div className="p-6 bg-neutral-900 border border-solid border-neutral-850 rounded-2xl space-y-6" id="payment-selection-panel">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep(2)}
                    className="p-1 hover:bg-neutral-800 text-neutral-400 rounded-lg"
                    title="Back to Address Select page"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Secured Payment Gateways
                  </h3>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'card', label: 'Credit Card', icon: <CreditCard className="w-5 h-5 text-[#D1D1D1]" /> },
                    { id: 'upi', label: 'UPI Pin', icon: <Compass className="w-5 h-5 text-[#D1D1D1]" /> },
                    { id: 'wallet', label: 'Alike Wallet', icon: <Banknote className="w-5 h-5 text-[#D1D1D1]" /> },
                    { id: 'cod', label: 'Cash on Del.', icon: <CheckCircle2 className="w-5 h-5 text-[#D1D1D1]" /> },
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      id={`pay-method-pill-${pay.id}`}
                      onClick={() => setPaymentMethod(pay.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border border-solid cursor-pointer select-none gap-2 text-xs font-bold transition-all ${
                        paymentMethod === pay.id
                          ? 'border-[#D1D1D1] bg-[#D1D1D1]/10 text-white'
                          : 'border-neutral-850 bg-neutral-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {pay.icon}
                      <span className="text-[10px] uppercase font-bold tracking-wider">{pay.label}</span>
                    </button>
                  ))}
                </div>

                {/* DYNAMIC METRIC FORM ACCORDING TO PAYMENT METHOD */}
                <div className="p-4 bg-neutral-950 border border-solid border-neutral-850 rounded-xl min-h-[140px] flex flex-col justify-center">
                  
                  {paymentMethod === 'card' && (
                    <div className="space-y-3 animate-fade-in text-xs max-w-sm mx-auto w-full text-white">
                      <p className="font-bold uppercase tracking-wider text-[10px] text-[#D1D1D1] text-left">Credit or Debit Card</p>
                      <input
                        id="card-number-input"
                        type="text"
                        maxLength={16}
                        required
                        placeholder="16-Digit Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-2.5 bg-neutral-900 border border-solid border-neutral-800 rounded focus:outline-none text-xs text-white text-center tracking-widest font-mono"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          id="card-expiry-input"
                          type="text"
                          maxLength={5}
                          required
                          placeholder="MM/YY Expiry"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="p-2.5 bg-neutral-900 border border-solid border-neutral-800 rounded focus:outline-none text-xs text-white text-center"
                        />
                        <input
                          id="card-cvv-input"
                          type="password"
                          maxLength={3}
                          required
                          placeholder="CVV"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                          className="p-2.5 bg-neutral-900 border border-solid border-neutral-800 rounded focus:outline-none text-xs text-white text-center tracking-widest"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-3 animate-fade-in text-xs text-center">
                      <p className="font-bold uppercase tracking-wider text-[10px] text-[#D1D1D1] text-center">Instant UPI Node Verification</p>
                      <input
                        id="upi-address-input"
                        type="text"
                        required
                        placeholder="e.g. paytm@alike"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="max-w-xs w-full mx-auto p-2.5 bg-neutral-900 border border-solid border-neutral-800 focus:border-[#D1D1D1] rounded text-xs text-white text-center font-mono focus:outline-none"
                      />
                      <p className="text-[10px] text-neutral-500">Supports PhonePe, BHIM, GooglePay, Paytm nodes.</p>
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div className="text-center space-y-2 animate-fade-in">
                      <p className="font-bold uppercase tracking-wider text-[10px] text-[#D1D1D1]">Secure wallet reserves</p>
                      <div className="text-2xl font-black text-white">
                        ₹{walletBalance.toLocaleString('en-IN')}
                      </div>
                      <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                        Order aggregate: <strong className="text-rose-500">₹{totalAmount.toLocaleString('en-IN')}</strong>. 
                        {walletBalance >= totalAmount ? (
                          <span className="text-green-500 block font-bold mt-1">✓ Balance is locked & ready. No card required!</span>
                        ) : (
                          <span className="text-red-500 block font-bold mt-1">❌ Insufficient balances. Please load money in Profile under settings.</span>
                        )}
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="text-center p-3 animate-fade-in text-xs space-y-1.5">
                      <p className="font-bold uppercase text-[10px] text-[#D1D1D1]">Cash on Delivery</p>
                      <p className="text-neutral-300 font-semibold text-center mt-1">
                        We collect cash or UPI upon express secure delivery drop.
                      </p>
                      <p className="text-[10px] text-neutral-500 leading-relaxed">Requires photo-verification of security pin upon driver arrival.</p>
                    </div>
                  )}

                </div>

                <div className="border-t border-solid border-neutral-800 pt-4 flex justify-between items-center text-xs">
                  <button
                    onClick={() => setStep(2)}
                    className="text-neutral-400 hover:text-white uppercase font-bold tracking-wider"
                  >
                    Select Address
                  </button>

                  <button
                    id="place-order-submit-btn"
                    onClick={handlePlaceOrderSubmit}
                    disabled={paymentMethod === 'wallet' && walletBalance < totalAmount}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 disabled:from-neutral-800 disabled:to-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 text-black font-extrabold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-green-500/10 cursor-pointer"
                  >
                    Place My Luxury Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel Order summary sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="p-6 bg-neutral-900 border border-solid border-neutral-850 rounded-2xl text-xs space-y-5">
              <h3 className="font-extrabold uppercase text-[10px] tracking-widest border-b border-solid border-neutral-800 pb-2.5">
                Cart Items ({cartItems.length})
              </h3>

              {/* Items row displays */}
              <div className="max-h-[160px] overflow-y-auto space-y-3.5 pr-1">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3 justify-between items-center">
                    <div className="flex gap-2.5 truncate min-w-0">
                      <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div className="truncate min-w-0">
                        <h4 className="font-bold text-white truncate text-[11px] leading-tight">{item.product.name}</h4>
                        <span className="text-neutral-500 text-[10px]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-white shrink-0">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Bill items */}
              <div className="space-y-2 pt-3 border-t border-solid border-neutral-800 font-medium text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500 font-bold">
                    <span>10% Promo Discount:</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span className="text-white">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transit Courier:</span>
                  <span className="text-white">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                </div>
              </div>

              {/* Aggregates total */}
              <div className="flex justify-between items-baseline pt-3 border-t border-solid border-neutral-800 font-extrabold text-sm uppercase">
                <span className="text-[#D1D1D1]">Total Outlay:</span>
                <span className="text-lg text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="p-3 bg-neutral-950 border border-solid border-neutral-850 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  Secure encryptions safeguard each transit routing loop. Fully certified for luxury payment clearance.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
