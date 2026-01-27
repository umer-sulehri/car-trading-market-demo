"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import apiClient from "@/src/lib/api/apiClient";
import carDummy from "@/src/assets/images/car2.png";
import logo from "@/src/assets/images/logo.svg";

import {
  MapPin,
  Gauge,
  Paintbrush,
  ShieldCheck,
  Phone,
  Mail,
  User,
  BadgeCheck,
  ChartBar,
  MessageSquare,
  
} from "lucide-react";

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      // apiClient already returns res.data directly (see interceptor)
      const carData = await apiClient.get(`/sell-cars/${id}`);
      
      // Debug log to see actual response
      console.log("API Response:", carData);
      
      // Check if car data exists
      if (!carData || typeof carData !== 'object') {
        console.error("Car not found - invalid response:", carData);
        setCar(null);
        setLoading(false);
        return;
      }
      
      // Check if car is approved
      if (carData.status !== "approved") {
        console.error("Car is not approved for public viewing", carData.status);
        setCar(null);
        setLoading(false);
        return;
      }
      
      // Map images from media and normalize phone field
      const mappedCar = {
        ...carData,
        images: carData.media?.length > 0 
          ? carData.media.map((m: any) => m.image || m.media_path) 
          : [],
        phone: carData.seller_phone,
      };
      
      setCar(mappedCar);
      setActiveImage(
        mappedCar.images?.length
          ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/sell-cars/${mappedCar.images[0]}`
          : carDummy.src
      );
    } catch (err) {
      console.error("Failed to fetch car:", err);
      setCar(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading car details...</p>;
  if (!car) return <p className="p-10 text-center">Car not found</p>;

  return (
    <>
      <Navbar />

      <section className="bg-gray-50 py-10 px-4 md:px-12  ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">

          {/* ================= LEFT SIDE ================= */}
          <div className="lg:col-span-2 space-y-8">



            {/* IMAGE GALLERY */}
            <div className="bg-white rounded-2xl mb-3 shadow-sm p-4">
               <h1 className="text-3xl font-bold">
                {car.make?.name || "Car"}
                {" "}
                {car.version?.model?.name || ""}
                {" "}
                {car.version?.name && `(${car.version.name})`}
              </h1>

              <div className="flex items-center gap-2 text-gray-500 mt-2 mb-6">
                <MapPin size={16} /> {car.city?.name || "City"}, {car.registered_city}
              </div>

              <div className="h-[380px] rounded-xl overflow-hidden mb-4">
                <Image
                  src={activeImage || carDummy.src}
                  alt="Car"
                  width={900}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-3 overflow-x-auto">
                {car.images?.map((img: string, index: number) => {
                  const src = `${process.env.NEXT_PUBLIC_STORAGE_URL}/${img}`;
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImage(src)}
                      className={`w-24 h-16 rounded-lg overflow-hidden border-2 
                      ${activeImage === src ? "border-blue-600" : "border-transparent"}`}
                    >
                      <Image src={src} alt={`Thumb ${index}`} width={120} height={80} className="object-cover w-full h-full" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CAR BASIC INFO */}
            <div className="bg-white rounded-2xl mb-3 shadow-sm p-6">
              

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <InfoCard icon={<Gauge />} label="Mileage" value={`${car.mileage.toLocaleString()} km`} />
                {car.engine && <InfoCard icon={<Paintbrush />} label="Engine" value={car.engine} />}
                {car.transmission?.name && <InfoCard icon={<ShieldCheck />} label="Transmission" value={car.transmission.name} />}
                {car.engineType?.name && <InfoCard icon={<BadgeCheck />} label="Engine Type" value={car.engineType.name} />}
              </div>
            </div>

            {/* DESCRIPTION */}
            {car.description && (
              <div className="bg-white rounded-2xl mb-3 shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {car.description}
                </p>
              </div>
            )}

            {/* SELLER INFO */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2"><User size={16} /> {car.seller_name}</div>
                <div className="flex items-center gap-2"><Phone size={16} /> {car.phone}</div>
                {car.secondary_phone && (
                  <div className="flex items-center gap-2"><Phone size={16} /> {car.secondary_phone}</div>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE (CONTACT CARD) ================= */}
          <div className="sticky top-16 h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

              {/* PRICE + STATUS + LOGO */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    PKR {car.price.toLocaleString()}
                  </p>
                  {car.status === "approved" && (
                    <span className="inline-block mt-1 bg-green-100 text-green-600 px-3 py-1 text-xs rounded-full">
                      Approved
                    </span>
                  )}
                </div>

                {/* LOGO */}
                <Image
                  src={logo.src} // 🔥 replace with your logo path
                  alt="Logo"
                  width={90}
                  height={90}
                  className="object-contain border p-2 rounded-lg hover:shadow-md transition"
                />
              </div>

              {/* SELLER NUMBER */}
              <SellerPhone phone={car.phone} />

              {/* MESSAGE SECTION */}
              <MessageBox car={car} />

              <p className="text-xs text-gray-400 text-center">
                Your contact details are shared only with the seller
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

/* ================= SMALL COMPONENT ================= */

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-gray-50 rounded-xl p-4 text-sm flex gap-3 items-center">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const SellerPhone = ({ phone }: { phone: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full border rounded-xl px-4 py-3 text-left hover:bg-gray-50 transition">
      <p className="text-xs text-gray-500">Seller Phone</p>
      <p
        className="font-semibold text-lg text-blue-600 cursor-pointer"
        onClick={() => setShow(true)}
      >
        {show ? phone : `${phone.slice(0, 2)}••••••••`}
      </p>

      {!show ? (
        <p className="text-xs text-gray-400">Click to reveal number</p>
      ) : (
        <div className="flex mt-2 gap-4">
          <a href={`tel:${phone}`} className="flex items-center gap-1 text-green-600 hover:text-green-800">
            <Phone size={18} /> 
          </a>
          <a href={`sms:${phone}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
            <MessageSquare  size={18} /> 
          </a>
        </div>
      )}
    </div>
  );
};

const MessageBox = ({ car }: { car: any }) => {
  const defaultMessage = `Hi, I am interested in your ${car.make?.name || "car"} ${car.version?.model?.name || ""} advertised on Car Trading Market.
Please let me know if it's still available.
Thanks`;

  const [message, setMessage] = useState(defaultMessage);

  return (
    <div className="space-y-3 border rounded-xl p-4">
      <p className="font-semibold text-sm">Send Message to Seller</p>

      {/* BUYER NAME */}
      <input
        type="text"
        placeholder="Your Name"
        className="w-full border rounded-lg  mb-3  px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* MESSAGE */}
      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border rounded-lg px-3 mb-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* BUYER PRICE */}
      <input
        type="number"
        placeholder="Your Offer Price (Optional)"
        className="w-full border rounded-lg px-3 mb-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <button
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 
        text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
      >
        Send Message
      </button>
    </div>
  );
};
