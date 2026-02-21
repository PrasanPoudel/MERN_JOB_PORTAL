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
  Upload,
  UserCheck,
  CheckCircle,
  CircleChevronRight,
  CircleChevronLeft,
} from "lucide-react";
import {
  validateEmail,
  validateAvatar,
  validatePassword,
} from "../../utils/helper";
import uploadFile from "../../utils/uploadFile";
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
    avatar: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    avatarPreview: null,
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
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateAvatar(file);
      if (error) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, avatar: error },
        }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, avatar: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormState((prev) => ({
        ...prev,
        avatarPreview: e.target.result,
        errors: {
          ...prev.errors,
          avatar: "",
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {
      fullName: !formData.fullName.trim() ? "Enter full name" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: !formData.role ? "Please select a role" : "",
      avatar: validateAvatar(formData.avatar),
    };

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormState((prev) => ({ ...prev, errors }));
    if (errors.fullName || errors.email || errors.password) {
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
      let avatarUrl = "";
      //upload avatar (profile picture) if given
      if (formData.avatar) {
        const fileUploadRes = await uploadFile(formData.avatar);
        avatarUrl = fileUploadRes.fileUrl;
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: avatarUrl,
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
      console.log(err);
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            err.response?.data?.message ||
            "Registration failed. Please try again",
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
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
        <div className="flex items-center justify-center">
          <img src={logo} className="w-40 h-30" />
        </div>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5" />
                  <input
                    type="email"
                    name="email"
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
            </>
          )}

          {step == 2 && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture *
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {formState.avatarPreview ? (
                      <img
                        src={formState.avatarPreview}
                        alt="Profile Picture"
                        className="w-full h-full object-fill"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      name="avatar"
                      id="avatar"
                      accept=".jpeg,.jpg,.png,.webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 flex text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or WEBP upto 5MB
                    </p>
                  </div>
                </div>
                {formState.errors.avatar && (
                  <p className="flex text-red-500 text-sm mt-1 items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formState.errors.avatar}
                  </p>
                )}
              </div>

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
              <CircleChevronLeft className="w-4 h-4" />
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
              Next <CircleChevronRight className="w-4 h-4" />
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
                  <p className="flex text-red-500 text-sm mt-1 items-center">
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
