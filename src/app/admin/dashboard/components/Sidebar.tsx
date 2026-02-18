"use client";

import {
  Car,
  PlusCircle,
  ClipboardList,
  CheckCircle,
  LogOut,
  MapPin,
  Palette,
  Home,
  Users,
  Package,
  Settings,
  BarChart3,
  Zap,
  Layers,
  Link as LinkIcon,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Dashboard",
    "Inventory",
    "Lookup",
  ]);

  const handleLogout = () => {
    router.replace("/auth/login");
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 min-h-screen flex flex-col text-white overflow-y-auto">
      {/* Admin Info */}
      <div className="py-6 px-4 flex flex-col items-center border-b border-gray-700">
        <div className="w-12 h-12 rounded-full mb-2 border-2 border-blue-500 bg-blue-600 flex items-center justify-center font-bold text-lg">
          AD
        </div>
        <h4 className="text-sm font-semibold text-white">Admin Panel</h4>
        <p className="text-xs text-gray-400">Management System</p>
      </div>

      {/* Menu */}
      <nav className="mt-4 flex-1 px-3">
        {/* Dashboard Section */}
        <SidebarSection
          title="Dashboard"
          icon={<Home size={18} />}
          expanded={expandedSections.includes("Dashboard")}
          onToggle={() => toggleSection("Dashboard")}
        >
          <SidebarItem
            href="/admin/dashboard"
            icon={<BarChart3 size={16} />}
            label="Overview"
          />
        </SidebarSection>

        {/* Inventory Management */}
        <SidebarSection
          title="Inventory"
          icon={<Package size={18} />}
          expanded={expandedSections.includes("Inventory")}
          onToggle={() => toggleSection("Inventory")}
        >
          <SidebarItem
            href="/admin/dashboard/car-catalog"
            icon={<Car size={16} />}
            label="Car Catalog"
          />
          <SidebarItem
            href="/admin/dashboard/versions"
            icon={<Layers size={16} />}
            label="Versions"
          />
          <SidebarItem
            href="/admin/dashboard/sell-cars"
            icon={<PlusCircle size={16} />}
            label="Sell Cars"
          />
          <SidebarItem
            href="/admin/dashboard/managed-cars"
            icon={<ShieldCheck size={16} />}
            label="Managed Cars"
          />
        </SidebarSection>

        {/* Lookup Data */}
        <SidebarSection
          title="Lookup Data"
          icon={<Settings size={18} />}
          expanded={expandedSections.includes("Lookup")}
          onToggle={() => toggleSection("Lookup")}
        >
          <SidebarItem
            href="/admin/dashboard/makes"
            icon={<Car size={16} />}
            label="Makes"
          />
          <SidebarItem
            href="/admin/dashboard/models"
            icon={<Car size={16} />}
            label="Models"
          />
          <SidebarItem
            href="/admin/dashboard/model-body-types"
            icon={<Car size={16} />}
            label="Model-Body Types"
          />
          <SidebarItem
            href="/admin/dashboard/body-types"
            icon={<Car size={16} />}
            label="Body Types"
          />
          <SidebarItem
            href="/admin/dashboard/cities"
            icon={<MapPin size={16} />}
            label="Cities"
          />
          <SidebarItem
            href="/admin/dashboard/colors"
            icon={<Palette size={16} />}
            label="Colors"
          />
        </SidebarSection>

        {/* Feature & Specification */}
        <SidebarSection
          title="Features"
          icon={<Zap size={18} />}
          expanded={expandedSections.includes("Features")}
          onToggle={() => toggleSection("Features")}
        >
          <SidebarItem
            href="/admin/dashboard/features"
            icon={<Zap size={16} />}
            label="Features"
          />
          <SidebarItem
            href="/admin/dashboard/specifications"
            icon={<ClipboardList size={16} />}
            label="Specifications"
          />
          <SidebarItem
            href="/admin/dashboard/VersionFeatures"
            icon={<LinkIcon size={16} />}
            label="Version Features"
          />
          <SidebarItem
            href="/admin/dashboard/VersionSpecification"
            icon={<LinkIcon size={16} />}
            label="Version Specs"
          />
          <SidebarItem
            href="/admin/dashboard/version-colors"
            icon={<Palette size={16} />}
            label="Version Colors"
          />
        </SidebarSection>

        {/* Featured Cars Plans */}
        <SidebarSection
          title="Featured Plans"
          icon={<BarChart3 size={18} />}
          expanded={expandedSections.includes("Featured")}
          onToggle={() => toggleSection("Featured")}
        >
          <SidebarItem
            href="/admin/dashboard/feature-plans"
            icon={<PlusCircle size={16} />}
            label="Plans Management"
          />
          <SidebarItem
            href="/admin/dashboard/featured-cars"
            icon={<Car size={16} />}
            label="Featured Cars"
          />
        </SidebarSection>

        {/* User & Transaction Management */}
        <SidebarSection
          title="Management"
          icon={<Users size={18} />}
          expanded={expandedSections.includes("Management")}
          onToggle={() => toggleSection("Management")}
        >
          <SidebarItem
            href="/admin/dashboard/user-management"
            icon={<Users size={16} />}
            label="Users"
          />
          <SidebarItem
            href="/admin/dashboard/bookings"
            icon={<CheckCircle size={16} />}
            label="Bookings"
          />
          <SidebarItem
            href="/admin/dashboard/enquirie"
            icon={<ClipboardList size={16} />}
            label="Enquiries"
          />
          <SidebarItem
            href="/admin/dashboard/profile"
            icon={<Users size={16} />}
            label="Profile"
          />
        </SidebarSection>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-700 p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-900 hover:bg-opacity-30 transition font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

/* ============== Components ============== */

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  expanded,
  onToggle,
  children,
}) => {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-700 transition text-gray-100 font-medium"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm">{title}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && <div className="pl-4 space-y-1">{children}</div>}
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition ${isActive
        ? "bg-blue-600 text-white font-medium"
        : "text-gray-300 hover:bg-gray-700"
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
