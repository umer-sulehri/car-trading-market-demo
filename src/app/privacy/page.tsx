import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Car Trading Market',
  description: 'Learn about how we collect, use, and protect your personal data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Car Trading Market ("we", "us", "our", or "Company") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information Collection and Use</h2>
            <p className="text-gray-700 mb-4">We collect several different types of information for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Personal Data:</strong> Name, email address, password, phone number, and location information</li>
              <li><strong>Vehicle Information:</strong> Details about vehicles you list or are interested in</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, and time spent on pages</li>
              <li><strong>Cookies:</strong> Information stored in cookies to enhance your experience</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Use of Data</h2>
            <p className="text-gray-700 mb-4">Car Trading Market uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Security of Data</h2>
            <p className="text-gray-700">
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the bottom of this Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                our contact page
              </Link>
              .
            </p>
          </div>

          <div className="border-t pt-8">
            <p className="text-sm text-gray-500">Last updated: February 2025</p>
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
