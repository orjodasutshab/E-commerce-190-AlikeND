import { useState, useEffect } from 'react';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Tv,
  Smartphone,
  Laptop,
  Shirt,
  Gem,
  ShoppingBag,
  Gamepad2,
  Wrench,
  Sparkles,
  Armchair,
  Diamond,
  PackageOpen,
  LayoutGrid,
  Briefcase,
  Store,
  ChevronRight,
  Star,
  Quote,
  MessageSquare
} from 'lucide-react';
import { Product, Job, Testimonial } from '../types';
import { CATEGORIES } from '../data/mockData';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  products: Product[];
  jobs: Job[];
  testimonials: Testimonial[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  onNavigate: (view: string, filter?: string) => void;
  wishlistedIds: number[];
  onCompare: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    title: "Smart Shopping Experience",
    subtitle: "DEMAND PERFECTION. THE NEW GOLD STANDARD.",
    desc: "Plunge into our curated catalog of ultra-premium electronics, handcrafted jewelery, and high-net-worth designer apparel.",
    button1: "Shop Now",
    button2: "Become a Seller",
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200",
    action1: "category_search",
    action2: "seller_register"
  },
  {
    id: 2,
    title: "Guaranteed 20 Min Delivery",
    subtitle: "EXPRESS URBAN LUXURY AT YOUR DOORSTEP",
    desc: "Why wait for premium? We courier organic caviar, luxury serums, and chrome hardware to your sector in under 20 minutes.",
    button1: "See Speed Deals",
    button2: "How It Works",
    bgImage: "https://images.unsplash.com/photo-1580907115718-4c8abd021ae5?auto=format&fit=crop&q=80&w=1200",
    action1: "category_search",
    categoryFilter: "delivery",
    action2: "messenger"
  },
  {
    id: 3,
    title: "B2B Volume Wholesale Deals",
    subtitle: "DIRECT BULK IMPORTS FROM ATELIER LEADERS",
    desc: "Secure Persian saffron lots, bulk fast-charger boxes, and designer satin wraps directly. Save up to 45% with our transparent tier grids.",
    button1: "Browse Whole Catalog",
    button2: "Register Corporate",
    bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    action1: "category_search",
    categoryFilter: "wholesale",
    action2: "seller_register"
  }
];

export default function Home({
  products,
  jobs,
  testimonials,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  onNavigate,
  wishlistedIds,
  onCompare,
  onQuickView,
}: HomeProps) {
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Flash Sale Timer State (24 hours standard initial)
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

  // VIP Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 24 * 60 * 60));
    }, 1000);

    return () => {
      clearInterval(heroInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0')
    };
  };

  const timer = formatTime(timeLeft);

  // Filters for Homepage displays
  const flashSaleProducts = products.filter(p => p.badge === 'SALE').slice(0, 4);
  const featuredProducts = products.filter(p => p.category === 'luxury' || p.badge === 'HOT').slice(0, 4);
  const wholesaleProducts = products.filter(p => p.isWholesale).slice(0, 4);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tv': return <Tv className="w-5 h-5 text-[#D1D1D1]" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-[#D1D1D1]" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-[#D1D1D1]" />;
      case 'Shirt': return <Shirt className="w-5 h-5 text-[#D1D1D1]" />;
      case 'Gem': return <Gem className="w-5 h-5 text-[#D1D1D1]" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-[#D1D1D1]" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-[#D1D1D1]" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-[#D1D1D1]" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#D1D1D1]" />;
      case 'Armchair': return <Armchair className="w-5 h-5 text-[#D1D1D1]" />;
      case 'Diamond': return <Diamond className="w-5 h-5 text-[#D1D1D1]" />;
      case 'PackageOpen': return <PackageOpen className="w-5 h-5 text-[#D1D1D1]" />;
      case 'Zap': return <Zap className="w-5 h-5 text-neutral-400" />;
      default: return <LayoutGrid className="w-5 h-5 text-[#D1D1D1]" />;
    }
  };

  return (
    <div id="homepage-root" className="space-y-12 pb-16">
      {/* 1. Hero Auto-Slider Section */}
      <section className="relative h-[480px] md:h-[550px] bg-black overflow-hidden select-none">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            id={`hero-slide-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background image & deep linear darkening layer */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={slide.bgImage}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5500ms] ease-out"
                style={{ transform: index === currentSlide ? 'scale(1.04)' : 'scale(1.0)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            </div>

            {/* Slide Body Context */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-4xl mx-auto px-6 sm:px-8 w-full space-y-4 md:space-y-6">
                <span className="inline-block px-3 py-1 bg-[#D4AF37]/15 border border-solid border-[#D4AF37]/50 text-[#D4AF37] text-[10px] tracking-widest font-extrabold uppercase rounded-full">
                  {slide.subtitle}
                </span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-md text-neutral-400 font-medium leading-relaxed max-w-xl">
                  {slide.desc}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => {
                      if (slide.categoryFilter) {
                        onNavigate(slide.action1, slide.categoryFilter);
                      } else {
                        onNavigate(slide.action1);
                      }
                    }}
                    className="px-6 py-3 uppercase tracking-wider font-extrabold text-black bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#F59E0B] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] rounded-xl text-[13px] md:text-sm active:scale-[0.98] transition-all hover:scale-105 duration-350"
                  >
                    {slide.button1} <ArrowRight className="inline-block w-4.5 h-4.5 ml-1" />
                  </button>
                  <button
                    onClick={() => onNavigate(slide.action2)}
                    className="px-6 py-3 uppercase tracking-wider font-bold text-white border border-solid border-neutral-700 hover:border-[#D4AF37] hover:bg-neutral-900/60 rounded-xl text-[13px] md:text-sm transition-all hover:scale-105 duration-350 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                  >
                    {slide.button2}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-neutral-950/80 border border-solid border-neutral-800 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 active:scale-[0.93] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          title="Previous slide"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-neutral-950/80 border border-solid border-neutral-800 text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 active:scale-[0.93] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          title="Next slide"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Paginator Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-7 bg-[#D4AF37]' : 'bg-neutral-600 hover:bg-neutral-500'
              }`}
              title={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* 2. Top Banner Features (4 Service Cards) */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => onNavigate('category_search', 'delivery')}
          className="cursor-pointer group flex items-start gap-4 p-5 bg-neutral-900/40 backdrop-blur-md border border-solid border-neutral-800 hover:border-[#D4AF37]/80 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:-translate-y-1"
        >
          <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl group-hover:scale-105 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm group-hover:text-[#D4AF37] transition-all">20 Min Delivery</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Express Sector Logistics couriers premium essentials instantly.
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('messenger')}
          className="cursor-pointer group flex items-start gap-4 p-5 bg-neutral-900/40 backdrop-blur-md border border-solid border-neutral-800 hover:border-[#D4AF37]/80 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:-translate-y-1"
        >
          <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl group-hover:scale-105 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm group-hover:text-[#D4AF37] transition-all">Concierge Messenger</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Instant contact and platinum negotiations direct with sellers.
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('seller_register')}
          className="cursor-pointer group flex items-start gap-4 p-5 bg-neutral-900/40 backdrop-blur-md border border-solid border-neutral-800 hover:border-[#D4AF37]/80 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:-translate-y-1"
        >
          <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl group-hover:scale-105 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm group-hover:text-[#D4AF37] transition-all">Become a Seller</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Launch storefronts, manage bulk catalog, and reach luxury buyers.
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('ai_recommendations')}
          className="cursor-pointer group flex items-start gap-4 p-5 bg-neutral-900/40 backdrop-blur-md border border-solid border-neutral-800 hover:border-[#D4AF37]/80 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:-translate-y-1"
        >
          <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl group-hover:scale-105 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm group-hover:text-[#D4AF37] transition-all">AI Recommendation</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Deep machine curation matchings based on your client style.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-solid border-neutral-800 pb-3">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-white via-neutral-100 to-[#D4AF37] bg-clip-text text-transparent tracking-tight">
              Browse Categories
            </h3>
            <p className="text-xs text-neutral-500 mt-1">Discover curated premium collections</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              onClick={() => onNavigate('category_search', cat.id)}
              className="group cursor-pointer p-4 bg-neutral-900 border border-solid border-neutral-800 hover:border-[#D4AF37] rounded-xl text-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:-translate-y-1"
            >
              <div className="inline-flex p-3 rounded-full bg-neutral-950 mb-3 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(212,175,55,0.25)]">
                {getCategoryIcon(cat.icon)}
              </div>
              <h4 className="text-xs font-semibold text-neutral-300 group-hover:text-white truncate">
                {cat.label}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Flash Sale Section (With 24h Countdown) */}
      <section className="max-w-7xl mx-auto px-6 p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-solid border-[#D4AF37]/30 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-solid border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <Zap className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">
                Flash Premium Hours
              </h3>
              <p className="text-xs text-neutral-500">Uncompromised pricing on luxury gear</p>
            </div>
          </div>

          {/* Golden Countdown timer */}
          <div className="flex items-center gap-2 text-white">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mr-1">Time Left:</span>
            <div className="flex gap-1.5 font-mono font-bold text-sm">
              <div className="bg-neutral-950 px-2.5 py-1.5 rounded border border-solid border-[#D4AF37]/40 text-[#D4AF37]">
                {timer.hours}
              </div>
              <span className="self-center text-[#D4AF37]">:</span>
              <div className="bg-neutral-950 px-2.5 py-1.5 rounded border border-solid border-[#D4AF37]/40 text-[#D4AF37]">
                {timer.minutes}
              </div>
              <span className="self-center text-[#D4AF37]">:</span>
              <div className="bg-neutral-950 px-2.5 py-1.5 rounded border border-solid border-[#D4AF37]/40 text-[#D4AF37]">
                {timer.seconds}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic products in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {flashSaleProducts.map((p) => {
            const isWishlisted = wishlistedIds.includes(p.id);
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
          })}
        </div>
      </section>

      {/* 5. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex justify-between items-end border-b border-solid border-neutral-800 pb-3">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-white via-neutral-100 to-[#D4AF37] bg-clip-text text-transparent tracking-tight">
              ✨ Selected Luxury Goods
            </h3>
            <p className="text-xs text-neutral-500 mt-1">Our crown elite catalog with masterclass platinum grades</p>
          </div>
          <button
            id="view-all-featured"
            onClick={() => onNavigate('category_search', 'luxury')}
            className="text-xs text-[#D4AF37] hover:text-amber-400 hover:underline flex items-center gap-1 font-bold uppercase tracking-wider transition-all duration-300 hover:translate-x-1.5 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Explore Luxury <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
            const isWishlisted = wishlistedIds.includes(p.id);
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
          })}
        </div>
      </section>

      {/* 6. Wholesale Deals Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex justify-between items-end border-b border-solid border-neutral-800 pb-3">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-white via-neutral-100 to-[#D4AF37] bg-clip-text text-transparent tracking-tight">
              📦 Wholesale Bulk Catalog
            </h3>
            <p className="text-xs text-neutral-500 mt-1">High volume bulk purchasing straight from atelier factories</p>
          </div>
          <button
            id="view-all-wholesale"
            onClick={() => onNavigate('category_search', 'wholesale')}
            className="text-xs text-[#D4AF37] hover:text-amber-400 hover:underline flex items-center gap-1 font-bold uppercase tracking-wider transition-all duration-300 hover:translate-x-1.5 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Explore Wholesale <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {wholesaleProducts.map((p) => {
            const isWishlisted = wishlistedIds.includes(p.id);
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
          })}
        </div>
      </section>

      {/* 7. Alike Premium Jobs Preview */}
      <section className="max-w-7xl mx-auto px-6 bg-neutral-950 border border-solid border-neutral-800 p-6 md:p-8 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-solid border-neutral-800 pb-4 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <Briefcase className="w-5.5 h-5.5 text-[#D4AF37]" /> Careers @ Alike-ND Group
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Join one of India's fastest scaling hyper-local luxury delivery channels</p>
          </div>
          <button
            id="view-all-jobs"
            onClick={() => onNavigate('jobs')}
            className="text-xs text-[#D4AF37] hover:text-amber-400 hover:underline font-bold uppercase tracking-wider flex items-center gap-1 transition-all duration-300 hover:translate-x-1 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Go to Careers Center <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.slice(0, 2).map((job) => (
            <div
              key={job.id}
              onClick={() => onNavigate('jobs')}
              className="group cursor-pointer p-5 bg-neutral-900 border border-solid border-neutral-800 hover:border-[#D4AF37] rounded-xl flex items-start gap-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
            >
              <img
                src={job.logo}
                alt={job.company}
                className="w-12 h-12 rounded-lg object-cover bg-neutral-950 border border-solid border-neutral-800 shrink-0"
              />
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 bg-neutral-800 text-[9px] uppercase tracking-wider text-neutral-400 rounded-full font-semibold">
                  {job.type}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  {job.title}
                </h4>
                <p className="text-xs text-neutral-400 font-semibold">{job.company}</p>
                <div className="flex flex-wrap gap-2 text-[10px] text-neutral-500 font-mono pt-1">
                  <span>📍 {job.location}</span>
                  <span>|</span>
                  <span className="text-gradient">💰 {job.salary}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Luxury Brand Logos Carousel (Swiper simulated via custom horizontal list) */}
      <section className="max-w-7xl mx-auto px-6 space-y-4">
        <h4 className="text-center text-[10px] uppercase tracking-widest text-[#D4AF37] font-extrabold font-mono">
          Authorized Brand Collaborators
        </h4>
        <div className="bg-neutral-900/60 p-6 rounded-2xl border border-solid border-neutral-800 overflow-hidden relative">
          <div className="flex gap-10 items-center justify-around overflow-x-auto scrollbar-none whitespace-nowrap py-1">
            <span className="text-lg font-black tracking-widest text-neutral-600 uppercase font-mono hover:text-[#D4AF37] transition-all duration-300">AURELIA</span>
            <span className="text-lg font-black tracking-widest text-neutral-600 uppercase font-serif hover:text-[#D4AF37] transition-all duration-300">VENEZIA</span>
            <span className="text-lg font-black tracking-widest text-neutral-600 uppercase hover:text-[#D4AF37] transition-all duration-300">KAVALERI</span>
            <span className="text-lg font-black tracking-widest text-neutral-600 uppercase font-mono hover:text-[#D4AF37] transition-all duration-300">AMORE</span>
            <span className="text-lg font-black tracking-widest text-neutral-600 uppercase font-serif hover:text-[#D4AF37] transition-all duration-300">BARISTA_R</span>
            <span className="text-lg font-black tracking-widest text-neutral-600 uppercase hover:text-[#D4AF37] transition-all duration-300">APEX_PRO</span>
          </div>
        </div>
      </section>

      {/* 9. Client Testimonials */}
      <section className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="text-center border-b border-solid border-neutral-800 pb-4">
          <span className="text-[10px] uppercase tracking-widest font-mono font-black text-[#D4AF37]">Atelier Endorsements</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">What Our Luxury Clients Experience</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="relative p-6 bg-neutral-900/40 backdrop-blur-md border border-solid border-neutral-800 hover:border-[#D4AF37]/70 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] hover:-translate-y-1"
            >
              <span className="absolute top-5 right-5 text-neutral-850">
                <Quote className="w-8 h-8 rotate-180" />
              </span>
              <div className="space-y-3">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-neutral-300 italic leading-relaxed">
                  "{test.content}"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-solid border-neutral-800">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-9 h-9 rounded-full object-cover border border-solid border-[#D4AF37]"
                />
                <div>
                  <h5 className="text-xs font-bold text-white">{test.name}</h5>
                  <p className="text-[10px] text-neutral-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Newsletter Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="p-8 bg-gradient-to-br from-[#111111] to-neutral-900 border border-solid border-[#D4AF37]/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          <div className="space-y-1.5 z-10 text-center md:text-left">
            <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-widest block font-mono">VIP CLIENT MEMBERSHIP</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#ffffff]">Unlock Exclusive Voucher Codes</h3>
            <p className="text-xs text-neutral-400 max-w-md">
              Sign up today and receive a flat 10% coupon valid on your next order, including limited timepiece catalogs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2.5 z-10 shrink-0">
            {newsletterSubscribed ? (
              <div className="px-6 py-3.5 bg-[#D4AF37]/10 border border-solid border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Greetings! Welcome to the premium Alike Group VIP Club.</span>
              </div>
            ) : (
              <>
                <input
                  id="newsletter-sub-main-input"
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-3 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37] w-full md:w-64 transition-all duration-300"
                />
                <button
                  id="newsletter-sub-main-btn"
                  onClick={() => {
                    if (newsletterEmail.trim().includes('@')) {
                      setNewsletterSubscribed(true);
                    } else {
                      alert('Please enter a valid luxury partner email address.');
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#F59E0B] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 select-none cursor-pointer"
                  title="Join Membership Club"
                >
                  Join VIP Club
                </button>
              </>
            )}
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full"></div>
        </div>
      </section>
    </div>
  );
}
