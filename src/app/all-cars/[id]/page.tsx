"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import apiClient from "@/src/lib/api/apiClient";
import carDummy from "@/src/assets/images/car2.png";
import logo from "@/src/assets/images/logo.svg";
import { submitBuyerQuery } from "@/src/services/buyer.service";
import { addToFavorites, removeFromFavorites, checkIfFavorited } from "@/src/services/favorite.service";
import { getImageUrl } from "@/src/utils/imageUtils";

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
  Check,
  AlertCircle,
  Heart,
  Calendar,
  Zap,
  Wind,
  Wrench,
  MoreHorizontal,
} from "lucide-react";
import { isUserAuthenticated, getAuthTokenFromCookie } from "@/src/lib/auth/cookie.utils";

export default function CarDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    if (id) fetchCar();
  }, [id]);

  const checkAuth = async () => {
    try {
      const isAuth = await isUserAuthenticated();
      setIsAuthenticated(isAuth);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchCar = async () => {
    try {
      const response = await apiClient.get(`/sell-cars/${id}`);
      const carData = response as any;

      if (!carData || typeof carData !== "object") {
        console.error("Car not found - invalid response:", carData);
        setCar(null);
        setLoading(false);
        return;
      }

      if ((carData.status as any) !== "approved" && carData.status !== 1) {
        console.error("Car is not approved for public viewing", carData.status);
        setCar(null);
        setLoading(false);
        return;
      }

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
          ? getImageUrl(mappedCar.images[0])
          : carDummy.src
      );

      // Check if favorited
      if (isAuthenticated) {
        try {
          const response = await checkIfFavorited(Number(id));
          setIsFavorited(response.isFavorited);
        } catch (error) {
          console.log("Could not check favorite status");
        }
      }
    } catch (err) {
      console.error("Failed to fetch car:", err);
      setCar(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavorites(Number(id));
        setIsFavorited(false);
      } else {
        await addToFavorites(Number(id));
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="p-10 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Loading car details...</p>
      </div>
      <Footer />
    </>
  );

  if (!car) return (
    <>
      <Navbar />
      <div className="p-10 text-center">
        <p className="text-gray-600 text-lg">Car not found or not available for viewing</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />

      <section className="bg-gray-50 py-10 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          {/* ================= LEFT SIDE ================= */}
          <div className="lg:col-span-2 space-y-8">
            {/* IMAGE GALLERY */}
            <div className="bg-white rounded-2xl mb-3 shadow-sm p-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold">
                    {car.make?.name || "Car"}
                    {" "}
                    {car.version?.model?.name || ""}
                    {" "}
                    {car.version?.name && `(${car.version.name})`}
                  </h1>

                  <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <MapPin size={16} /> {car.city?.name || "City"}, {car.registered_city}
                  </div>

                  {car.is_managed && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-bold text-sm border border-orange-200">
                      <ShieldCheck size={18} fill="currentColor" />
                      MANAGED BY KAAR4U
                    </div>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={handleToggleFavorite}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Heart
                    size={24}
                    className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>
              </div>

              {/* Main Image */}
              <div className="h-[380px] rounded-xl overflow-hidden mb-4 bg-gray-100">
                <Image
                  src={activeImage || carDummy.src}
                  alt="Car"
                  width={900}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {car.images?.map((img: string, index: number) => {
                  const src = getImageUrl(img);
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImage(src)}
                      className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all
                      ${activeImage === src ? "border-blue-600" : "border-transparent hover:border-gray-300"}`}
                    >
                      <Image
                        src={src}
                        alt={`Thumb ${index}`}
                        width={120}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CAR KEY SPECS */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Car Specifications</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCard icon={<Calendar />} label="Year" value={car.year || "N/A"} />
                <InfoCard icon={<Gauge />} label="Mileage" value={`${car.mileage?.toLocaleString() || 0} km`} />
                {car.engine && <InfoCard icon={<Zap />} label="Engine" value={car.engine} />}
                {car.capacity && <InfoCard icon={<Wind />} label="Capacity" value={`${car.capacity}cc`} />}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {car.transmission?.name && <InfoCard icon={<Wrench />} label="Transmission" value={car.transmission.name} />}
                {car.engineType?.name && <InfoCard icon={<Zap />} label="Engine Type" value={car.engineType.name} />}
                {car.assembly_type && <InfoCard icon={<MoreHorizontal />} label="Assembly" value={car.assembly_type} />}
                {car.color?.name && <InfoCard icon={<Paintbrush />} label="Color" value={car.color.name} />}
              </div>
            </div>

            {/* REGISTRATION & FEATURES */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Registration & Status</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Registration Status</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {car.registration_status || "Not Available"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Registered City</p>
                  <p className="font-semibold text-gray-900">{car.registered_city || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Province</p>
                  <p className="font-semibold text-gray-900">
                    {car.registered_province || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Availability</p>
                  <p className="font-semibold text-green-600 capitalize">
                    {car.availability_status || "Available"}
                  </p>
                </div>
              </div>
            </div>

            {/* FEATURES */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <Check size={16} className="text-blue-600" />
                      <span className="text-sm text-gray-800">{feature.name || feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DESCRIPTION */}
            {car.description && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                  {car.description}
                </p>
              </div>
            )}

            {/* SELLER DETAILS */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User size={18} className="text-blue-600" />
                  <span>{car.seller_name}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-blue-600" />
                  <a href={`tel:${car.phone}`} className="hover:text-blue-600 transition">
                    {car.phone}
                  </a>
                </div>
                {car.secondary_phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={18} className="text-blue-600" />
                    <a href={`tel:${car.secondary_phone}`} className="hover:text-blue-600 transition">
                      {car.secondary_phone}
                    </a>
                  </div>
                )}
                {car.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-blue-600" />
                    <a href={`mailto:${car.email}`} className="hover:text-blue-600 transition">
                      {car.email}
                    </a>
                  </div>
                )}
                {car.whatsapp_allowed && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-green-700">
                    <MessageSquare size={18} />
                    <span>WhatsApp available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE (CONTACT CARD) ================= */}
          <div className="sticky top-16 h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              {/* PRICE + STATUS */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Asking Price</p>
                  <p className="text-3xl font-bold text-blue-600">
                    PKR {car.price.toLocaleString()}
                  </p>
                  {car.status === "approved" && (
                    <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold rounded-full">
                      ✓ Approved
                    </span>
                  )}
                </div>
              </div>

              {/* SELLER QUICK CONTACT */}
              <SellerPhone phone={car.phone} />

              {/* MESSAGE SECTION */}
              <MessageBox car={car} />

              <p className="text-xs text-gray-400 text-center border-t pt-4">
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
  value: string | number;
}) => (
  <div className="bg-gray-50 rounded-xl p-4 text-sm flex gap-3 items-start">
    <div className="text-blue-600 flex-shrink-0 mt-0.5">{icon}</div>
    <div className="min-w-0">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold text-gray-900 break-words">{value}</p>
    </div>
  </div>
);

const SellerPhone = ({ phone }: { phone: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full border rounded-xl px-4 py-3 text-left hover:bg-gray-50 transition">
      <p className="text-xs text-gray-500 mb-1">Seller Phone</p>
      <p className="font-semibold text-lg text-blue-600 cursor-pointer" onClick={() => setShow(!show)}>
        {show ? phone : `${phone.slice(0, 2)}••••••••`}
      </p>

      {show && (
        <div className="flex gap-3 mt-3">
          <a
            href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm"
          >
            <Phone size={16} /> Call
          </a>
          <a
            href={`sms:${phone}`}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <MessageSquare size={16} /> SMS
          </a>
        </div>
      )}
    </div>
  );
};

const MessageBox = ({ car }: { car: any }) => {
  const defaultMessage = `Hi, I am interested in your ${car.make?.name || "car"} ${car.version?.model?.name || ""
    } advertised on Car Trading Market. Please let me know if it's still available. Thanks`;

  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_email: "",
    buyer_phone: "",
    message: defaultMessage,
    offer_price: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isUserAuthenticated();
        setIsAuthenticated(isAuth);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.buyer_name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!formData.buyer_email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!formData.buyer_phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    if (!formData.message.trim()) {
      setError("Please enter a message");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        sell_car_id: car.id,
        buyer_name: formData.buyer_name.trim(),
        buyer_email: formData.buyer_email.trim(),
        buyer_phone: formData.buyer_phone.trim(),
        message: formData.message.trim(),
        offer_price: formData.offer_price ? parseFloat(formData.offer_price) : undefined,
      };

      await submitBuyerQuery(payload);

      setFormData({
        buyer_name: "",
        buyer_email: "",
        buyer_phone: "",
        message: defaultMessage,
        offer_price: "",
      });

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error("Error submitting buyer query:", err);
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 border rounded-xl p-4">
      <p className="font-semibold text-sm">Send Message to Seller</p>

      {isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <Check size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">You're logged in</p>
            <p className="text-xs text-blue-700">
              Your query will be saved to your dashboard.
            </p>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Not logged in</p>
            <p className="text-xs text-amber-700">
              <a href="/auth/login" className="underline font-medium">
                Log in
              </a>{" "}
              to save queries to your account.
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
          <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Success!</p>
            <p className="text-xs text-green-700">
              Your message has been sent to the seller.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          name="buyer_name"
          value={formData.buyer_name}
          onChange={handleInputChange}
          placeholder="Your Name"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={loading}
        />

        <input
          type="email"
          name="buyer_email"
          value={formData.buyer_email}
          onChange={handleInputChange}
          placeholder="Your Email"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={loading}
        />

        <input
          type="tel"
          name="buyer_phone"
          value={formData.buyer_phone}
          onChange={handleInputChange}
          placeholder="Your Phone"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={loading}
        />

        <textarea
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          disabled={loading}
        />

        <input
          type="number"
          name="offer_price"
          value={formData.offer_price}
          onChange={handleInputChange}
          placeholder="Your Offer Price (Optional)"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};
