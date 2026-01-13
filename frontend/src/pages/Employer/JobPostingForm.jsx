import react, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AlertCircle, MapPin, Briefcase, Users, Eye, Send } from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import toast from "react-hot-toast";
import InputField from "../../components/Input/InputField";
import SelectField from "../../components/Input/SelectField";
import TextareaField from "../../components/Input/TextareaField";
import JobPostingPreview from "../../components/Cards/JobPostingPreview";

const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (field, value) => {
    const formatValue = (value) => {
      if (typeof value !== "string" || value.length === 0) return value;
      return value.replace(/(^\s*\w|[.!?]\s*\w)/g, (char) =>
        char.toUpperCase()
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
    };

    try {
      const response = jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          jobId ? "Job Updated Successfully!" : "Job Posted Successfully!"
        );
        setFormData({
          jobTitle: "",
          location: "",
          category: "",
          jobType: "",
          description: "",
          requirements: "",
          salaryMin: "",
          salaryMax: "",
        });
        navigate("/employer-dashboard");
        return;
      } else {
        console.log("Unexpected response", response);
        toast.error("Something went wrong. Please try again");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response?.data?.message);
      } else {
        console.error("Couldn't post/update job", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form validation
  const validateForm = (formData) => {
    const errors = {};

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "Job Title is required";
    }
    if (!formData.category.trim()) {
      errors.category = "Please select a category";
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }
    if (!formData.jobType.trim()) {
      errors.jobType = "Please select a job type";
    }
    if (!formData.description.trim()) {
      errors.description = "Job description is required";
    }
    if (!formData.requirements.trim()) {
      errors.requirements = "Job requirements are required";
    }
    if (!formData.salaryMin || !formData.salaryMax) {
      errors.salary = "Both minimum and maximum salary are required";
    } else if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      errors.salary = "Maximum salary must be greater than minimum salary";
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
          <div className="shadow-xl p-4 pb-25">
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
                  onClick={() => setIsPreview(true)}
                  disabled={!isFormValid()}
                  className="group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white hover:bg-sky-600 border border-gray-100 hover:border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span className="">Preview</span>
                </button>
              </div>
            </div>
            <div className="space-y-6 max-w-4xl">
              <InputField
                label="Job Title"
                id="jobTitle"
                placeholder="e.g., Software Developer"
                value={formData.jobTitle}
                required
                onChange={(e) => {
                  handleInputChange("jobTitle", e.target.value);
                }}
                icon={Briefcase}
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
                  icon={Briefcase}
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
                error={errors.description}
                helperText="Include key requirements and preferred skills in candidates. Seperate them by dot ( . )"
                required
              />
              {/* Salary Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Salary Range (monthly)
                  <span className="text-red-500 ml-1">*</span>
                </label>
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
              <div className="pt-2">
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
