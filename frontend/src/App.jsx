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

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminJobManagement from "./pages/Admin/AdminJobManagement";
import AdminUserManagement from "./pages/Admin/AdminUserManagement";

import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";
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
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Chat routes - accessible to both jobSeeker and employer */}
          <Route element={<ProtectedRoute />}>
            <Route path="/EmployerChatBox" element={<EmployerChatBox />} />
            <Route path="/JobSeekerChatBox" element={<JobSeekerChatBox />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="jobSeeker" />}>
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route
              path="/applied-applications"
              element={<AppliedApplications />}
            />
            <Route path="/profile" element={<UserProfile />} />
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
      </Router>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "12.5px",
          },
        }}
      />
    </ErrorBoundary>
  );
};

export default App;
