"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/src/services/auth.service";
import { handleAuthResponse } from "@/src/lib/auth/auth.actions";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Submitting form:", form);
    try {
      const res = await login(form);
      await handleAuthResponse(res);
   
     if (res.user.role === "admin") {
  router.push("/admin/dashboard");
} else {
  router.push("/");
}
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        <div className="">
          <h2 className="text-3xl font-semibold text-center mb-8">
            <span className="text-primary">User</span> Login
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="input mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="input mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />

            <p className="text-sm text-gray-500 my-4">
              Create an account?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => router.push("/auth/signup")}
              >
                Sign up
              </span>
            </p>

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
