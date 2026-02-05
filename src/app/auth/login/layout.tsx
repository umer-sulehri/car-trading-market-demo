import { Metadata } from "next";
import { getSEOConfig, generateMetadata as generateSEOMetadata } from "@/config/seo";
import { ReactNode } from "react";

export const metadata: Metadata = generateSEOMetadata(getSEOConfig("login"));

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
