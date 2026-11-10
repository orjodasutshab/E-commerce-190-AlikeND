import { useState } from 'react';
import { Sparkles, ShoppingCart, RefreshCw, Star, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface AIRecommendationsProps {
  products: Product[];
  onAddMultipleToCart: (items: Product[]) => void;
  onSelectProduct: (p: Product) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

interface Archetype {
  id: string;
  name: string;
  desc: string;
  vibe: string;
  icon: string;
  productNames: string[];
}

const STYLE_ARCHETYPES: Archetype[] = [
  {
    id: 'yacht-club',
    name: 'Royal Monaco Yacht Club',
    desc: 'High-nautical gold chronometers paired with platinum ocean bands for marina lounging.',
    vibe: 'Sophisticated Nautical Royalist',
    icon: '⛵',
    productNames: ['Zenith El Primero Gold Edition', 'Minimalist Italian Gold Ring']
  },
  {
    id: 'met-gala',
    name: 'Billionaire Met Gala',
    desc: 'Bespoke polished diamonds, heavy 18K rose gold weight and Florence velvet accents.',
    vibe: 'Heavy Opulence red carpet',
    icon: '💎',
    productNames: ['Zenith El Primero Gold Edition', 'Luxury Cuban Link Chain']
  },
  {
    id: 'streetwear',
    name: 'Milano Streetwear Elite',
    desc: 'Heavy chunky links combined with contemporary industrial digital watches.',
    vibe: 'Contemporary Milanese Hype-Artisan',
    icon: '👟',
    productNames: ['Zenith El Primero Gold Edition', 'Luxury Cuban Link Chain']
  },
  {
    id: 'executive',
    name: 'Sovereign Boardroom Executive',
    desc: 'Elegantly understated Swiss mechanics matching certified bespoke diamond seals.',
    vibe: 'Stealth Wealth Aristocrat',
    icon: '💼',
    productNames: ['Minimalist Italian Gold Ring', 'Zenith El Primero Gold Edition']
  }
];

export default function AIRecommendations({
  products,
  onAddMultipleToCart,
  onSelectProduct,
  showToast,
}: AIRecommendationsProps) {
  const [selectedArch, setSelectedArch] = useState<string>('yacht-club');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);

  // Parse styled items from active products list
  const activeArchetype = STYLE_ARCHETYPES.find((a) => a.id === selectedArch) || STYLE_ARCHETYPES[0];

  const matchedProducts = products.filter((p) =>
    activeArchetype.productNames.some((name) => p.name.includes(name) || name.includes(p.name))
  );

  const bundleSubtotal = matchedProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscount = Math.round(bundleSubtotal * 0.15); // 15% package discount code
  const bundleTotal = bundleSubtotal - bundleDiscount;

  const handleGenerateStyle = () => {
    setIsGenerating(true);
    setHasGenerated(false);
    
    // Simulate smart AI compiler sequence
    setGenerationStep('Auditing client historical purchase indexes...');
    setTimeout(() => {
      setGenerationStep('Mapping chromatic gold alignments with Zurich catalogs...');
      setTimeout(() => {
        setGenerationStep('Synthesizing Milanese tailoring standards...');
        setTimeout(() => {
          setIsGenerating(false);
          setHasGenerated(true);
          showToast(`Algorithm compiled lookroom: ${activeArchetype.name}!`, 'success');
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleAddBundleToCart = () => {
    if (matchedProducts.length === 0) return;
    onAddMultipleToCart(matchedProducts);
    showToast(`Added entire styling lookroom bundle to your shopping bag! Saved ₹${bundleDiscount.toLocaleString('en-IN')}!`, 'success');
  };

  return (
    <div id="ai-recs-root" className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Visual Header */}
      <div className="border border-solid border-[#D1D1D1] rounded-2xl p-6 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-950 text-center space-y-2.5 relative overflow-hidden" id="ai-recs-intro">
        <span className="text-[#D1D1D1] text-[9px] font-mono tracking-widest uppercase font-black block">Gemini 2.5 flash style matrix</span>
        <h1 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-white via-[#E5E5E5] to-[#D1D1D1] bg-clip-text text-transparent uppercase select-none">
          AI Lookroom Style Counselor
        </h1>
        <p className="text-xs text-neutral-500 max-w-lg mx-auto leading-relaxed">
          Select customized persona benchmarks. Our predictive fashion matrix aligns color matching, material integrity and platinum balances directly.
        </p>
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-3xl rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column selection pane */}
        <aside className="lg:col-span-4 bg-neutral-900/40 backdrop-blur-md border border-solid border-neutral-850/60 p-5 rounded-2xl space-y-6">
          <h3 className="text-xs uppercase tracking-widest font-extrabold text-white pb-2.5 border-b border-solid border-neutral-805">
            1. Select archetype vibe
          </h3>

          <div className="space-y-3.5">
            {STYLE_ARCHETYPES.map((arch) => (
              <div
                key={arch.id}
                id={`arch-card-${arch.id}`}
                onClick={() => setSelectedArch(arch.id)}
                className={`p-4 rounded-xl border border-solid cursor-pointer select-none transition-all ${
                  selectedArch === arch.id
                    ? 'border-[#D1D1D1] bg-neutral-950/40'
                    : 'border-neutral-850 bg-neutral-950 hover:bg-neutral-900/50'
                }`}
              >
                <div className="flex gap-3">
                  <span className="text-2xl mt-0.5" role="img" aria-label={arch.name}>{arch.icon}</span>
                  <div className="text-xs space-y-1">
                    <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wide">{arch.name}</h4>
                    <p className="text-neutral-400 font-medium leading-relaxed">{arch.desc}</p>
                    <p className="text-[10px] text-neutral-300 italic font-semibold">Core: {arch.vibe}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            id="compile-ai-dossier-btn"
            onClick={handleGenerateStyle}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] hover:shadow-lg disabled:from-neutral-800 disabled:to-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed disabled:shadow-none text-black font-extrabold uppercase tracking-widest text-xs rounded-xl flex justify-center items-center gap-2 transition-transform active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" /> Curate Atelier Look
          </button>
        </aside>

        {/* Right column Lookbook generation feedback */}
        <section className="lg:col-span-8 bg-neutral-900/40 backdrop-blur-md border border-solid border-neutral-850/60 p-5 rounded-2xl min-h-[350px] flex flex-col justify-center">
          
          {isGenerating && (
            /* COMPILING LOADER ANIMATION VIEW */
            <div id="ai-compiling-loader" className="text-center py-12 space-y-4 animate-pulse">
              <span className="inline-flex p-4 rounded-full bg-neutral-950 border border-solid border-neutral-800 text-white">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </span>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Atelier Signature Synthesis Active</p>
                <p className="text-[#D1D1D1] text-xs font-mono font-black italic">{generationStep}</p>
              </div>
            </div>
          )}

          {!isGenerating && !hasGenerated && (
            /* EMPTY INITIAL CALL TO ACTION */
            <div id="atelier-style-call-to-action" className="text-center py-16 space-y-4 text-neutral-500">
              <span className="inline-flex p-5 rounded-full bg-neutral-950 border border-solid border-neutral-850">
                <Sparkles className="w-10 h-10 text-white opacity-80" />
              </span>
              <div className="space-y-1">
                <h3 className="text-white font-bold text-sm uppercase">Atelier Stylist Guild Online</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Trigger our counselor styling guild by selecting archetype vibes and curating your bespoke look.
                </p>
              </div>
            </div>
          )}

          {!isGenerating && hasGenerated && (
            /* GENERATED STYLED COMPILATION GRID RESULTS */
            <div id="ai-lookbook-grid-results" className="space-y-6 animate-fade-in text-xs">
              
              {/* Lookbook Summary Card Header */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-solid border-[#D1D1D1]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-black text-white font-mono">Dossier lock unlocked: 15% Off</span>
                  <h3 className="text-md font-bold text-white uppercase">{activeArchetype.name} Suite</h3>
                  <p className="text-neutral-500 text-[10px]">Stylist Vibe matches: <strong>Stealth luxury styling</strong></p>
                </div>

                <div className="shrink-0 self-stretch sm:self-auto">
                  <button
                    id="add-bundle-lookbook-cart-btn"
                    onClick={handleAddBundleToCart}
                    className="w-full py-3 px-5 uppercase font-extrabold text-[10px] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-green-500/10 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Acquire Look Suite (15% Off)
                  </button>
                </div>
              </div>

              {/* Grid of matched items */}
              <div className="grid grid-cols-2 gap-5">
                {matchedProducts.map((p) => {
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className="group cursor-pointer bg-neutral-950 rounded-xl p-4 border border-solid border-neutral-850 hover:border-[#D1D1D1] transition-all"
                    >
                      <img src={p.image} alt={p.name} className="w-full aspect-square rounded-lg object-cover bg-neutral-900 group-hover:scale-102 transition-transform" referrerPolicy="no-referrer" />
                      <span className="text-[9px] text-neutral-400 uppercase font-mono mt-3 block">{p.brand}</span>
                      <h4 className="font-bold text-white truncate text-[11px] mt-0.5 leading-tight">{p.name}</h4>
                      <p className="text-[10px] text-neutral-400 mt-1 shadow-inner">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                  );
                })}
              </div>

              {/* Aggregate bill info */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-solid border-neutral-850 divide-y divide-solid divide-neutral-900 space-y-3">
                <div className="flex justify-between font-bold text-neutral-500">
                  <span>Bundled Subtotal:</span>
                  <span className="text-white">₹{bundleSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-green-500 pt-3">
                  <span>15% AI Lookroom Discount:</span>
                  <span>-₹{bundleDiscount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-extrabold text-white pt-3 text-sm uppercase border-t border-solid border-neutral-900">
                  <span>Final outfit outlay:</span>
                  <span className="text-white">₹{bundleTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-center text-neutral-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>🔒 AI styling lockers hold certificates of Venice genuine weights.</span>
              </div>

            </div>
          )}

        </section>
      </div>
    </div>
  );
}
