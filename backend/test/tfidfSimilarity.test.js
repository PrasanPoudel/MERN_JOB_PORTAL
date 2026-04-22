const TFIDFSimilarity = require('../utils/tfidfSimilarity');

describe('TFIDFSimilarity', () => {
  describe('tokenize', () => {
    test('TC001: Should tokenize text correctly', () => {
      const input = "Software Engineer with JavaScript and React experience";
      const result = TFIDFSimilarity.tokenize(input);
      expect(result).toEqual(['software', 'engineer', 'javascript', 'react', 'experience']);
    });

    test('TC002: Should handle empty input', () => {
      const input = "";
      const result = TFIDFSimilarity.tokenize(input);
      expect(result).toEqual([]);
    });

    test('TC003: Should filter stopwords', () => {
      const input = "the quick brown fox and the lazy dog";
      const result = TFIDFSimilarity.tokenize(input);
      expect(result).toEqual(['quick', 'brown', 'fox', 'lazy', 'dog']);
    });
  });

  describe('getSemanticGroup', () => {
    test('TC004: Should return semantic group for known token', () => {
      const input = "js";
      const result = TFIDFSimilarity.getSemanticGroup(input);
      expect(result).toBe('javascript');
    });

    test('TC005: Should return original token for unknown token', () => {
      const input = "unknowntoken";
      const result = TFIDFSimilarity.getSemanticGroup(input);
      expect(result).toBe('unknowntoken');
    });
  });

  describe('extractUserTextWithWeights', () => {
    test('TC006: Should extract user text with weights', () => {
      const user = {
        skills: ['JavaScript', 'React'],
        experience: [
          { jobTitle: 'Software Engineer', isCurrent: true },
          { jobTitle: 'Junior Developer', company: 'TechCorp' }
        ],
        location: 'Kathmandu'
      };
      const result = TFIDFSimilarity.extractUserTextWithWeights(user);
      expect(result.tokens.length).toBeGreaterThan(0);
      expect(result.weights).toBeDefined();
    });

    test('TC007: Should handle null user', () => {
      const result = TFIDFSimilarity.extractUserTextWithWeights(null);
      expect(result).toEqual({ tokens: [], weights: {} });
    });
  });

  describe('extractJobTextWithWeights', () => {
    test('TC008: Should extract job text with weights', () => {
      const job = {
        title: 'Frontend Developer',
        description: 'Build amazing web applications',
        requirements: ['React', 'JavaScript'],
        category: 'IT',
        type: 'full-time',
        location: 'Kathmandu'
      };
      const result = TFIDFSimilarity.extractJobTextWithWeights(job);
      expect(result.tokens.length).toBeGreaterThan(0);
      expect(result.weights).toBeDefined();
    });

    test('TC009: Should handle null job', () => {
      const result = TFIDFSimilarity.extractJobTextWithWeights(null);
      expect(result).toEqual({ tokens: [], weights: {} });
    });
  });

  describe('calculateWeightedTF', () => {
    test('TC010: Should calculate weighted term frequency', () => {
      const tokens = ['javascript', 'react', 'javascript'];
      const weights = { 0: 2.0, 1: 1.0, 2: 2.0 };
      const result = TFIDFSimilarity.calculateWeightedTF(tokens, weights);
      expect(result).toBeDefined();
      expect(result.javascript).toBeGreaterThan(result.react);
    });
  });

  describe('calculateIDF', () => {
    test('TC011: Should calculate inverse document frequency', () => {
      const documents = [
        ['javascript', 'react'],
        ['python', 'django'],
        ['javascript', 'node']
      ];
      const result = TFIDFSimilarity.calculateIDF(documents);
      expect(result).toBeDefined();
      expect(result.javascript).toBeLessThan(result.python);
    });
  });

  describe('cosineSimilarity', () => {
    test('TC012: Should calculate cosine similarity between vectors', () => {
      const v1 = { javascript: 0.5, react: 0.3 };
      const v2 = { javascript: 0.4, react: 0.6 };
      const result = TFIDFSimilarity.cosineSimilarity(v1, v2);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(1);
    });

    test('TC013: Should return 0 for empty vectors', () => {
      const v1 = {};
      const v2 = {};
      const result = TFIDFSimilarity.cosineSimilarity(v1, v2);
      expect(result).toBe(0);
    });
  });

  describe('calculateSimilarity', () => {
    test('TC014: Should calculate similarity score between user and job', () => {
      const user = {
        role: 'jobSeeker',
        skills: ['JavaScript', 'React'],
        experience: [{ jobTitle: 'Frontend Developer', isCurrent: true }]
      };
      const job = {
        title: 'React Developer',
        requirements: ['JavaScript', 'React'],
        description: 'Build web applications'
      };
      const result = TFIDFSimilarity.calculateSimilarity(user, job);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(1);
    });

    test('TC015: Should return 0 for non-jobSeeker user', () => {
      const user = { role: 'employer' };
      const job = { title: 'Developer' };
      const result = TFIDFSimilarity.calculateSimilarity(user, job);
      expect(result).toBe(0);
    });

    test('TC016: Should return 0 for null inputs', () => {
      const result = TFIDFSimilarity.calculateSimilarity(null, null);
      expect(result).toBe(0);
    });
  });
});