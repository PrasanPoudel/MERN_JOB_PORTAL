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

const JobPostingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

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

  // Sample Job post (Real)

  // const [formData, setFormData] = useState({
  //   jobTitle: "Senior Frontend React Engineer",
  //   location: "San Francisco, CA",
  //   category: "",
  //   jobType: "",
  //   educationLevel: "",
  //   experienceLevel: "",

  //   description:
  //     "We are seeking a visionary Senior Frontend Engineer to lead the evolution of our core user interface. You will be responsible for architecting high-performance web applications, mentoring junior developers, and collaborating closely with our design team to deliver seamless, accessible user experiences. This role is perfect for someone who thrives at the intersection of complex state management and polished aesthetic design.",

  //   requirements:
  //     "The ideal candidate possesses expert-level proficiency in React 18 and TypeScript, with a deep understanding of Next.js and modern server components. We require extensive hands-on experience with state management libraries like Zustand and a strong grasp of Tailwind CSS for building responsive layouts. You should have a proven track record of optimizing web performance and a commitment to maintaining high-quality code standards through rigorous testing.",

  //   offer:
  //     "We provide a competitive base salary paired with an annual performance bonus and early-stage equity in a high-growth environment. Our comprehensive benefits include full health, dental, and vision insurance for you and your family, alongside an annual professional development stipend. Employees also enjoy a flexible 'Work from Anywhere' policy and an unlimited PTO program designed to promote a healthy work-life balance.",

  //   salaryMin: "145000",
  //   salaryMax: "185000",
  //   noOfVacancy: "3",
  //   createdAt: "2026-03-10",
  //   applicationDeadlineDate: "2026-05-15",
  // });

  //Sample job post (Scam)

  // const [formData, setFormData] = useState({
  //   jobTitle: "PART TIME HOME BASED DATA ENTRY CLERK - START IMMEDIATELY",
  //   location: "Remote",
  //   category: "",
  //   jobType: "",
  //   educationLevel: "",
  //   experienceLevel: "",

  //   description:
  //     "Are you looking for a way to earn extra cash from the comfort of your own home? Our rapidly expanding international firm is seeking motivated individuals to assist with basic data entry tasks and clerical duties. No previous experience is necessary as we provide full online training. This is a perfect opportunity for students, stay-at-home parents, or anyone looking to increase their weekly income with minimal effort.",

  //   requirements:
  //     "The only requirements for this position are a stable internet connection and a basic understanding of how to use a computer or smartphone. You must be at least 18 years old and capable of following simple instructions. We value reliability and a positive attitude over technical skills or previous employment history. You must be able to start immediately upon acceptance.",

  //   offer:
  //     "We offer an incredible hourly rate of $50 to $100 per hour depending on your speed and accuracy. Payments are made daily via wire transfer or cryptocurrency. You will also receive a sign-on bonus of $500 after your first week of successful data entry. Flexible hours allow you to work as little or as much as you want without any boss hovering over your shoulder.",

  //   salaryMin: "96000",
  //   salaryMax: "192000",
  //   noOfVacancy: "10",
  //   createdAt: "2026-03-12",
  //   applicationDeadlineDate: "2026-03-13",
  // });

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

    if (
      !user.companyName?.trim() ||
      !user.companyDescription?.trim() ||
      !user.companyLocation?.trim() ||
      !user.companySize ||
      !user.companyRegistrationNumber ||
      !user.panNumber
    ) {
      toast.error("Please complete your company profile before posting a job");
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
        toast.error("❌ Failed to post job. Please try again.");
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
