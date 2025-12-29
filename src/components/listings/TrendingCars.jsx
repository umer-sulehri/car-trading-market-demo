import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const TrendingCars = () => {
  const navigate = useNavigate();

  const cars = [
    {
      img: assets.car1,
      name: "BMW X5",
      type: "SUV 2022",
      seats: "5 Seats",
      fuel: "Gasoline",
      trans: "Automatic",
      location: "Los Angeles",
      price: 100,
    },
    {
      img: assets.car2,
      name: "BMW X6",
      type: "SUV 2023",
      seats: "5 Seats",
      fuel: "Gasoline",
      trans: "Automatic",
      location: "New York",
      price: 120,
    },
    {
      img: assets.car3,
      name: "Audi A6",
      type: "Sedan 2022",
      seats: "5 Seats",
      fuel: "Gasoline",
      trans: "Automatic",
      location: "Chicago",
      price: 110,
    },
  ];

  const handleExplore = () => {
    navigate("/allcars");
  };

  return (
    <section className="py-16 text-center bg-gray-50">
      {/* Section Header */}
      <h2 className="text-3xl font-semibold">Featured Vehicles</h2>
      <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
        Explore our selection of premium vehicles available for your next
        adventure.
      </p>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-14 mt-10 px-4">
        {cars.map((car, index) => (
          <div
            key={index}
            className="w-74 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="h-40 w-full relative">
              <img
                src={car.img}
                alt={car.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded">
                Available Now
              </span>
            </div>

            <div className="p-4 text-left space-y-1.5">
              <h3 className="text-sm font-semibold">{car.name}</h3>
              <p className="text-[11px] text-gray-500">{car.type}</p>

              <div className="flex justify-between text-[11px] text-gray-600 mt-1">
                <div className="flex flex-col gap-1">
                  <span>{car.seats}</span>
                  <span>{car.fuel}</span>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <span>{car.trans}</span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {car.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleExplore}
          className="px-6 py-3 rounded-sm bg-white text-black border border-gray-300 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          Explore all cars
          <img src={assets.arrow_icon} alt="arrow" className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default TrendingCars;
