import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  Building2,
  UserCheck,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { validateEmail, validatePassword } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const SignUp = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    success: false,
  });
  const [step, setStep] = useState(1);

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

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    if (formState.errors.role) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, role: "" },
      }));
    }
  };
  const validateForm = () => {
    const errors = {
      fullName: !formData.fullName.trim() ? "Enter full name" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: !formData.role ? "Please select a role" : "",
    };

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormState((prev) => ({ ...prev, errors }));
    if (errors.fullName || errors.role) {
      setStep(1);
    }
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setFormState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {},
      }));

      const { token } = response.data;

      if (token) {
        login(response.data, token);
        setTimeout(() => {
          window.location.href =
            formData.role === "employer" ? "/employer-dashboard" : "find-jobs";
        }, 2000);
      }
    } catch (err) {
      console.error("[SignUp Error]", {
        email: formData.email,
        role: formData.role,
        error: err?.message || err,
      });
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit: err?.message || "Registration failed. Please try again.",
        },
      }));
    }
  };

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
            Account Created!
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome to KAAMSETU! Your account has been successfully created
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to your dashboard...
          </p>
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
        className="bg-white p-4 lg:p-8 rounded-xl shadow-lg max-w-lg w-full"
      >
        <div className="flex items-center justify-center mb-4">
          <img src={logo} className="w-32 h-24" />
        </div>
        <div className="text-center mb-4">
          <h2 className="text-2xl text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">
            Join thousands of professionals finding their dream job!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5" />
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    onChange={handleInputChange}
                    value={formData.fullName}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      formState.errors.fullName
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors`}
                    placeholder="Enter your full name"
                  />
                </div>
                {formState.errors.fullName && (
                  <p className="flex text-red-500 text-sm mt-1 items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formState.errors.fullName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="role" className="flex mb-4">
                  I am a *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange("jobSeeker");
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === "jobSeeker"
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <UserCheck className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-medium">Job Seeker</div>
                    <div className="text-xs text-gray-500">
                      Looking for opportunities
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange("employer");
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === "employer"
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Building2 className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-medium">Employer</div>
                    <div className="text-xs text-gray-500">
                      Want to hire talents
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {step == 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
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
                      formState.errors.email
                        ? "border-red-500"
                        : "border-gray-300"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5" />
                  <input
                    type={formState.showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    onChange={handleInputChange}
                    value={formData.password}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      formState.errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors`}
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {formState.showPassword ? (
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
              {formState.errors.role && (
                <p className="flex text-red-500 text-sm mt-1 items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formState.errors.role}
                </p>
              )}
            </>
          )}

          {/* Steps controllers */}
          <div className="flex items-center justify-between">
            <p
              onClick={() => {
                if (step > 1) {
                  setStep((prev) => prev - 1);
                }
              }}
              className={`flex items-center gap-1 text-base font-medium px-3 py-2 rounded-lg shadow-sm border border-white/20 ${
                step === 2
                  ? "text-white bg-sky-600 hover:bg-sky-700 cursor-pointer"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              } ${step <= 1 && "opacity-0"} `}
            >
              <ArrowLeft className="w-4 h-4" />
              Prev
            </p>
            <p
              onClick={() => {
                if (step < 2) {
                  setStep((prev) => prev + 1);
                }
              }}
              className={`flex items-center gap-1 text-base font-medium px-3 py-2 rounded-lg shadow-sm border border-white/20 ${
                step === 1
                  ? "text-white bg-sky-600 hover:bg-sky-700 cursor-pointer"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              } ${step == 2 && "opacity-0"}`}
            >
              Next <ArrowRight className="w-4 h-4" />
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?
              <br className="lg:hidden" />
              <a
                href="/login"
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                {" "}
                Click here to login
              </a>
            </p>
          </div>
          {step == 2 && (
            <>
              {formState.errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="flex text-red-500 text-xs mt-1 items-center justify-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formState.errors.submit}
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={formState.loading}
                className="cursor-pointer flex w-full bg-sky-600 hover:bg-sky-700  text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center space-x-2"
              >
                {formState.loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span className="">Create Account</span>
                )}
              </button>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
