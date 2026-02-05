/**
 * robots.txt generator for Next.js
 * Place this content in public/robots.txt
 */

export const robotsTxt = `User-agent: *
Allow: /
Allow: /home
Allow: /all-cars
Allow: /new-cars
Allow: /sell-car
Allow: /auth/login
Allow: /auth/signup

Disallow: /admin
Disallow: /user/dashboard
Disallow: /user/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Crawl delay in milliseconds
Crawl-delay: 1

# Specific rules for Google
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Sitemap location
Sitemap: https://cartradingmarket.com/sitemap.xml
Sitemap: https://cartradingmarket.com/sitemap-cars.xml
`;

/**
 * Dynamic sitemap configuration
 * Use this with next-sitemap package
 */
export const sitemapConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://cartradingmarket.com",
  generateRobotsTxt: true,
  sitemapSize: 50000,
  changefreq: "daily" as const,
  priority: 0.7,
  exclude: [
    "/admin/*",
    "/user/dashboard/*",
    "/api/*",
    "/auth/*",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/user/dashboard", "/api"],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0,
      },
    ],
    additionalSitemaps: [
      "https://cartradingmarket.com/sitemap-cars.xml",
    ],
  },
  transform: async (config, path) => {
    // Custom URL transformations
    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq: getChangeFreq(path),
      priority: getPriority(path),
    };
  },
};

/**
 * Get change frequency based on URL pattern
 */
function getChangeFreq(path: string): string {
  if (path === "/" || path === "/home") return "daily";
  if (path.includes("/all-cars")) return "daily";
  if (path.includes("/new-cars")) return "weekly";
  if (path.includes("/sell-car")) return "never";
  return "weekly";
}

/**
 * Get priority based on URL pattern
 */
function getPriority(path: string): number {
  if (path === "/" || path === "/home") return 1.0;
  if (path === "/all-cars") return 0.9;
  if (path === "/new-cars") return 0.8;
  if (path === "/sell-car") return 0.7;
  return 0.5;
}

/**
 * Sitemap generation with car data
 * Example for dynamic car listings
 */
export async function generateCarSitemap(cars: any[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cartradingmarket.com";
  
  const carUrls = cars
    .filter(car => car.id && car.approval_status === "approved") // Only approved cars
    .map(car => ({
      loc: `${baseUrl}/all-cars/${car.id}`,
      lastmod: car.updated_at || new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.8,
    }));

  return carUrls;
}

/**
 * Static routes for sitemap
 */
export const staticRoutes = [
  {
    loc: "https://cartradingmarket.com/home",
    lastmod: new Date().toISOString(),
    changefreq: "daily" as const,
    priority: 1.0,
  },
  {
    loc: "https://cartradingmarket.com/all-cars",
    lastmod: new Date().toISOString(),
    changefreq: "daily" as const,
    priority: 0.9,
  },
  {
    loc: "https://cartradingmarket.com/new-cars",
    lastmod: new Date().toISOString(),
    changefreq: "weekly" as const,
    priority: 0.8,
  },
  {
    loc: "https://cartradingmarket.com/sell-car",
    lastmod: new Date().toISOString(),
    changefreq: "never" as const,
    priority: 0.7,
  },
  {
    loc: "https://cartradingmarket.com/auth/login",
    lastmod: new Date().toISOString(),
    changefreq: "never" as const,
    priority: 0.5,
  },
  {
    loc: "https://cartradingmarket.com/auth/signup",
    lastmod: new Date().toISOString(),
    changefreq: "never" as const,
    priority: 0.5,
  },
];
