import { useState } from "react";
import { UserPlus, FileSearch, Send, CheckCircle, Building2, FileText, Users2, Handshake } from "lucide-react";

const HowItWorks = () => {
  const [userType, setUserType] = useState("jobSeeker");

  const jobSeekerSteps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Create Profile",
      description: "Sign up and build your professional profile in minutes"
    },
    {
      icon: <FileSearch className="w-8 h-8" />,
      title: "Browse Jobs",
      description: "Explore verified job listings matched to your skills"
    },
    {
      icon: <Send className="w-8 h-8" />,
      title: "Apply Instantly",
      description: "One-click applications with your saved profile"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Get Hired",
      description: "Connect with employers and land your dream job"
    }
  ];

  const employerSteps = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Register Company",
      description: "Create your company profile and get verified"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Post Jobs",
      description: "List job openings with detailed requirements"
    },
    {
      icon: <Users2 className="w-8 h-8" />,
      title: "Review Candidates",
      description: "Get AI-ranked applications from qualified candidates"
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Hire Talent",
      description: "Connect with top candidates and build your team"
    }
  ];

  const steps = userType === "jobSeeker" ? jobSeekerSteps : employerSteps;

  return (
    <section className="py-16 px-4 bg-linear-to-b from-sky-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sky-600 text-xs font-bold tracking-widest uppercase mb-3">
            How It Works
          </p>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-gray-900 mb-6">
            Get Started in 4 Simple Steps
          </h2>

          {/* User Type Toggle */}
          <div className="inline-flex items-center gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setUserType("jobSeeker")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                userType === "jobSeeker"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setUserType("employer")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                userType === "employer"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              For Employers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative text-center">
              <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                {step.icon}
              </div>
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-sky-200 -z-10 hidden lg:block last:hidden" />
              <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
