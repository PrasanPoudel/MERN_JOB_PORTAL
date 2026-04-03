import { useEffect, useState } from "react";
import {
  Loader,
  Users,
  Search,
  X,
  MapPin,
  Building2,
  Calendar,
  BriefcaseBusiness,
  BadgeCheck,
  FileText as FileTextIcon,
  Link as LinkIcon,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";

const AdminCompanyVerification = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [confirmVerifyCompany, setConfirmVerifyCompany] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Pagination
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getCompanies = async () => {
    try {
      setIsLoading(true);
      const endpoint =
        verificationFilter === "unverified"
          ? API_PATHS.ADMIN.GET_PENDING_COMPANIES
          : API_PATHS.ADMIN.GET_ALL_COMPANIES;

      const response = await axiosInstance.get(endpoint);
      if (response.status === 200) {
        setCompanies(response.data);
        setFilteredCompanies(response.data);
      }
    } catch {
      toast.error("Failed to fetch companies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    let filtered = companies;

    if (verificationFilter !== "all") {
      filtered = filtered.filter((c) =>
        verificationFilter === "verified"
          ? c.isCompanyVerified
          : !c.isCompanyVerified,
      );
    }

    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          c.companyName
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()),
      );
    }

    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [debouncedSearchTerm, verificationFilter, companies]);

  const handleVerifyCompany = async (companyId) => {
    try {
      setVerifying(true);
      const response = await axiosInstance.put(
        API_PATHS.ADMIN.VERIFY_COMPANY(companyId),
      );
      toast.success("Company verified successfully");
      setCompanies((prev) => prev.filter((c) => c._id !== companyId));
      setSelectedCompany(null);
      setConfirmVerifyCompany(null);
      // Refresh the list to remove the verified company
      getCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify company");
    } finally {
      setVerifying(false);
    }
  };

  const handleRemoveVerification = async (companyId) => {
    try {
      setVerifying(true);
      const response = await axiosInstance.put(
        API_PATHS.ADMIN.REMOVE_COMPANY_VERIFICATION(companyId),
      );
      toast.success("Company verification removed successfully");
      // Refresh the list to update the company status
      getCompanies();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to remove verification",
      );
    } finally {
      setVerifying(false);
      setSelectedCompany(null);
    }
  };

  const handleMessageCompany = (companyId) => {
    navigate(`/admin-chat-box?userId=${companyId}`);
  };

  const getPaginationPages = (currentPage, totalPages) => {
    const pages = [];
    const delta = 2;

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <DashboardLayout activeMenu="admin-company-verification">
      {selectedCompany && (
        <CompanyModal
          companyId={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onVerify={(id) =>
            setConfirmVerifyCompany(companies.find((c) => c._id === id))
          }
          onMessage={handleMessageCompany}
          handleVerificationRemoval={handleRemoveVerification}
        />
      )}

      {confirmVerifyCompany && (
        <VerifyConfirmationModal
          company={confirmVerifyCompany}
          verifying={verifying}
          onCancel={() => setConfirmVerifyCompany(null)}
          onConfirm={handleVerifyCompany}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Company Verification
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review and verify company details
            </p>
          </div>

          <div className="bg-sky-50 text-sky-700 px-4 py-2 rounded-xl text-sm font-semibold">
            {filteredCompanies.length}{" "}
            {verificationFilter === "verified"
              ? "Verified"
              : verificationFilter === "unverified"
                ? "Unverified"
                : "Total"}{" "}
            Companies
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              autoComplete="off"
              id="search_companies"
              type="text"
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            id="select_verification"
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
          >
            <option value="all">All Companies</option>
            <option value="verified">Verified Companies</option>
            <option value="unverified">Unverified Companies</option>
          </select>
        </div>

        {/* Company Cards */}
        {isLoading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto text-sky-600" />
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 font-medium">
              {verificationFilter === "verified"
                ? "No verified companies found"
                : verificationFilter === "unverified"
                  ? "No unverified companies found"
                  : "No companies found"}
            </p>
          </div>
        ) : (
          <>
            {/* Result Summary */}
            <div className="flex justify-between mb-3">
              <div className="flex items-center">
                <p className="text-sm text-slate-700 lg:text-base">
                  Showing{" "}
                  <span className="font-semibold">{startIndex + 1}</span> to{" "}
                  <span className="font-semibold">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredCompanies.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {filteredCompanies.length}
                  </span>{" "}
                  results
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {paginatedCompanies.map((company) => (
                <div key={company._id} className="flex flex-col gap-2">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={company.companyLogo || "/default.png"}
                            alt={company.companyName || company.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-xs sm:text-lg text-slate-900 truncate max-w-36 sm:max-w-64">
                              {company.companyName}
                            </p>
                            {company.isCompanyVerified ? (
                              <span
                                title="Company Verified"
                                className="text-sky-500 p-1"
                              >
                                <BadgeCheck className="w-5 h-5" />
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-lg font-medium">
                                Pending Verification
                              </span>
                            )}
                          </div>
                          <p className="flex items-center gap-1 text-[10px] sm:text-sm truncate text-slate-500 mt-1">
                            <MapPin className="w-4 h-4" />
                            {company.companyLocation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex gap-1 flex-wrap py-1 justify-end">
                    <button
                      onClick={() => setSelectedCompany(company._id)}
                      title="View company details"
                      className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-[10px] sm:text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition"
                    >
                      Review Details
                    </button>

                    <button
                      onClick={() => handleMessageCompany(company._id)}
                      title="Send message to company"
                      className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-[10px] sm:text-sm font-semibold border border-gray-300 hover:bg-slate-100 transition"
                    >
                      Message
                    </button>

                    {company?.isCompanyVerified ? (
                      <button
                        onClick={() => handleRemoveVerification(company._id)}
                        title="Verify company"
                        className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-[10px] sm:text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Remove Verification
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerifyCompany(company._id)}
                        title="Verify company"
                        className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-[10px] sm:text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredCompanies.length > itemsPerPage && (
              <div className="mt-8 flex items-center justify-between pb-16">
                {/* Mobile pagination */}
                <div className="flex flex-1 justify-between md:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                {/* Desktop pagination */}
                <div className="hidden md:flex sm:flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-700">
                      Showing{" "}
                      <span className="font-semibold">{startIndex + 1}</span> to{" "}
                      <span className="font-semibold">
                        {Math.min(
                          startIndex + itemsPerPage,
                          filteredCompanies.length,
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold">
                        {filteredCompanies.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex shadow-sm -space-x-px rounded-md">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {getPaginationPages(currentPage, totalPages).map(
                        (page, index) =>
                          page === "..." ? (
                            <span
                              key={`dots-${index}`}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-slate-500 bg-white"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? "z-10 bg-sky-50 border-sky-500 text-sky-600"
                                  : "text-slate-700 border-gray-300 bg-white hover:bg-slate-50"
                              }`}
                            >
                              {page}
                            </button>
                          ),
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

const CompanyModal = ({ companyId, onClose }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.ADMIN.GET_COMPANY_DETAILS(companyId),
        );
        setCompany(response.data);
      } catch {
        toast.error("Failed to fetch company details");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  if (!company) return null;

  return (
    <div className="fixed inset-0 z-1000 bg-black/60 backdrop-blur-sm flex items-start justify-center p-2 overflow-y-auto">
      <div className="bg-slate-50 m-auto rounded-4xl shadow-2xl w-full max-w-5xl relative max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1">
            <h2 className="sm:text-xl font-semibold text-slate-900">
              {company.companyName || "N/A"}
            </h2>
            {company.isCompanyVerified && (
              <span title="Company Verified" className="p-1 text-sky-500">
                <BadgeCheck className="w-5 h-5" />
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="animate-spin text-sky-600 w-10 h-10 mb-4" />
              <p className="text-slate-500 font-medium">Loading details...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Employer Profile Card */}
                <section className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                      <User className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Employer Profile
                    </h3>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2 pb-6 border-b border-slate-50">
                      <div className="w-16 h-16 rounded-full border-2 border-sky-100 p-0.5 shrink-0">
                        <img
                          src={company.avatar || "/default.png"}
                          alt="Avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {company.name || "N/A"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {company.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <InfoItem
                        icon={<User className="w-4 h-4" />}
                        label="User"
                        value={
                          company?.isPremiumUser ? "Premium User" : "Free User"
                        }
                      />
                      <InfoItem
                        icon={<Calendar className="w-4 h-4" />}
                        label="Member Since"
                        value={new Date(company.createdAt).toLocaleDateString()}
                      />
                    </div>
                  </div>
                </section>

                <section className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Company Profile
                    </h3>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2 pb-6 border-b border-slate-50">
                      <img
                        src={company.companyLogo || "/default.png"}
                        alt="Logo"
                        className="w-16 h-16 rounded-xl object-contain border border-slate-100"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 leading-tight">
                          {company.companyName || "N/A"}
                        </p>
                        {company.companyWebsiteLink && (
                          <p className="text-sm text-sky-600 truncate hover:underline cursor-pointer">
                            {company.companyWebsiteLink}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <InfoItem
                        icon={<MapPin className="w-4 h-4" />}
                        label="Company Location"
                        value={company.companyLocation || "N/A"}
                      />
                      <InfoItem
                        icon={<Building2 className="w-4 h-4" />}
                        label="Company Size"
                        value={company.companySize || "Not specified"}
                      />
                      <InfoItem
                        icon={<BriefcaseBusiness className="w-4 h-4" />}
                        label="Total Job Postings"
                        value={company.stats?.postedJobs || 0}
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Documents */}
                <div className="lg:col-span-1">
                  <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                        <FileTextIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-700 tracking-wide">
                        Legal Verification
                      </h4>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      {/* Registration Number */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Registration No.
                        </span>
                        <span className="text-sm font-mono text-slate-800 bg-slate-100 px-3 py-2 rounded-lg">
                          {company.companyRegistrationNumber || "Not provided"}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-200" />

                      {/* PAN */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          PAN / Tax ID
                        </span>
                        <span className="text-sm font-mono text-slate-800 bg-slate-100 px-3 py-2 rounded-lg">
                          {company.panNumber || "Not provided"}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-200" />

                      {/* Warnings */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Admin Warnings
                        </span>
                        <span
                          className={`text-sm font-medium px-3 py-2 rounded-lg ${company.noOfWarnings > 0 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}
                        >
                          {company.noOfWarnings || 0} warning
                          {company.noOfWarnings !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-200" />

                      {/* Ban Status */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Account Status
                        </span>
                        {company.isBanned ? (
                          <span className="text-sm font-medium bg-red-100 text-red-800 px-3 py-2 rounded-lg">
                            Banned: {company.banReason || "No reason provided"}
                          </span>
                        ) : (
                          <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                    About the Organization
                  </h4>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <p className="text-slate-600 text-xs sm:text-sm text-justify">
                      {company.companyDescription ||
                        "No company description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VerifyConfirmationModal = ({
  company,
  onCancel,
  onConfirm,
  verifying,
}) => (
  <div className="fixed inset-0 z-1200 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Verify Company?
        </h3>

        <p className="text-slate-500 text-sm mb-6">
          Verify <strong>{company.companyName}</strong>? This will mark the
          company as verified and display a verification badge.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={verifying}
            className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(company._id)}
            disabled={verifying}
            className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {verifying ? "Verifying..." : "Yes, Verify"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
    <div className="text-sky-600">{icon}</div>
    <div>
      <p className="text-slate-500 text-xs uppercase">{label}</p>
      <p className="font-medium text-slate-900 text-md">{value}</p>
    </div>
  </div>
);

export default AdminCompanyVerification;
