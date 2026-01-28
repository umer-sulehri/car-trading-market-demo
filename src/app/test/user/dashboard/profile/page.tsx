"use client";

import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, AppUser } from "@/src/services/user.service";

export default function ProfilePage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  // Load profile
  useEffect(() => {
    getUserProfile().then((data) => {
      setUser(data);
      setForm({ name: data.name, email: data.email });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateUserProfile(form);
      setUser(res);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="max-w-xl bg-white shadow rounded p-6">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      {/* Profile Image (optional) */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
