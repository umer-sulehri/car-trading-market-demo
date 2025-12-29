import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MyCars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    api.get("/my-cars").then((res) => setCars(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Listed Cars</h2>

      {cars.map((car) => (
        <div key={car.id} className="border p-4 mb-3 rounded">
          <h3>{car.title}</h3>
          <p>{car.model} • {car.year}</p>
          <p>${car.price}</p>
        </div>
      ))}
    </div>
  );
}
