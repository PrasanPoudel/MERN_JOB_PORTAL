class TFIDFSimilarity {
  static STOPWORDS = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "is",
    "are",
    "was",
    "were",
    "been",
    "be",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "what",
    "which",
    "who",
    "when",
    "where",
    "why",
    "how",
    "all",
    "each",
    "every",
    "both",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "same",
    "so",
    "than",
    "too",
    "very",
    "just",
    "as",
    "if",
    "about",
  ]);

  static SYNONYMS = {
    backend: [
      "backend",
      "back-end",
      "server",
      "api",
      "rest",
      "graphql",
      "microservices",
      "distributed systems",
      "server-side",
      "application server",
      "service layer",
    ],
    frontend: [
      "frontend",
      "front-end",
      "ui",
      "ux",
      "client",
      "client-side",
      "web interface",
      "spa",
      "responsive design",
    ],
    fullstack: [
      "fullstack",
      "full-stack",
      "full stack",
      "end-to-end",
      "e2e",
      "cross-functional engineer",
    ],
    javascript: ["javascript", "js", "ecmascript", "es6", "esnext"],
    typescript: ["typescript", "ts"],
    python: ["python", "py"],
    java: ["java", "j2ee", "spring java"],
    csharp: ["c#", "dotnet", ".net", "asp.net"],
    cpp: ["c++"],
    go: ["golang", "go"],
    rust: ["rust"],
    php: ["php"],
    kotlin: ["kotlin"],
    swift: ["swift"],
    react: ["react", "reactjs", "react.js", "next.js", "redux"],
    angular: ["angular", "angularjs"],
    vue: ["vue", "vuejs", "nuxt"],
    svelte: ["svelte"],
    html: ["html", "html5"],
    css: ["css", "css3", "scss", "sass", "less", "tailwind", "bootstrap"],
    nodejs: ["nodejs", "node.js", "node"],
    express: ["express", "expressjs"],
    nestjs: ["nestjs"],
    django: ["django"],
    flask: ["flask"],
    spring: ["spring", "spring boot", "spring framework"],
    laravel: ["laravel"],
    rails: ["ruby on rails", "rails"],
    aspnet: ["asp.net", "aspnet core"],
    database: ["database", "db", "data storage"],
    sql: ["sql", "mysql", "postgresql", "mssql", "oracle db"],
    nosql: ["nosql", "mongodb", "redis", "cassandra", "dynamodb", "firebase"],
    devops: [
      "devops",
      "ci/cd",
      "continuous integration",
      "continuous delivery",
    ],
    aws: ["aws", "amazon web services"],
    azure: ["azure", "microsoft azure"],
    gcp: ["gcp", "google cloud", "google cloud platform"],
    docker: ["docker", "containerization"],
    kubernetes: ["kubernetes", "k8s"],
    terraform: ["terraform", "iac", "infrastructure as code"],
    linux: ["linux", "unix"],
    architect: [
      "architect",
      "software architect",
      "solution architect",
      "technical architect",
      "enterprise architect",
    ],
    microservices: ["microservices", "event-driven architecture"],
    monolith: ["monolith", "monolithic architecture"],
    ddd: ["domain driven design", "ddd"],
    tdd: ["tdd", "test driven development"],
    oop: ["oop", "object oriented programming"],
    functional: ["functional programming", "fp"],
    developer: [
      "developer",
      "engineer",
      "software engineer",
      "programmer",
      "coder",
      "application developer",
    ],
    junior: ["junior", "jr", "entry level", "associate"],
    mid: ["mid", "mid-level", "intermediate"],
    senior: ["senior", "sr", "lead developer", "principal engineer"],
    lead: ["lead", "tech lead", "technical lead", "team lead"],
    manager: ["engineering manager", "em", "tech manager"],
    qa: ["qa", "quality assurance", "test engineer", "sdet"],
    sre: ["sre", "site reliability engineer"],
    data_engineer: ["data engineer", "etl developer", "data pipeline engineer"],
    data_scientist: [
      "data scientist",
      "ml engineer",
      "machine learning engineer",
    ],
    mobile: ["mobile developer", "ios developer", "android developer"],
    security: [
      "security engineer",
      "application security",
      "cybersecurity engineer",
    ],
    executive: [
      "executive",
      "c-level",
      "cxo",
      "chief officer",
      "ceo",
      "cto",
      "cfo",
      "coo",
      "cio",
      "cmo",
      "cro",
      "founder",
      "cofounder",
      "co-founder",
      "president",
      "vice president",
      "vp",
      "svp",
      "evp",
      "managing director",
      "md",
      "general manager",
      "gm",
      "board member",
      "chairman",
      "chairperson",
    ],

    manager: [
      "manager",
      "management",
      "team lead",
      "department head",
      "supervisor",
      "director",
      "head of",
      "practice lead",
      "area manager",
      "regional manager",
      "operations manager",
      "line manager",
      "section head",
    ],

    consultant: [
      "consultant",
      "advisor",
      "specialist",
      "subject matter expert",
      "sme",
      "strategy consultant",
      "business consultant",
      "management consultant",
      "independent consultant",
      "external advisor",
    ],

    project_manager: [
      "project manager",
      "pm",
      "program manager",
      "delivery manager",
      "scrum master",
      "agile coach",
      "implementation manager",
      "engagement manager",
      "transition manager",
    ],

    product_manager: [
      "product manager",
      "product owner",
      "product lead",
      "product strategist",
      "group product manager",
      "gpm",
      "product director",
      "head of product",
      "chief product officer",
    ],

    business_analyst: [
      "business analyst",
      "ba",
      "systems analyst",
      "process analyst",
      "functional analyst",
      "requirements analyst",
      "solution analyst",
    ],

    operations: [
      "operations",
      "ops",
      "business operations",
      "operational lead",
      "operations director",
      "operations executive",
      "supply chain manager",
      "logistics manager",
      "procurement manager",
    ],

    accountant: [
      "accountant",
      "chartered accountant",
      "cpa",
      "bookkeeper",
      "accounting specialist",
      "finance executive",
      "tax consultant",
      "tax advisor",
      "accounts manager",
    ],

    financial_analyst: [
      "financial analyst",
      "finance analyst",
      "investment analyst",
      "equity analyst",
      "portfolio analyst",
      "risk analyst",
      "credit analyst",
      "treasury analyst",
    ],

    banker: [
      "banker",
      "investment banker",
      "private banker",
      "relationship manager",
      "wealth manager",
      "loan officer",
      "mortgage advisor",
    ],

    auditor: [
      "auditor",
      "internal auditor",
      "external auditor",
      "compliance auditor",
      "forensic auditor",
      "it auditor",
    ],

    marketer: [
      "marketer",
      "marketing specialist",
      "marketing manager",
      "growth marketer",
      "brand manager",
      "brand strategist",
      "campaign manager",
      "marketing executive",
    ],

    digital_marketing: [
      "digital marketing",
      "performance marketing",
      "online marketing",
      "growth hacking",
      "paid media",
      "media buyer",
      "ppc specialist",
      "email marketer",
      "marketing automation",
    ],

    seo: [
      "seo",
      "search engine optimization",
      "seo specialist",
      "seo analyst",
      "technical seo",
      "search marketer",
      "sem specialist",
    ],

    sales: [
      "sales",
      "sales representative",
      "account executive",
      "account manager",
      "business development",
      "bdm",
      "sales manager",
      "sales executive",
      "territory manager",
      "inside sales",
      "outside sales",
    ],

    customer_success: [
      "customer success manager",
      "csm",
      "client success",
      "customer relationship manager",
      "crm manager",
      "account success manager",
    ],

    designer: [
      "designer",
      "creative designer",
      "visual designer",
      "graphic designer",
      "brand designer",
      "layout artist",
    ],

    ux_designer: [
      "ux designer",
      "ui designer",
      "product designer",
      "interaction designer",
      "experience designer",
      "service designer",
      "design lead",
    ],

    art_director: [
      "art director",
      "creative director",
      "design director",
      "head of design",
    ],

    content_creator: [
      "content creator",
      "copywriter",
      "editor",
      "content strategist",
      "technical writer",
      "blogger",
      "script writer",
      "ghostwriter",
    ],

    video_editor: [
      "video editor",
      "videographer",
      "film editor",
      "content producer",
      "multimedia producer",
    ],

    photographer: [
      "photographer",
      "photojournalist",
      "studio photographer",
      "commercial photographer",
    ],

    animator: [
      "animator",
      "motion designer",
      "3d artist",
      "vfx artist",
      "visual effects artist",
      "game artist",
    ],

    doctor: [
      "doctor",
      "physician",
      "medical doctor",
      "md",
      "general practitioner",
      "gp",
      "consultant physician",
      "specialist",
      "medical officer",
    ],

    nurse: [
      "nurse",
      "registered nurse",
      "rn",
      "nurse practitioner",
      "clinical nurse",
      "staff nurse",
      "head nurse",
    ],

    pharmacist: [
      "pharmacist",
      "clinical pharmacist",
      "retail pharmacist",
      "hospital pharmacist",
    ],

    therapist: [
      "therapist",
      "psychotherapist",
      "counselor",
      "clinical psychologist",
      "mental health specialist",
    ],

    dentist: ["dentist", "dental surgeon", "orthodontist", "oral surgeon"],

    lawyer: [
      "lawyer",
      "attorney",
      "legal counsel",
      "advocate",
      "solicitor",
      "barrister",
      "corporate lawyer",
      "litigation lawyer",
    ],

    paralegal: ["paralegal", "legal assistant", "legal executive", "law clerk"],

    compliance: [
      "compliance officer",
      "regulatory specialist",
      "risk compliance",
      "governance officer",
    ],

    teacher: [
      "teacher",
      "educator",
      "instructor",
      "school teacher",
      "faculty",
      "academic instructor",
    ],

    professor: [
      "professor",
      "lecturer",
      "associate professor",
      "assistant professor",
      "faculty member",
    ],

    researcher: [
      "researcher",
      "research scientist",
      "postdoctoral researcher",
      "lab scientist",
      "principal investigator",
    ],

    civil_engineer: [
      "civil engineer",
      "structural engineer",
      "construction engineer",
      "site engineer",
      "project engineer",
    ],

    mechanical_engineer: [
      "mechanical engineer",
      "design engineer",
      "manufacturing engineer",
      "maintenance engineer",
    ],

    electrical_engineer: [
      "electrical engineer",
      "electronics engineer",
      "power systems engineer",
      "instrumentation engineer",
    ],

    industrial_engineer: [
      "industrial engineer",
      "process engineer",
      "quality engineer",
      "production engineer",
    ],

    hr: [
      "hr",
      "human resources",
      "hr manager",
      "talent manager",
      "people operations",
      "hr business partner",
      "hrbp",
    ],

    recruiter: [
      "recruiter",
      "talent acquisition",
      "headhunter",
      "technical recruiter",
      "staffing specialist",
    ],

    journalist: [
      "journalist",
      "reporter",
      "correspondent",
      "news writer",
      "editorial writer",
    ],

    public_relations: [
      "public relations",
      "pr manager",
      "communications manager",
      "media relations",
      "corporate communications",
    ],

    electrician: [
      "electrician",
      "electrical technician",
      "maintenance electrician",
    ],

    plumber: ["plumber", "pipefitter", "plumbing technician"],

    mechanic: ["mechanic", "automotive technician", "service technician"],

    chef: [
      "chef",
      "head chef",
      "cook",
      "culinary specialist",
      "sous chef",
      "executive chef",
    ],

    hospitality: [
      "hospitality manager",
      "hotel manager",
      "front desk manager",
      "guest relations",
    ],

    entrepreneur: [
      "entrepreneur",
      "startup founder",
      "business owner",
      "self-employed",
      "independent professional",
      "proprietor",
    ],

    freelancer: [
      "freelancer",
      "independent contractor",
      "consultant",
      "contract specialist",
    ],
  };

  static SEMANTIC_MAP = Object.entries(this.SYNONYMS).reduce(
    (acc, [primary, synonyms]) => {
      synonyms.forEach((term) => (acc[term] = primary));
      return acc;
    },
    {},
  );

  static tokenize(text) {
    if (!text || typeof text !== "string") return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !this.STOPWORDS.has(token));
  }

  static getSemanticGroup(token) {
    return this.SEMANTIC_MAP[token] || token;
  }

  static extractUserTextWithWeights(user) {
    if (!user) return { tokens: [], weights: {} };

    const tokens = [];
    const weights = {};

    const addTokens = (text, weightValue) => {
      this.tokenize(text).forEach((token) => {
        const semantic = this.getSemanticGroup(token);
        tokens.push(semantic);
        weights[tokens.length - 1] = weightValue;
      });
    };

    user.skills?.forEach((skill) => addTokens(skill, 3.0));

    const currentExp = user.experience?.find((exp) => exp?.isCurrent);
    if (currentExp?.jobTitle) addTokens(currentExp.jobTitle, 2.5);

    user.experience?.forEach((exp) => {
      if (!exp?.jobTitle || exp === currentExp) return;
      addTokens(exp.jobTitle, 1.8);
      if (exp.company) addTokens(exp.company, 1.2);
      exp.description?.forEach((desc) => addTokens(desc, 1.5));
    });

    user.education?.forEach((edu) => {
      if (edu?.study) addTokens(edu.study, 2.0);
      if (edu?.institution) addTokens(edu.institution, 1.3);
    });

    user.certifications?.forEach((cert) => {
      if (cert?.name) addTokens(cert.name, 2.2);
      if (cert?.issuer) addTokens(cert.issuer, 1.1);
    });

    if (user.location) addTokens(user.location, 1.4);

    return { tokens, weights };
  }

  static extractJobTextWithWeights(job) {
    if (!job) return { tokens: [], weights: {} };

    const tokens = [];
    const weights = {};

    const addTokens = (text, weightValue, boost = false) => {
      this.tokenize(text).forEach((token) => {
        const semantic = this.getSemanticGroup(token);
        tokens.push(semantic);
        weights[tokens.length - 1] = boost ? weightValue * 1.3 : weightValue;
      });
    };

    if (job.title) addTokens(job.title, 3.0);

    if (job.requirements) {
      if (typeof job.requirements === "string") {
        addTokens(job.requirements, 2.8, true);
      } else {
        job.requirements.forEach((req) => addTokens(req, 2.8, true));
      }
    }

    if (job.description) addTokens(job.description, 1.8);
    if (job.category) addTokens(job.category, 2.0);
    if (job.type) addTokens(job.type, 1.5);
    if (job.location) addTokens(job.location, 1.4);

    return { tokens, weights };
  }

  static calculateWeightedTF(tokens, weights) {
    const tf = {};
    let totalWeight = 0;

    tokens.forEach((token, index) => {
      const weight = weights[index] || 1;
      tf[token] = (tf[token] || 0) + weight;
      totalWeight += weight;
    });

    Object.keys(tf).forEach((term) => {
      tf[term] = (1 + Math.log(tf[term])) * (tf[term] / totalWeight);
    });

    return tf;
  }

  static calculateIDF(documents) {
    const idf = {};
    const totalDocs = documents.length;
    const docFrequency = {};

    documents.forEach((tokens) => {
      new Set(tokens).forEach((term) => {
        docFrequency[term] = (docFrequency[term] || 0) + 1;
      });
    });

    Object.keys(docFrequency).forEach((term) => {
      idf[term] = Math.log((totalDocs + 1) / (docFrequency[term] + 1)) + 1;
    });

    return idf;
  }

  static calculateTFIDF(tokens, idf, weights) {
    const tf = this.calculateWeightedTF(tokens, weights);
    const tfidf = {};
    Object.keys(tf).forEach((term) => {
      tfidf[term] = tf[term] * (idf[term] || 1);
    });
    return tfidf;
  }

  static cosineSimilarity(v1, v2) {
    const terms = new Set([...Object.keys(v1), ...Object.keys(v2)]);
    let dot = 0,
      mag1 = 0,
      mag2 = 0;

    terms.forEach((term) => {
      const a = v1[term] || 0;
      const b = v2[term] || 0;
      dot += a * b;
      mag1 += a * a;
      mag2 += b * b;
    });

    if (!mag1 || !mag2) return 0;
    return Math.max(0, Math.min(1, dot / (Math.sqrt(mag1) * Math.sqrt(mag2))));
  }

  static calculateSkillsMatch(userSkills, jobRequirements) {
    if (!userSkills?.length || !jobRequirements) return 0;

    const normalizedJobReqs = (
      typeof jobRequirements === "string"
        ? this.tokenize(jobRequirements)
        : jobRequirements.flatMap((req) => this.tokenize(req || ""))
    ).map((t) => this.getSemanticGroup(t));

    const userSkillsNormalized = userSkills
      .flatMap((skill) => this.tokenize(skill))
      .map((t) => this.getSemanticGroup(t));

    const matched = new Set(
      userSkillsNormalized.filter((skill) => normalizedJobReqs.includes(skill)),
    );

    return normalizedJobReqs.length
      ? Math.min(1, matched.size / normalizedJobReqs.length)
      : 0;
  }

  static calculateSalaryMatch(user, job) {
    if (job.salaryMin == null || job.salaryMax == null) return 0.5;

    const range = job.salaryMax - job.salaryMin;
    if (range <= 0) return 0.5;

    const expected = user.salaryExpectation ?? job.salaryMax;

    if (expected < job.salaryMin) return 0.4;

    if (expected > job.salaryMax) {
      const overPercent = (expected - job.salaryMax) / range;
      return Math.max(0.3, 1 - overPercent * 0.15);
    }

    return 0.95;
  }

  static calculateSimilarity(user, job, idfCache = null) {
    if (!user || !job || user.role !== "jobSeeker") return 0;

    const { tokens: userTokens, weights: userWeights } =
      this.extractUserTextWithWeights(user);
    const { tokens: jobTokens, weights: jobWeights } =
      this.extractJobTextWithWeights(job);

    if (!userTokens.length || !jobTokens.length) return 0;

    const idf = idfCache ?? this.calculateIDF([userTokens, jobTokens]);

    const userVector = this.calculateTFIDF(userTokens, idf, userWeights);
    const jobVector = this.calculateTFIDF(jobTokens, idf, jobWeights);

    const cosineSim = this.cosineSimilarity(userVector, jobVector);
    const skillsMatch = this.calculateSkillsMatch(
      user.skills,
      job.requirements,
    );
    const salaryMatch = this.calculateSalaryMatch(user, job);

    const finalScore =
      cosineSim * 0.35 + skillsMatch * 0.35 + salaryMatch * 0.1;

    return Math.round(Math.max(0, Math.min(1, finalScore)) * 10000) / 10000;
  }

  static calculateBatchSimilarity(user, jobs) {
    if (!jobs?.length) return [];

    const { tokens: userTokens } = this.extractUserTextWithWeights(user);

    const allDocuments = [
      userTokens,
      ...jobs.map((job) => this.extractJobTextWithWeights(job).tokens),
    ];

    const idfCache = this.calculateIDF(allDocuments);

    return jobs
      .map((job) => ({
        jobId: job._id || job.id,
        similarity: this.calculateSimilarity(user, job, idfCache),
        job,
      }))
      .filter((r) => r.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity);
  }
}

module.exports = TFIDFSimilarity;
