class TFIDFSimilarity {
  static STOPWORDS = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "been", "be",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "can", "this", "that", "these", "those",
    "i", "you", "he", "she", "it", "we", "they", "what", "which", "who",
    "when", "where", "why", "how", "all", "each", "every", "both", "few",
    "more", "most", "other", "some", "such", "no", "nor", "not", "only",
    "same", "so", "than", "too", "very", "just", "as", "if", "about",
  ]);

  // Synonym mapping for semantic understanding
  static SYNONYMS = {
    "backend": ["backend", "server", "api", "microservices"],
    "frontend": ["frontend", "ui", "ux", "client"],
    "fullstack": ["fullstack", "full-stack", "full stack"],
    "react": ["react", "reactjs", "react.js"],
    "nodejs": ["nodejs", "node.js", "node"],
    "javascript": ["javascript", "js", "ecmascript"],
    "python": ["python", "py"],
    "java": ["java", "j2ee"],
    "developer": ["developer", "engineer", "programmer", "coder"],
    "architect": ["architect", "lead", "senior"],
  };

  /**
   * Tokenize text with improved filtering
   * @param {string} text - Text to tokenize
   * @returns {string[]} - Array of valid tokens
   */
  static tokenize(text) {
    if (!text || typeof text !== "string") {
      return [];
    }

    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !this.STOPWORDS.has(token));
  }

  /**
   * Get semantic group of a token (for matching similar skills)
   * @param {string} token - Token to look up
   * @returns {string} - Primary semantic term
   */
  static getSemanticGroup(token) {
    for (const [primary, synonyms] of Object.entries(this.SYNONYMS)) {
      if (synonyms.includes(token)) {
        return primary;
      }
    }
    return token;
  }

  /**
   * Extract user text with weights - FIXED to return tokens instead of string
   * @param {Object} user - User object
   * @returns {Object} - { tokens: string[], weights: {}, tokenTypes: {} }
   */
  static extractUserTextWithWeights(user) {
    if (!user) {
      return { tokens: [], weights: {}, tokenTypes: {} };
    }

    const tokens = [];
    const weights = {};
    const tokenTypes = {}; // Track which field each token came from

    const addTokens = (text, weightValue, type) => {
      const extracted = this.tokenize(text);
      extracted.forEach((token) => {
        const semantic = this.getSemanticGroup(token);
        tokens.push(semantic);
        const index = tokens.length - 1;
        // Higher weight for skills, lower for auxiliary info
        weights[index] = weightValue;
        tokenTypes[index] = type;
      });
    };

    // Skills - highest priority (weight 3.0)
    if (Array.isArray(user.skills) && user.skills.length > 0) {
      user.skills.forEach((skill) => {
        if (skill && typeof skill === "string") {
          addTokens(skill, 3.0, "skill");
        }
      });
    }

    // Current job title - very high priority (weight 2.5)
    if (Array.isArray(user.experience) && user.experience.length > 0) {
      const currentExp = user.experience.find((exp) => exp && exp.isCurrent);
      if (currentExp && currentExp.jobTitle) {
        addTokens(currentExp.jobTitle, 2.5, "currentJobTitle");
      }

      // Past job titles - medium priority (weight 1.8)
      user.experience.forEach((exp) => {
        if (!exp || !exp.jobTitle || (currentExp && exp === currentExp)) return;
        addTokens(exp.jobTitle, 1.8, "pastJobTitle");

        // Company name - lower priority (weight 1.2)
        if (exp.company && typeof exp.company === "string") {
          addTokens(exp.company, 1.2, "company");
        }

        // Job description - medium priority (weight 1.5)
        if (Array.isArray(exp.description)) {
          exp.description.forEach((desc) => {
            if (desc && typeof desc === "string") {
              addTokens(desc, 1.5, "description");
            }
          });
        }
      });
    }

    // Education
    if (Array.isArray(user.education) && user.education.length > 0) {
      user.education.forEach((edu) => {
        if (!edu) return;

        // Field of study - medium priority (weight 2.0)
        if (edu.study && typeof edu.study === "string") {
          addTokens(edu.study, 2.0, "study");
        }

        // Institution - lower priority (weight 1.3)
        if (edu.institution && typeof edu.institution === "string") {
          addTokens(edu.institution, 1.3, "institution");
        }
      });
    }

    // Certifications
    if (Array.isArray(user.certifications) && user.certifications.length > 0) {
      user.certifications.forEach((cert) => {
        if (!cert) return;

        // Certification name - medium-high priority (weight 2.2)
        if (cert.name && typeof cert.name === "string") {
          addTokens(cert.name, 2.2, "certification");
        }

        // Issuer - lower priority (weight 1.1)
        if (cert.issuer && typeof cert.issuer === "string") {
          addTokens(cert.issuer, 1.1, "issuer");
        }
      });
    }

    // Location - lowest priority (weight 1.4)
    if (user.location && typeof user.location === "string") {
      addTokens(user.location, 1.4, "location");
    }

    return { tokens, weights, tokenTypes };
  }

  /**
   * Extract job text with weights - FIXED to return tokens instead of string
   * @param {Object} job - Job object
   * @returns {Object} - { tokens: string[], weights: {}, tokenTypes: {} }
   */
  static extractJobTextWithWeights(job) {
    if (!job) {
      return { tokens: [], weights: {}, tokenTypes: {} };
    }

    const tokens = [];
    const weights = {};
    const tokenTypes = {};

    const addTokens = (text, weightValue, type, isRequired = false) => {
      const extracted = this.tokenize(text);
      extracted.forEach((token) => {
        const semantic = this.getSemanticGroup(token);
        tokens.push(semantic);
        const index = tokens.length - 1;
        // Required tokens get 1.3x boost
        weights[index] = isRequired ? weightValue * 1.3 : weightValue;
        tokenTypes[index] = type;
      });
    };

    // Job title - highest priority (weight 3.0)
    if (job.title && typeof job.title === "string") {
      addTokens(job.title, 3.0, "title");
    }

    // Requirements - very high priority (weight 2.8)
    if (job.requirements) {
      if (typeof job.requirements === "string") {
        // Parse required vs optional (simplified: assume all are required)
        addTokens(job.requirements, 2.8, "requirements", true);
      } else if (Array.isArray(job.requirements)) {
        job.requirements.forEach((req) => {
          if (req && typeof req === "string") {
            addTokens(req, 2.8, "requirements", true);
          }
        });
      }
    }

    // Description - medium priority (weight 1.8)
    if (job.description && typeof job.description === "string") {
      addTokens(job.description, 1.8, "description");
    }

    // Category - medium priority (weight 2.0)
    if (job.category && typeof job.category === "string") {
      addTokens(job.category, 2.0, "category");
    }

    // Job type - lower priority (weight 1.5)
    if (job.type && typeof job.type === "string") {
      addTokens(job.type, 1.5, "type");
    }

    // Location - lower priority (weight 1.4)
    if (job.location && typeof job.location === "string") {
      addTokens(job.location, 1.4, "location");
    }

    return { tokens, weights, tokenTypes };
  }

  /**
   * Calculate weighted TF with proper indexing
   * @param {string[]} tokens - Array of tokens
   * @param {Object} weights - Weight map by index
   * @returns {Object} - TF map
   */
  static calculateWeightedTF(tokens, weights) {
    if (!Array.isArray(tokens) || tokens.length === 0) {
      return {};
    }

    const tf = {};
    let totalWeight = 0;

    tokens.forEach((token, index) => {
      const weight = weights[index] || 1;
      tf[token] = (tf[token] || 0) + weight;
      totalWeight += weight;
    });

    if (totalWeight === 0) return tf;

    // Normalize: (1 + log(frequency)) * (weight_sum / total_weight)
    Object.keys(tf).forEach((term) => {
      tf[term] = (1 + Math.log(tf[term])) * (tf[term] / totalWeight);
    });

    return tf;
  }

  /**
   * Calculate IDF from entire document corpus
   * @param {string[][]} allDocuments - Array of tokenized documents
   * @returns {Object} - IDF map
   */
  static calculateIDF(allDocuments) {
    if (!Array.isArray(allDocuments) || allDocuments.length === 0) {
      return {};
    }

    const idf = {};
    const totalDocs = allDocuments.length;
    const docFrequency = {};

    // Count document frequency for each term
    allDocuments.forEach((tokens) => {
      if (!Array.isArray(tokens)) return;
      const uniqueTerms = new Set(tokens);
      uniqueTerms.forEach((term) => {
        docFrequency[term] = (docFrequency[term] || 0) + 1;
      });
    });

    // Calculate IDF: log((total_docs + 1) / (doc_frequency + 1)) + 1
    Object.keys(docFrequency).forEach((term) => {
      idf[term] = Math.log((totalDocs + 1) / (docFrequency[term] + 1)) + 1;
    });

    return idf;
  }

  /**
   * Calculate TF-IDF vector
   * @param {string[]} tokens - Array of tokens
   * @param {Object} idf - IDF map
   * @param {Object} weights - Weight map by index
   * @returns {Object} - TF-IDF vector
   */
  static calculateTFIDF(tokens, idf, weights) {
    if (!Array.isArray(tokens) || tokens.length === 0) {
      return {};
    }

    const tf = this.calculateWeightedTF(tokens, weights);
    const tfidf = {};

    Object.keys(tf).forEach((term) => {
      tfidf[term] = tf[term] * (idf[term] || 1);
    });

    return tfidf;
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param {Object} vector1 - First TF-IDF vector
   * @param {Object} vector2 - Second TF-IDF vector
   * @returns {number} - Similarity score (0-1)
   */
  static cosineSimilarity(vector1, vector2) {
    if (!vector1 || !vector2 || typeof vector1 !== "object" || typeof vector2 !== "object") {
      return 0;
    }

    const allTerms = new Set([
      ...Object.keys(vector1),
      ...Object.keys(vector2),
    ]);

    if (allTerms.size === 0) return 0;

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    allTerms.forEach((term) => {
      const v1 = vector1[term] || 0;
      const v2 = vector2[term] || 0;

      dotProduct += v1 * v2;
      magnitude1 += v1 * v1;
      magnitude2 += v2 * v2;
    });

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    const similarity = dotProduct / (magnitude1 * magnitude2);
    return Math.max(0, Math.min(1, similarity));
  }

  /**
   * Calculate location match with improved logic
   * @param {string} userLocation - User's location
   * @param {string} jobLocation - Job's location
   * @param {boolean} isRemote - Whether job is remote
   * @returns {number} - Location match score (0-1)
   */
  static calculateLocationMatch(userLocation, jobLocation, isRemote = false) {
    // Remote jobs match any location
    if (isRemote) return 1;

    if (!userLocation || !jobLocation) return 0;

    const userLoc = (userLocation || "").toLowerCase().trim();
    const jobLoc = (jobLocation || "").toLowerCase().trim();

    if (!userLoc || !jobLoc) return 0;

    // Exact match
    if (userLoc === jobLoc) return 1;

    // Split by common delimiters
    const userParts = userLoc.split(/[,\s]+/).filter((p) => p.length > 0);
    const jobParts = jobLoc.split(/[,\s]+/).filter((p) => p.length > 0);

    // Check for common parts (city, state, country)
    // Only exact word matches, not substring matches
    const matches = userParts.filter((up) =>
      jobParts.some((jp) => jp === up)
    );

    if (matches.length > 0) {
      // If any common location parts exist, it's a good match
      return Math.min(1, 0.7 + (matches.length * 0.15));
    }

    return 0;
  }

  /**
   * Calculate salary match with improved logic
   * @param {Object} user - User object
   * @param {Object} job - Job object
   * @returns {number} - Salary match score (0-1)
   */
  static calculateSalaryMatch(user, job) {
    // If job doesn't specify salary, skip this metric (don't penalize)
    if (!job.salaryMin || !job.salaryMax) return 0.5;

    const salaryRange = job.salaryMax - job.salaryMin;
    if (salaryRange <= 0) return 0.5;

    // Use user's expectation or job's max as fallback
    const userSalaryExpectation = user.salaryExpectation || job.salaryMax;

    // User expects less than minimum: risky match
    if (userSalaryExpectation < job.salaryMin) {
      return 0.4; // Slight penalty, but not total rejection
    }

    // User expects more than maximum
    if (userSalaryExpectation > job.salaryMax) {
      const overage = userSalaryExpectation - job.salaryMax;
      const overagePercent = overage / salaryRange;
      // Penalty increases with overage percentage
      return Math.max(0.3, 1 - (overagePercent * 0.15));
    }

    // User expectation within range: excellent match
    return 0.95;
  }

  /**
   * Calculate experience match with relevance weighting
   * @param {Object} user - User object
   * @param {Object} job - Job object (optional, for requirement checking)
   * @returns {number} - Experience match score (0-1)
   */
  static calculateExperienceMatch(user, job = null) {
    if (!Array.isArray(user.experience) || user.experience.length === 0) {
      return 0.2;
    }

    let relevantExperienceYears = 0;
    let totalExperienceYears = 0;
    const now = new Date();

    // Calculate experience with recency weighting
    user.experience.forEach((exp) => {
      if (!exp || !exp.startDate) return;

      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : now;

      if (endDate > startDate) {
        const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
        totalExperienceYears += years;

        // Weight recent experience higher
        const recencyFactor = exp.isCurrent ? 1.5 : 1;
        relevantExperienceYears += years * recencyFactor;
      }
    });

    // No experience
    if (relevantExperienceYears < 0.5) return 0.3;
    // Entry level (< 2 years)
    if (relevantExperienceYears < 2) return 0.5;
    // Mid level (2-5 years)
    if (relevantExperienceYears < 5) return 0.75;
    // Senior (5-10 years)
    if (relevantExperienceYears < 10) return 0.9;
    // Very senior (> 10 years)
    return 1.0;
  }

  /**
   * Calculate education score
   * @param {Object} user - User object
   * @returns {number} - Education score (0-1)
   */
  static calculateEducationScore(user) {
    if (!Array.isArray(user.education) || user.education.length === 0) {
      return 0.3; // Some experience without formal education
    }

    const validEducation = user.education.filter(
      (edu) => edu && edu.study && edu.institution
    ).length;

    if (validEducation === 0) return 0.3;
    if (validEducation === 1) return 0.75;
    if (validEducation === 2) return 0.85;
    return 1.0; // Multiple degrees
  }

  /**
   * Calculate skills match with semantic understanding
   * @param {string[]} userSkills - User's skills
   * @param {string|string[]} jobRequirements - Job requirements
   * @returns {number} - Skills match score (0-1)
   */
  static calculateSkillsMatch(userSkills, jobRequirements) {
    if (!Array.isArray(userSkills) || userSkills.length === 0) {
      return 0;
    }

    if (!jobRequirements) return 0;

    // Normalize job requirements to array of tokens
    const normalizedJobReqs = typeof jobRequirements === "string"
      ? this.tokenize(jobRequirements)
      : Array.isArray(jobRequirements)
      ? jobRequirements.flatMap((req) => this.tokenize(req || ""))
      : [];

    if (normalizedJobReqs.length === 0) return 0;

    // Normalize user skills to semantic tokens
    const userSkillsNormalized = userSkills
      .filter((skill) => skill && typeof skill === "string")
      .map((skill) => {
        const tokens = this.tokenize(skill);
        return tokens.map((t) => this.getSemanticGroup(t));
      })
      .flat();

    if (userSkillsNormalized.length === 0) return 0;

    // Count matches using semantic groups
    const matchedSkills = new Set();
    userSkillsNormalized.forEach((userSkill) => {
      normalizedJobReqs.forEach((jobReq) => {
        // Exact match or semantic group match
        if (userSkill === jobReq || this.getSemanticGroup(jobReq) === userSkill) {
          matchedSkills.add(userSkill);
        }
      });
    });

    return Math.min(1, matchedSkills.size / normalizedJobReqs.length);
  }

  /**
   * Main similarity calculation
   * @param {Object} user - User object (must be jobSeeker)
   * @param {Object} job - Job object
   * @param {Object} idfCache - Pre-calculated IDF from all jobs
   * @returns {number} - Final similarity score (0-1)
   */
  static calculateSimilarity(user, job, idfCache = null) {
    try {
      if (!user || !job) {
        return 0;
      }

      if (user.role !== "jobSeeker") {
        return 0;
      }

      // Extract with improved tokenization
      const { tokens: userTokens, weights: userWeights } = this.extractUserTextWithWeights(user);
      const { tokens: jobTokens, weights: jobWeights } = this.extractJobTextWithWeights(job);

      if (userTokens.length === 0 || jobTokens.length === 0) {
        return 0;
      }

      // Use cached IDF or calculate from two documents
      let idf;
      if (idfCache) {
        idf = idfCache;
      } else {
        const allTokens = [userTokens, jobTokens];
        idf = this.calculateIDF(allTokens);
      }

      // Calculate TF-IDF vectors - now passing pre-tokenized arrays
      const userVector = this.calculateTFIDF(userTokens, idf, userWeights);
      const jobVector = this.calculateTFIDF(jobTokens, idf, jobWeights);

      // Calculate content similarity
      const cosineSim = this.cosineSimilarity(userVector, jobVector);

      // Calculate supplementary metrics
      const locationMatch = this.calculateLocationMatch(
        user.location,
        job.location,
        job.isRemote
      );
      const skillsMatch = this.calculateSkillsMatch(user.skills, job.requirements);
      const experienceMatch = this.calculateExperienceMatch(user, job);
      const educationScore = this.calculateEducationScore(user);
      const salaryMatch = this.calculateSalaryMatch(user, job);

      // Configurable weight distribution
      const weights = {
        cosine: 0.30,        // Content/keyword match
        skills: 0.28,        // Skills match (increased importance)
        experience: 0.18,    // Experience level
        location: 0.12,      // Location fit
        education: 0.07,     // Education background
        salary: 0.05,        // Salary compatibility
      };

      // Ensure weights sum to 1
      const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
      Object.keys(weights).forEach((key) => {
        weights[key] = weights[key] / totalWeight;
      });

      const finalScore =
        cosineSim * weights.cosine +
        skillsMatch * weights.skills +
        experienceMatch * weights.experience +
        locationMatch * weights.location +
        educationScore * weights.education +
        salaryMatch * weights.salary;

      // Round to 4 decimal places
      return Math.round(Math.max(0, Math.min(1, finalScore)) * 10000) / 10000;
    } catch (error) {
      console.error("Error calculating similarity:", error);
      return 0;
    }
  }

  /**
   * Calculate batch similarity with proper IDF caching
   * @param {Object} user - User object
   * @param {Object[]} jobs - Array of job objects
   * @returns {Array} - Sorted array of similarity results
   */
  static calculateBatchSimilarity(user, jobs) {
    if (!Array.isArray(jobs) || jobs.length === 0) {
      return [];
    }

    // Calculate IDF from all jobs once (improvement over original)
    const allJobTokens = jobs.map((job) => {
      const { tokens } = this.extractJobTextWithWeights(job);
      return tokens;
    });

    const idfCache = this.calculateIDF(allJobTokens);

    // Calculate similarity for each job using cached IDF
    const results = jobs
      .map((job) => ({
        jobId: job._id || job.id,
        similarity: this.calculateSimilarity(user, job, idfCache),
        job,
      }))
      .filter((result) => result.similarity > 0) // Filter out zero matches
      .sort((a, b) => b.similarity - a.similarity);

    return results;
  }

  /**
   * Get detailed match breakdown (for debugging/UI)
   * @param {Object} user - User object
   * @param {Object} job - Job object
   * @returns {Object} - Detailed scores for each metric
   */
  static getSimilarityBreakdown(user, job) {
    try {
      const { tokens: userTokens, weights: userWeights } = this.extractUserTextWithWeights(user);
      const { tokens: jobTokens, weights: jobWeights } = this.extractJobTextWithWeights(job);

      if (userTokens.length === 0 || jobTokens.length === 0) {
        return null;
      }

      const allTokens = [userTokens, jobTokens];
      const idf = this.calculateIDF(allTokens);

      const userVector = this.calculateTFIDF(userTokens, idf, userWeights);
      const jobVector = this.calculateTFIDF(jobTokens, idf, jobWeights);

      return {
        contentMatch: this.cosineSimilarity(userVector, jobVector),
        skillsMatch: this.calculateSkillsMatch(user.skills, job.requirements),
        experienceMatch: this.calculateExperienceMatch(user, job),
        locationMatch: this.calculateLocationMatch(user.location, job.location),
        educationScore: this.calculateEducationScore(user),
        salaryMatch: this.calculateSalaryMatch(user, job),
        finalScore: this.calculateSimilarity(user, job, idf),
      };
    } catch (error) {
      console.error("Error getting similarity breakdown:", error);
      return null;
    }
  }
}

module.exports = TFIDFSimilarity;