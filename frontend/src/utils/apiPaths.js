export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Signup
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/getMe", // Get logged-in user details
    UPDATE_PROFILE: "/api/user/profile", // Update profile details
    DELETE_RESUME: "/api/user/resume", // Delete Resume details
  },
  DASHBOARD: {
    OVERVIEW: `/api/analytics/overview`,
  },
  JOBS: {
    GET_ALL_JOBS: "/api/jobs",
    POST_JOB: "/api/jobs",
    GET_JOBS_EMPLOYER: "/api/jobs/get-jobs-employer",
    GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
    TOGGLE_CLOSE: (id) => `/api/jobs/${id}/toggle-close`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    SAVE_JOB: (id) => `/api/save-jobs/${id}`,
    UNSAVE_JOB: (id) => `/api/save-jobs/${id}`,
    GET_SAVED_JOBS: "/api/save-jobs/my",
  },
  APPLICATIONS: {
    APPLY_TO_JOB: (id) => `/api/applications/${id}`,
    GET_MY_APPLICATIONS: "/api/applications/my",
    GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`,
    GET_APPLICATION_BY_ID: (id) => `/api/applications/${id}`,
    UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
  },
  MESSAGES: {
    SEND_MESSAGE: "/api/messages/send",
    GET_CONVERSATION: (id) => `/api/messages/conversation/${id}`,
    GET_CONVERSATIONS: "/api/messages/conversations",
    GET_UNREAD_COUNT: "/api/messages/unread-count",
    GET_ADMIN_MESSAGES: "/api/messages/admin-messages",
    SEND_TO_ADMIN: "/api/messages/send-to-admin",
  },
  LANDING_PAGE_STATS: {
    GET_STATS: "/api/analytics/landingPageStats",
  },
  ADMIN: {
    GET_STATS: "/api/admin/stats",
    GET_ALL_USERS: "/api/admin/users",
    GET_USER_BY_ID: (id) => `/api/admin/users/${id}`,
    DELETE_USER: (id) => `/api/admin/users/${id}`,
    GET_ALL_JOBS: "/api/admin/jobs",
    DELETE_JOB: (id) => `/api/admin/jobs/${id}`,
    SEND_ADMIN_MESSAGE: "/api/admin/messages/send",
    GET_ADMIN_CONVERSATIONS: "/api/admin/messages/conversations",
    GET_ADMIN_CONVERSATION: (userId) =>
      `/api/admin/messages/conversation/${userId}`,
    SEND_USER_REPLY: "/api/admin/messages/reply",
    GET_DAILY_ANALYTICS: "/api/admin/analytics/daily",
    GET_RISK_DISTRIBUTION: "/api/admin/analytics/risk-distribution",
  },
  FILE: {
    UPLOAD_FILE: "/api/auth/upload-file", //upload profile picture
  },
};
