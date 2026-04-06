import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Crown,
  Loader,
  MapPin,
  Facebook,
  Instagram,
  Calendar,
  ExternalLink,
  BriefcaseBusiness,
  GraduationCap,
  Award,
  User,
  FileText,
  ChevronRight,
  ShieldCheck,
  X,
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.PROFILE.GET_USER_BY_ID(userId),
        );
        setUser(response.data);
      } catch {
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="animate-spin w-10 h-10 text-sky-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <div className="text-center max-w-sm flex flex-col items-center">
            <div className="w-24 h-24 bg-linear-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-200/50 shadow-xs">
              <User className="w-12 h-12 text-gray-400" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              User not found
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We couldn't find the profile you're looking for. It may have been
              deleted or the URL might be incorrect.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl transition-all duration-200 active:scale-95 shadow-md shadow-gray-200"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Go back </span>
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show admin badge
  const getUserRoleDisplay = () => {
    if (user.role === "admin") return "Admin";
    return user.role === "employer" ? "Employer" : "Job Seeker";
  };

  const getRoleBadgeClass = () => {
    if (user.role === "admin") return "bg-red-100 text-red-700";
    if (user.role === "employer") return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  if (user.role === "admin") {
    return (
      <DashboardLayout>
        <div className="min-h-[90vh] flex items-center justify-center bg-gray-50/50 p-6">
          <div className="max-w-md w-full">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 overflow-hidden border border-gray-100">
              <div className="px-8 pb-10 text-center">
                <div className="relative py-10 flex justify-center">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <img
                      src={user.avatar || "/default.png"}
                      alt={user.name}
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-gray-50"
                    />
                  </div>
                </div>
                <div className="space-y-1 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-2">
                    {user.name}
                  </h2>
                  <p className="text-gray-500 font-medium">{user.email}</p>
                </div>
                <span className="inline-flex items-center p-2 rounded-full text-xs font-medium bg-linear-to-r from-sky-100 to-sky-200 text-sky-600 border border-sky-300 shadow-sm">
                  <ShieldCheck className="w-4 h-4 mr-1 text-sky-600" />
                  Admin Support
                </span>
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <button
                    onClick={() => navigate(-1)}
                    className="group w-full flex items-center justify-center gap-2 bg-sky-600 text-white px-6 py-4 rounded-2xl hover:bg-sky-700 transition-all duration-300 shadow-lg shadow-gray-200 active:scale-[0.98]"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">Go Back</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-6xl">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="h-24 flex justify-end items-center px-4 bg-sky-600 relative">
              <button
                title="Back to previous page"
                onClick={() => {
                  navigate(-1);
                }}
                className="text-white flex items-center gap-2 bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-white/30 transition text-sm"
              >
                <X className="w-4 h-4" />
                <span className="hidden xs:inline">Cancel</span>
              </button>
            </div>

            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-6 mb-4 gap-4">
                <div className="flex flex-col items-start sm:flex-row sm:items-end z-10 gap-2">
                  <img
                    src={user.avatar || "/default.png"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover bg-white shadow-sm"
                  />
                  <div className="pb-1">
                    <h2 className="flex gap-1 items-center sm:text-2xl font-semibold text-gray-900 leading-tight">
                      {user.name || ""}
                      {user.isPremium && (
                        <span
                          title="Premium User"
                          className="p-1 rounded-full text-white bg-yellow-400 text-sm font-semibold"
                        >
                          <Crown className="w-4 h-4" />
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p
                      className={`text-xs mt-1 px-2 py-0.5 inline-block rounded-full ${getRoleBadgeClass()}`}
                    >
                      {getUserRoleDisplay()}
                    </p>
                  </div>
                </div>
                <div className="pb-1">
                  {!user.isPremium && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-sm font-medium">
                      <User className="w-3.5 h-3.5" />
                      Free User
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 border-t border-gray-100 pt-4">
                {user.location && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    {user.location}
                  </span>
                )}
                {user.facebookLink && (
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
                {user.instagramLink && (
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
                {user.role === "employer" && (
                  <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2">
                    <img
                      src={user.companyLogo || "/default.png"}
                      alt={user.companyName}
                      className="w-24 h-24 rounded-2xl object-contain bg-white shadow-sm"
                    />
                    <p className="flex items-center gap-1 sm:text-2xl font-semibold text-gray-900 leading-tight">
                      {user?.companyName || "N/A"}
                      {user.role === "employer" && user.isCompanyVerified && (
                        <span
                          title="Verified Company"
                          className="p-1 rounded-full text-sky-500 text-sm font-semibold"
                        >
                          <BadgeCheck className="w-5 h-5" />
                        </span>
                      )}
                    </p>
                    {user.role === "employer" && user.companyWebsiteLink && (
                      <a
                        href={user.companyWebsiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>
              {user.role === "employer" && user.companyDescription && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-justify text-gray-700">
                    {user.companyDescription}
                  </p>
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

                      // Hide employer irrelevant tabs
                      if (user.role === "employer" && tab.id !== "about")
                        return null;

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
                      ]
                        .filter(Boolean)
                        .map(({ label, value }) => (
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
                                    {edu.location && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {edu.location}
                                      </span>
                                    )}
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
                                <BriefcaseBusiness className="w-4 h-4 text-sky-600" />
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
                                  {exp.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {exp.location}
                                    </span>
                                  )}
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
                {user.role === "jobSeeker" && (
                  <>
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
                      </div>
                    )}
                  </>
                )}

                {user.role === "employer" && (
                  <div className="space-y-4">
                    {user.companyName && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                          Company
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {user.companyName}
                        </p>
                      </div>
                    )}
                    {user.companySize && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                          Company Size
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {user.companySize}
                        </p>
                      </div>
                    )}
                    {user.stats && user.stats.postedJobs != null && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                          Jobs Posted
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {user.stats.postedJobs} jobs
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
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

export default UserProfilePage;
