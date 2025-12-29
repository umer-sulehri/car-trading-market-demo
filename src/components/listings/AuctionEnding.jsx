import { assets } from "../../assets/assets";

const auctionCars = [
  {
    img: assets.car1,
    name: "BMW X5",
    type: "Luxury SUV",
    seats: "5 Seats",
    fuel: "Diesel",
    trans: "Automatic",
    location: "New York",
    endsIn: "2h 15m",
  },
  {
    img: assets.car2,
    name: "Audi A6",
    type: "Premium Sedan",
    seats: "5 Seats",
    fuel: "Petrol",
    trans: "Automatic",
    location: "Los Angeles",
    endsIn: "1h 45m",
  },
  {
    img: assets.car3,
    name: "Mercedes GLC",
    type: "SUV",
    seats: "5 Seats",
    fuel: "Diesel",
    trans: "Automatic",
    location: "Chicago",
    endsIn: "3h 20m",
  },
];

const AuctionEndingSoon = () => {
  return (
    <section className="py-16 text-center bg-gray-50">
      <h2 className="text-3xl font-semibold">Auctions Ending Soon</h2>
      <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
        Check out vehicles with auctions ending soon and place your bids!
      </p>

      <div className="flex flex-wrap justify-center gap-14 mt-10 px-4">
        {auctionCars.map((car, index) => (
          <div
            key={index}
            className="w-72 bg-white rounded-xl shadow-md overflow-hidden"
          >
            {/* Image */}
            <div className="h-40 w-full relative">
              <img
                src={car.img}
                alt={car.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded">
                Ends in {car.endsIn}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-4 text-left space-y-1.5">
              <h3 className="text-sm font-semibold">{car.name}</h3>
              <p className="text-[11px] text-gray-500">{car.type}</p>

              {/* Specs */}
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
    </section>
  );
};

export default AuctionEndingSoon;
