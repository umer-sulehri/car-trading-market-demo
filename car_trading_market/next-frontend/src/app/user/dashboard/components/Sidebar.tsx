"use client";

import {
  LayoutDashboard,
  Car,
  PlusCircle,
  
  LogOut,
  HomeIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getUserProfile, AppUser } from "@/src/services/user.service";


/* ---------------- Sidebar ---------------- */

export default function Sidebar() {

   const [user, setUser] = useState<AppUser | null>(null);
  
    useEffect(() => {
      getUserProfile()
        .then((res) => setUser(res))
        .catch(() => setUser(null));
    }, []);

  const router = useRouter();

  const handleLogout = () => {
    router.replace("/auth/login");
  };

  return (
    <aside   style={{ width: "15%", minWidth: "15%", flexShrink: 0 }} className="w-60 bg-white border-r border-gray-200 min-h-screen flex flex-col mt-16">
      
      {/* User Info */}
      <div className="py-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
           {user?.name?.charAt(0)}
        </div>
        <h4 className="text-sm font-semibold text-gray-800">
          {user ? user.name : "Loading..."}
        </h4>
        <p className="text-xs text-gray-500">Seller/Buyer</p>
      </div>

      {/* Menu */}
      <nav className="mt-4 flex-1">
        <SidebarItem
          href="/home"
          icon={<HomeIcon size={16} />}
          label="Home"
        />

        <SidebarItem
          href="/user/dashboard"
          icon={<LayoutDashboard size={16} />}
          label="Dashboard"
        />

        <SidebarItem
          href="/user/dashboard/cars"
          icon={<Car size={16} />}
          label="My Cars"
        />

        <SidebarItem
          href="/user/dashboard/cars/add"
          icon={<PlusCircle size={16} />}
          label="Add Car"
        />

        <SidebarItem
          href="/user/dashboard/profile"
          icon={<User size={16} />}
          label="Profile"
        />

        {/* Logout */}
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
}

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
