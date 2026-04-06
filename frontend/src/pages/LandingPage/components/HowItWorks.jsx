import { useState } from "react";
import {
  UserPlus,
  FileSearch,
  Send,
  CheckCircle,
  Building2,
  FileText,
  Users2,
  Handshake,
} from "lucide-react";

const HowItWorks = () => {
  const [userType, setUserType] = useState("jobSeeker");

  const jobSeekerSteps = [
    {
      icon: <UserPlus className="w-7 h-7" />,
      title: "Create Profile",
      description: "Sign up and build your professional profile in minutes",
    },
    {
      icon: <FileSearch className="w-7 h-7" />,
      title: "Browse Jobs",
      description: "Explore verified job listings matched to your skills",
    },
    {
      icon: <Send className="w-7 h-7" />,
      title: "Apply Instantly",
      description: "One-click applications with your saved profile",
    },
    {
      icon: <CheckCircle className="w-7 h-7" />,
      title: "Get Hired",
      description: "Connect with employers and land your dream job",
    },
  ];

  const employerSteps = [
    {
      icon: <Building2 className="w-7 h-7" />,
      title: "Register Company",
      description: "Create your company profile and get verified",
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Post Jobs",
      description: "List job openings with detailed requirements",
    },
    {
      icon: <Users2 className="w-7 h-7" />,
      title: "Review Candidates",
      description: "Get AI-ranked applications from qualified candidates",
    },
    {
      icon: <Handshake className="w-7 h-7" />,
      title: "Hire Talent",
      description: "Connect with top candidates and build your team",
    },
  ];

  const steps = userType === "jobSeeker" ? jobSeekerSteps : employerSteps;

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label">How It Works</p>
          <h2 className="section-title">Get Started in 4 Simple Steps</h2>

          <div className="inline-flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 mt-4">
            <button
              onClick={() => setUserType("jobSeeker")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                userType === "jobSeeker"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setUserType("employer")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                userType === "employer"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Employers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative text-center">
              <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-sm">
                {step.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
