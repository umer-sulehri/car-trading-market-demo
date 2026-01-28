"use client";

import { useEffect, useState } from "react";
import { getUserProfile, User } from "@/src/services/user.service";

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUserProfile()
      .then((res) => setUser(res))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-black">Dashboard</h1>

      <div className="flex items-center gap-3">
        {/* ✅ USER NAME */}
        <div className="text-sm text-gray-600">
          {user ? user.name : "Loading..."}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-black" />
      </div>
    </header>
  );
}
