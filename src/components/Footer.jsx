import { assets } from "../assets/assets";
import twitter from "../assets/twitter.png";
import facebook from "../assets/facebook.png";
import insta from "../assets/insta.png";
import email from "../assets/email.png";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 pt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Description */}
        <div>
          <img src={assets.logo} alt="logo" className="h-8" />
          <p className="text-sm text-gray-600 pt-4">
            Premium car rental service with a wide selection of luxury and
            everyday vehicles for all your driving needs.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <img src={twitter} alt="twitter" className="h-6 w-6" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <img src={facebook} alt="facebook" className="h-6 w-6" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <img src={insta} alt="insta" className="h-6 w-6" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <img src={email} alt="email" className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Browse Cars
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900 transition-colors">
                List Your Car
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900 transition-colors">
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Insurance
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>1234 Luxury Drive</li>
            <li>San Francisco, CA 94107</li>
            <li>+1 (555) 123-4567</li>
            <li>car@example.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-300 pt-6 pb-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center px-4 max-w-7xl mx-auto">
        <p>© 2025 CarRental. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-gray-700 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
