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
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadFile from "../../utils/uploadFile";
import Navbar from "../../components/layout/Navbar";
import { formatDate } from "../../utils/helper";

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

  const [newSkill, setNewSkill] = useState("");
  const [newDesc, setNewDesc] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState({ avatar: false, resume: false });

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

  const handleFileUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const fileUploadRes = await uploadFile(file);
      const fileUrl = fileUploadRes.fileUrl || "";

      // Update form data with new File URL
      setFormData((prev) => ({
        ...prev,
        [type]: fileUrl,
      }));
    } catch (err) {
      console.error("upload failed:", err);
      toast.error("File upload failed. Please try again.");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL for avatar
      if (type === "avatar") {
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          [type]: previewUrl,
        }));
      }

      // Upload File
      handleFileUpload(file, type);
    }
  };

  const deleteResume = async () => {
    setIsSaving(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.DELETE_RESUME, {
        resumeUrl: formData.resume || "",
      });

      if (response.status === 200) {
        toast.success("Resume Deleted Successfully!");
        setFormData((prev) => ({ ...prev, resume: "" }));
        updateUser({ ...user, resume: "" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to Delete Resume. Please Try Again");
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
      // Prepare data for API - properly formatted
      const dataToSend = {
        ...formData,
        education: formData.education.map((edu) => ({
          ...edu,
          startDate: edu.startDate || undefined,
          endDate: edu.endDate || undefined,
        })),
        experience: formData.experience.map((exp) => ({
          ...exp,
          startDate: exp.startDate || undefined,
          endDate: exp.endDate || undefined,
        })),
        certifications: formData.certifications.map((cert) => ({
          ...cert,
          date: cert.date || undefined,
        })),
      };
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        dataToSend,
      );
      if (response.status === 200 && response.data) {
        toast.success("Profile Updated Successfully!");
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
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 my-16 lg:my-20">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  Edit Profile
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Update your professional information
                </p>
              </div>
              <div className="flex gap-2 flex-col md:flex-row">
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
                <button
                  onClick={() => {
                    setEditMode(false);
                  }}
                  className="p-3 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
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
                    src={formData.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-2 border-gray-100 object-cover"
                  />
                  {uploading.avatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin w-6 h-6 rounded-full border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block cursor-pointer">
                    <span className="sr-only">Choose avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileChange(e, "avatar");
                      }}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition-colors cursor-pointer"
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
                  value={formData.name ?? ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Prasan Poudel"
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
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-100 text-sky-700 rounded-full text-sm"
                >
                  {skill}
                  <button onClick={() => removeSkill(i)}>
                    <Trash2 className="w-4 h-4 hover:text-red-600" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-1">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Add skill"
                className="flex-1 px-2 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-600 text-sm sm:text-base"
              />
              <button
                onClick={addSkill}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
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
                className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
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
                        onChange={(e) =>
                          handleEducationChange(index, "study", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <input
                      placeholder="Institution"
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
                      value={edu.location ?? ""}
                      onChange={(e) =>
                        handleEducationChange(index, "location", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      type="date"
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
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg"
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
                      <div className="space-y-2 mb-3">
                        {exp.description?.map((desc, dIndex) => (
                          <div
                            key={dIndex}
                            className="flex flex-col sm:flex-row gap-2"
                          >
                            <input
                              value={desc ?? ""}
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
                              className="text-red-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          value={newDesc[expIndex] ?? ""}
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
                          className="px-4 py-2 bg-sky-600 text-white rounded-lg"
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
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg"
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
                      value={cert.name ?? ""}
                      onChange={(e) =>
                        handleCertificationChange(index, "name", e.target.value)
                      }
                      className="sm:col-span-2 px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      placeholder="Issuer"
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
                      value={formatDate(cert.date)}
                      onChange={(e) =>
                        handleCertificationChange(index, "date", e.target.value)
                      }
                      className="px-3 sm:px-4 py-2 border rounded-lg"
                    />

                    <input
                      placeholder="Certificate Link (optional)"
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
        </div>
      </div>
    </>
  );
};

export default EditUserProfile;
