import { useState } from "react";
import api from "../../api/axios";

export default function AddCar() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    model: "",
    year: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/cars", form);
    alert("Car added successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h2 className="text-xl font-semibold">Add Car for Sale</h2>

      <input name="title" placeholder="Car Title" onChange={handleChange} />
      <input name="model" placeholder="Model" onChange={handleChange} />
      <input name="year" placeholder="Year" onChange={handleChange} />
      <input name="price" placeholder="Price" onChange={handleChange} />

      <button className="bg-primary text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
