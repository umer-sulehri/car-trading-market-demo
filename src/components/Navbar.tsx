"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { menuLinks, assets } from "@/src/assets/js/assets";
import { Menu, X, Search } from "lucide-react";
import Image from "next/image";

const Navbar: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => setIsLoggedIn(data.authenticated))
      .catch(() => setIsLoggedIn(false));
  }, [pathname]);

  // Disable scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={assets.logo} alt="logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {menuLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-5 py-2 rounded-full transition-colors font-medium ${
                pathname === link.path
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Search */}
          {/* <div className="flex items-center bg-blue-50 rounded-full px-4 py-1 gap-2 border border-blue-100">
            <input
              type="text"
              placeholder="Search cars..."
              className="bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
            <Search className="text-blue-500" size={18} />
          </div> */}

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/user/dashboard")}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-blue-50 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} className="text-blue-600" /> : <Menu size={28} className="text-blue-600" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-white/95 backdrop-blur-lg shadow-xl
                    rounded-l-3xl p-6 flex flex-col gap-6 transform transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {menuLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            onClick={() => setOpen(false)}
            className={`px-5 py-3 rounded-full text-lg font-medium transition-colors ${
              pathname === link.path
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {link.name}
          </Link>
        ))}

        {/* Auth Buttons */}
        {isLoggedIn ? (
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => {
                router.push("/user/dashboard");
                setOpen(false);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              router.push("/auth/login");
              setOpen(false);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
