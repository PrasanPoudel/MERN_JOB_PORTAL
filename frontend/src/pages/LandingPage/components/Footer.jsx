import React from "react";
import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
      <div className="flex items-center space-x-3">
        <div className="flex w-8 h-8 bg-linear-to-r from-sky-600 to-purple-600 rounded-lg items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">KARYASETU</span>
      </div>
      <p className="text-md text-gray-900 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
        © 2025 KARYASETU —
        <a
          href="https://KARYASETU.vercel.app"
          className="text-gray-900 ml-1"
          rel="noopener noreferrer"
          target="_blank"
        >
          @Prasan Poudel
        </a>
      </p>
    </footer>
  );
};

export default Footer;
