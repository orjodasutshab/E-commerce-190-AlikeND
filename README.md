# Alike-ND — Sovereign Luxury & Wholesale Atelier Guild

> **A sovereign quick-commerce luxury marketplace and wholesale atelier network delivering bespoke horology, fine jewelry, haute couture, and rare botanicals in 24 hours.**

---

## 🏛️ Executive Summary

**Alike-ND** is an enterprise-grade luxury e-commerce and wholesale guild platform designed for discerning collectors, high-net-worth clients, and verified trade partners. Operating on an authenticated hyper-local dark store atelier model, the platform bridges private Swiss ateliers, Italian jewelry workshops, and French couture houses with rapid courier delivery.

---

## ✨ Core Modules & Feature Highlights

### 1. ⚜️ Sovereign Luxury Atelier
- **Curated High-End Catalog:** High-horology timepieces, bespoke 18K/24K jewelry, rare botanicals, and high-fashion leather goods.
- **Flash Sale Vaults:** Real-time countdown flash reserves with tier-limited pricing and immediate inventory lock.
- **Search & Deep Category Filtering:** Instant search autocomplete, multi-facet filtering (category, price range, brand authenticity ratings).

### 2. 💬 VIP Concierge & Butler Messenger
- **Bespoke Concierge Corridors:** Direct encrypted messaging channels with specialized boutique curators and personal atelier butlers.
- **Asset Authenticity Inspection:** Integrated media upload corridor with automated metal refraction and stitch-vector verification.
- **Channel Controls:** Real-time unread badges, audio/video consultation tunnels, mute/block options, and instant status indicators.

### 3. 💼 B2B Wholesale Guild & Seller Hub
- **Merchant Staging Dashboard:** Complete seller workstation featuring active revenue ledgers, shipment tracking, order fulfillment status, and inventory metrics.
- **B2B Bulk Tiers:** Dynamic price reduction matrices for certified wholesale buyers and boutique procurement officers.
- **Vendor Onboarding:** Streamlined atelier verification and seller guild registration.

### 4. 👔 Bespoke Atelier Stylist
- **Archetype Look Synthesis:** Tailored style recommendations matched to high-profile aesthetics (Royal Monaco Yacht Club, Sovereign Boardroom Executive, Billionaire Met Gala).
- **Bundle Acquisition:** One-click checkout bundle acquire with tiered guild discounts.

### 5. 🛡️ Secure Checkout & Privilege Wallet
- **Multimodal Settlements:** Instant card checkout, luxury UPI channels, wire transfers, and Alike Reserve Credit Wallet.
- **Complimentary Insurance & Courier Protocol:** White-glove tamper-evident dispatch tracking with step-by-step milestones.

### 6. 💼 Careers & Guild Talent Hub
- **Executive Openings:** Global talent acquisition portal for dark store logistics directors, lead gemologists, and client consultants.

---

## 🛠️ Technology Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) with custom luxury radial backgrounds, gold foil gradients (`#D4AF37`, `#F59E0B`), and obsidian glassmorphism |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) |
| **Build & Dev Tooling** | [Vite](https://vitejs.dev/) + ESM |
| **State & Persistence** | Modern React State Hooks + Local Storage Guild Caching |

---

## 📁 Repository Directory Structure

```text
├── index.html                  # HTML5 entry point with OpenGraph & luxury typography
├── metadata.json               # Platform metadata and service descriptors
├── package.json                # Project dependencies and script declarations
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite bundler plugins and server configuration
│
├── src/
│   ├── main.tsx                # React application bootstrapper
│   ├── App.tsx                 # Master root routing, toast system, and navigation state
│   ├── index.css               # Global typography, color variables, and luxury scrollbars
│   ├── types.ts                # TypeScript domain models (Product, Contact, Message, Job, Order)
│   │
│   ├── components/             # Reusable modular UI components
│   │   ├── Header.tsx          # Sticky glassmorphic navbar with search autocomplete & notification popups
│   │   ├── Footer.tsx          # Luxury brand guild footer, newsletter subscription, and legal links
│   │   ├── ProductCard.tsx     # High-fidelity luxury asset display cards with wishlist & cart actions
│   │   ├── LoginModal.tsx      # Dual-factor password and OTP VIP authentication modal
│   │   └── Toast.tsx           # Floating dispatch notices and status toasts
│   │
│   ├── pages/                  # Top-level platform views
│   │   ├── Home.tsx            # Hero slideshow, flash sale timer, categorized rails, and VIP membership
│   │   ├── ProductDetail.tsx   # Asset specifications, certification certificates, and reviews
│   │   ├── Cart.tsx            # Bag summary, promotional codes, and delivery estimators
│   │   ├── Checkout.tsx        # White-glove shipping addresses and secure payment gate
│   │   ├── Messenger.tsx       # VIP Concierge chat corridors, attachment verification, and butler replies
│   │   ├── AIRecommendations.tsx # Bespoke atelier signature look synthesis
│   │   ├── CategorySearch.tsx  # Product catalog search, filter, and sorting view
│   │   ├── SellerDashboard.tsx # B2B merchant operations, order fulfillment, and metrics
│   │   ├── SellerRegister.tsx  # Atelier merchant registration corridor
│   │   ├── JobsPortal.tsx      # Careers center and role applications
│   │   ├── Notifications.tsx   # Order updates, price drops, and security bulletins
│   │   └── Profile.tsx         # VIP account details, addresses, order history, and wallet
│   │
│   └── data/
│       └── mockData.ts         # Certified mock catalogs, boutique channels, and sample testimonials
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **bun** / **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alike-nd/alike-nd-luxury-atelier.git
   cd alike-nd-luxury-atelier
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The local application will launch on `http://localhost:3000`.

### Building for Production

Compile optimized production assets:
```bash
npm run build
```
The output will be generated inside the `dist/` directory.

### Code Quality & Validation

Run strict type checking:
```bash
npm run lint
```

---

## 🎨 Design Philosophy & Luxury Guidelines

- **Palette:** Obsidian Black (`#0a0a0a`, `#111111`), Imperial Navy (`#0B1B32`), Venetian Gold (`#D4AF37`), Amber Glow (`#F59E0B`).
- **Typography:** Serif headlines paired with clean geometric sans (`Inter`, `Outfit`) and precision monospace (`JetBrains Mono`) for transaction receipts and certificates.
- **Glassmorphism:** Multi-layered backdrops with subtle border refractions to evoke high-end jewelry vitrines and private salon atmospheres.

---

## 📄 License & Attribution

Copyright © 2026 **Alike-ND Group**. All rights reserved.  
Unauthorized distribution, replication, or reverse-engineering of proprietary atelier guild assets is strictly governed by global luxury trade regulations.
