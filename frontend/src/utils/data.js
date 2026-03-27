import {
  Users,
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  Plus,
  Edit3,
} from "lucide-react";

// Navigation items configuration
export const NAVIGATION_MENU_EMPLOYER = [
  { id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "employer-profile", name: "Company Profile", icon: Building2 },
  { id: "manage-jobs", name: "Manage Jobs", icon: BriefcaseBusiness },
  { id: "post-job", name: "Post Job", icon: Plus },
];
export const NAVIGATION_MENU_ADMIN = [
  { id: "admin-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "edit-admin-profile", name: "Edit Profile", icon: Edit3 },
  { id: "admin-users-management", name: "Manage Users", icon: Users },
  {
    id: "admin-company-verification",
    name: "Company Verification",
    icon: Building2,
  },
  { id: "admin-jobs-management", name: "Manage Jobs", icon: BriefcaseBusiness },
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

export const REQUIRED_EXPERIENCE_LEVEL = [
  { value: "Internship", label: "Internship" },
  { value: "Entry level", label: "Entry level" },
  {
    value: "Mid-Senior level (2-5 years)",
    label: "Mid-Senior level (2-5 years)",
  },
  { value: "Senior level (5 year plus)", label: "Senior level (5 year plus)" },
  { value: "Executive level", label: "Executive level" },
  { value: "Not Applicable", label: "Not Applicable" },
];

export const REQUIRED_EDUCATION_LEVEL = [
  { value: "High School or equivalent", label: "High School or equivalent" },
  { value: "Certification", label: "Certification" },
  { value: "Professional Certification", label: "Professional Certification" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "Doctorate/Phd Level", label: "Doctorate/Phd Level" },
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

export const SAMPLE_PROFILES = {
  "Senior Backend Engineer (Node.js)": {
    facebookLink: "https://facebook.com",
    instagramLink: "https://instagram.com",
    skills: [
      "Node.js",
      "Express.js",
      "NestJS",
      "Microservices",
      "Redis",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "Kubernetes",
      "AWS (Lambda, S3, EC2)",
      "GraphQL",
      "Socket.io",
      "Jest",
      "CI/CD (GitHub Actions)",
    ],
    education: [
      {
        study: "B.E. in Computer Engineering",
        institution: "Pulchowk Campus (IOE)",
        location: "Lalitpur",
        startDate: "2016-11-01",
        endDate: "2020-12-15",
      },
    ],
    experience: [
      {
        jobTitle: "Senior Backend Developer",
        company: "CloudScale Solutions",
        location: "Remote",
        startDate: "2021-01-01",
        endDate: "",
        isCurrent: true,
        description: [
          "Architected a scalable microservices system using NestJS and RabbitMQ handling 50k+ daily active users.",
          "Reduced server response time by 60% by implementing a multi-layer caching strategy with Redis.",
          "Led the migration from a monolithic architecture to Dockerized microservices on AWS EKS.",
          "Mentored a team of 3 junior developers and conducted weekly code reviews.",
        ],
      },
      {
        jobTitle: "Backend Developer",
        company: "WebSoft Nepal",
        location: "Kathmandu",
        startDate: "2019-06-01",
        endDate: "2020-12-30",
        isCurrent: false,
        description: [
          "Developed RESTful APIs for a high-traffic e-commerce platform using Express.js.",
          "Integrated third-party payment gateways including eSewa, Khalti, and Stripe.",
          "Optimized MongoDB queries which decreased database load by 35%.",
        ],
      },
    ],
    certifications: [
      {
        name: "AWS Certified Developer – Associate",
        issuer: "Amazon",
        date: "2022-05-10",
        link: "https://aws.amazon.com/verify/1",
      },
      {
        name: "Node.js Application Developer (JSNAD)",
        issuer: "OpenJS Foundation",
        date: "2021-08-15",
        link: "https://openjsf.org/verify/2",
      },
      {
        name: "MongoDB Professional Certification",
        issuer: "MongoDB University",
        date: "2020-02-20",
        link: "https://mongodb.com/verify/3",
      },
    ],
  },
  "Enterprise Java Developer": {
    facebookLink: "https://facebook.com",
    instagramLink: "https://instagram.com",
    skills: [
      "Java 17",
      "Spring Boot",
      "Spring Security",
      "Hibernate (JPA)",
      "Apache Kafka",
      "Oracle DB",
      "JUnit 5",
      "Maven",
      "Jenkins",
      "Microservices",
      "OAuth2",
      "ELK Stack",
    ],
    education: [
      {
        study: "Master of Computer Science",
        institution: "Tribhuvan University",
        location: "Kirtipur",
        startDate: "2018-02-01",
        endDate: "2020-03-01",
      },
    ],
    experience: [
      {
        jobTitle: "Java Software Engineer",
        company: "Global Fintech Systems",
        location: "Kathmandu",
        startDate: "2020-04-15",
        endDate: "",
        isCurrent: true,
        description: [
          "Developed core banking modules for transaction processing using Spring Boot and Hibernate.",
          "Implemented secure authentication and authorization protocols using Spring Security and JWT.",
          "Utilized Apache Kafka for real-time data streaming between microservices.",
          "Optimized complex SQL queries in Oracle DB to improve report generation speed by 50%.",
        ],
      },
    ],
    certifications: [
      {
        name: "Oracle Certified Professional: Java SE 11 Developer",
        issuer: "Oracle",
        date: "2021-01-12",
        link: "https://oracle.com/verify/java",
      },
      {
        name: "Spring Certified Professional",
        issuer: "VMware",
        date: "2022-11-30",
        link: "https://vmware.com/verify/spring",
      },
    ],
  },
  "Full Stack MERN Developer": {
    facebookLink: "https://facebook.com",
    instagramLink: "https://instagram.com",
    skills: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "Redux Toolkit",
      "Tailwind CSS",
      "Next.js",
      "Firebase",
      "Vercel",
      "Mongoose",
      "TypeScript",
      "Postman",
    ],
    education: [
      {
        study: "B.Sc. CSIT",
        institution: "Prithvi Narayan Campus",
        location: "Pokhara",
        startDate: "2017-09-01",
        endDate: "2021-11-20",
      },
    ],
    experience: [
      {
        jobTitle: "Full Stack Developer",
        company: "Digital Nepal Agency",
        location: "Kathmandu / Remote",
        startDate: "2022-01-10",
        endDate: "",
        isCurrent: true,
        description: [
          "Built and deployed 5+ full-stack web applications using the MERN stack with 99% uptime.",
          "Integrated Redux Toolkit for efficient state management in large-scale React applications.",
          "Implemented SEO best practices using Next.js, resulting in a 40% increase in organic traffic.",
          "Managed database schemas and data migration using Mongoose ODM.",
        ],
      },
    ],
    certifications: [
      {
        name: "Meta Front-End Developer Professional Certificate",
        issuer: "Coursera/Meta",
        date: "2022-06-05",
        link: "https://coursera.org/meta/frontend",
      },
      {
        name: "Complete React Developer (Redux, Hooks, GraphQL)",
        issuer: "Udemy",
        date: "2021-12-15",
        link: "https://udemy.com/react-cert",
      },
    ],
  },
  "Senior Bank Cashier / Teller": {
    facebookLink: "https://facebook.com",
    instagramLink: "https://instagram.com",
    skills: [
      "Cash Handling",
      "T24 Banking Software",
      "KYC Compliance",
      "Customer Relationship Management (CRM)",
      "Financial Reporting",
      "AML (Anti-Money Laundering) Detection",
      "Microsoft Excel",
      "Cross-selling",
    ],
    education: [
      {
        study: "Bachelor of Business Studies (BBS)",
        institution: "Lumbini Banijya Campus",
        location: "Butwal",
        startDate: "2015-07-01",
        endDate: "2019-06-30",
      },
    ],
    experience: [
      {
        jobTitle: "Senior Cashier",
        company: "Nabil Bank Ltd.",
        location: "Butwal Branch",
        startDate: "2020-02-01",
        endDate: "",
        isCurrent: true,
        description: [
          "Processing an average of 150+ cash and cheque transactions daily with 100% accuracy.",
          "Ensuring strict adherence to NRB (Nepal Rastra Bank) guidelines and internal KYC/AML policies.",
          "Reconciling the cash drawer at the end of every shift and managing vault cash supply.",
          "Providing excellent customer service and resolving account-related queries for walk-in clients.",
        ],
      },
    ],
    certifications: [
      {
        name: "Anti-Money Laundering (AML) Specialist",
        issuer: "NRB Certified Program",
        date: "2021-05-10",
        link: "",
      },
      {
        name: "Excellence in Customer Service",
        issuer: "Bank Training Center",
        date: "2022-09-15",
        link: "",
      },
    ],
  },
  "Heavy Vehicle Driver": {
    facebookLink: "https://facebook.com",
    instagramLink: "https://instagram.com",
    skills: [
      "Long-haul Driving",
      "Heavy Truck Operation",
      "Vehicle Maintenance",
      "Route Optimization",
      "Loading/Unloading Safety",
      "Logistics Coordination",
      "Emergency Repairs",
      "GPS Navigation",
    ],
    education: [
      {
        study: "Secondary School Education (SLC)",
        institution: "Shree Jana Jyoti Secondary School",
        location: "Chitwan",
        startDate: "2010-04-10",
        endDate: "2012-03-25",
      },
    ],
    experience: [
      {
        jobTitle: "Senior Logistics Driver",
        company: "Nepal Cargo Services",
        location: "Chitwan - Birgunj Route",
        startDate: "2018-05-01",
        endDate: "",
        isCurrent: true,
        description: [
          "Operating 18-wheeler trucks for long-haul transport across difficult mountainous terrain.",
          "Maintaining a 100% accident-free record over 6 years of professional driving.",
          "Performing routine mechanical inspections and minor roadside repairs to ensure schedule adherence.",
          "Managing delivery documentation, invoices, and fuel logs accurately.",
        ],
      },
      {
        jobTitle: "Delivery Driver",
        company: "Local Supply Chain Inc.",
        location: "Bharatpur",
        startDate: "2014-01-15",
        endDate: "2018-04-20",
        isCurrent: false,
        description: [
          "Handled local distribution of fast-moving consumer goods (FMCG) to retailers.",
          "Assisted in manual loading and inventory verification during deliveries.",
        ],
      },
    ],
    certifications: [
      {
        name: "Heavy Equipment Operator License (Category G)",
        issuer: "Department of Transport Management",
        date: "2015-06-20",
        link: "",
      },
      {
        name: "Defensive Driving Certification",
        issuer: "National Safety Council",
        date: "2022-02-14",
        link: "",
      },
    ],
  },
};
