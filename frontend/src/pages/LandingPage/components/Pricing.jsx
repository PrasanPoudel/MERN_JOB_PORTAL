import React from "react";
import { Gift, Star, Check, Minus } from "lucide-react";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="bg-gray-50 border-y border-gray-200 py-16 px-4 sm:px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sky-600 text-xs font-bold tracking-widest uppercase mb-3">
            Pricing
          </p>

          <h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight text-gray-900 mb-4">
            Simple, transparent pricing.
          </h2>

          <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
            Start free. Upgrade when you need more power. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col shadow-sm">
            <div className="mb-7">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-gray-500" />
                </div>
                <span className="font-bold text-base text-gray-900">Free</span>
              </div>

              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="font-extrabold text-4xl text-gray-900">
                  रू 0
                </span>
              </div>

              <p className="text-gray-400 text-xs">
                Forever free · No credit card required
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {[
                "Personalized Job Visibility",
                "Apply upto 5 jobs per month",
                "1 active job post (employer)",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-gray-600 text-sm"
                >
                  <Check className="w-4 h-4 text-sky-600 shrink-0" />
                  {feature}
                </li>
              ))}

              {["Email Notification For Job Recommandations", "Email Notification For Application Tracking"].map(
                (feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-gray-400 text-sm"
                  >
                    <Minus className="w-4 h-4 text-gray-300 shrink-0" />
                    {feature}
                  </li>
                ),
              )}
            </ul>

            <a
              href="#"
              className="block text-center text-sm font-semibold border border-gray-300 hover:border-sky-600 hover:text-sky-600 text-gray-700 px-5 py-3 rounded-xl transition-all"
            >
              Get Started Free
            </a>
          </div>

          {/* Premium Plan */}
          <div className="rounded-2xl bg-sky-600 p-8 flex flex-col relative overflow-hidden shadow-lg">
            <div className="mb-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-base text-white">
                    Premium
                  </span>
                </div>

                <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full tracking-wide">
                  POPULAR
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="font-extrabold text-4xl text-white">
                  रू 199
                </span>
                <span className="text-sky-100 text-sm font-medium">
                  / month
                </span>
              </div>

              <p className="text-sky-200 text-xs">Via eSewa · Cancel anytime</p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {[
                "All Basic Plan Features",
                "Post Unlimited Job Applications (Job Seeker)",
                "Instant Email Notification To Track Application Progress (Job Seeker)",
                "Post Unlimited Jobs (Employer)",
                "Upto 12 Job Recommandation Emails Monthly (Job Seeker)",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-white text-sm"
                >
                  <Check className="w-4 h-4 text-white shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href="#"
              className="block text-center text-sm font-bold bg-white hover:bg-gray-100 text-sky-700 px-5 py-3 rounded-xl transition-colors"
            >
              Upgrade to Premium
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-xs mt-6 flex items-center justify-center">
          Secure payments via eSewa · Instant activation · No hidden charges
        </p>
      </div>
    </section>
  );
};

export default Pricing;
