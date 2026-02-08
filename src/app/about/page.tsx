import Link from 'next/link';

export const metadata = {
  title: 'About Us | Car Trading Market',
  description: 'Learn about Car Trading Market and our mission to simplify car trading.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Car Trading Market</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg">
              To revolutionize the car trading industry by providing a transparent, secure, and efficient platform that connects buyers and sellers, enabling them to find the perfect car match with confidence.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Who We Are</h2>
            <p className="text-gray-700 mb-4">
              Car Trading Market is a leading online platform dedicated to simplifying the car trading experience. We understand the challenges both buyers and sellers face in finding reliable, transparent, and secure transactions. That's why we've built a comprehensive solution that brings trust and transparency to the car trading industry.
            </p>
            <p className="text-gray-700">
              Our team consists of passionate professionals with deep expertise in automotive, technology, and customer service sectors, all unified by a common goal: making car trading easier and more trustworthy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
                <p className="text-gray-700">
                  We believe in honest and clear communication. All vehicle information, pricing, and terms are transparent and easy to understand.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust</h3>
                <p className="text-gray-700">
                  We've implemented rigorous verification processes to ensure safe and secure transactions between all parties.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-700">
                  We continuously evolve our platform with cutting-edge technology to provide the best user experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Focus</h3>
                <p className="text-gray-700">
                  Your satisfaction is our priority. We're committed to providing excellent support and service.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Verified Listings:</strong> All vehicles are verified for accuracy and security</li>
              <li><strong>Secure Transactions:</strong> Advanced encryption and secure payment systems</li>
              <li><strong>Expert Support:</strong> 24/7 customer support from industry experts</li>
              <li><strong>Comprehensive Database:</strong> Access to thousands of vehicles from trusted sellers</li>
              <li><strong>Easy Communication:</strong> Direct messaging and buyer query features</li>
              <li><strong>Fair Pricing:</strong> Market-competitive pricing with no hidden fees</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Promise</h2>
            <p className="text-gray-700">
              We promise to maintain the highest standards of service, security, and integrity. Whether you're a buyer looking for your next car or a seller wanting to showcase your vehicle, Car Trading Market is your trusted partner in making smart car trading decisions.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Started Today</h2>
            <p className="text-gray-700 mb-6">
              Join thousands of satisfied users who have successfully traded cars through our platform.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/auth/signup" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Create Account
              </Link>
              <Link 
                href="/contact" 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
