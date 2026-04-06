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
  ChevronRight,
  Briefcase,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import EditUserProfile from "./EditUserProfile";
import { Link } from "react-router-dom";

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
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="h-24 bg-sky-600 relative">
              <button
                onClick={() => setEditMode(true)}
                className="absolute top-4 right-4 text-white flex items-center gap-2 bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-white/30 transition text-sm"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            <div className="px-2 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-10 mb-4 gap-4">
                <div className="flex items-end gap-2 z-10">
                  <img
                    src={user?.avatar || "/default.png"}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full object-cover bg-white shadow-sm"
                  />
                  <div className="pb-1">
                    <h2 className="flex gap-1 items-center text-2xl font-semibold text-gray-900 leading-tight">
                      {user?.name || ""}
                      {user?.isPremium && (
                        <span
                          title="You are a premium user"
                          className="p-1 rounded-full text-white bg-yellow-400 text-sm font-semibold"
                        >
                          <Crown className="w-4 h-4" />
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="pb-1">
                  {!user?.isPremium && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-sm font-medium">
                        <User className="w-3.5 h-3.5" />
                        Free User
                      </span>
                      <Link
                        to="/pricing"
                        className="text-sm text-sky-600 hover:text-sky-700 font-medium underline underline-offset-2"
                      >
                        Upgrade →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              {(user?.location ||
                user?.facebookLink ||
                user?.instagramLink) && (
                <div className="flex flex-wrap items-center gap-4 mt-2 border-t border-gray-100 pt-4">
                  {user?.location && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-sky-500" />
                      {user.location}
                    </span>
                  )}
                  {user?.facebookLink && (
                    <a
                      href={user.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                  {user?.instagramLink && (
                    <a
                      href={user.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Tab Bar */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="flex min-w-max">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                            isActive
                              ? "border-sky-500 text-sky-600 bg-sky-50/50"
                              : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
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

              <div className="bg-white rounded-xl shadow-sm p-6">
                {/* ABOUT */}
                {activeTab === "about" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 bg-sky-500 rounded-full inline-block" />
                      About
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Email", value: user?.email },
                        { label: "Location", value: user?.location },
                        {
                          label: "Account Type",
                          value: user?.isPremium ? "Premium User" : "Free User",
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                        >
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                            {label}
                          </p>
                          <p className="text-sm text-gray-800 font-medium">
                            {value || "Not provided"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SKILLS & EDUCATION */}
                {activeTab === "skills_and_education" && (
                  <div className="space-y-8">
                    {/* Skills */}
                    <section>
                      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full inline-block" />
                        Skills
                      </h3>
                      {user?.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-sm border border-sky-200 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <EmptyState label="No skills added yet." />
                      )}
                    </section>

                    {/* Education */}
                    <section>
                      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full inline-block" />
                        Education
                      </h3>
                      {user?.education?.length > 0 ? (
                        <div className="space-y-3">
                          {user.education.map((edu, i) => (
                            <TimelineCard key={i}>
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-sky-50 rounded-lg shrink-0">
                                  <GraduationCap className="w-4 h-4 text-sky-600" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {edu.study}
                                  </p>
                                  <p className="text-sky-600 text-sm mt-0.5">
                                    {edu.institution}
                                  </p>
                                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {edu.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(edu.startDate)} –{" "}
                                      {formatDate(edu.endDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TimelineCard>
                          ))}
                        </div>
                      ) : (
                        <EmptyState label="No education added yet." />
                      )}
                    </section>
                  </div>
                )}

                {/* EXPERIENCE */}
                {activeTab === "experience" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <span className="w-1 h-5 bg-sky-500 rounded-full inline-block" />
                      Work Experience
                    </h3>
                    {user?.experience?.length > 0 ? (
                      <div className="space-y-3">
                        {user.experience.map((exp, i) => (
                          <TimelineCard key={i}>
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-sky-50 rounded-lg shrink-0">
                                <Briefcase className="w-4 h-4 text-sky-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {exp.jobTitle}
                                    </p>
                                    <p className="text-sky-600 text-sm mt-0.5">
                                      {exp.company}
                                    </p>
                                  </div>
                                  {exp.isCurrent && (
                                    <span className="shrink-0 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-200 font-medium">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {exp.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(exp.startDate)} –{" "}
                                    {exp.isCurrent
                                      ? "Present"
                                      : formatDate(exp.endDate)}
                                  </span>
                                </div>
                                {exp.description?.length > 0 && (
                                  <ul className="mt-3 space-y-1">
                                    {exp.description.map((desc, j) => (
                                      <li
                                        key={j}
                                        className="flex gap-2 text-sm text-gray-700"
                                      >
                                        <ChevronRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                                        <span>{desc}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </TimelineCard>
                        ))}
                      </div>
                    ) : (
                      <EmptyState label="No work experience added yet." />
                    )}
                  </div>
                )}

                {/* CERTIFICATIONS */}
                {activeTab === "certifications" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <span className="w-1 h-5 bg-sky-500 rounded-full inline-block" />
                      Certifications
                    </h3>
                    {user?.certifications?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {user.certifications.map((cert, i) => (
                          <div
                            key={i}
                            className="border border-gray-100 rounded-xl p-4 hover:bg-sky-50/40 hover:border-sky-200 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                                <Award className="w-4 h-4 text-sky-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 text-sm leading-snug">
                                  {cert.name}
                                </p>
                                <p className="text-sky-600 text-xs mt-1">
                                  {cert.issuer}
                                </p>
                                <p className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(cert.date)}
                                </p>
                                {cert.link && (
                                  <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-2.5 text-xs text-sky-600 hover:text-sky-700 font-semibold"
                                  >
                                    View Certificate
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState label="No certifications added yet." />
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    Resume
                  </h3>
                  {user?.resume && user.resume !== "" && (
                    <a
                      href={user.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open
                    </a>
                  )}
                </div>

                {user?.resume && user.resume !== "" ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden h-full w-full">
                    <iframe
                      src={user.resume}
                      className="w-full h-full min-h-120 object-contain"
                      title="Resume"
                      style={{ border: "none" }}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">
                      No resume uploaded
                    </p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-3 inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-semibold"
                    >
                      Upload Resume
                      <ChevronRight className="w-4 h-4" />
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

const TimelineCard = ({ children }) => (
  <div className="border border-gray-100 rounded-xl p-4 hover:border-sky-200 hover:bg-sky-50/30 transition-colors">
    {children}
  </div>
);

const EmptyState = ({ label }) => (
  <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
    {label}
  </p>
);

export default UserProfile;
