import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Check if payment has already been processed in this session
        const paymentProcessed = sessionStorage.getItem("paymentProcessed");
        if (paymentProcessed) {
          setLoading(false);
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get("data");
        // console.log(encodedData);
        if (!encodedData) {
          navigate("/");
          return;
        }
        const decodedData = atob(encodedData);
        // console.log(typeof(decodedData));
        const paymentStatus = JSON.parse(decodedData).status;
        if (paymentStatus === "COMPLETE") {
          try {
            const response = await axiosInstance.post(
              API_PATHS.ESEWA_PAYMENT.UPGRADE_USER_TO_PREMIUM,
            );

            // Mark payment as processed in session
            sessionStorage.setItem("paymentProcessed", "true");

            updateUser({ isPremium: true });
            setLoading(false);
          } catch (err) {
            console.log("Error upgrading to premium:", err);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.log("Error processing payment:", err);
        setLoading(false);
      }
    };
    processPayment();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
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
