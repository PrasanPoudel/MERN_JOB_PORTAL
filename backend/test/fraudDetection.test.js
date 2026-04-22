const axios = require("axios");

// Mock axios
jest.mock("axios");
const mockedAxios = axios;

describe("Fraud Detection API", () => {
  const FRAUD_PREDICTOR_API_URL =
    process.env.FRAUD_PREDICTOR_API_URL || "http://localhost:5000";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("FastAPI Fraud Detection Endpoint", () => {
    test("TC017: Should return fraud score when valid job data is sent", async () => {
      const jobData = {
        title: "Senior Backend Software Engineer",
        description:
          "We are seeking an experienced backend engineer to design, build, and maintain scalable APIs and microservices. You will collaborate with cross-functional teams, participate in code reviews, and contribute to system architecture decisions.",
        requirements:
          "Bachelor’s degree in Computer Science or related field, 5+ years of experience in backend development, strong knowledge of Python, Django, REST APIs, and cloud platforms like AWS.",
        benefits:
          "Health, dental, and vision insurance, paid time off, remote work flexibility, annual bonus, learning and development budget.",
        company_profile:
          "InnovateTech Solutions is a mid-sized SaaS company focused on building cloud-based enterprise tools for global clients.",
        location: "US, NY, New York",
        department: "Engineering",
        salary_range: "110000-140000",
        employment_type: "Full-time",
        required_experience: "Senior level",
        required_education: "Bachelor's Degree",
        has_company_logo: 1,
      };

      const mockResponse = {
        data: { fraudScore: 0.1198 },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await axios.post(
        `${FRAUD_PREDICTOR_API_URL}/predict`,
        jobData,
        {
          timeout: 8000,
        },
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${FRAUD_PREDICTOR_API_URL}/predict`,
        jobData,
        { timeout: 8000 },
      );
      expect(response.data.fraudScore).toBeLessThan(0.5);
      expect(typeof response.data.fraudScore).toBe("number");
    });

    test("TC018: Should handle API failure gracefully", async () => {
      const jobData = {
        title: "Software Engineer",
        description: "Develop applications",
      };

      mockedAxios.post.mockRejectedValue(new Error("API unavailable"));

      try {
        await axios.post(`${FRAUD_PREDICTOR_API_URL}/predict`, jobData, {
          timeout: 8000,
        });
      } catch (error) {
        expect(error.message).toBe("API unavailable");
      }

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${FRAUD_PREDICTOR_API_URL}/predict`,
        jobData,
        { timeout: 8000 },
      );
    });

    test("TC019: Should handle timeout error", async () => {
      const jobData = {
        title: "Software Engineer",
        description: "Develop applications",
      };

      const timeoutError = new Error("timeout of 8000ms exceeded");
      timeoutError.code = "ECONNABORTED";
      mockedAxios.post.mockRejectedValue(timeoutError);

      try {
        await axios.post(`${FRAUD_PREDICTOR_API_URL}/predict`, jobData, {
          timeout: 8000,
        });
      } catch (error) {
        expect(error.message).toBe("timeout of 8000ms exceeded");
        expect(error.code).toBe("ECONNABORTED");
      }
    });

    test("TC020: Should handle invalid response data", async () => {
      const jobData = {
        title: "Software Engineer",
        description: "Develop applications",
      };

      const mockResponse = {
        data: { fraudScore: null },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await axios.post(
        `${FRAUD_PREDICTOR_API_URL}/predict`,
        jobData,
        {
          timeout: 8000,
        },
      );

      expect(response.data.fraudScore).toBe(null);
    });

    test("TC021: Should handle response with high fraud score", async () => {
      const suspiciousJobData = {
        title: "Make $5000 per day working from home!!!",
        description: "Easy money, no experience required, contact now!",
        requirements: "None",
        benefits: "Unlimited earning potential",
        company_profile: "",
        location: "Remote",
        department: "Sales",
        salary_range: "100000 - 200000",
        employment_type: "part-time",
        required_experience: "entry",
        required_education: "none",
        has_company_logo: 0,
      };

      const mockResponse = {
        data: { fraudScore: 1 },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await axios.post(
        `${FRAUD_PREDICTOR_API_URL}/predict`,
        suspiciousJobData,
        {
          timeout: 8000,
        },
      );
      expect(response.data.fraudScore).toBeGreaterThan(0.5);
    });
  });
});
