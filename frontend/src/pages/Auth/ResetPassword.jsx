import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import logo from "../../assets/logo.png";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    success: false,
    tokenValid: false,
    checkingToken: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Extract token and email from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const email = urlParams.get("email");

  useEffect(() => {
    // Validate token exists
    if (!token || !email) {
      setFormState((prev) => ({
        ...prev,
        checkingToken: false,
        tokenValid: false,
      }));
      return;
    }

    // Token is valid, we can proceed
    setFormState((prev) => ({
      ...prev,
      checkingToken: false,
      tokenValid: true,
    }));
  }, [token, email]);

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

  const validatePassword = (password) => {
    if (!password.trim()) return "Password is required.";
    if (password.length < 6)
      return "Password must be at least 6 characters long.";
    return "";
  };

  const validateForm = () => {
    const errors = {
      password: validatePassword(formData.password),
      confirmPassword: !formData.confirmPassword
        ? "Please confirm your password."
        : "",
    };

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match.";
    }

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
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        email: email,
        token: token,
        password: formData.password,
      });

      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {},
      }));
    } catch (err) {
      console.error("[Reset Password Error]", {
        email: email,
        error: err?.message || err,
      });
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            err?.message ||
            "Failed to reset password. The link may have expired. Please try again.",
        },
      }));
    }
  };

  if (formState.checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <Loader className="w-16 h-16 text-sky-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Verifying Link...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your reset link.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!formState.tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Invalid Link
          </h2>
          <p className="text-gray-600 mb-4">
            This password reset link is invalid or has expired.
          </p>
          <a
            href="/forgot-password"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Request New Link
          </a>
        </motion.div>
      </div>
    );
  }

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Password Reset!
          </h2>
          <p className="text-gray-600 mb-4">
            Your password has been successfully reset. You can now log in with
            your new password.
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
          <h2 className="text-2xl text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">Enter your new password below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                onChange={handleInputChange}
                value={formData.password}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  formState.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formState.errors.password && (
              <p className="flex text-red-500 text-sm mt-1 items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                onChange={handleInputChange}
                value={formData.confirmPassword}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  formState.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formState.errors.confirmPassword && (
              <p className="flex text-red-500 text-sm mt-1 items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.confirmPassword}
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
                Resetting Password...
              </>
            ) : (
              "Reset Password"
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

export default ResetPassword;
