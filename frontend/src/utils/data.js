import {
  Search,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Award,
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  Plus,
} from "lucide-react";

export const jobSeekerFeatures = [
  {
    icon: Search,
    title: "Smart Job Matching",
    description:
      "AI-powered algorithm matches you with relevant opportunities based on your skills and preferences.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Create professional resumes with our intuitive builder and templates designed by experts.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description:
      "Connect directly with hiring managers and recruiters through our secure messaging platform.",
  },
  {
    icon: Award,
    title: "Skill Assessment",
    description:
      "Showcase your abilities with verified skill tests and earn badges that employers trust.",
  },
];

export const employerFeatures = [
  {
    icon: Users,
    title: "Talent Pool Access",
    description:
      "Access our vast database of pre-screened candidates and find the perfect fit for your team.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track your hiring performance with detailed analytics and insights on candidate engagement.",
  },
  {
    icon: Shield,
    title: "Verified Candidates",
    description:
      "All candidates undergo background verification to ensure you're hiring trustworthy professionals.",
  },
  {
    icon: Clock,
    title: "Quick Hiring",
    description:
      "Streamlined hiring process reduces time-to-hire by 60% with automated screening tools.",
  },
];

// Navigation items configuration
export const NAVIGATION_MENU_EMPLOYER = [
  { id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "employer-profile", name: "Company Profile", icon: Building2 },
  { id: "manage-jobs", name: "Manage Jobs", icon: BriefcaseBusiness },
  { id: "post-job", name: "Post Job", icon: Plus },
  { id: "EmployerChatBox", name: "Messages", icon: MessageSquare },
];
export const NAVIGATION_MENU_ADMIN = [
  { id: "admin-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "admin-users", name: "Manage Users", icon: Users },
  { id: "admin-jobs", name: "Manage Jobs", icon: BriefcaseBusiness },
  { id: "admin-chat", name: "Messages", icon: MessageSquare },
];
// Categories and job types
export const CATEGORIES = [
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "IT & Software", label: "IT & Software" },
  { value: "Customer-service", label: "Customer Service" },
  { value: "Product", label: "Product" },
  { value: "Operations", label: "Operations" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "Human Resources" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
  { value: "Other", label: "Other" },
];

export const JOB_TYPES = [
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

// Nepal locations data
export const NEPAL_LOCATIONS = [
  // Bagmati Province
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Kirtipur",
  "Madhyapur Thimi",
  "Hetauda",
  "Bharatpur",
  "Chitwan",
  "Bidur",
  "Banepa",
  "Dhulikhel",
  "Panauti",

  // Gandaki Province
  "Pokhara",
  "Lekhnath",
  "Baglung",
  "Besisahar",
  "Gorkha",
  "Putalibazar",
  "Waling",

  // Koshi Province
  "Biratnagar",
  "Dharan",
  "Itahari",
  "Inaruwa",
  "Damak",
  "Mechinagar",
  "Bhadrapur",
  "Urlabari",
  "Belbari",
  "Ilam",

  // Madhesh Province
  "Birgunj",
  "Janakpur",
  "Kalaiya",
  "Gaur",
  "Rajbiraj",
  "Lahan",
  "Malangwa",
  "Jaleshwar",

  // Lumbini Province
  "Butwal",
  "Siddharthanagar",
  "Bhairahawa",
  "Tilottama",
  "Kapilvastu",
  "Tansen",
  "Sandhikharka",
  "Ghorahi",
  "Tulsipur",
  "Lamahi",

  // Karnali Province
  "Birendranagar",
  "Surkhet",
  "Manma",
  "Jumla",
  "Dailekh",

  // Sudurpashchim Province
  "Dhangadhi",
  "Bhimdatta",
  "Mahendranagar",
  "Tikapur",
  "Attariya",
  "Gulariya",
  "Rajapur",

  // Other notable locations
  "Nepalgunj",
  "Dadeldhura",
  "Charikot",
  "Diktel",
  "Phidim",
];

// job categories data
export const JOB_CATEGORIES = [
  // Technology
  "Software Engineering",
  "Information Technology",
  "Web Development",
  "Mobile App Development",
  "Data Science",
  "Data Analysis",
  "Artificial Intelligence",
  "Machine Learning",
  "Cybersecurity",
  "DevOps",
  "Cloud Computing",
  "QA / Testing",

  // Design & Creative
  "UI/UX Design",
  "Graphic Design",
  "Product Design",
  "Motion Graphics",
  "Video Editing",
  "Content Writing",
  "Copywriting",
  "Creative Direction",

  // Business & Management
  "Business Development",
  "Project Management",
  "Product Management",
  "Operations",
  "Administration",
  "Strategy",
  "Entrepreneurship",

  // Marketing & Sales
  "Marketing",
  "Digital Marketing",
  "SEO / SEM",
  "Social Media Marketing",
  "Performance Marketing",
  "Brand Management",
  "Public Relations",
  "Sales",
  "Inside Sales",
  "Field Sales",
  "Account Management",
  "Customer Success",

  // Finance & Legal
  "Finance",
  "Accounting",
  "Auditing",
  "Banking",
  "Investment",
  "Economics",
  "Legal",
  "Compliance",
  "Risk Management",

  // Human Resources
  "Human Resources",
  "Talent Acquisition",
  "Recruitment",
  "People Operations",
  "Training & Development",
  "Payroll",

  // Healthcare
  "Healthcare",
  "Nursing",
  "Medical Officer",
  "Pharmacy",
  "Public Health",
  "Laboratory Technician",
  "Mental Health",

  // Education & Research
  "Education",
  "Teaching",
  "Academic Research",
  "Training",
  "Curriculum Development",
  "E-learning",

  // Engineering (Non-Software)
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Electronics Engineering",
  "Industrial Engineering",

  // Manufacturing & Construction
  "Manufacturing",
  "Production",
  "Quality Control",
  "Supply Chain",
  "Logistics",
  "Construction",
  "Site Engineering",
  "Procurement",

  // Hospitality & Tourism
  "Hospitality",
  "Hotel Management",
  "Travel & Tourism",
  "Aviation",
  "Food & Beverage",

  // Media & Communication
  "Media",
  "Journalism",
  "Broadcasting",
  "Corporate Communication",

  // Agriculture & Environment
  "Agriculture",
  "Agribusiness",
  "Veterinary",
  "Forestry",
  "Environmental Science",

  // Customer & Support
  "Customer Service",
  "Customer Support",
  "Call Center",
  "Technical Support",

  // Miscellaneous
  "Consulting",
  "Research",
  "Non-Profit / NGO",
  "Government",
  "Security",
  "Skilled Labor",
];
