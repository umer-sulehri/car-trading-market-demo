/**
 * Dynamic SEO utilities for pages with dynamic content
 * Used for car details, user profiles, and other dynamic pages
 */

import { Metadata } from "next";

/**
 * Generate SEO metadata for car details page
 * @param car - Car object with details
 * @returns Metadata for car details page
 */
export function generateCarDetailsMetadata(car: any): Metadata {
  const title = `${car.year} ${car.make} ${car.model} - Buy at Best Price | Car Trading Market`;
  const description = `Buy ${car.year} ${car.make} ${car.model}. ${car.transmission}, ${car.mileage}km driven. Price: Rs. ${car.price}. Verified seller. Easy financing available.`;
  const keywords = [
    `${car.year} ${car.make} ${car.model}`,
    `${car.make} ${car.model}`,
    car.make,
    "used car",
    "buy car online",
    `${car.bodyType} for sale`,
    `${car.color} car`,
  ];

  return {
    title,
    description,
    keywords,
    robots: "index, follow",
    openGraph: {
      title: `${car.year} ${car.make} ${car.model}`,
      description: `${car.year} ${car.make} ${car.model} for Rs. ${car.price}`,
      type: "article",
      images: car.images && car.images.length > 0 ? [{ url: car.images[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${car.year} ${car.make} ${car.model} - Car Trading Market`,
      description: `Buy this car at Rs. ${car.price}. ${car.transmission}, ${car.mileage}km.`,
      images: car.images && car.images.length > 0 ? [car.images[0]] : undefined,
    },
  };
}

/**
 * Generate structured data (JSON-LD) for a car product
 * @param car - Car object
 * @returns JSON-LD structured data
 */
export function generateCarProductSchema(car: any) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: `${car.year} ${car.make} ${car.model}`,
    description: `${car.year} ${car.make} ${car.model} with ${car.mileage}km mileage`,
    image: car.images || [],
    brand: {
      "@type": "Brand",
      name: car.make,
    },
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: car.seller_name || "Car Trading Market",
      },
    },
    aggregateRating: car.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: car.rating,
          reviewCount: car.reviewCount || 1,
        }
      : undefined,
  };
}

/**
 * Generate SEO metadata for search results/listing page
 * @param page - Current page number
 * @param filters - Applied filters
 * @returns Metadata for listing page
 */
export function generateListingMetadata(page: number = 1, filters?: any): Metadata {
  const pageNumber = page > 1 ? ` - Page ${page}` : "";
  const filterText =
    filters && Object.keys(filters).length > 0
      ? ` (${Object.values(filters).join(", ")})`
      : "";

  const title = `Browse Used & New Cars Online${filterText}${pageNumber} | Car Trading Market`;
  const description = `Search thousands of new and used cars for sale. Compare prices, features, and find your perfect car at Best prices with easy financing.${filterText}`;

  return {
    title,
    description,
    robots: "index, follow",
    openGraph: {
      title: `Browse Cars${filterText}${pageNumber}`,
      description: "Find your perfect car on Car Trading Market",
    },
  };
}

/**
 * Generate breadcrumb schema for SEO
 * @param items - Breadcrumb items [{name, url}, ...]
 * @returns JSON-LD breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ schema for SEO
 * @param faqs - Array of {question, answer} objects
 * @returns JSON-LD FAQ schema
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Generate organization contact schema
 * @param contactInfo - Contact details
 * @returns JSON-LD organization schema with contact
 */
export function generateOrganizationContactSchema(contactInfo: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Car Trading Market",
    url: "https://cartradingmarket.com",
    logo: "https://cartradingmarket.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contactInfo.phone || "+92-XXXXXXXXX",
      contactType: "Customer Support",
      email: contactInfo.email || "support@cartradingmarket.com",
    },
    sameAs: [
      "https://facebook.com/cartradingmarket",
      "https://twitter.com/cartradingmarket",
      "https://instagram.com/cartradingmarket",
    ],
  };
}

/**
 * Open Graph image validator
 * Checks if image meets OG requirements
 * @param imageUrl - Image URL to validate
 * @param width - Image width (default 1200)
 * @param height - Image height (default 630)
 * @returns Validation result
 */
export function validateOGImage(
  imageUrl: string,
  width: number = 1200,
  height: number = 630
): { valid: boolean; message: string } {
  if (!imageUrl) {
    return { valid: false, message: "Image URL is required" };
  }

  if (!imageUrl.startsWith("http")) {
    return { valid: false, message: "Image URL must be absolute (start with http/https)" };
  }

  if (width < 600 || height < 315) {
    return { valid: false, message: `Image dimensions too small. Minimum 600x315, recommended 1200x630` };
  }

  return { valid: true, message: "Image meets OG requirements" };
}
