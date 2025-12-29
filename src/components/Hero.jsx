import { assets, cityList, carModels, priceRanges } from "../assets/assets";
import { useState, useRef, useEffect } from "react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [carModel, setCarModel] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const [openCity, setOpenCity] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);

  const [showWarning, setShowWarning] = useState(false);

  const cityRef = useRef(null);
  const modelRef = useRef(null);
  const priceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        cityRef.current &&
        !cityRef.current.contains(e.target) &&
        modelRef.current &&
        !modelRef.current.contains(e.target) &&
        priceRef.current &&
        !priceRef.current.contains(e.target)
      ) {
        setOpenCity(false);
        setOpenModel(false);
        setOpenPrice(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!pickupLocation && !carModel && !priceRange) {
      setShowWarning(true); // Show warning if nothing selected
    } else {
      setShowWarning(false); // Hide warning when at least one option is selected
      // Here you can implement your actual search logic if needed
      console.log("Search criteria:", { pickupLocation, carModel, priceRange });
    }
  };

  return (
    <div className="flex flex-col items-center gap-14 bg-light text-center py-22 h-screen">
      <h1 className="text-4xl md:text-5xl font-semibold">Luxury cars</h1>

      <form
        className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* DROPDOWNS */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-22 min-md:ml-8">
          {/* CITY DROPDOWN */}
          <div className="flex flex-col items-start gap-2">
            <div className="relative w-30" ref={cityRef}>
              <div
                className="cursor-pointer text-gray-700 flex justify-between items-center text-sm font-semibold hover:text-gray-900 transition"
                onClick={() => setOpenCity(!openCity)}
              >
                {pickupLocation || "Select a city"}
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    openCity ? "rotate-180" : "rotate-0"
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
                <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto text-sm">
                  {cityList.map((city) => (
                    <div
                      key={city}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 transition text-left"
                      onClick={() => {
                        setPickupLocation(city);
                        setOpenCity(false);
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {pickupLocation || "Please select location"}
            </p>
          </div>

          {/* CAR MODEL DROPDOWN */}
          <div className="flex flex-col items-start gap-2">
            <div className="relative w-35" ref={modelRef}>
              <div
                className="cursor-pointer text-gray-700 flex justify-between items-center text-sm font-semibold hover:text-gray-900 transition"
                onClick={() => setOpenModel(!openModel)}
              >
                {carModel || "Car model"}
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    openModel ? "rotate-180" : "rotate-0"
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
                <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto text-sm">
                  {carModels.map((model) => (
                    <div
                      key={model}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 transition text-left"
                      onClick={() => {
                        setCarModel(model);
                        setOpenModel(false);
                      }}
                    >
                      {model}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500">
              {carModel || "Choose model"}
            </p>
          </div>

          {/* PRICE RANGE DROPDOWN */}
          <div className="flex flex-col items-start gap-2">
            <div className="relative w-42" ref={priceRef}>
              <div
                className="cursor-pointer text-gray-700 flex justify-between items-center text-sm font-semibold hover:text-gray-900 transition"
                onClick={() => setOpenPrice(!openPrice)}
              >
                {priceRange || "Price range"}
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    openPrice ? "rotate-180" : "rotate-0"
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
                <div className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto text-sm">
                  {priceRanges.map((price) => (
                    <div
                      key={price}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100 transition text-left"
                      onClick={() => {
                        setPriceRange(price);
                        setOpenPrice(false);
                      }}
                    >
                      {price}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500">
              {priceRange || "Select budget"}
            </p>
          </div>
        </div>

        {/* SEARCH ICON */}
        <button
          type="button"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-black hover:bg-gray-800 transition"
          onClick={handleSearch}
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5 invert"
          />
        </button>
      </form>

      {/* WARNING MESSAGE */}
      {showWarning && (
        <p className="mt-1 text-red-500 text-sm">
          Please select at least one option to search.
        </p>
      )}

      {/* MAIN CAR IMAGE */}
      <img src={assets.main_car} alt="car" className="max-h-78 " />
    </div>
  );
};

export default Hero;
