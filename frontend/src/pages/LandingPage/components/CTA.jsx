import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-sky-600 to-sky-700">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-extrabold text-3xl sm:text-4xl text-white mb-4">
          Ready to Find Your Next Opportunity?
        </h2>
        <p className="text-sky-100 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of job seekers and employers already using KAAMSETU
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/find-jobs"
            className="inline-flex items-center justify-center gap-2 bg-white text-sky-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 bg-sky-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-sky-900 transition-all"
          >
            View Pricing
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
