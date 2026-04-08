import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

import EditAdminProfile from "./pages/Admin/EditAdminProfile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminJobManagement from "./pages/Admin/AdminJobManagement";
import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import AdminCompanyVerification from "./pages/Admin/AdminCompanyVerification";

import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import JobSeekerProfilePage from "./pages/JobSeeker/JobSeekerProfilePage";
import AppliedApplications from "./pages/JobSeeker/AppliedApplications";

import ProtectedRoute from "./routes/ProtectedRoute";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import JobPostingForm from "./pages/Employer/JobPostingForm";
import ManageJobs from "./pages/Employer/ManageJobs";
import ApplicationViewer from "./pages/Employer/ApplicationViewer";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";

import AdminChatBox from "./pages/Chat/AdminChatBox";
import EmployerChatBox from "./pages/Chat/EmployerChatBox";
import JobSeekerChatBox from "./pages/Chat/JobSeekerChatBox";

import { useAuth } from "./context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";

import ChangePassword from "./pages/Shared/ChangePassword";
import DeleteAccount from "./pages/Shared/DeleteAccount";
import Pricing from "./pages/Payment/Pricing";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PaymentFailed from "./pages/Payment/PaymentFailed";
import UserProfilePage from "./pages/Shared/UserProfilePage";

const App = () => {
  const { loading } = useAuth();
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      window.location.reload();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isOffline) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#fff",
          zIndex: 999999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: "#333",
        }}
      >
        <div style={{ maxWidth: 600, padding: "0 20px", textAlign: "left" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "normal",
              marginBottom: "12px",
            }}
          >
            No Internet
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#5f6368",
              lineHeight: "20px",
              margin: 0,
            }}
          >
            Try:
          </p>
          <ul
            style={{
              fontSize: "16px",
              color: "#5f6368",
              lineHeight: "20px",
              paddingLeft: "20px",
              marginTop: "4px",
            }}
          >
            <li>Checking the network cables, modem, and router</li>
            <li>Reconnecting to Wi-Fi</li>
          </ul>
          <p style={{ fontSize: "14px", color: "#80868b", marginTop: "24px" }}>
            ERR_INTERNET_DISCONNECTED
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Chat routes - accessible to both jobSeeker and employer */}
        <Route element={<ProtectedRoute />}>
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/EmployerChatBox" element={<EmployerChatBox />} />
          <Route path="/JobSeekerChatBox" element={<JobSeekerChatBox />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="jobSeeker" />}>
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route
            path="/applied-applications"
            element={<AppliedApplications />}
          />
          <Route path="/profile" element={<JobSeekerProfilePage />} />
        </Route>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="employer" />}>
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/post-job" element={<JobPostingForm />} />
          <Route path="/manage-jobs" element={<ManageJobs />} />
          <Route path="/applicants" element={<ApplicationViewer />} />
          <Route path="/employer-profile" element={<EmployerProfilePage />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/edit-admin-profile" element={<EditAdminProfile />} />
          <Route
            path="/admin-company-verification"
            element={<AdminCompanyVerification />}
          />
          <Route
            path="/admin-users-management"
            element={<AdminUserManagement />}
          />
          <Route
            path="/admin-jobs-management"
            element={<AdminJobManagement />}
          />
          <Route path="/admin-chat-box" element={<AdminChatBox />} />
        </Route>

        <Route path="/find-jobs" element={<JobSeekerDashboard />} />
        <Route path="/job/:jobId" element={<JobDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "12.5px",
          },
        }}
      />
    </Router>
  );
};

export default App;
