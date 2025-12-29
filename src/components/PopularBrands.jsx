const PopularBrands = () => {
  return (
    <section className="py-16 flex justify-center">
      <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-2xl shadow-lg p-12 w-full max-w-5xl text-center">
        {/* Section Header */}
        <h2 className="text-3xl font-semibold mb-2">
          Popular Brands & Categories
        </h2>
        <p className="text-white/90 mb-8 max-w-xl mx-auto text-sm">
          Explore vehicles from top brands and categories. Find the perfect car
          that suits your style and needs.
        </p>

        {/* Brands */}
        <div className="flex flex-wrap justify-center gap-4">
          {["BMW", "Audi", "Mercedes", "SUV", "Luxury"].map((brand) => (
            <div
              key={brand}
              className="px-6 py-3 bg-white/20 text-white rounded-full shadow-md cursor-pointer hover:bg-white/40 transition-colors duration-300"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBrands;
