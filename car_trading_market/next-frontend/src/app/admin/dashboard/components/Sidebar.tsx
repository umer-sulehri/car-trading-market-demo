"use client";

import {
  Car,
  PlusCircle,
  ClipboardList,
  CheckCircle,
  LogOut,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { usePathname , useRouter} from "next/navigation";
import React from "react";

const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const handleLogout = () => {
    router.replace("/auth/login");
  };
  return (
    <aside className="w-60 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Admin Info */}
      <div className="py-6 flex flex-col items-center">
        <img
          src="https://i.pravatar.cc/100"
          alt="Admin"
          className="w-12 h-12 rounded-full mb-2"
        />
        <h4 className="text-sm font-semibold text-gray-800">
          Richard Sanford
        </h4>
        <p className="text-xs text-gray-500">Administrator</p>
      </div>

      {/* Menu */}
      <nav className="mt-4 flex-1">
        <SidebarItem
          href="/admin"
          icon={<ClipboardList size={16} />}
          label="Dashboard"
        />
        <SidebarItem
          href="/admin/dashboard/sell-cars"
          icon={<PlusCircle size={16} />}
          label="Enquirie"
        />
        <SidebarItem
          href="/admin/dashboard/user-management"
          icon={<Car size={16} />}
          label="Add Users"
        />
        <SidebarItem
          href="/admin/dashboard/bookings"
          icon={<CheckCircle size={16} />}
          label="Manage Bookings"
        />
        <SidebarItem href="/admin/dashboard/makes" icon={<Car />} label="Makes" />
<SidebarItem href="/admin/dashboard/models" icon={<Car />} label="Models" />
<SidebarItem href="/admin/dashboard/versions" icon={<Car />} label="Versions" />
<SidebarItem href="/admin/dashboard/features" icon={<ClipboardList />} label="Features" />
<SidebarItem href="/admin/dashboard/cities" icon={<MapPin />} label="Cities" />
<SidebarItem href="/admin/dashboard/VersionFeatures" icon={<MapPin />} label="VersionFeatures" />

        <button
        onClick={handleLogout}
        className="m-4 flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50"
      >
        <LogOut size={18} />
        Logout
      </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

/* ---------------- Sidebar Item ---------------- */

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
}) => {
  const pathname = usePathname();

  const isActive =
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition
        ${
          isActive
            ? "bg-blue-100 text-blue-600 font-medium"
            : "text-gray-600 hover:bg-blue-200"
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
