"use client";

const brands = ["BMW", "Audi", "Mercedes", "SUV", "Luxury", "Toyota", "Honda", "Suzuki"] as const;

export default function PopularBrands() {
  return (
    <section className="py-16 flex justify-center bg-gray-50">
      <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-2xl shadow-lg p-12 w-full max-w-5xl text-center">
        <h2 className="text-3xl font-semibold mb-2">
          Popular Brands & Categories
        </h2>

        <p className="text-white/90 mb-8 max-w-xl mx-auto text-sm">
          Explore vehicles from top brands and categories. Find the perfect car
          that suits your style and needs.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {brands.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="px-6 py-3 bg-white/20 rounded-full shadow-md cursor-pointer hover:bg-white/40 transition-colors duration-300"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
