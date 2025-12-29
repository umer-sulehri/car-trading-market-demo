import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
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

  return (
    <div>
      <h2>User Dashboard</h2>

      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <p>{user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
