"use client";

import { assets } from "@/src/assets/js/assets";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { User, Zap, Settings, MapPin } from "lucide-react"; // import icons

interface Car {
  img: StaticImageData;
  name: string;
  type: string;
  seats: string;
  fuel: string;
  trans: string;
  location: string;
  price: number;
}

const TrendingCars: FC = () => {
  const router = useRouter();

  const cars: Car[] = [
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
    router.push("/all-cars"); // Next.js navigation
  };

  return (
    <section className="py-16 text-center bg-white">
      {/* Section Header */}
      <h2 className="text-4xl text-black font-semibold">Featured Vehicles</h2>
      <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
        Explore our selection of premium vehicles available for your next
        adventure.
      </p>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-14 mt-10 px-4">
        {cars.map((car, index) => (
          <div
            key={index}
            className="w-80 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="h-50 w-full relative">
              <Image
                src={car.img}       // StaticImageData works here
                alt={car.name}
                className="h-full w-full object-cover"
                width={400}         // required
                height={250}        // required
                priority={true}     // optional
              />
              <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded">
                Available Now
              </span>
            </div>
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

      {/* CTA */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleExplore}
          className="px-6 py-3 rounded-lg bg-white text-black border border-gray-300 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          Explore all cars
          <Image src={assets.arrow_icon} alt="arrow" className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default TrendingCars;
