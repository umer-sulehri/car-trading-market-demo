import { useState } from "react";
import api from "../../api/axios";

export default function Profile({ user, setUser }) {
  const [form, setForm] = useState(user);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const updateProfile = async (e) => {
    e.preventDefault();
    const res = await api.put("/user/update", form);
    setUser(res.data);
    alert("Profile updated");
  };

  return (
    <form onSubmit={updateProfile} className="space-y-4 max-w-lg">
      <h2 className="text-xl font-semibold">Update Profile</h2>

      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />

      <button className="bg-primary text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}
