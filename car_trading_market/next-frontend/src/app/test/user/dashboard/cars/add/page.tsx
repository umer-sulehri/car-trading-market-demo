"use client";

import { createCar } from "@/src/services/car.service";
import { useState } from "react";

const YEARS = [2024, 2023, 2022, 2021, 2020];
const MAKES = ["Toyota", "Honda", "Suzuki", "Kia"];
const MODELS = ["Corolla", "Civic", "City", "Cultus"];
const VERSIONS = ["VXL", "GLI", "VX", "Auto"];

export default function AddCarPage() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [showCarPopup, setShowCarPopup] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [carInfo, setCarInfo] = useState({
    year: "",
    make: "",
    model: "",
    version: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  const resetCarInfo = () => {
    setCarInfo({ year: "", make: "", model: "", version: "" });
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      images.forEach((img) => formData.append("images[]", img));
      await createCar(formData);

      alert("Car added successfully!");
      e.currentTarget.reset();
      setImages([]);
      resetCarInfo();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to submit car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-600">Sell Your Car Add Details</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-3xl p-8 md:p-12 space-y-8 border border-gray-200"
      >
        {/* 📍 Location */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-600"> Location</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">City</label>
              <input
                name="city"
                required
                placeholder="City"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Address</label>
              <input
                name="address"
                required
                placeholder="Address"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </section>

        {/* 🚗 Car Info */}
        <section>
          <h3 className="font-semibold text-blue-600 mb-3">Car Information *</h3>
          <button
            type="button"
            onClick={() => setShowCarPopup(true)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-left hover:border-blue-400 focus:ring-2 focus:ring-blue-300 transition"
          >
            {carInfo.make ? (
              <span className="font-medium">
                {carInfo.year} • {carInfo.make} • {carInfo.model} • {carInfo.version}
              </span>
            ) : (
              <span className="text-gray-400">
                Select Year, Make, Model & Version
              </span>
            )}
          </button>

          <input type="hidden" name="year" value={carInfo.year} />
          <input type="hidden" name="make" value={carInfo.make} />
          <input type="hidden" name="model" value={carInfo.model} />
          <input type="hidden" name="version" value={carInfo.version} />
        </section>

        {/* 📝 Registration */}
        <section className="space-y-4">
          <h3 className="font-semibold text-blue-600">Registration</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Registration Status</label>
              <select
                name="registration_status"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="registered">Registered</option>
                <option value="unregistered">Unregistered</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Registration City</label>
              <input
                name="registration_city"
                placeholder="Registration City"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </section>

        {/* 🎨 Car Details */}
        <section className="space-y-4">
          <h3 className="font-semibold text-blue-600">Car Details</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Color</label>
              <input
                name="exterior_color"
                placeholder="Color"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Mileage</label>
              <input
                name="mileage"
                type="number"
                placeholder="Mileage"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Price</label>
              <input
                name="price"
                type="number"
                placeholder="Price"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </section>

        {/* 🖊 Description */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Car Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Car description"
            className="input w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 🖼 Images */}
        <section>
          <label className="mb-2 text-sm font-medium text-gray-600">Car Images</label>
          <input type="file" multiple onChange={handleImageChange} className="text-sm" />
          {images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="h-24 w-full object-cover rounded-xl shadow-sm"
                />
              ))}
            </div>
          )}
        </section>

        {/* 👤 Seller Info */}
        <section className="space-y-4">
          <h3 className="font-semibold text-blue-600">Seller Info</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Name</label>
              <input
                name="seller_name"
                placeholder="Name"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Phone</label>
              <input
                name="phone"
                placeholder="Phone"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">Secondary Phone</label>
              <input
                name="secondary_phone"
                placeholder="Secondary Phone"
                className="input rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </section>

        {/* 📦 Status */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Availability Status</label>
          <select
            name="availability_status"
            className="input w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {/* 🚀 Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3 rounded-xl w-full text-lg hover:bg-blue-500 transition"
        >
          {loading ? "Submitting..." : "Submit Car"}
        </button>
      </form>

      {/* ===== Modal ===== */}
      {showCarPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white max-w-3xl w-full rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              Step {step} of 4
            </h3>

            {step === 1 && (
              <StepGrid
                title="Select Year"
                data={YEARS}
                onSelect={(v) => {
                  setCarInfo({ year: v, make: "", model: "", version: "" });
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <StepGrid
                title="Select Make"
                data={MAKES}
                onBack={() => setStep(1)}
                onSelect={(v) => {
                  setCarInfo((p) => ({ ...p, make: v }));
                  setStep(3);
                }}
              />
            )}
            {step === 3 && (
              <StepGrid
                title="Select Model"
                data={MODELS}
                onBack={() => setStep(2)}
                onSelect={(v) => {
                  setCarInfo((p) => ({ ...p, model: v }));
                  setStep(4);
                }}
              />
            )}
            {step === 4 && (
              <StepGrid
                title="Select Version"
                data={VERSIONS}
                onBack={() => setStep(3)}
                onSelect={(v) => {
                  setCarInfo((p) => ({ ...p, version: v }));
                  setShowCarPopup(false);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Step Grid ===== */
function StepGrid({ title, data, onSelect, onBack }: any) {
  return (
    <>
      <h4 className="font-semibold mb-4 text-blue-600">{title}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item: any) => (
          <button
            key={item}
            onClick={() => onSelect(String(item))}
            className="border border-gray-300 rounded-xl py-3 hover:bg-blue-50 hover:border-blue-400 transition"
          >
            {item}
          </button>
        ))}
      </div>
      {onBack && (
        <button onClick={onBack} className="mt-4 text-sm text-blue-600 underline">
          ← Back
        </button>
      )}
    </>
  );
}
