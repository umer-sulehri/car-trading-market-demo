import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import AddCar from "./AddCar";
import MyCars from "./MyCars";
import Orders from "./Orders";
import Profile from "./Profile";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("cars");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/user")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  const logout = async () => {
    await api.post("/logout");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

        <ul className="space-y-4">
          <li onClick={() => setTab("cars")} className="cursor-pointer">
            My Cars
          </li>
          <li onClick={() => setTab("add")} className="cursor-pointer">
            Add Car
          </li>
          <li onClick={() => setTab("orders")} className="cursor-pointer">
            Purchase History
          </li>
          <li onClick={() => setTab("profile")} className="cursor-pointer">
            Update Profile
          </li>
        </ul>

        <button
          onClick={logout}
          className="mt-10 text-red-500 font-medium"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">
          Welcome, {user.name}
        </h1>

        {tab === "cars" && <MyCars />}
        {tab === "add" && <AddCar />}
        {tab === "orders" && <Orders />}
        {tab === "profile" && <Profile user={user} setUser={setUser} />}
      </main>
    </div>
  );
}
