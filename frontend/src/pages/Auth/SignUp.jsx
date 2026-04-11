import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/helper";
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
  const [otpData, setOtpData] = useState({
    email: "",
    otp: "",
    countdown: 0,
    isVerifying: false,
  });

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
      fullName: validateName(formData.fullName),
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

  const handleSendVerification = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setFormState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.SEND_VERIFICATION,
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
      );

      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {},
      }));

      setOtpData({
        email: formData.email,
        otp: "",
        countdown: 300,
        isVerifying: false,
      });
      setStep(3);

      const interval = setInterval(() => {
        setOtpData((prev) => {
          if (prev.countdown <= 1) {
            clearInterval(interval);
            return { ...prev, countdown: 0 };
          }
          return { ...prev, countdown: prev.countdown - 1 };
        });
      }, 1000);
    } catch (err) {
      console.error("[Send Verification Error]", {
        email: formData.email,
        role: formData.role,
        error: err?.message || err,
      });
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            err?.message ||
            "Failed to send verification email. Please try again.",
        },
      }));
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!otpData.otp || otpData.otp.length !== 6) {
      setFormState((prev) => ({
        ...prev,
        errors: { otp: "Please enter a valid 6-digit OTP" },
      }));
      return;
    }

    setOtpData((prev) => ({ ...prev, isVerifying: true }));

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_EMAIL, {
        email: otpData.email,
        otp: otpData.otp,
      });

      setOtpData((prev) => ({ ...prev, isVerifying: false }));

      const { token } = response?.data || {};

      if (token) {
        login(response.data, token);
        setFormState((prev) => ({ ...prev, success: true }));

        setTimeout(() => {
          window.location.href =
            formData.role === "employer" ? "/employer-dashboard" : "/find-jobs";
        }, 2000);
      }
    } catch (err) {
      console.error("[Verify Email Error]", {
        email: otpData.email,
        error: err?.message || err,
      });
      setOtpData((prev) => ({ ...prev, isVerifying: false }));
      setFormState((prev) => ({
        ...prev,
        errors: {
          otp: err?.message || "Invalid or expired OTP. Please try again.",
        },
      }));
    }
  };

  const handleResendOTP = async () => {
    if (otpData.countdown > 0) return;

    setFormState((prev) => ({ ...prev, loading: true }));

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_VERIFICATION, {
        email: otpData.email,
      });

      setFormState((prev) => ({ ...prev, loading: false, errors: {} }));
      setOtpData((prev) => ({ ...prev, countdown: 300, otp: "" }));

      const interval = setInterval(() => {
        setOtpData((prev) => {
          if (prev.countdown <= 1) {
            clearInterval(interval);
            return { ...prev, countdown: 0 };
          }
          return { ...prev, countdown: prev.countdown - 1 };
        });
      }, 1000);
    } catch (err) {
      console.error("[Resend OTP Error]", {
        email: otpData.email,
        error: err?.message || err,
      });
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit: err?.message || "Failed to resend OTP. Please try again.",
        },
      }));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
            Account Created!
          </h2>
          <p className="text-gray-500 mb-4">
            Welcome to KAAMSETU! Your account has been successfully created and
            verified.
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
        className="card-elevated p-8 max-w-lg w-full"
      >
        <div className="flex items-center justify-center mb-6">
          <img src={logo} className="w-28 h-20 object-contain" alt="KAAMSETU" />
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Create Account
              </h2>
              <p className="text-gray-500 text-sm">
                Join thousands of professionals finding their dream job!
              </p>
            </div>
            <form onSubmit={handleSendVerification} className="space-y-5">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    onChange={handleInputChange}
                    value={formData.fullName}
                    className={`input-base input-with-icon ${formState.errors.fullName ? "input-error" : ""}`}
                    placeholder="Enter your full name"
                  />
                </div>
                {formState.errors.fullName && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {formState.errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="label">I am a</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("jobSeeker")}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                      formData.role === "jobSeeker"
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <UserCheck className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold">Job Seeker</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Looking for opportunities
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange("employer")}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                      formData.role === "employer"
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <Building2 className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold">Employer</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Want to hire talents
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p
                  onClick={() => {
                    if (step > 1) setStep((prev) => prev - 1);
                  }}
                  className={`flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg ${
                    step === 2
                      ? "text-white bg-sky-600 hover:bg-sky-700 cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  } ${step <= 1 && "opacity-0"}`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Prev
                </p>
                <p
                  onClick={() => {
                    if (step < 2) setStep((prev) => prev + 1);
                  }}
                  className={`flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg ${
                    step === 1
                      ? "text-white bg-sky-600 hover:bg-sky-700 cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  } ${step === 2 && "opacity-0"}`}
                >
                  Next <ArrowRight className="w-4 h-4" />
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    Click here to login
                  </a>
                </p>
              </div>

              {step === 2 && (
                <>
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
                        Sending Verification...
                      </>
                    ) : (
                      "Send Verification Email"
                    )}
                  </button>
                </>
              )}
            </form>
          </>
        )}

        {/* Step 2: Email & Password */}
        {step === 2 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Account Details
              </h2>
              <p className="text-gray-500 text-sm">
                Complete your registration
              </p>
            </div>
            <form onSubmit={handleSendVerification} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
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
                <label className="label">Password</label>
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

              {formState.errors.role && (
                <p className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formState.errors.role}
                </p>
              )}

              <div className="flex items-center justify-between">
                <p
                  onClick={() => {
                    if (step > 1) setStep((prev) => prev - 1);
                  }}
                  className="flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg text-white bg-sky-600 hover:bg-sky-700 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Prev
                </p>
                <p className="flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed">
                  Next <ArrowRight className="w-4 h-4" />
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    Click here to login
                  </a>
                </p>
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
                    Sending Verification...
                  </>
                ) : (
                  "Send Verification Email"
                )}
              </button>
            </form>
          </>
        )}

        {/* Step 3: OTP Verification */}
        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <ShieldCheck className="w-16 h-16 text-sky-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Verify Your Email
              </h2>
              <p className="text-gray-500 text-sm">
                We've sent a 6-digit verification code to {otpData.email}
              </p>
            </div>

            <form onSubmit={handleVerifyEmail} className="space-y-5">
              <div>
                <label className="label">Enter 6-digit OTP</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength="6"
                    value={otpData.otp}
                    onChange={(e) =>
                      setOtpData((prev) => ({ ...prev, otp: e.target.value }))
                    }
                    className={`input-base text-center text-2xl tracking-widest ${formState.errors.otp ? "input-error" : ""}`}
                    placeholder="000000"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                {formState.errors.otp && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {formState.errors.otp}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Expires in: {formatTime(otpData.countdown)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={otpData.countdown > 0 || formState.loading}
                  className={`flex items-center gap-2 font-semibold ${
                    otpData.countdown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-sky-600 hover:text-sky-700 cursor-pointer"
                  }`}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${otpData.countdown > 0 ? "" : ""}`}
                  />
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={otpData.isVerifying || formState.loading}
                className="btn-primary w-full"
              >
                {otpData.isVerifying ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-xs">
                  Didn't receive the email? Check your spam folder or contact
                  support.
                </p>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SignUp;
