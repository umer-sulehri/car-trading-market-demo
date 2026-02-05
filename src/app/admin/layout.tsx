import { Metadata } from "next";
import { getSEOConfig, generateMetadata as generateSEOMetadata } from "@/config/seo";
import { ReactNode } from "react";

export const metadata: Metadata = generateSEOMetadata(getSEOConfig("admin-dashboard"));

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
