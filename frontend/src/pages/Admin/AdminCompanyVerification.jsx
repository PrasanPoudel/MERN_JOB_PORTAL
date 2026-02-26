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
  ShieldCheck,
  FileText as FileTextIcon,
  Link as LinkIcon,
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

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, verificationFilter, companies]);

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

      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Company Verification
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Review and verify company details
            </p>
          </div>

          <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-semibold">
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
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
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
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">
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
                <p className="text-sm text-gray-700 lg:text-base">
                  Showing <span className="font-bold">{startIndex + 1}</span> to{" "}
                  <span className="font-bold">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredCompanies.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold">{filteredCompanies.length}</span>{" "}
                  results
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {paginatedCompanies.map((company) => (
                <div
                  key={company._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={company.avatar || "/default.png"}
                        alt={company.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-md">
                          {company.name}
                        </p>
                        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                          Employer
                        </span>
                      </div>
                      <p className="flex items-center text-sm text-gray-700 wrap-break-word">
                        {company.companyName}
                        {company.isCompanyVerified && (
                          <BadgeCheck className="w-4 h-4 text-sky-600 ml-1" />
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{company.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center py-2 gap-2 justify-end">
                    <button
                      onClick={() => setSelectedCompany(company._id)}
                      title="View company details"
                      className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition"
                    >
                      Review Details
                    </button>

                    <button
                      onClick={() => handleMessageCompany(company._id)}
                      title="Send message to company"
                      className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Message
                    </button>
                    {!company?.isCompanyVerified && (
                      <button
                        onClick={() => handleVerifyCompany(company._id)}
                        title="Verify company"
                        className="px-2 sm:px-4 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
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
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                {/* Desktop pagination */}
                <div className="hidden md:flex sm:flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-bold">{startIndex + 1}</span> to{" "}
                      <span className="font-bold">
                        {Math.min(
                          startIndex + itemsPerPage,
                          filteredCompanies.length,
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold">
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
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {getPaginationPages(currentPage, totalPages).map(
                        (page, index) =>
                          page === "..." ? (
                            <span
                              key={`dots-${index}`}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white"
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
                                  : "text-gray-700 border-gray-300 bg-white hover:bg-gray-50"
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
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

const CompanyModal = ({ companyId, onClose, onVerify, onMessage }) => {
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

  const handleVerify = async () => {
    try {
      const endpoint = company.isCompanyVerified
        ? API_PATHS.ADMIN.REMOVE_COMPANY_VERIFICATION(company._id)
        : API_PATHS.ADMIN.VERIFY_COMPANY(company._id);

      const response = await axiosInstance.put(endpoint);
      const action = company.isCompanyVerified ? "removed" : "added";
      toast.success(`Company verification ${action} successfully`);

      // Refresh the company data to get updated verification status
      const updatedResponse = await axiosInstance.get(
        API_PATHS.ADMIN.GET_COMPANY_DETAILS(companyId),
      );
      setCompany(updatedResponse.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update verification status",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-1000 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 pt-8 md:pt-16 overflow-y-auto">
      <div className="bg-white m-auto rounded-3xl shadow-2xl w-full max-w-4xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 z-10"
        >
          <X />
        </button>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin mx-auto text-sky-600 w-8 h-8" />
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={company.avatar || "/default.png"}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                    {company.name}
                  </h2>
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                    Employer
                  </span>
                  {company.isCompanyVerified && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm md:text-base truncate">
                  {company.email}
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Building2 className="w-4 h-4" />
                  <span className="flex font-semibold wrap-break-word">
                    {company.companyName}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => onMessage(company._id)}
                className="flex-1 bg-sky-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-sky-700 transition text-sm"
              >
                Send Message
              </button>

              {company.isCompanyVerified ? (
                <button
                  onClick={handleVerify}
                  className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-red-700 transition text-sm"
                >
                  Remove Verification
                </button>
              ) : (
                <button
                  onClick={() => onVerify(company._id)}
                  className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-green-700 transition text-sm"
                >
                  Verify Company
                </button>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <InfoItem
                icon={<Calendar />}
                label="Joined"
                value={new Date(company.createdAt).toLocaleDateString()}
              />
              {company.location && (
                <InfoItem
                  icon={<MapPin />}
                  label="Location"
                  value={company.location}
                />
              )}
              {company.companyLocation && (
                <InfoItem
                  icon={<Building2 />}
                  label="Company Location"
                  value={company.companyLocation}
                />
              )}
              {company.companyWebsiteLink && (
                <InfoItem
                  icon={<LinkIcon />}
                  label="Website"
                  value={company.companyWebsiteLink}
                />
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4" />
                  Company Documents
                </h3>
                <div className="space-y-2">
                  {company.companyRegistrationNumber && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-xs text-gray-600">
                        Registration No:
                      </span>
                      <span className="text-sm font-medium">
                        {company.companyRegistrationNumber}
                      </span>
                    </div>
                  )}
                  {company.panNumber && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-xs text-gray-600">PAN Number:</span>
                      <span className="text-sm font-medium">
                        {company.panNumber}
                      </span>
                    </div>
                  )}
                  {!company.companyRegistrationNumber && !company.panNumber && (
                    <div className="text-xs text-gray-500 italic">
                      No documents provided
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <BriefcaseBusiness />
                  Company Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-gray-600">Posted Jobs:</span>
                    <span className="text-sm font-medium">
                      {company.stats?.postedJobs || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-gray-600">
                      Total Applications:
                    </span>
                    <span className="text-sm font-medium">
                      {company.stats?.totalApplications || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Description */}
            {company.companyDescription && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Company Description
                </h3>
                <p className="text-xs text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed text-justify">
                  {company.companyDescription}
                </p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100 transition text-sm"
              >
                Close
              </button>
            </div>
          </>
        )}
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
  <div className="fixed inset-0 z-1200 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
          <ShieldCheck className="text-green-600 w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Verify Company?
        </h3>

        <p className="text-gray-500 text-sm mb-6">
          Verify <strong>{company.companyName}</strong>? This will mark the
          company as verified and display a verification badge.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={verifying}
            className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100 transition"
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
  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
    <div className="text-sky-600">{icon}</div>
    <div>
      <p className="text-gray-500 text-xs uppercase">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default AdminCompanyVerification;
