"use client";

import { FC } from "react";
import Image, { StaticImageData } from "next/image";

import { assets } from "@/src/assets/js/assets";
import { User, Zap, Settings, MapPin } from "lucide-react"; // import icons

interface AuctionCar {
  img: StaticImageData;
  name: string;
  type: string;
  seats: string;
  fuel: string;
  trans: string;
  location: string;
  endsIn: string;
}

const auctionCars: AuctionCar[] = [
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

const AuctionEndingSoon: FC = () => {
  return (
    <section className="py-16 text-center bg-gray-50">
      <h2 className="text-4xl text-black font-semibold">Auctions Ending Soon</h2>
      <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
        Check out vehicles with auctions ending soon and place your bids!
      </p>

      <div className="flex flex-wrap justify-center gap-14 mt-10 px-4">
        {auctionCars.map((car, index) => (
          <div
            key={index}
            className="w-80 bg-white rounded-xl shadow-md overflow-hidden"
          >
            {/* Image */}
            <div className="h-50 w-full relative">
              <Image
                src={car.img}
                alt={car.name}
                fill
                
                style={{ objectFit: "cover" }}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded">
                Ends in {car.endsIn}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-4 text-left space-y-1.5">
              <h3 className="text-sm text-black font-semibold">{car.name}</h3>
              <p className="text-[12px] text-black">{car.type}</p>

            <div className="flex justify-between text-[12px] text-gray-600 mt-1">
              {/* Left Column */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <User size={12} className="text-gray-500" /> {/* Seats icon */}
                  <span>{car.seats}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={12} className="text-gray-500" /> {/* Fuel icon */}
                  <span>{car.fuel}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center gap-1">
                  <Settings size={12} className="text-gray-500" /> {/* Transmission icon */}
                  <span>{car.trans}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-gray-500" /> {/* Location icon */}
                  <p className="text-[11px] text-gray-500 mt-1">{car.location}</p>
                </div>
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
