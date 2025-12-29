import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/userdashboard");
    } catch (err) {
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Card */}
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-center mb-8">
          <span className="text-primary">User</span> Signup
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-5">
            <label className="text-sm text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full mt-2 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full mt-2 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="w-full mt-2 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Already have an account?{" "}
            <span
              className="text-primary cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dull transition text-white py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
