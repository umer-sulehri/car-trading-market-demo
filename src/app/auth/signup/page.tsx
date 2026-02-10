"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/src/services/auth.service";
import { handleAuthResponse } from "@/src/lib/auth/auth.actions";
import { createSellCar } from "@/src/services/sellCar.service";

const STORAGE_KEY = "sellCarFormData";

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

      // Check if there's saved car form data in localStorage
      const savedFormData = localStorage.getItem(STORAGE_KEY);
      if (savedFormData) {
        try {
          const savedData = JSON.parse(savedFormData);
          console.log("Found saved form data, submitting to database:", savedData);
          
          // Transform the saved data into the format expected by createSellCar
          const payload = {
            version_id: savedData.carInfo?.version_id,
            make_id: savedData.carInfo?.make_id,
            color_id: savedData.formFields?.color_id ? Number(savedData.formFields.color_id) : null,
            seller_city_id: savedData.formFields?.seller_city_id ? Number(savedData.formFields.seller_city_id) : null,
            registered_city: savedData.formFields?.registered_city || "",
            registered_province: savedData.formFields?.registered_province || "",
            mileage: savedData.formFields?.mileage ? Number(savedData.formFields.mileage) : 0,
            price: savedData.formFields?.price ? Number(savedData.formFields.price) : 0,
            engine_type_id: savedData.formFields?.engine_type_id ? Number(savedData.formFields.engine_type_id) : 0,
            engine: savedData.formFields?.engine || undefined,
            capacity: savedData.formFields?.capacity ? Number(savedData.formFields.capacity) : undefined,
            transmission_id: savedData.formFields?.transmission_id ? Number(savedData.formFields.transmission_id) : 0,
            assembly_type: savedData.formFields?.assembly_type || "Local",
            seller_name: savedData.formFields?.seller_name || "",
            seller_phone: savedData.formFields?.seller_phone || "",
            secondary_phone: savedData.formFields?.secondary_phone || null,
            whatsapp_allowed: savedData.formFields?.whatsapp_allowed === true || savedData.formFields?.whatsapp_allowed === "on",
            description: savedData.formFields?.description || null,
            features: savedData.selectedFeatures && savedData.selectedFeatures.length > 0 ? savedData.selectedFeatures : undefined,
          };
          
          // Submit the saved form data to the database
          await createSellCar(payload);
          
          // Clear localStorage after successful save
          localStorage.removeItem(STORAGE_KEY);
          alert("Account created successfully! Your car listing has been saved.");
          console.log("Saved form data submitted to database and cleared from storage");
        } catch (submitError: any) {
          console.error("Error submitting saved form data:", submitError);
          alert("Account created successfully, but there was an error saving your car listing. Please try again from the sell-car page.");
        }
      }

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
