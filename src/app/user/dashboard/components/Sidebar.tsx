"use client";

import {
  LayoutDashboard,
  Car,
  PlusCircle,
  LogOut,
  HomeIcon,
  User,
  Settings,
  Heart,
  MessageCircle,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getUserProfile, AppUser } from "@/src/services/user.service";

export default function Sidebar() {
  const [user, setUser] = useState<AppUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getUserProfile()
      .then((res) => setUser(res))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    router.replace("/auth/login");
  };

  return (
    <aside 
      style={{ width: "15%", minWidth: "240px", flexShrink: 0 }} 
      className="bg-white border-r border-gray-200 min-h-screen flex flex-col mt-16"
    >
      {/* User Info Card */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl font-bold text-white mb-3">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
            {user?.name || "User"}
          </h4>
          <p className="text-xs text-gray-500 mt-1">Seller Account</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        <div className="px-3 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3">Main</p>
        </div>

        <SidebarItem
          href="/user/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          isActive={pathname === "/user/dashboard"}
        />

        <div className="px-3 my-4 border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3">Listings</p>
        </div>

        <SidebarItem
          href="/user/dashboard/cars/all"
          icon={<Car size={18} />}
          label="All Cars"
          isActive={pathname?.includes("/cars/all")}
        />

        <SidebarItem
          href="/user/dashboard/featured-cars"
          icon={<BarChart3 size={18} />}
          label="Featured Cars"
          isActive={pathname?.includes("/featured-cars")}
        />

        <SidebarItem
          href="/sell-car"
          icon={<PlusCircle size={18} />}
          label="Add New Car"
          isActive={pathname === "/sell-car"}
        />

        <SidebarItem
          href="/user/dashboard/my-favorite"
          icon={<Heart size={18} />}
          label="My Favorite"
          isActive={pathname === "/my-favorite"}
        />
        <div className="px-3 my-4 border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3">Buyer Queries</p>
        </div>

        <SidebarItem
          href="/user/dashboard/buyer-queries"
          icon={<Car size={18} />}
          label="Queries"
          isActive={pathname?.includes("/buyer-queries")}
        />
        <div className="px-3 my-4 border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3">Account</p>
        </div>

        <SidebarItem
          href="/user/dashboard/profile"
          icon={<User size={18} />}
          label="Profile"
          isActive={pathname === "/user/dashboard/profile"}
        />

        <div className="px-3 my-4 border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3">Browse</p>
        </div>

        <SidebarItem
          href="/all-cars"
          icon={<BarChart3 size={18} />}
          label="Market"
          isActive={pathname === "/all-cars"}
        />

        <SidebarItem
          href="/home"
          icon={<HomeIcon size={18} />}
          label="Home"
          isActive={pathname === "/home" || pathname === "/"}
        />
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive,
}) => {
  return (
    <Link
      href={href}
      className={`mx-3 flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
