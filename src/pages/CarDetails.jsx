import { useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { assets } from "../assets/assets.js";
import { ChevronDown } from "lucide-react";

const carsData = [
  {
    id: 1,
    name: "Toyota Corolla 2025",
    type: "Sedan",
    seats: 5,
    fuel: "Petrol",
    trans: "Automatic",
    location: "Karachi",
    mileage: "15 km/l",
    engine: "1.8L 4-cylinder",
    color: "White",
    price: "PKR 4,200,000",
    images: [assets.car1, assets.car2, assets.car3],
  },
];

const CarDetails = () => {
  const { id } = useParams();
  const car = carsData.find((c) => c.id.toString() === id);

  const [showForm, setShowForm] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    action: "buy",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (value) => {
    setFormData({ ...formData, action: value });
    setOpenSelect(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your request has been submitted.");
    setShowForm(false);
    setFormData({ name: "", email: "", action: "buy" });
  };

  if (!car)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">Car not found!</p>
    );

  return (
    <div className="flex flex-col items-center bg-white p-4 pt-26 pb-10 space-y-6">
      {/* Car Details Card */}
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full -translate-y-4">
        {/* Image Slider */}
        <div className="md:w-1/2">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={1}
            className="h-full"
          >
            {car.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`${car.name} ${idx + 1}`}
                  className="w-full h-80 md:h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-semibold mb-3 text-gray-900">
              {car.name}
            </h1>

            <p className="text-blue-600 font-semibold mb-4">{car.price}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <p>
                <span className="font-medium">Type:</span> {car.type}
              </p>
              <p>
                <span className="font-medium">Seats:</span> {car.seats}
              </p>
              <p>
                <span className="font-medium">Fuel:</span> {car.fuel}
              </p>
              <p>
                <span className="font-medium">Transmission:</span> {car.trans}
              </p>
              <p>
                <span className="font-medium">Mileage:</span> {car.mileage}
              </p>
              <p>
                <span className="font-medium">Engine:</span> {car.engine}
              </p>
              <p>
                <span className="font-medium">Color:</span> {car.color}
              </p>
              <p className="sm:col-span-2">
                <span className="font-medium">Location:</span> {car.location}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition shadow"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg max-w-5xl w-full p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Booking Form
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Custom Div Select */}
            <div className="relative col-span-2">
              <div
                onClick={() => setOpenSelect(!openSelect)}
                className="border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer hover:border-blue-500"
              >
                <span className="text-gray-700">
                  {formData.action === "buy"
                    ? "I want to Buy"
                    : formData.action === "sell"
                    ? "I want to Sell"
                    : "Send for Auction"}
                </span>

                {/* Arrow slightly left */}
                <ChevronDown className="w-4 h-4 text-gray-500 mr-1" />
              </div>

              {openSelect && (
                <div className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-md z-10">
                  <div
                    onClick={() => handleSelect("buy")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    I want to Buy
                  </div>
                  <div
                    onClick={() => handleSelect("sell")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    I want to Sell
                  </div>
                  <div
                    onClick={() => handleSelect("auction")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Send for Auction
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow col-span-2"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
