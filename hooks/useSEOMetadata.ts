import { getSEOConfig, generateMetadata as generateSEOMetadata } from "@/config/seo";
import { Metadata } from "next";

/**
 * Custom hook to get and generate SEO metadata for any page
 * @param pageKey - Key from seoConfig object (e.g., "home", "all-cars", "sell-car")
 * @returns Next.js Metadata object
 *
 * @example
 * // In a page.tsx or layout.tsx file:
 * import { useSEOMetadata } from "@/hooks/useSEOMetadata";
 *
 * export const metadata = useSEOMetadata("home");
 *
 * export default function HomePage() {
 *   return <div>Home</div>;
 * }
 */
export function useSEOMetadata(pageKey: string): Metadata {
  const config = getSEOConfig(pageKey);
  return generateSEOMetadata(config);
}
