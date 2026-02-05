/**
 * SEO Configuration for all pages
 * Centralized metadata and SEO data for the entire application
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  canonical?: string;
  robots?: string;
  author?: string;
  viewport?: string;
}

export const seoConfig: Record<string, SEOConfig> = {
  // Home Page
  home: {
    title: "Car Trading Market - Buy & Sell New & Used Cars Online",
    description:
      "Find the best deals on new and used cars. Buy directly from trusted sellers or auction listings. Easy financing options available.",
    keywords: [
      "buy cars online",
      "sell car",
      "used cars",
      "new cars",
      "car auction",
      "car trading",
      "best car deals",
      "automotive marketplace",
    ],
    ogTitle: "Car Trading Market - Your Ultimate Car Marketplace",
    ogDescription:
      "Browse thousands of new and used cars. Buy from verified sellers with secure transactions and financing options.",
    ogImage: "/og-home.jpg",
    robots: "index, follow",
    author: "Car Trading Market",
  },

  // All Cars Page
  "all-cars": {
    title: "Browse All Cars - Car Trading Market",
    description:
      "Explore our complete inventory of new and used cars. Filter by price, brand, model, color, and more.",
    keywords: [
      "all cars",
      "car inventory",
      "used cars for sale",
      "new cars",
      "car listings",
      "browse cars",
      "find cars",
    ],
    ogTitle: "All Cars - Car Trading Market",
    ogDescription:
      "Discover thousands of cars in our marketplace. Apply filters to find your perfect vehicle.",
    robots: "index, follow",
  },

  // New Cars Page
  "new-cars": {
    title: "New Cars for Sale - Latest Models at Best Prices",
    description:
      "Shop new cars from leading manufacturers. Browse the latest models with full warranty and dealer support.",
    keywords: [
      "new cars",
      "new car sale",
      "latest car models",
      "buy new car",
      "car warranty",
      "dealer cars",
    ],
    ogTitle: "New Cars - Latest Models Available",
    ogDescription:
      "Explore new cars from top brands with warranty and financing options.",
    robots: "index, follow",
  },

  // Sell Car Page
  "sell-car": {
    title: "Sell Your Car Online - Fast & Easy Process",
    description:
      "Sell your car quickly with our simple listing process. Get instant valuation and reach thousands of buyers.",
    keywords: [
      "sell car online",
      "sell used car",
      "car valuation",
      "sell car fast",
      "car listing",
      "online car selling",
    ],
    ogTitle: "Sell Your Car - Car Trading Market",
    ogDescription:
      "List your car for sale in minutes. Reach thousands of potential buyers instantly.",
    robots: "index, follow",
  },

  // Login Page
  login: {
    title: "Login - Car Trading Market",
    description: "Sign in to your Car Trading Market account to buy or sell cars.",
    keywords: ["login", "sign in", "account", "car trading"],
    robots: "noindex, nofollow",
  },

  // Signup Page
  signup: {
    title: "Create Account - Car Trading Market",
    description:
      "Sign up for a free account on Car Trading Market. Buy and sell cars easily.",
    keywords: ["signup", "register", "create account", "join"],
    robots: "index, follow",
  },

  // User Dashboard
  "user-dashboard": {
    title: "My Dashboard - Car Trading Market",
    description: "Manage your listings, queries, and favorite cars in one place.",
    keywords: ["dashboard", "my listings", "profile", "account"],
    robots: "noindex, nofollow",
  },

  // Admin Dashboard
  "admin-dashboard": {
    title: "Admin Dashboard - Car Trading Market",
    description: "Manage platform, users, and car listings.",
    keywords: ["admin", "dashboard", "management"],
    robots: "noindex, nofollow",
  },

  // Car Details Page
  "car-details": {
    title: "Car Details - Car Trading Market",
    description: "View detailed information about this car including specifications and pricing.",
    keywords: ["car details", "car specs", "car information", "car price"],
    robots: "index, follow",
  },

  // Buyer Queries Page
  "buyer-queries": {
    title: "My Queries - Car Trading Market",
    description: "Track and manage your car inquiries and responses from sellers.",
    keywords: ["queries", "inquiries", "messages", "chat"],
    robots: "noindex, nofollow",
  },

  // Sent Queries Page
  "sent-queries": {
    title: "Sent Queries - Car Trading Market",
    description: "View all your sent car inquiries and responses.",
    keywords: ["sent queries", "inquiries", "responses"],
    robots: "noindex, nofollow",
  },

  // Favorite Cars Page
  "favorite-cars": {
    title: "My Favorite Cars - Car Trading Market",
    description: "View all your saved favorite cars in one place.",
    keywords: ["favorite cars", "saved cars", "watchlist"],
    robots: "noindex, nofollow",
  },

  // Default/Fallback
  default: {
    title: "Car Trading Market - Buy & Sell Cars Online",
    description: "The ultimate online marketplace for buying and selling cars.",
    keywords: [
      "cars",
      "buy cars",
      "sell cars",
      "car marketplace",
      "automotive",
    ],
    robots: "index, follow",
    author: "Car Trading Market",
  },
};

/**
 * Get SEO config for a specific page
 * @param page - Page identifier
 * @returns SEO configuration object
 */
export function getSEOConfig(page: string): SEOConfig {
  return seoConfig[page] || seoConfig.default;
}

/**
 * Generate metadata object for Next.js metadata API
 * @param config - SEO configuration
 * @returns Next.js Metadata object
 */
export function generateMetadata(config: SEOConfig) {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    robots: config.robots || "index, follow",
    authors: config.author ? [{ name: config.author }] : undefined,
    openGraph: {
      title: config.ogTitle || config.title,
      description: config.ogDescription || config.description,
      images: config.ogImage ? [{ url: config.ogImage }] : undefined,
      url: config.ogUrl || "https://cartradingmarket.com",
      type: "website" as const,
    },
    twitter: {
      card: config.twitterCard || "summary_large_image",
      title: config.ogTitle || config.title,
      description: config.ogDescription || config.description,
      images: config.ogImage ? [config.ogImage] : undefined,
    },
    canonical: config.canonical,
    viewport: config.viewport || "width=device-width, initial-scale=1",
  };
}

/**
 * Structured Data (Schema.org JSON-LD) configurations
 */
export const structuredData = {
  // Organization schema
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Car Trading Market",
    url: "https://cartradingmarket.com",
    logo: "https://cartradingmarket.com/logo.png",
    description: "Online marketplace for buying and selling cars",
    sameAs: [
      "https://facebook.com/cartradingmarket",
      "https://twitter.com/cartradingmarket",
      "https://instagram.com/cartradingmarket",
    ],
  },

  // Website schema
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Car Trading Market",
    url: "https://cartradingmarket.com",
    searchAction: {
      "@type": "SearchAction",
      target: "https://cartradingmarket.com/all-cars?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },

  // Local business schema
  localBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Car Trading Market",
    image: "https://cartradingmarket.com/logo.png",
    description: "Online car trading marketplace",
    url: "https://cartradingmarket.com",
  },
};
