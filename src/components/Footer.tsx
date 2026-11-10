import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, filter?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-neutral-950 border-t border-solid border-[#D1D1D1]/20 text-neutral-400 text-xs">
      {/* 4-Column Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Column 1: Logo and social indicators */}
        <div className="space-y-4">
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer inline-block"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffffff] to-[#D1D1D1] shadow-md">
              <span className="text-lg font-black text-black">A</span>
            </div>
            <span className="text-md font-black bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] bg-clip-text text-transparent uppercase tracking-wider">
              Alike-ND
            </span>
          </div>
          <p className="text-neutral-500 leading-relaxed text-xs">
            Alike-ND is India's pre-eminent luxury micro-delivery, wholesale, and interactive conversational social shopping platform.
          </p>
          <div className="flex gap-3 text-lg text-[#D1D1D1]">
            <a href="#facebook" className="hover:text-white transition-colors" aria-label="Alike-ND Facebook Page"><i className="fa-brands fa-facebook"></i></a>
            <a href="#instagram" className="hover:text-white transition-colors" aria-label="Alike-ND Instagram Page"><i className="fa-brands fa-instagram"></i></a>
            <a href="#twitter" className="hover:text-white transition-colors" aria-label="Alike-ND Twitter Feed"><i className="fa-brands fa-twitter"></i></a>
            <a href="#youtube" className="hover:text-white transition-colors" aria-label="Alike-ND YouTube Channel"><i className="fa-brands fa-youtube"></i></a>
            <a href="#linkedin" className="hover:text-white transition-colors" aria-label="Alike-ND LinkedIn Company Page"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3.5">
          <h4 className="text-white uppercase font-bold tracking-wider text-[11px] border-b border-solid border-neutral-800 pb-1.5 inline-block">
            Quick Discovery
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-[#D1D1D1] transition-colors">
                Market Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('category_search', 'luxury')} className="hover:text-[#D1D1D1] transition-colors">
                Selected Luxury Edition
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('category_search', 'wholesale')} className="hover:text-[#D1D1D1] transition-colors">
                Wholesale Volume Deals
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('ai_recommendations')} className="hover:text-[#D1D1D1] transition-colors text-neutral-300">
                🤖 AI Shopping Guide
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('jobs')} className="hover:text-[#D1D1D1] transition-colors">
                💼 Premium Job Board
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div className="space-y-3.5">
          <h4 className="text-white uppercase font-bold tracking-wider text-[11px] border-b border-solid border-neutral-800 pb-1.5 inline-block">
            Client Assistance
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:text-[#D1D1D1] transition-colors">
                Real-Time Order Track
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('messenger')} className="hover:text-[#D1D1D1] transition-colors">
                Concierge Live Messenger
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('profile')} className="hover:text-[#D1D1D1] transition-colors">
                My Wallet & Settings
              </button>
            </li>
            <li>
              <a href="#faq" className="hover:text-[#D1D1D1] transition-colors">Returns & Refunds FAQ</a>
            </li>
            <li>
              <a href="#shipping" className="hover:text-[#D1D1D1] transition-colors">20 Min Delivery Policy</a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-3.5">
          <h4 className="text-white uppercase font-bold tracking-wider text-[11px] border-b border-solid border-neutral-800 pb-1.5 inline-block">
            Atelier Newsletter
          </h4>
          <p className="text-neutral-500 leading-relaxed text-[11px]">
            Subscribe to receive golden coupon hour notifications and new physical luxury stock drops directly.
          </p>
          <div className="flex gap-2">
            <input
              id="newsletter-email-input"
              type="text"
              placeholder="Your email address"
              className="w-full px-3 py-1.5 bg-neutral-900 border border-solid border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-[#D1D1D1]"
            />
            <button
              id="newsletter-subscribe-btn"
              onClick={() => alert('Warmest greetings! You have successfully joint our elite newsletter.')}
              className="px-3 bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black font-extrabold text-[10px] uppercase rounded hover:opacity-90 active:scale-95 transition-all shrink-0"
              title="Subscribe"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-neutral-990 border-t border-solid border-neutral-900 py-6 text-center text-[11px] text-neutral-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Alike-ND Platform Inc. Crafted with dark luxury and extreme care.</p>
          <div className="flex items-center gap-2.5 text-base text-neutral-600">
            <span className="text-xs uppercase tracking-wider font-semibold mr-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Secure Payments:
            </span>
            <i className="fa-brands fa-cc-visa hover:text-white transition-colors" title="Visa Card Support"></i>
            <i className="fa-brands fa-cc-mastercard hover:text-white transition-colors" title="Mastercard Support"></i>
            <i className="fa-brands fa-cc-paypal hover:text-white transition-colors" title="PayPal Gateways"></i>
            <span>UPI IP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
