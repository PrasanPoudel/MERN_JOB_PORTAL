import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import logo from "../../assets/logo.png";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    success: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: "" },
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
    };

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setFormState((prev) => ({ ...prev, loading: true }));

    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, {
        email: formData.email,
      });

      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {},
      }));
    } catch (err) {
      console.error("[Forgot Password Error]", {
        email: formData.email,
        error: err?.message || err,
      });
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            err?.message ||
            "Failed to send password reset email. Please try again.",
        },
      }));
    }
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Reset Email Sent!
          </h2>
          <p className="text-gray-600 mb-4">
            We've sent a password reset link to {formData.email}. Please check
            your inbox and follow the instructions.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            The link will expire in 15 minutes.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-4 lg:p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="flex items-center justify-center mb-4">
          <img src={logo} className="w-32 h-24" />
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5" />
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
                value={formData.email}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.errors.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors`}
                placeholder="Enter your email"
              />
            </div>
            {formState.errors.email && (
              <p className="flex text-red-500 text-sm mt-1 items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.email}
              </p>
            )}
          </div>

          {formState.errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="flex text-red-500 text-sm mt-1 items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin inline mr-2" />
                Sending Reset Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Remember your password?
              <br className="lg:hidden" />
              <a
                href="/login"
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                {" "}
                Back to login
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
