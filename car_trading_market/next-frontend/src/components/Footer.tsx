// components/Footer.tsx
import Image from "next/image";
import { assets } from "../assets/js/assets";
import twitter from "../assets/images/twitter.png";
import facebook from "../assets/images/facebook.png";
import insta from "../assets/images/insta.png";
import email from "../assets/images/email.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 pt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Description */}
        <div>
          <Image src={assets.logo} alt="logo" height={32} />
          <p className="text-sm text-gray-600 pt-4">
            Premium car rental service with a wide selection of luxury and
            everyday vehicles for all your driving needs.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Image src={twitter} alt="twitter" width={24} height={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Image src={facebook} alt="facebook" width={24} height={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Image src={insta} alt="instagram" width={24} height={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Image src={email} alt="email" width={24} height={24} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "Browse Cars", "List Your Car", "About Us"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            {["Help Center", "Terms of Service", "Privacy Policy", "Insurance"].map(
              (link) => (
                <li key={link}>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    {link}
                  </a>
                </li>
              )
            )}
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
          {["Terms", "Privacy", "Cookies"].map((link) => (
            <a key={link} href="#" className="hover:text-gray-700 transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
