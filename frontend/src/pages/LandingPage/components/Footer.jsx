import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">KAAMSETU</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Nepal's trusted job portal connecting talent with opportunities.
            </p>
            <div className="flex gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/find-jobs"
                  className="hover:text-sky-400 transition-colors"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-sky-400 transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-sky-400 transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex gap-2">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                info@kaamsetu.com
              </li>
              <li className="flex gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                +977 XXX-XXXXXXX
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>
            &copy; 2025 KAAMSETU &mdash; Created by{" "}
            <span className="text-sky-400">@Prasan Poudel</span>,{" "}
            <span className="text-sky-400">@Smriti Neupane</span> and{" "}
            <span className="text-sky-400">@Subodh Shakya</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
