import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Car Trading Market',
  description: 'Review our terms and conditions for using Car Trading Market.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using Car Trading Market, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">Users agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate and complete information in their profile</li>
              <li>Conduct themselves professionally in all transactions</li>
              <li>Not post false, misleading, or deceptive information about vehicles</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Not engage in abusive or harassing behavior</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Vehicle Listings</h2>
            <p className="text-gray-700 mb-4">
              Users who list vehicles on our platform agree that all information about vehicles is accurate, complete, and honestly presented. We reserve the right to remove listings that violate these terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Limitation of Liability</h2>
            <p className="text-gray-700">
              Car Trading Market is provided on an "as is" basis. We do not warrant that the service will be uninterrupted, timely, secure, or error-free. To the fullest extent allowed by law, we disclaim all warranties, express or implied, including but not limited to warranties of merchantability and fitness for a particular purpose.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              Car Trading Market provides a platform for connecting buyers and sellers. We are not responsible for disputes between users. Users agree to resolve disputes directly with each other or through appropriate legal channels.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Modification of Terms</h2>
            <p className="text-gray-700">
              Car Trading Market reserves the right to modify these terms at any time. Continued use of the service after modifications constitutes acceptance of the modified terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
            <p className="text-gray-700">
              We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
            <p className="text-gray-700">
              Questions about these Terms of Service should be directed to our{' '}
              <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                contact page
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
