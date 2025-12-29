import { assets } from "../assets/assets";

const ModeSelector = () => {
  return (
    <section className="bg-blue-600 text-white py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Left Column: Text */}
        <div className="flex-1 text-left">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Mode
          </h2>

          {/* Description */}
          <p className="text-blue-100 mb-6 max-w-lg">
            Select an option below to start your journey. Whether you want to
            buy, sell, or participate in an auction, we've got you covered.
          </p>

          {/* Action Button */}
          <button className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition">
            Get Started
          </button>
        </div>

        {/* Right Column: Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src={assets.car}
            alt="Mode Illustration"
            className="w-full max-w-md" // removed rounded & shadow
          />
        </div>
      </div>
    </section>
  );
};

export default ModeSelector;
