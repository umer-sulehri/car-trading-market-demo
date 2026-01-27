"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/src/services/auth.service";
import { handleAuthResponse } from "@/src/lib/auth/auth.actions";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signup(form);
      await handleAuthResponse(res);
      router.push("/user/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-center mb-8">
          <span className="text-primary">User</span> Signup
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="input"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="input mt-4"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="input mt-4"
          />

          <p className="text-sm text-gray-500 my-4">
            Already have an account?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
