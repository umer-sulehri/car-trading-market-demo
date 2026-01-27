"use client";

import { useRouter } from "next/navigation";

export default function FinalCTA() {
  const router = useRouter();

  return (
    <section className="py-24 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Sell Your Car?
        </h2>

        <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
          Join thousands of sellers who are getting the best value for their
          cars. List your car today and connect with real buyers instantly.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => router.push("/sell-car")}
            className="px-10 py-4 bg-black rounded-xl font-semibold
                       hover:bg-gray-900 active:scale-95 transition"
          >
            Sell Your Car Now
          </button>

          <button
            onClick={() => router.push("/cars")}
            className="px-10 py-4 border border-white/40 rounded-xl
                       hover:bg-white hover:text-black transition"
          >
            Browse Cars
          </button>
        </div>
      </div>
    </section>
  );
}
