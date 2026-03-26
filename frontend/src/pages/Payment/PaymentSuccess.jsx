import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  useEffect(() => {
    const processPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get("data");
        // console.log(encodedData);
        if (!encodedData) {
          navigate("/");
        }
        const decodedData = atob(encodedData);
        // console.log(typeof(decodedData));
        const paymentStatus = JSON.parse(decodedData).status;
        if (paymentStatus === "COMPLETE") {
          try {
            await axiosInstance.post(
              API_PATHS.ESEWA_PAYMENT.UPGRADE_USER_TO_PREMIUM,
            );
            updateUser({ isPremium: true });
          } catch (err) {
            console.log("Error:", err);
          }
        }
      } catch (err) {
        console.log("error");
      }
    };
    processPayment();
  }, []);

  return (
    <div className="min-h-screen border-2 shadow-sm border-gray-200 rounded-2xl flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-20 h-20" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your payment has been completed successfully using eSewa. Thank you
          for your purchase!
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
