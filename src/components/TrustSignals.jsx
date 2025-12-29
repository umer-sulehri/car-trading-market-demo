const trustItems = [
  {
    title: "Verified Sellers",
    description: "Trusted & authenticated dealers",
    icon: (
      <svg
        className="h-8 w-8 text-blue-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: "Car Inspections",
    description: "Quality checked vehicles",
    icon: (
      <svg
        className="h-8 w-8 text-blue-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
        />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description: "100% safe transactions",
    icon: (
      <svg
        className="h-8 w-8 text-blue-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 11c1.657 0 3-.895 3-2s-1.343-2-3-2-3 .895-3 2 1.343 2 3 2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14v7m0 0H6m6 0h6"
        />
      </svg>
    ),
  },
];

const TrustSignals = () => {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <h2 className="text-3xl font-semibold mb-10">Why You Can Trust Us</h2>

      <div className="flex flex-wrap justify-center gap-8 px-4">
        {trustItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white rounded-2xl shadow-md p-6 w-64 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="bg-blue-100 p-4 rounded-full mb-4">{item.icon}</div>
            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustSignals;
