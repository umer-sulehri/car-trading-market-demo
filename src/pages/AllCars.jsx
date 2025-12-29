import { carsData, cityList, carModels, priceRanges } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AllCars = () => {
  const navigate = useNavigate();

  // filters
  const [city, setCity] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");

  // dropdown states
  const [openCity, setOpenCity] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);

  // scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ✅ DERIVED FILTERED DATA (NO STATE, NO EFFECT)
  const filteredCars = carsData.filter((car) => {
    return (
      (!city || car.location === city) &&
      (!model || car.model === model) &&
      (!price || car.price === price)
    );
  });

  const handleClick = (car) => {
    navigate(`/car-details/${car.id}`);
  };

  const clearFilters = () => {
    setCity("");
    setModel("");
    setPrice("");
  };

  return (
    <>
      <section className="py-10 px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto flex gap-8">
          {/* ================= SIDEBAR ================= */}
          <aside className="w-64 bg-white p-5 rounded-lg shadow-md h-fit -ml-4">
            <h3 className="text-lg font-semibold mb-6">Filter Cars</h3>

            {/* CITY */}
            <div className="mb-5">
              <p className="text-sm text-gray-500 mb-1">City</p>

              <div
                className="flex justify-between items-center cursor-pointer text-sm font-semibold text-gray-700 hover:text-black transition"
                onClick={() => {
                  setOpenCity(!openCity);
                  setOpenModel(false);
                  setOpenPrice(false);
                }}
              >
                {city || "Select city"}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    openCity ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {openCity && (
                <div className="mt-2 border rounded-lg bg-white shadow-sm text-sm max-h-44 overflow-y-auto">
                  {cityList.map((c) => (
                    <div
                      key={c}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setCity(c);
                        setOpenCity(false);
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MODEL */}
            <div className="mb-5">
              <p className="text-sm text-gray-500 mb-1">Car Model</p>

              <div
                className="flex justify-between items-center cursor-pointer text-sm font-semibold text-gray-700 hover:text-black transition"
                onClick={() => {
                  setOpenModel(!openModel);
                  setOpenCity(false);
                  setOpenPrice(false);
                }}
              >
                {model || "Select model"}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    openModel ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {openModel && (
                <div className="mt-2 border rounded-lg bg-white shadow-sm text-sm max-h-44 overflow-y-auto">
                  {carModels.map((m) => (
                    <div
                      key={m}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setModel(m);
                        setOpenModel(false);
                      }}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PRICE */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Price Range</p>

              <div
                className="flex justify-between items-center cursor-pointer text-sm font-semibold text-gray-700 hover:text-black transition"
                onClick={() => {
                  setOpenPrice(!openPrice);
                  setOpenCity(false);
                  setOpenModel(false);
                }}
              >
                {price || "Select budget"}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    openPrice ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {openPrice && (
                <div className="mt-2 border rounded-lg bg-white shadow-sm text-sm max-h-44 overflow-y-auto">
                  {priceRanges.map((p) => (
                    <div
                      key={p}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setPrice(p);
                        setOpenPrice(false);
                      }}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={clearFilters}
              className="w-full border text-sm py-2 rounded hover:bg-gray-100 transition"
            >
              Clear Filters
            </button>
          </aside>

          {/* ================= CARS GRID ================= */}
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-6">Available Cars</h2>

            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car, index) => (
                  <div
                    key={index}
                    onClick={() => handleClick(car)}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={car.img}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-3 space-y-1">
                      <h3 className="text-sm font-semibold">{car.name}</h3>
                      <p className="text-sm text-gray-500">{car.type}</p>

                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <div>
                          <p>{car.seats}</p>
                          <p>{car.fuel}</p>
                        </div>
                        <div>
                          <p>{car.trans}</p>
                          <p className="text-gray-500">{car.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-10">No cars match your filters.</p>
            )}
          </div>
        </div>
      </section>

    </>
  );
};

export default AllCars;
