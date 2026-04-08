import React, { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  User,
  MapPin,
  Link,
  Award,
  BriefcaseBusiness,
  GraduationCap,
  Code,
  X,
  Crown,
  CheckCircle,
  ArrowRight,
  Info,
  Star,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadFile from "../../utils/uploadFile";
import Navbar from "../../components/layout/Navbar";
import { formatDate } from "../../utils/helper";
import { SAMPLE_PROFILES } from "../../utils/data";

const EditUserProfile = ({ user, updateUser, setEditMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    avatar: "",
    resume: "",
    facebookLink: "",
    instagramLink: "",
    skills: [],
    education: [],
    experience: [],
    certifications: [],
  });
  const [sampleValue, setSampleValue] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newDesc, setNewDesc] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState({ avatar: false, resume: false });
  const [tempFiles, setTempFiles] = useState({ avatar: null, resume: null });
  const [tempPreviews, setTempPreviews] = useState({
    avatar: null,
    resume: null,
  });
  const [showProfileImportancePopup, setShowProfileImportancePopup] =
    useState(false);

  // Show popup every time component mounts
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setShowProfileImportancePopup(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const closePopup = () => {
    setShowProfileImportancePopup(false);
  };

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        location: user.location || "",
        avatar: user.avatar || "",
        resume: user.resume || "",
        facebookLink: user.facebookLink || "",
        instagramLink: user.instagramLink || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        education: Array.isArray(user.education) ? user.education : [],
        experience: Array.isArray(user.experience) ? user.experience : [],
        certifications: Array.isArray(user.certifications)
          ? user.certifications
          : [],
      });
      // console.log(user);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      // Store file and preview in temporary state
      setTempFiles((prev) => ({ ...prev, [type]: file }));
      setTempPreviews((prev) => ({ ...prev, [type]: previewUrl }));

      // Update form data with preview URL for immediate display
      setFormData((prev) => ({
        ...prev,
        [type]: previewUrl,
      }));
    }
  };

  const deleteResume = async () => {
    if (!formData.resume) return;

    setIsSaving(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.DELETE_RESUME, {
        resumeUrl: formData.resume,
      });

      if (response.status === 200) {
        toast.success("Resume deleted successfully!");
        setFormData((prev) => ({ ...prev, resume: "" }));
        updateUser({ ...user, resume: "" });
      }
    } catch (err) {
      console.error("[Delete Resume Error]", {
        resumeUrl: formData.resume,
        error: err?.message || err,
      });
      toast.error(err?.message || "Failed to delete resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData({ ...formData, education: updated });
  };

  const addEducation = () => {
    // Validation: Check if last education entry is complete
    const lastEdu = formData.education[formData.education.length - 1];
    if (
      formData.education.length > 0 &&
      (!lastEdu.study?.trim() ||
        !lastEdu.institution?.trim() ||
        !lastEdu.location?.trim() ||
        !lastEdu.startDate ||
        !lastEdu.endDate)
    ) {
      toast.error(
        "Please complete all fields in the current education entry before adding a new one.",
      );
      return;
    }

    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          study: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
        },
      ],
    });
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };

  const addExperienceDescription = (expIndex) => {
    const desc = newDesc[expIndex];
    if (desc && desc.trim()) {
      const updated = [...formData.experience];
      updated[expIndex].description = [
        ...(updated[expIndex].description || []),
        desc.trim(),
      ];
      setFormData({ ...formData, experience: updated });
      setNewDesc({ ...newDesc, [expIndex]: "" });
    }
  };

  const removeExperienceDescription = (expIndex, descIndex) => {
    const updated = [...formData.experience];
    updated[expIndex].description = updated[expIndex].description.filter(
      (_, i) => i !== descIndex,
    );
    setFormData({ ...formData, experience: updated });
  };

  const addExperience = () => {
    // Validation: Check if last experience entry is complete
    const lastExp = formData.experience[formData.experience.length - 1];
    if (
      formData.experience.length > 0 &&
      (!lastExp.jobTitle?.trim() ||
        !lastExp.company?.trim() ||
        !lastExp.location?.trim() ||
        !lastExp.startDate ||
        (!lastExp.isCurrent && !lastExp.endDate))
    ) {
      toast.error(
        "Please complete all fields in the current experience entry before adding a new one.",
      );
      return;
    }

    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: [],
        },
      ],
    });
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  const handleCertificationChange = (index, field, value) => {
    const updated = [...formData.certifications];
    updated[index][field] = value;
    setFormData({ ...formData, certifications: updated });
  };

  const addCertification = () => {
    // Validation: Check if last certification entry is complete
    const lastCert =
      formData.certifications[formData.certifications.length - 1];
    if (
      formData.certifications.length > 0 &&
      (!lastCert.name?.trim() || !lastCert.issuer?.trim() || !lastCert.date)
    ) {
      toast.error(
        "Please complete all required fields (name, issuer, date) in the current certification before adding a new one.",
      );
      return;
    }

    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        {
          name: "",
          issuer: "",
          date: "",
          link: "",
        },
      ],
    });
  };

  const removeCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Upload files first if they exist
      let avatarUrl = formData.avatar;
      let resumeUrl = formData.resume;

      if (tempFiles.avatar) {
        setUploading((prev) => ({ ...prev, avatar: true }));
        try {
          const avatarUploadRes = await uploadFile(tempFiles.avatar);
          avatarUrl = avatarUploadRes?.fileUrl || "";
        } catch (err) {
          console.error("[Avatar Upload Error]", {
            fileName: tempFiles.avatar?.name,
            error: err?.message || err,
          });
          toast.error("Profile picture upload failed. Please try again.");
          return;
        } finally {
          setUploading((prev) => ({ ...prev, avatar: false }));
        }
      }

      if (tempFiles.resume) {
        setUploading((prev) => ({ ...prev, resume: true }));
        try {
          const resumeUploadRes = await uploadFile(tempFiles.resume);
          resumeUrl = resumeUploadRes?.fileUrl || "";
        } catch (err) {
          console.error("[Resume Upload Error]", {
            fileName: tempFiles.resume?.name,
            error: err?.message || err,
          });
          toast.error("Resume upload failed. Please try again.");
          return;
        } finally {
          setUploading((prev) => ({ ...prev, resume: false }));
        }
      }

      // Update form data with uploaded URLs
      const updatedFormData = {
        ...formData,
        avatar: avatarUrl,
        resume: resumeUrl,
      };

      // Prepare data for API
      const dataToSend = {
        ...updatedFormData,
        education: updatedFormData.education.map((edu) => ({
          ...edu,
          startDate: edu.startDate || undefined,
          endDate: edu.endDate || undefined,
        })),
        experience: updatedFormData.experience.map((exp) => ({
          ...exp,
          startDate: exp.startDate || undefined,
          endDate: exp.endDate || undefined,
        })),
        certifications: updatedFormData.certifications.map((cert) => ({
          ...cert,
          date: cert.date || undefined,
        })),
      };

      // Update profile
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        dataToSend,
      );

      if (response.status === 200 && response.data) {
        toast.success("Profile updated successfully!");
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          role: response.data.role || "",
          location: response.data.location || "",
          avatar: response.data.avatar || "",
          resume: response.data.resume || "",
          facebookLink: response.data.facebookLink || "",
          instagramLink: response.data.instagramLink || "",
          skills: Array.isArray(response.data.skills)
            ? response.data.skills
            : [],
          education: Array.isArray(response.data.education)
            ? response.data.education
            : [],
          experience: Array.isArray(response.data.experience)
            ? response.data.experience
            : [],
          certifications: Array.isArray(response.data.certifications)
            ? response.data.certifications
            : [],
        });
        updateUser(response.data);
        setEditMode(false);

        // Clean up temporary files and previews
        setTempFiles({ avatar: null, resume: null });
        setTempPreviews({ avatar: null, resume: null });
      }
    } catch (err) {
      console.error("[Profile Update Error]", {
        error: err?.message || err,
      });
      toast.error(
        err?.message || "Failed to update profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-sky-600 flex text-white items-start justify-between sm:flex-row flex-col space-y-2 rounded-2xl shadow-sm p-4 sm:p-6 mb-2">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              Edit Profile
            </h1>
            <div className="flex gap-2">
              <select
                value={sampleValue}
                onChange={(e) => {
                  setSampleValue(e.target.value);
                  SAMPLE_PROFILES[e.target.value]
                    ? setFormData({
                        name: user?.name || "Prasan Poudel",
                        email: user.email || "",
                        role: user.role || "",
                        location: user.location || "",
                        avatar: user.avatar || "",
                        resume: user.resume || "",
                        ...SAMPLE_PROFILES[e.target.value],
                      })
                    : setFormData({
                        name: user.name || "",
                        email: user.email || "",
                        role: user.role || "",
                        location: user.location || "",
                        avatar: user.avatar || "",
                        resume: user.resume || "",
                        facebookLink: user.facebookLink || "",
                        instagramLink: user.instagramLink || "",
                        skills: Array.isArray(user.skills) ? user.skills : [],
                        education: Array.isArray(user.education)
                          ? user.education
                          : [],
                        experience: Array.isArray(user.experience)
                          ? user.experience
                          : [],
                        certifications: Array.isArray(user.certifications)
                          ? user.certifications
                          : [],
                      });
                }}
                id="profile-select"
                className="w-full px-4 py-2.5 border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-white/90 text-gray-900 font-medium cursor-pointer transition-all hover:bg-white"
              >
                <option value="" disabled>
                  Sample Template
                </option>
                {Object.keys(SAMPLE_PROFILES).map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                title="Turn off edit mode"
                onClick={() => {
                  setEditMode(false);
                }}
                className="text-white flex items-center gap-2 bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-white/30 transition text-sm"
              >
                <X className="w-4 h-4" />
                <span className="hidden xs:inline">Cancel</span>
              </button>
            </div>
          </div>

          {/* Profile Image & Resume Section */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-sky-600" />
              Profile Image & Resume
            </h2>

            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col space-y-4 items-start md:items-center md:flex-row md:space-x-4">
                <div className="relative">
                  <img
                    src={formData.avatar || "/default.png"}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-2 border-gray-100 object-cover"
                  />
                  {uploading.avatar && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                      <div className="animate-spin w-6 h-6 rounded-full border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>

                <div className="">
                  <label className="block cursor-pointer">
                    <span className="sr-only">Choose avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      onChange={(e) => {
                        handleFileChange(e, "avatar");
                      }}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition-colors file:cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Resume Upload/Display */}
              {formData.resume ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="md:text-base text-sm text-gray-600 flex-1">
                      Link:{" "}
                      <a
                        href={formData.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pl-2 text-sky-500 underline cursor-pointer break-all"
                      >
                        {formData.resume}
                      </a>
                    </p>
                    <button
                      onClick={deleteResume}
                      className="cursor-pointer p-2 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={isSaving}
                    >
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume
                    <span className="cursor-pointer sr-only">Choose File</span>
                    <input
                      type="file"
                      id="resume-upload"
                      onChange={(e) => {
                        handleFileChange(e, "resume");
                      }}
                      accept=".pdf,.doc,.docx"
                      className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition-colors cursor-pointer"
                    />
                  </label>
                  {uploading.resume && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <div className="animate-spin w-4 h-4 rounded-full border-2 border-sky-600 border-t-transparent"></div>
                      <span>Uploading resume...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-sky-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name ?? ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Alex Johnson"
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Location (Na_Pa/Ga_Pa)
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Butwal-11, Milanchowk"
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 text-sm sm:text-base"
                />
              </div>

              {[
                { label: "Facebook Link", name: "facebookLink" },
                { label: "Instagram Link", name: "instagramLink" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Link className="w-4 h-4" /> {field.label}
                  </label>
                  <input
                    type="url"
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder="https://"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 text-sm sm:text-base"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Code className="w-6 h-6 text-sky-600" />
              Skills
            </h2>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
              {formData.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-400 shadow-sm rounded-full text-sm"
                >
                  {skill}
                  <button onClick={() => removeSkill(i)}>
                    <Trash2 className="w-4 h-4 text-red-600 hover:text-red-700" />
                  </button>
                </span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-1">
              <input
                value={newSkill}
                id="newSkill"
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Add skill"
                className="col-span-3 px-2 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 text-sm sm:text-base"
              />
              <button
                onClick={addSkill}
                className="flex items-center justify-center gap-2 p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden lg:flex">Add</span>
              </button>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 mb-6">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-sky-600" />
                Education
              </h2>
              <button
                onClick={addEducation}
                className="flex items-center justify-center gap-2 p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>

            <div className="space-y-6">
              {formData.education?.map((edu, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 relative"
                >
                  <button
                    onClick={() => removeEducation(index)}
                    className="absolute top-3 right-3 p-2 text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10">
                    <div className="sm:col-span-2">
                      <label className="flex text-sm font-medium mb-2">
                        Degree
                      </label>
                      <input
                        value={edu.study ?? ""}
                        id={`education-study-${index}`}
                        onChange={(e) =>
                          handleEducationChange(index, "study", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <input
                      placeholder="Institution"
                      id={`education-institution-${index}`}
                      value={edu.institution ?? ""}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "institution",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      placeholder="Location"
                      id={`education-location-${index}`}
                      value={edu.location ?? ""}
                      onChange={(e) =>
                        handleEducationChange(index, "location", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      type="date"
                      id={`education-startDate-${index}`}
                      value={formatDate(edu.startDate)}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "startDate",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      type="date"
                      id={`education-endDate-${index}`}
                      value={formatDate(edu.endDate)}
                      onChange={(e) =>
                        handleEducationChange(index, "endDate", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 mb-6">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BriefcaseBusiness className="w-6 h-6 text-sky-600" />
                Experience
              </h2>
              <button
                onClick={addExperience}
                className="flex items-center gap-2 p-2 bg-sky-600 text-white rounded-lg"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>

            <div className="space-y-6">
              {formData.experience?.map((exp, expIndex) => (
                <div
                  key={expIndex}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 relative"
                >
                  <button
                    onClick={() => removeExperience(expIndex)}
                    className="absolute top-3 right-3 p-2 text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10">
                    <input
                      placeholder="Job Title"
                      id={`experience-jobTitle-${expIndex}`}
                      value={exp.jobTitle ?? ""}
                      onChange={(e) =>
                        handleExperienceChange(
                          expIndex,
                          "jobTitle",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      placeholder="Company"
                      id={`experience-company-${expIndex}`}
                      value={exp.company ?? ""}
                      onChange={(e) =>
                        handleExperienceChange(
                          expIndex,
                          "company",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      placeholder="Location"
                      id={`experience-location-${expIndex}`}
                      value={exp.location ?? ""}
                      onChange={(e) =>
                        handleExperienceChange(
                          expIndex,
                          "location",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        id={`experience-isCurrent-${expIndex}`}
                        checked={exp.isCurrent}
                        onChange={(e) =>
                          handleExperienceChange(
                            expIndex,
                            "isCurrent",
                            e.target.checked,
                          )
                        }
                      />
                      Currently working here
                    </label>

                    <input
                      type="date"
                      id={`experience-startDate-${expIndex}`}
                      value={formatDate(exp.startDate)}
                      onChange={(e) =>
                        handleExperienceChange(
                          expIndex,
                          "startDate",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    {!exp.isCurrent && (
                      <input
                        type="date"
                        id={`experience-endDate-${expIndex}`}
                        value={formatDate(exp.endDate)}
                        onChange={(e) =>
                          handleExperienceChange(
                            expIndex,
                            "endDate",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                      />
                    )}

                    <div className="sm:col-span-2">
                      <div className="space-y-2 mb-3 relative">
                        {exp.description?.map((desc, dIndex) => (
                          <div key={dIndex} className="flex">
                            <input
                              value={desc ?? ""}
                              id={`experience-description-${expIndex}-${dIndex}`}
                              onChange={(e) => {
                                const updated = [...formData.experience];
                                updated[expIndex].description[dIndex] =
                                  e.target.value;
                                setFormData({
                                  ...formData,
                                  experience: updated,
                                });
                              }}
                              className="flex-1 px-3 sm:px-4 py-2 border rounded-lg"
                            />
                            <button
                              onClick={() =>
                                removeExperienceDescription(expIndex, dIndex)
                              }
                              className="text-red-600 absolute right-0 bg-white -mt-1 rounded-full overflow-hidden"
                            >
                              <X className="w-5 h-5 shadow-sm" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col items-end sm:flex-row sm:items-center gap-2">
                        <input
                          value={newDesc[expIndex] ?? ""}
                          id={`experience-newDesc-${expIndex}`}
                          onChange={(e) =>
                            setNewDesc({
                              ...newDesc,
                              [expIndex]: e.target.value,
                            })
                          }
                          placeholder="Add responsibility"
                          className="flex-1 px-3 sm:px-4 py-2 border rounded-lg"
                        />
                        <button
                          onClick={() => addExperienceDescription(expIndex)}
                          className="flex justify-end px-4 py-2 bg-sky-600 text-white rounded-lg"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 mb-20">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <Award className="w-6 h-6 text-sky-600" />
                Certifications
              </h2>
              <button
                onClick={addCertification}
                className="flex items-center gap-2 p-2 bg-sky-600 text-white rounded-lg"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>

            <div className="space-y-6">
              {formData.certifications?.map((cert, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 relative"
                >
                  <button
                    onClick={() => removeCertification(index)}
                    className="absolute top-3 right-3 p-2 text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10">
                    <input
                      placeholder="Certification Name"
                      id={`certification-name-${index}`}
                      value={cert.name ?? ""}
                      onChange={(e) =>
                        handleCertificationChange(index, "name", e.target.value)
                      }
                      className="sm:col-span-2 px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      placeholder="Issuer"
                      id={`certification-issuer-${index}`}
                      value={cert.issuer ?? ""}
                      onChange={(e) =>
                        handleCertificationChange(
                          index,
                          "issuer",
                          e.target.value,
                        )
                      }
                      className="px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      type="date"
                      id={`certification-date-${index}`}
                      value={formatDate(cert.date)}
                      onChange={(e) =>
                        handleCertificationChange(index, "date", e.target.value)
                      }
                      className="px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      placeholder="Certificate Link (optional)"
                      id={`certification-link-${index}`}
                      value={cert.link ?? ""}
                      onChange={(e) =>
                        handleCertificationChange(index, "link", e.target.value)
                      }
                      className="sm:col-span-2 px-3 sm:px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-col md:flex-row justify-end">
            <button
              onClick={() => {
                setEditMode(false);
              }}
              className="p-3 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || uploading.avatar || uploading.resume}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="animate-spin border-2 border-b-sky-600 w-5 h-5 rounded-full"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Importance Popup Modal */}
      {showProfileImportancePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="bg-sky-600 p-6 text-white relative">
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    Why Your Profile Matters
                  </h2>
                  <p className="text-sky-100 text-sm">
                    Get noticed by employers
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* How it works section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  How Your Profile Affects Your Job Search
                </h3>

                <div className="space-y-3">
                  <div className="flex gap-3 p-3 bg-sky-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Smart Job Matching
                      </p>
                      <p className="text-sm text-gray-600">
                        Our system uses TF-IDF algorithm to calculate similarity
                        score between your profile and job postings. Complete
                        profiles get more relevant job recommendations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 bg-green-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Employer Ranking
                      </p>
                      <p className="text-sm text-gray-600">
                        When employers view applications, they are sorted by
                        "Most Relevant" by default. Better profile means you
                        appear at the TOP of their candidate list.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Benefits Section */}
              {!user?.isPremium && (
                <div className="border-2 border-sky-200 bg-linear-to-br from-sky-50 to-blue-50 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Go Premium</h3>
                      <p className="text-sm text-gray-600">
                        Maximize your job search potential
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-sky-600" />
                      <span>Unlimited job applications</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-sky-600" />
                      <span>Personalized job recommendation emails</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-sky-600" />
                      <span>
                        Instant application status tracking notifications
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        closePopup();
                        window.location.href = "/pricing";
                      }}
                      className="flex-1 cursor-pointer bg-yellow-400 hover:bg-yellow-500 p-2 rounded-xl text-white hover:shadow-lg"
                    >
                      Upgrade Now - रू 100/month
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closePopup}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  I understand
                </button>
                <button
                  onClick={closePopup}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Let's complete my profile
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditUserProfile;
