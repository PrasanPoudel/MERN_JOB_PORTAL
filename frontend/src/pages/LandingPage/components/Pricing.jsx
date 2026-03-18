import React from "react";
import { Gift, Star, Check, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { API_PATHS } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";

const Pricing = ({ notPricingPage }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Redirecting to eSewa...");
    document.querySelector("#pay-button").disabled = true;

    const formData = {
      amount: 100,
      tax_amount: 0,
      total_amount: 100,
      transaction_uuid: `Payment- ${Math.floor(Math.random() * 10000000)}`,
      product_code: "EPAYTEST",
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${API_PATHS.ESEWA_PAYMENT.PAYMENT_SUCCESS}`,
      failure_url: `${API_PATHS.ESEWA_PAYMENT.PAYMENT_FAILED}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    try {
      const response = await axiosInstance.post(
        API_PATHS.ESEWA_PAYMENT.GENERATE_SIGNATURE,
        formData,
      );
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `${API_PATHS.ESEWA_PAYMENT.ESEWA_API}`;
      // console.log(typeof(form.action));
      Object.keys(formData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });
      //Signature from incomming response
      const signature = response.data.signature;
      // console.log(signature);

      const signatureInput = document.createElement("input");
      signatureInput.type = "hidden";
      signatureInput.name = "signature";
      signatureInput.value = signature;
      form.appendChild(signatureInput);

      document.querySelector("#formInBody").appendChild(form);
      form.submit();
    } catch (err) {
      console.log("Something went wrong. Please try again", err);
      toast.error("Something went wrong. Please try again");
    }
  };

  return (
    <>
      {!notPricingPage && <Navbar />}
      <section
        id="pricing"
        className="mt-16 mx-auto p-4 lg:p-12 bg-gray-50 border-y border-gray-200"
      >
        {!notPricingPage && (
          <button
            onClick={() => {
              navigate(-1);
            }}
            title="Go back to previous page"
            className="group flex items-center border border-gray-200 space-x-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-sky-600 cursor-pointer shadow-sm hover:shadow-md hover:border-transparent transition-all duration-200 "
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
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

                  {user?.isPremium && (
                    <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full tracking-wide">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <span className="font-extrabold text-4xl text-white">
                    रू 100
                  </span>
                  <span className="text-sky-100 text-sm font-medium">
                    / month
                  </span>
                </div>

                <p className="text-sky-200 text-xs">
                  Via eSewa · Cancel anytime
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {[
                  "All Basic Plan Features",
                  "Post Unlimited Job Applications (Job Seeker)",
                  "Instant Email Notification To Track Application Progress (Job Seeker)",
                  "Post Unlimited Jobs (Employer)",
                  "Receive Job Recommandation Emails (Job Seeker)",
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
              {/* Esewa payment */}
              <form onSubmit={handleSubmit}>
                <button
                  disabled={user?.isPremium}
                  id="pay-button"
                  title="Pay with eSewa"
                  type="submit"
                  className="block cursor-pointer w-full text-center text-sm font-bold bg-white hover:bg-gray-100 text-sky-700 px-5 py-3 rounded-xl transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  Upgrade to Premium
                </button>
              </form>
            </div>
            {/* Free Plan */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col shadow-sm">
              <div className="mb-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                      <Gift className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-base">Free</span>
                  </div>

                  {!user?.isPremium && (
                    <span className="text-sm bg-black text-white font-bold px-2.5 py-1 rounded-full tracking-wide">
                      Current
                    </span>
                  )}
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
                  "Apply upto 3 jobs per month",
                  "1 active job post (Employer)",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-gray-600 text-sm"
                  >
                    <Check className="w-4 h-4 text-sky-600 shrink-0" />
                    {feature}
                  </li>
                ))}

                {[
                  "Job Recommandation Email Notification",
                  "Email Notification For Application Tracking",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-gray-400 text-sm"
                  >
                    <Minus className="w-4 h-4 text-gray-300 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {!user?.isPremium && (
                <a
                  href="/"
                  className="block cursor-pointer text-center text-sm font-semibold border border-gray-300 hover:border-sky-600 hover:text-sky-600 text-gray-700 px-5 py-3 rounded-xl transition-all"
                >
                  Get Started Free
                </a>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-400 text-xs mt-6 flex items-center justify-center">
            Secure payments via eSewa · Instant activation · No hidden charges
          </p>
        </div>
      </section>
      <div id="formInBody">{/* form element will append here */}</div>
    </>
  );
};

export default Pricing;
