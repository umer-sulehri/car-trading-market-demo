import { Metadata } from "next";
import { getSEOConfig, generateMetadata as generateSEOMetadata } from "@/config/seo";
import { ReactNode } from "react";

export const metadata: Metadata = generateSEOMetadata(getSEOConfig("user-dashboard"));

export default function UserLayout({ children }: { children: ReactNode }) {
  return children;
}
