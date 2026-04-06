import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  AlertCircle,
  MapPin,
  BriefcaseBusiness,
  Users,
  Eye,
  Send,
  GraduationCap,
  Building2,
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  CATEGORIES,
  JOB_TYPES,
  REQUIRED_EDUCATION_LEVEL,
  REQUIRED_EXPERIENCE_LEVEL,
} from "../../utils/data";
import toast from "react-hot-toast";
import InputField from "../../components/Input/InputField";
import SelectField from "../../components/Input/SelectField";
import TextareaField from "../../components/Input/TextareaField";
import JobPostingPreview from "../../components/Cards/JobPostingPreview";
import { useAuth } from "../../context/AuthContext";
import JobPostNotAllowed from "../../components/Cards/JobPostNotAllowed";

const JobPostingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  // Check if employer has complete company profile
  const hasCompleteCompanyProfile =
    user?.companyName?.trim() &&
    user?.companyRegistrationNumber?.trim() &&
    user?.companyPanNumber?.trim() &&
    user?.companySize?.trim() &&
    user?.companyLocation?.trim() &&
    user?.companyDescription?.trim();

  // If company profile is not complete, show this page
  if (!hasCompleteCompanyProfile) {
    return <JobPostNotAllowed user={user} />;
  }

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    educationLevel: "",
    experienceLevel: "",
    description: "",
    requirements: "",
    offer: "",
    salaryMin: "",
    salaryMax: "",
    noOfVacancy: "",
    applicationDeadlineDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (field, value) => {
    const formatValue = (value) => {
      if (typeof value !== "string" || value.length === 0) return value;
      return value.replace(/(^\s*\w|[.!?]\s*\w)/g, (char) =>
        char.toUpperCase(),
      );
    };

    setFormData((prev) => ({
      ...prev,
      [field]: formatValue(value),
    }));

    // clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!user || user?.role !== "employer") {
      toast.error("Only employers can post jobs");
      return;
    }
    if (user.isBanned) {
      toast.error("Employer is banned, cannot post a job");
      return;
    }
    setIsSubmitting(true);

    const jobPayload = {
      title: formData.jobTitle,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      description: formData.description,
      requirements: formData.requirements,
      offer: formData.offer,
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
      no_of_vacancy: Number(formData.noOfVacancy),
      application_deadline_date: formData.applicationDeadlineDate,
      educationLevel: formData.educationLevel,
      experienceLevel: formData.experienceLevel,
    };

    try {
      const response = jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          jobId ? "Job updated successfully!" : "Job posted successfully!",
        );
        setFormData({
          jobTitle: "",
          location: "",
          category: "",
          jobType: "",
          description: "",
          requirements: "",
          offer: "",
          salaryMin: "",
          salaryMax: "",
          noOfVacancy: "",
          applicationDeadlineDate: "",
          educationLevel: "",
          experienceLevel: "",
        });
        navigate("/employer-dashboard");
        return;
      } else {
        console.log("Unexpected response :", response);
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("[Job Post Error]", {
        jobTitle: formData.jobTitle,
        error: err?.message || err,
      });
      if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("Failed to post job. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form validation
  const validateForm = (formData) => {
    const errors = {};

    if (!formData.jobTitle?.trim()) {
      errors.jobTitle = "Job Title is required";
    }
    if (!formData.category?.trim()) {
      errors.category = "Please select a category";
    }
    if (!formData.location?.trim()) {
      errors.location = "Location is required";
    }
    if (!formData.jobType?.trim()) {
      errors.jobType = "Please select a job type";
    }
    if (!formData.description?.trim()) {
      errors.description = "Job description is required";
    }
    if (!formData.requirements?.trim()) {
      errors.requirements = "Job requirements are required";
    }
    if (!formData.educationLevel?.trim()) {
      errors.educationLevel = "Education level is required";
    }
    if (!formData.experienceLevel?.trim()) {
      errors.experienceLevel = "Experience level is required";
    }
    if (!formData.salaryMin || !formData.salaryMax) {
      errors.salary = "Both minimum and maximum salary are required";
    } else if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      errors.salary = "Maximum salary must be greater than minimum salary";
    }
    if (!formData.noOfVacancy || parseInt(formData.noOfVacancy) <= 0) {
      errors.noOfVacancy = "Number of vacancies must be a positive number";
    }
    if (!formData.applicationDeadlineDate) {
      errors.applicationDeadlineDate = "Application deadline date is required";
    } else {
      const deadlineDate = new Date(formData.applicationDeadlineDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate <= today) {
        errors.applicationDeadlineDate =
          "Application deadline must be in the future";
      }
    }
    return errors;
  };

  const isFormValid = () => {
    const validationErrors = validateForm(formData);
    return Object.keys(validationErrors).length === 0;
  };

  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview} />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen">
        <div className="mx-auto">
          <div className="pb-24">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Post a New Job
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Fill out the form below to create your job posting
                </p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    if (!isFormValid()) {
                      toast.error(
                        "Please complete all required fields before previewing.",
                      );
                    } else {
                      setIsPreview(true);
                    }
                  }}
                  className="group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white hover:bg-sky-600 border border-gray-100 hover:border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span className="">Preview</span>
                </button>
              </div>
            </div>
            <div className="space-y-6 max-w-5xl">
              <InputField
                label="Job Title"
                id="jobTitle"
                placeholder="e.g., Software Developer"
                value={formData.jobTitle}
                required
                onChange={(e) => {
                  handleInputChange("jobTitle", e.target.value);
                }}
                icon={BriefcaseBusiness}
                errors={errors.jobTitle}
              />
              {/* Location */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <InputField
                      label="Location"
                      id="location"
                      placeholder="e.g., Milan Chowk, Butwal"
                      value={formData.location}
                      onChange={(e) => {
                        handleInputChange("location", e.target.value);
                      }}
                      icon={MapPin}
                      error={errors.location}
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Category and Job type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Category"
                  id="category"
                  value={formData.category}
                  onChange={(e) => {
                    handleInputChange("category", e.target.value);
                  }}
                  options={CATEGORIES}
                  placeholder="Select a category"
                  error={errors.category}
                  icon={Users}
                  required
                />
                <SelectField
                  label="Job Type"
                  id="jobType"
                  value={formData.jobType}
                  onChange={(e) => {
                    handleInputChange("jobType", e.target.value);
                  }}
                  options={JOB_TYPES}
                  placeholder="Select a job type"
                  error={errors.jobType}
                  icon={BriefcaseBusiness}
                  required
                />
              </div>
              {/* Education and Experience level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Minimum Education Requirement"
                  id="educationLevel"
                  value={formData.educationLevel}
                  onChange={(e) => {
                    handleInputChange("educationLevel", e.target.value);
                  }}
                  options={REQUIRED_EDUCATION_LEVEL}
                  placeholder="Select an education level"
                  error={errors.educationLevel}
                  icon={GraduationCap}
                  required
                />
                <SelectField
                  label="Expected Experience Level"
                  id="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={(e) => {
                    handleInputChange("experienceLevel", e.target.value);
                  }}
                  options={REQUIRED_EXPERIENCE_LEVEL}
                  placeholder="Select an experience level"
                  error={errors.experienceLevel}
                  icon={BriefcaseBusiness}
                  required
                />
              </div>
              {/* Description */}
              <TextareaField
                label="Job Description"
                id="description"
                placeholder="Describe the roles and responsibilities..."
                value={formData.description}
                onChange={(e) => {
                  handleInputChange("description", e.target.value);
                }}
                error={errors.description}
                helperText="Include key responsibilities and day-to-day tasks involved in the job."
                required
              />
              {/* Requirements */}
              <TextareaField
                label="Job Requirements"
                id="requirements"
                placeholder="List down the required skills and qualifications for the job..."
                value={formData.requirements}
                onChange={(e) => {
                  handleInputChange("requirements", e.target.value);
                }}
                error={errors.requirements}
                helperText="Include key requirements and preferred skills in candidates. Seperate them by dot ( . )"
                required
              />
              {/* Requirements */}
              <TextareaField
                label="Company Offers (optional)"
                id="offer"
                placeholder="List down the offers provided by company to candidate after hiring..."
                value={formData.offer}
                onChange={(e) => {
                  handleInputChange("offer", e.target.value);
                }}
                error={errors.offer}
                helperText="Include key offers and facilities that will be provided by company to this hold holder. Seperate them by dot ( . )"
              />
              {/* Number of Vacancies */}
              <div className="space-y-2">
                <p className="block text-sm font-medium text-gray-700">
                  Number of Vacancies
                  <span className="text-red-500 ml-1">*</span>
                </p>
                <input
                  type="number"
                  id="noOfVacancy"
                  placeholder="e.g., 5"
                  value={formData.noOfVacancy}
                  onChange={(e) => {
                    handleInputChange("noOfVacancy", e.target.value);
                  }}
                  required
                  min="1"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200"
                />
                {errors.noOfVacancy && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.noOfVacancy}</span>
                  </div>
                )}
              </div>
              {/* Application Deadline Date */}
              <div className="space-y-2">
                <p className="block text-sm font-medium text-gray-700">
                  Application Deadline Date
                  <span className="text-red-500 ml-1">*</span>
                </p>
                <input
                  type="date"
                  id="applicationDeadlineDate"
                  value={formData.applicationDeadlineDate}
                  onChange={(e) => {
                    handleInputChange(
                      "applicationDeadlineDate",
                      e.target.value,
                    );
                  }}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200"
                />
                {errors.applicationDeadlineDate && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.applicationDeadlineDate}</span>
                  </div>
                )}
              </div>
              {/* Salary Range */}
              <div className="space-y-2">
                <p className="block text-sm font-medium text-gray-700">
                  Salary Range (monthly)
                  <span className="text-red-500 ml-1">*</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <p className="text-xl text-gray-400"> रु</p>
                    </div>
                    <input
                      type="number"
                      id="salaryMin"
                      placeholder="Min"
                      value={formData.salaryMin}
                      onChange={(e) => {
                        handleInputChange("salaryMin", e.target.value);
                      }}
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <p className="text-xl text-gray-400"> रु</p>
                    </div>
                    <input
                      type="number"
                      id="salaryMax"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={(e) => {
                        handleInputChange("salaryMax", e.target.value);
                      }}
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200"
                    />
                  </div>
                </div>
                {errors.salary && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.salary}</span>
                  </div>
                )}
              </div>
              {/* Submit Button */}
              <div className="pt-2 w-full justify-end flex">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className="w-50 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-offset-2 focus:ring-sky-500 disabled:bg-gray-400 disabled:cursor-not-allowed outline-none transition-colors duration-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Publishing Job...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Publish Job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingForm;
