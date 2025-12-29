import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Purchase History</h2>

      {orders.length === 0 && <p>No purchases yet</p>}

      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-3 rounded">
          <p>Car: {order.car.title}</p>
          <p>Price: ${order.total}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
}
