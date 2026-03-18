import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white border-2 shadow-sm border-gray-200 rounded-2xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500 w-20 h-20" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Oops! Something went wrong while processing your payment. Please try
          again or contact support if the issue persists.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Go to Home
          </button>

          <button
            onClick={() => navigate("/pricing")}
            className="w-full border border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-lg transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
