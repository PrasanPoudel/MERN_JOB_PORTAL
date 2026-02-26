import React, { useState } from "react";
import {
  MapPin,
  Facebook,
  Instagram,
  Calendar,
  ExternalLink,
  BriefcaseBusiness,
  GraduationCap,
  Award,
  Crown,
  Edit3,
  User,
  FileText,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import EditUserProfile from "./EditUserProfile";

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("about");
  const [editMode, setEditMode] = useState(false);

  const formatDate = (date) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const tabs = [
    { id: "about", label: "About", icon: User },
    {
      id: "skills_and_education",
      label: "Skills & Education",
      icon: GraduationCap,
    },
    { id: "experience", label: "Experience", icon: BriefcaseBusiness },
    { id: "certifications", label: "Certifications", icon: Award },
  ];

  if (editMode) {
    return (
      <EditUserProfile
        user={user}
        updateUser={updateUser}
        setEditMode={setEditMode}
      />
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 mt-24 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-4">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col gap-2 items-center">
                <img
                  src={user?.avatar || "/default.png"}
                  alt={user?.name}
                  className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                />
                {/* User Details */}
                <div className="flex flex-col items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.name || ""}
                  </h2>
                  {user?.isPremium ? (
                    <span className="flex justify-center items-center gap-1.5 px-3 py-2 rounded-md bg-yellow-400 text-white text-xs shadow-sm">
                      <Crown className="w-4 h-4" />
                      Premium User
                    </span>
                  ) : (
                    <span className="flex justify-center items-center gap-1.5 px-3 py-1 rounded-md bg-gray-50 text-gray-700 text-xs font-medium border border-gray-200">
                      <User className="w-4 h-4" />
                      Free User
                    </span>
                  )}
                  <div className="flex items-center mt-1 text-gray-600">
                    <p className="text-sm">{user?.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-1">
                    {user?.location && (
                      <div className="flex items-center gap-1.5 text-gray-700 text-sm">
                        <MapPin className="w-4 h-4 text-sky-600" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user?.facebookLink && (
                      <a
                        href={user.facebookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Facebook className="w-4 h-4" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {user?.instagramLink && (
                      <a
                        href={user.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-pink-600 hover:text-pink-700 text-sm"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>Instagram</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="overflow-x-auto">
              <div className="flex min-w-max pb-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        isActive
                          ? "border-sky-500 text-sky-600"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-2">
                {/* About Tab */}
                {activeTab === "about" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      About
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <label className="text-sm font-semibold text-gray-600">
                          Email
                        </label>
                        <p className="mt-1 text-sm text-gray-800">
                          {user?.email || "Not provided"}
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <label className="text-sm font-semibold text-gray-600">
                          Location
                        </label>
                        <p className="mt-1 text-sm text-gray-800">
                          {user?.location || "Not provided"}
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <label className="text-sm font-semibold text-gray-600">
                          Account Type
                        </label>
                        <p className="mt-1 text-sm text-gray-800">
                          {user?.isPremium ? "Premium User" : "Free User"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills & Education Tab */}
                {activeTab === "skills_and_education" && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Skills
                      </h3>
                      {user?.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-md text-sm border border-sky-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No skills added yet.</p>
                      )}
                    </div>
                    <div className="mt-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Education
                      </h3>
                      {user?.education?.length > 0 ? (
                        <div className="space-y-4">
                          {user.education.map((edu, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <h4 className="font-semibold text-gray-900">
                                {edu.study}
                              </h4>
                              <p className="text-sky-600 text-sm mt-1">
                                {edu.institution}
                              </p>
                              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {edu.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(edu.startDate)} -{" "}
                                  {formatDate(edu.endDate)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No education added yet.</p>
                      )}
                    </div>
                  </>
                )}

                {/* Experience Tab */}
                {activeTab === "experience" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Work Experience
                    </h3>
                    {user?.experience?.length > 0 ? (
                      <div className="space-y-4">
                        {user.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {exp.jobTitle}
                                </h4>
                                <p className="text-sky-600 text-sm mt-1">
                                  {exp.company}
                                </p>
                              </div>
                              {exp.isCurrent && (
                                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {exp.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(exp.startDate)} -{" "}
                                {exp.isCurrent
                                  ? "Present"
                                  : formatDate(exp.endDate)}
                              </div>
                            </div>
                            {exp.description && exp.description.length > 0 && (
                              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                                {exp.description.map((desc, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-sky-600">•</span>
                                    <span>{desc}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No work experience added yet.
                      </p>
                    )}
                  </div>
                )}

                {/* Certifications Tab */}
                {activeTab === "certifications" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Certifications
                    </h3>
                    {user?.certifications?.length > 0 ? (
                      <div className="space-y-4">
                        {user.certifications.map((cert, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex gap-3">
                              <div className="p-2 bg-sky-50 rounded-lg h-fit">
                                <Award className="w-5 h-5 text-sky-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                  {cert.name}
                                </h4>
                                <p className="text-sky-600 text-sm mt-1">
                                  {cert.issuer}
                                </p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(cert.date)}
                                </div>
                                {cert.link && (
                                  <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-3 text-sky-600 hover:text-sky-700 text-sm font-medium"
                                  >
                                    View Certificate
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No certifications added yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Resume Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sky-600" />
                    Resume
                  </h3>
                  {user?.resume && user.resume !== "" && (
                    <a
                      href={user.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {user?.resume && user.resume !== "" ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden h-full w-full">
                    <iframe
                      src={user.resume}
                      className="w-full h-full object-contain min-h-120"
                      title="Resume"
                      style={{ border: "none" }}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No resume uploaded</p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-3 text-sky-600 hover:text-sky-700 text-sm font-medium"
                    >
                      Upload Resume
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
