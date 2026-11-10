import { useState, FormEvent } from 'react';
import { ShieldCheck, ArrowRight, Check, Award, Building, Sparkles, AlertTriangle } from 'lucide-react';

interface SellerRegisterProps {
  onRegisterSuccess: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function SellerRegister({ onRegisterSuccess, showToast }: SellerRegisterProps) {
  const [step, setStep] = useState<number>(1);
  const [shopName, setShopName] = useState('');
  const [gstin, setGstin] = useState('');
  const [businessType, setBusinessType] = useState('Luxury Boutique');
  const [pan, setPan] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);

  // Mock checking IRS tax codes
  const handleNextStep = () => {
    if (step === 1) {
      if (!shopName || shopName.length < 3) {
        showToast('Please insert a realistic shop name (min 3 characters).', 'warning');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // GSTIN check matches India tax registration layout
      if (gstin.length < 15) {
        showToast('GSTIN Tax ID must be exactly 15 characters long.', 'error');
        return;
      }
      if (!pan || pan.length < 10) {
        showToast('Valid Permanent Account Number (PAN) is required.', 'error');
        return;
      }
      setStep(3);
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!agreementChecked) {
      showToast('Please sign and accept the Alike Luxury Seller Agreement.', 'warning');
      return;
    }

    onRegisterSuccess();
    showToast('Success! You are now a certified Alike Merchant Atelier!', 'success');
  };

  return (
    <div id="seller-register-root" className="max-w-xl mx-auto px-6 py-12">
      <div className="bg-neutral-900 border border-solid border-[#D1D1D1] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Visual Progress wizard */}
        <div className="flex gap-2 justify-center border-b border-solid border-neutral-850 pb-5">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-1.5 text-xs font-bold uppercase">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border border-solid transition-colors ${
                step === num
                  ? 'bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black border-[#D1D1D1]'
                  : step > num
                  ? 'bg-green-500 text-black border-green-500'
                  : 'bg-neutral-950 text-neutral-600 border-neutral-850'
              }`}>
                {step > num ? '✓' : num}
              </span>
              <span className={step === num ? 'text-[#D1D1D1]' : 'text-neutral-500'}>
                {num === 1 ? 'Boutique' : num === 2 ? 'Tax Audits' : 'Sign'}
              </span>
              {num < 3 && <span className="text-neutral-700 ml-1">/</span>}
            </div>
          ))}
        </div>

        {step === 1 && (
          /* STEP 1: COMPANY INFO */
          <div className="space-y-4 animate-fade-in text-xs text-white">
            <div className="text-center space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[#D1D1D1] font-black font-mono block">Step 1 of 3</span>
              <h2 className="text-md sm:text-lg font-black uppercase text-white">Atelier Registration</h2>
              <p className="text-neutral-500 leading-relaxed font-semibold">Define your luxury micro-brand, boutique setup, or watchmaker atelier guild.</p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-neutral-400">Boutique Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"><Building className="w-4 h-4" /></span>
                  <input
                    id="sell-shop-name"
                    type="text"
                    required
                    placeholder="e.g. Romanov Jewelers, Zenith Horology"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl focus:border-[#D1D1D1] focus:outline-none placeholder-neutral-600 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-neutral-400">Seller Business Architecture</label>
                <select
                  id="sell-business-type"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl focus:border-[#D1D1D1] focus:outline-none"
                  title="Business Architecture"
                >
                  <option value="Luxury Boutique">Luxury Boutique (Watches / Rings / Chains)</option>
                  <option value="Wholesale Atelier">Wholesale Atelier (Bulk Electronics / Attire)</option>
                  <option value="Independent Artisan">Independent Artisan (Handmade crafts)</option>
                  <option value="Premium Transport">Premium Delivery Transport (Express Driver)</option>
                </select>
              </div>

              <button
                id="sell-next-btn-1"
                onClick={handleNextStep}
                className="w-full py-3 bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] hover:opacity-95 text-black font-extrabold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1"
              >
                Assemble tax records <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          /* STEP 2: TAX AUDITS AND GSTIN */
          <div className="space-y-4 animate-fade-in text-xs text-white">
            <div className="text-center space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[#D1D1D1] font-black font-mono block">Step 2 of 3</span>
              <h2 className="text-md sm:text-lg font-black uppercase text-white">Regulatory Tax Compliance</h2>
              <p className="text-neutral-500 leading-relaxed font-semibold">Corporate identity audits preserve the authenticity benchmark of the Alike platform.</p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-neutral-400">GSTIN Tax Registration ID</label>
                <input
                  id="sell-gstin"
                  type="text"
                  maxLength={15}
                  required
                  placeholder="15-Character GSTIN Number"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl focus:border-[#D1D1D1] focus:outline-none text-center tracking-widest font-mono text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-neutral-400">PAN Identification ID</label>
                <input
                  id="sell-pan"
                  type="text"
                  maxLength={10}
                  required
                  placeholder="10-Character Permanent Account Code"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-neutral-950 border border-solid border-neutral-850 rounded-xl focus:border-[#D1D1D1] focus:outline-none text-center tracking-widest font-mono text-white text-xs"
                />
              </div>

              <div className="flex gap-2 justify-between pt-2">
                <button
                  id="sell-back-btn-2"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-neutral-900 border border-solid border-neutral-800 rounded text-neutral-400 font-semibold"
                >
                  Back
                </button>
                <button
                  id="sell-next-btn-2"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-[#D1D1D1] text-black font-extrabold rounded"
                >
                  Inspect Agreement Signature
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          /* STEP 3: COMPLETED SIGN AGREEMENT */
          <div className="space-y-4 animate-fade-in text-xs text-white">
            <div className="text-center space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[#D1D1D1] font-black font-mono block">Step 3 of 3</span>
              <h2 className="text-md sm:text-lg font-black uppercase text-white">Corporate Merchant Agreement</h2>
              <p className="text-neutral-500 leading-relaxed font-semibold">Authorizing the luxury digital code charter below completes your setup.</p>
            </div>

            <div className="p-4 bg-neutral-950 border border-solid border-neutral-850 rounded-xl space-y-3.5 max-h-[160px] overflow-y-auto text-neutral-400 leading-relaxed font-medium">
              <p>1. <strong>Authenticity Mandate:</strong> Merchants are strictly forbidden from placing counterfeit luxury wristwatches, chains or rings. Fully active tracking codes are mandatory.</p>
              <p>2. <strong>Delivery Corridor Agreements:</strong> High-speed local delivery corridors must pack items in safe, premium bags.</p>
              <p>3. <strong>Vetting Process:</strong> Random auditing from certified consultants secures each transaction loop.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-3 text-xs">
              <label className="flex items-start gap-2.5 text-neutral-300 font-medium cursor-pointer select-none">
                <input
                  id="sell-agreement-checkbox"
                  type="checkbox"
                  required
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-800 text-[#D1D1D1] focus:ring-[#D1D1D1] accent-[#D1D1D1]"
                />
                <span>I solemnly trace my boutique brand origin and accept all conditions listed in this Digital Charter.</span>
              </label>

              <div className="flex gap-2 justify-between pt-2">
                <button
                  id="sell-back-btn-3"
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-neutral-900 border border-solid border-neutral-800 rounded-xl text-neutral-400 font-semibold"
                >
                  Back
                </button>
                <button
                  id="sell-submit-btn"
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] text-black font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Commit Boutique Setup <Sparkles className="w-4 h-4 inline-block ml-1" />
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D1D1D1]/5 blur-2xl rounded-full"></div>
      </div>
    </div>
  );
}
