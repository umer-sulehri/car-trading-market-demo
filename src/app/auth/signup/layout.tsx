import { Metadata, Viewport } from "next";
import { getSEOConfig, generateMetadata as generateSEOMetadata, generateViewport as generateSEOViewport } from "@/config/seo";
import { ReactNode } from "react";

export const metadata: Metadata = generateSEOMetadata(getSEOConfig("signup"));

export const viewport: Viewport = generateSEOViewport();

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children;
}
