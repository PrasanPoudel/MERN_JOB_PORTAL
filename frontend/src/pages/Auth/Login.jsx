import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    success: false,
  });

  const validatePassword = (password) => {
    if (!password.trim()) return "Password is required.";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      password: validatePassword(formData.password),
    };

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });
    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setFormState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {},
      }));
      const { token, role } = response?.data || {};

      if (token && role) {
        login(response.data, token);
        setTimeout(() => {
          window.location.href =
            role === "employer"
              ? "/employer-dashboard"
              : role === "admin"
                ? "/admin-dashboard"
                : "/";
        }, 2000);
      }
    } catch (error) {
      console.error("[Login Error]", {
        email: formData.email,
        error: error?.message || error,
      });
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit: error?.message,
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
          transition={{ duration: 0.4 }}
          className="card-elevated p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-500 mb-4">
            You have been successfully logged in.
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-gray-400 mt-2">
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-elevated p-8 max-w-md w-full"
      >
        <div className="flex items-center justify-center mb-6">
          <img src={logo} className="w-28 h-20 object-contain" alt="KAAMSETU" />
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome Back!
          </h2>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                autoComplete="off"
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
                value={formData.email}
                className={`input-base input-with-icon ${formState.errors.email ? "input-error" : ""}`}
                placeholder="Enter your email"
              />
            </div>
            {formState.errors.email && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formState.errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 justify-between">
              Password
              <a
                href="/forgot-password"
                className="text-sky-600 hover:text-sky-700 font-semibold text-sm"
              >
                Forgot password?
              </a>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                id="password"
                onChange={handleInputChange}
                value={formData.password}
                className={`input-base input-with-icon pr-10 ${formState.errors.password ? "input-error" : ""}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => {
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }));
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formState.errors.password && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formState.errors.password}
              </p>
            )}
          </div>

          {formState.errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="flex items-center gap-1 text-red-600 text-sm justify-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formState.errors.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={formState.loading}
            className="btn-primary w-full"
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                Create one here
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
