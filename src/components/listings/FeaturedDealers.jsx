import { assets } from "../../assets/assets"; // Assume you have three profile images

const reviewers = [
  {
    img: assets.client1,
    name: "John Doe",
    location: "New York, USA",
    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores earum at ducimus totam impedit maxime sequi consequuntur, velit vitae.",
  },
  {
    img: assets.client2,
    name: "Alice Smith",
    location: "London, UK",
    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores earum at ducimus totam impedit maxime sequi consequuntur, velit vitae.",
  },
  {
    img: assets.client1,
    name: "Michael Lee",
    location: "Sydney, Australia",
    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolores earum at ducimus totam impedit maxime sequi consequuntur, velit vitae.",
  },
];

const FeaturedDealers = () => {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <h2 className="text-3xl font-semibold mb-12">What Our Customers Say</h2>

      <div className="flex flex-wrap justify-center gap-8 px-4">
        {reviewers.map((reviewer, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 w-full sm:w-80 flex flex-col items-start"
          >
            {/* Image and name */}
            <div className="flex items-center mb-4">
              <img
                src={reviewer.img}
                alt={reviewer.name}
                className="h-16 w-16 rounded-full mr-4 object-cover"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg">{reviewer.name}</h3>
                <p className="text-gray-400 text-sm">{reviewer.location}</p>
                {/* Stars */}
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.946c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.946a1 1 0 00-.364-1.118L2.075 9.373c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.946z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-500 text-left text-sm">{reviewer.review}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedDealers;
