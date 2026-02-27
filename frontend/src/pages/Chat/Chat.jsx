import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  ArrowLeft,
  X,
  MessageCircle,
  Loader,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  User,
  ArrowRight,
  Mail,
  Search,
  MessageSquareMore,
  ShieldCheck,
} from "lucide-react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import moment from "moment";

const Chat = ({ isAdmin = false }) => {
  const { user } = useAuth();
  const { applicationId } = useParams();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get("userId");
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start polling when component mounts
  useEffect(() => {
    // Start polling for conversations and messages
    const interval = setInterval(() => {
      if (selectedConversation) {
        fetchMessages(getConvId(selectedConversation));
      }
      fetchConversations();
    }, 5000); // Poll every 5 seconds

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedConversation]);

  const getConvId = (conv) => {
    if (isAdmin) return conv.user._id;
    if (conv.isAdminConversation) return "admin";
    return conv.application._id;
  };

  const fetchConversations = async () => {
    try {
      if (isAdmin) {
        const response = await axiosInstance.get(
          API_PATHS.ADMIN.GET_ADMIN_CONVERSATIONS,
        );
        let adminConversations = (response.data || [])
          .filter((conv) => conv.user)
          .map((conv) => ({
            application: { _id: conv.user._id },
            user: conv.user,
            lastMessage: conv.lastMessage,
            unreadCount: conv.unreadCount,
          }));

        if (
          userIdParam &&
          !adminConversations.find((c) => c.user._id === userIdParam)
        ) {
          try {
            const userResponse = await axiosInstance.get(
              API_PATHS.ADMIN.GET_USER_BY_ID(userIdParam),
            );
            const newConv = {
              application: { _id: userIdParam },
              user: userResponse.data,
              lastMessage: null,
              unreadCount: 0,
            };
            adminConversations = [newConv, ...adminConversations];
            setSelectedConversation(newConv);
            fetchMessages(userIdParam);
          } catch (userErr) {
            console.error("User not found:", userIdParam);
            toast.error("User not found or has been deleted");
          }
        } else if (userIdParam) {
          const selected = adminConversations.find(
            (c) => c.user._id === userIdParam,
          );
          if (selected && !selectedConversation) {
            setSelectedConversation(selected);
            fetchMessages(userIdParam);
          }
        } else if (adminConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(adminConversations[0]);
          fetchMessages(adminConversations[0].user._id);
        }

        setConversations(adminConversations);
      } else {
        const [appResponse, adminResponse] = await Promise.all([
          axiosInstance.get(API_PATHS.MESSAGES.GET_CONVERSATIONS),
          axiosInstance.get(API_PATHS.MESSAGES.GET_ADMIN_MESSAGES),
        ]);

        let adminConversation = null;
        if (adminResponse.data?.length > 0) {
          const adminMsg = adminResponse.data.find(
            (msg) => msg.senderRole === "admin",
          );
          const adminUser =
            adminMsg?.sender ||
            adminResponse.data.find((msg) => msg.recipient)?.recipient;
          if (adminUser) {
            adminConversation = {
              isAdminConversation: true,
              application: { _id: "admin" },
              user: adminUser,
              lastMessage: adminResponse.data[adminResponse.data.length - 1],
              unreadCount: adminResponse.data.filter(
                (msg) => !msg.read && msg.senderRole === "admin",
              ).length,
            };
          }
        }

        const allConversations = adminConversation
          ? [adminConversation, ...(appResponse.data || [])]
          : appResponse.data || [];
        setConversations(allConversations);

        if (applicationId) {
          const selected = allConversations.find(
            (conv) => conv.application._id === applicationId,
          );
          if (selected && !selectedConversation) {
            setSelectedConversation(selected);
            fetchMessages(applicationId);
          }
        } else if (allConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(allConversations[0]);
          fetchMessages(getConvId(allConversations[0]));
        }
      }
    } catch (err) {
      console.error("Error loading conversations:", err);
      // Log error to console only, don't show toast for polling failures
    } finally {
      // Always set loading to false after the initial fetch attempt
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      let response;
      if (isAdmin) {
        response = await axiosInstance.get(
          API_PATHS.ADMIN.GET_ADMIN_CONVERSATION(convId),
        );
      } else if (convId === "admin") {
        response = await axiosInstance.get(
          API_PATHS.MESSAGES.GET_ADMIN_MESSAGES,
        );
      } else {
        response = await axiosInstance.get(
          API_PATHS.MESSAGES.GET_CONVERSATION(convId),
        );
      }

      const newMessages = response.data || [];
      setMessages(newMessages);

      // Update last message time for polling optimization
      if (newMessages.length > 0) {
        const latestMessage = newMessages[newMessages.length - 1];
      }
    } catch (err) {
      console.error(err);
      // Don't show error toast for polling failures to avoid spam
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      let response;

      if (isAdmin) {
        response = await axiosInstance.post(
          API_PATHS.ADMIN.SEND_ADMIN_MESSAGE,
          {
            recipientId: selectedConversation.user._id,
            content: newMessage,
          },
        );
      } else if (selectedConversation.isAdminConversation) {
        response = await axiosInstance.post(API_PATHS.MESSAGES.SEND_TO_ADMIN, {
          content: newMessage,
        });
      } else {
        response = await axiosInstance.post(API_PATHS.MESSAGES.SEND_MESSAGE, {
          applicationId: selectedConversation.application._id,
          recipientId:
            user.role === "jobSeeker"
              ? selectedConversation.application.job.company._id
              : selectedConversation.application.applicant._id,
          content: newMessage,
        });
      }

      setMessages([...messages, response.data]);
      setNewMessage("");

      // Refresh conversations to update last message
      fetchConversations();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader className="w-10 h-10 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-medium">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0 && !selectedConversation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-linear-to-br from-sky-100 to-sky-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-sky-100">
            <MessageCircle className="w-10 h-10 text-sky-600" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">
            No active conversations
          </h3>
          {isAdmin ? (
            <>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Start a conversation by selecting a user from the user
                management panel
              </p>
              <button
                onClick={() => navigate("/admin-users-management")}
                className="bg-sky-600 text-white px-8 py-3.5 rounded-xl  hover:bg-sky-700 transition-all duration-200 shadow-md shadow-sky-600/30 hover:shadow-md hover:shadow-sky-600/40 hover:-translate-y-0.5"
              >
                Manage Users
              </button>
            </>
          ) : (
            <>
              {user.role === "jobSeeker" && (
                <>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    You can start chatting once your application reaches the
                    interview stage
                  </p>
                  <button
                    onClick={() => navigate("/applied-applications")}
                    className="bg-sky-600 text-white px-8 py-3.5 rounded-xl  hover:bg-sky-700 transition-all duration-200 shadow-md shadow-sky-600/30 hover:shadow-md hover:shadow-sky-600/40 hover:-translate-y-0.5"
                  >
                    View Applications
                  </button>
                </>
              )}
              {user.role === "employer" && (
                <>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    No job has "In Interview" stage candidate right now.
                  </p>
                  <button
                    onClick={() => navigate("/manage-jobs")}
                    className="bg-sky-600 text-white px-8 py-3.5 rounded-xl  hover:bg-sky-700 transition-all duration-200 shadow-md shadow-sky-600/30 hover:shadow-md hover:shadow-sky-600/40 hover:-translate-y-0.5"
                  >
                    Manage Jobs
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  const getOtherPartyName = (conv) => {
    if (isAdmin) return conv.user.name;
    if (conv.isAdminConversation) return "Admin";
    return user.role === "jobSeeker"
      ? conv.companyName || "Employer"
      : conv.applicantName || "Applicant";
  };

  const getOtherPartyAvatar = (conv) => {
    if (isAdmin) return conv.user.avatar;
    if (conv.isAdminConversation) return conv.user?.avatar;
    return user.role === "jobSeeker"
      ? conv.application?.job?.company?.avatar
      : conv.applicantAvatar;
  };

  const getJobTitle = (conv) => {
    if (isAdmin) return conv.user.email;
    if (conv.isAdminConversation) return "KAAMSETU";
    return conv.jobTitle || "Job Application";
  };

  return (
    <>
      <div className="h-[calc(100vh-5rem)] flex bg-linear-to-br from-slate-50 via-gray-50 to-slate-100">
        {/* Sidebar - Conversations List */}
        <div
          className={`${
            isMobile
              ? `fixed inset-0 top-16 transition-transform duration-300 ease-in-out z-100 ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "w-full md:w-96 lg:w-104"
          } bg-white border-r border-gray-200/70 flex flex-col shadow-lg md:shadow-none`}
        >
          {/* Header */}
          <div className="p-2 border border-gray-200/70 bg-linear-to-r from-white to-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl pt-2 font-semibold text-gray-900 tracking-tight">
                  Messages
                </h2>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  {conversations.length} conversation
                  {conversations.length !== 1 ? "s" : ""}
                </p>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Search & Filter Section */}
          <div className="p-4 border-b border-gray-200/70 bg-gray-50/50">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="search_conversations"
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    filterType === "all"
                      ? "bg-sky-100 text-sky-700 border border-sky-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("unread")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    filterType === "unread"
                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilterType("recent")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    filterType === "recent"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Recent
                </button>
              </div>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {(selectedConversation && conversations.length === 0
              ? [selectedConversation]
              : conversations
            )
              .filter((conv) => {
                if (!searchQuery.trim()) return true;
                const searchLower = searchQuery.toLowerCase();
                return (
                  getOtherPartyName(conv).toLowerCase().includes(searchLower) ||
                  getJobTitle(conv).toLowerCase().includes(searchLower)
                );
              })
              .filter((conv) => {
                if (filterType === "unread") return conv.unreadCount > 0;
                if (filterType === "recent") {
                  const lastMsgTime = conv.lastMessage?.createdAt;
                  if (!lastMsgTime) return false;
                  const daysAgo = moment().diff(moment(lastMsgTime), "days");
                  return daysAgo <= 3;
                }
                return true;
              })
              .map((conv) => {
                const isSelected = isAdmin
                  ? selectedConversation?.user._id === conv.user._id
                  : conv.isAdminConversation
                    ? selectedConversation?.isAdminConversation
                    : selectedConversation?.application._id ===
                      conv.application._id;

                return (
                  <button
                    key={getConvId(conv)}
                    onClick={() => {
                      setSelectedConversation(conv);
                      fetchMessages(getConvId(conv));
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`w-full p-4 border-b border-gray-100/70 hover:bg-gray-50/70 transition-all duration-200 flex gap-3 items-start group ${
                      isSelected
                        ? "bg-sky-100 hover:bg-sky-100 border-l-4 border-l-sky-600"
                        : "border-l-4 border-l-transparent"
                    }`}
                  >
                    {/* Avatar Section */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-sky-100 to-sky-200 flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-md transition-all duration-300">
                        <img
                          src={getOtherPartyAvatar(conv) || "/default.png"}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-7 h-7 bg-linear-to-br from-sky-600 to-sky-700 text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-md border-2 border-white animate-pulse">
                          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 text-left space-y-1">
                      {/* Name & Time Row */}
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900 font-semibold text-base truncate leading-tight">
                          {getOtherPartyName(conv)}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-linear-to-br from-sky-600 to-sky-700 text-white animate-pulse shadow-md">
                            {conv.unreadCount} new
                          </span>
                        )}
                      </div>

                      {/* Badges Row */}
                      <div className="flex flex-col items-start">
                        {isAdmin ? (
                          <span className="text-xs">{conv.user.email}</span>
                        ) : conv.isAdminConversation ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-sky-100 to-sky-200 text-sky-700 border border-sky-300 shadow-sm">
                            <ShieldCheck className="w-4 h-4 mr-2 text-sky-600" />
                            Admin Support
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-green-100 to-green-200 text-green-700 border border-green-300 shadow-sm">
                            <BriefcaseBusiness className="w-4 h-4 mr-2 text-green-600" />
                            {conv.jobTitle || "Job Application"}
                          </span>
                        )}

                        {isAdmin && conv.user && (
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                              conv.user.role === "employer"
                                ? "bg-linear-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300 shadow-sm"
                                : "bg-linear-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-300 shadow-sm"
                            }`}
                          >
                            {conv.user.role === "employer" ? (
                              <BriefcaseBusiness className="w-4 h-4 mr-2 text-blue-600" />
                            ) : (
                              <User className="w-4 h-4 mr-2 text-purple-600" />
                            )}
                            {conv.user.role === "employer"
                              ? "Employer"
                              : "Job Seeker"}
                          </span>
                        )}
                      </div>

                      {/* Message Preview Row */}
                      {conv.lastMessage && (
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="truncate flex gap-1 flex-1 font-medium">
                            <MessageSquareMore className="w-4 h-4 text-gray-900" />
                            {conv.lastMessage.content.length > 100
                              ? conv.lastMessage.content.substring(0, 100) +
                                "..."
                              : conv.lastMessage.content}
                          </span>
                          <div className="flex items-center gap-2 text-gray-400 ml-2">
                            <span className="text-xs font-medium">
                              {moment(conv.lastMessage.createdAt).format(
                                "HH:mm",
                              )}
                            </span>
                            {conv.lastMessage.sender._id === user._id && (
                              <CheckCheck className="w-4 h-4 text-sky-600" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Main Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="border border-l-0 bg-white border-gray-200 p-2 bg-linear-to-r shadow-sm z-10">
              <div className="flex items-center gap-2">
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
                    <img
                      src={
                        getOtherPartyAvatar(selectedConversation) ||
                        "/default.png"
                      }
                      alt="User"
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-md tracking-tight truncate">
                    {getOtherPartyName(selectedConversation)}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-600 font-medium mt-1">
                    {isAdmin ? (
                      selectedConversation.user.role === "employer" ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )
                    ) : selectedConversation.isAdminConversation ? (
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                    ) : user.role === "jobSeeker" ? (
                      <BriefcaseBusiness className="w-4 h-4" />
                    ) : (
                      <div className="flex gap-1 items-center">
                        <User className="w-4 h-4" />
                        <ArrowRight className="w-4 h-4" />
                        <BriefcaseBusiness className="w-4 h-4" />
                      </div>
                    )}
                    <span className="truncate font-medium text-xs max-w-32 sm:max-w-48 text-gray-700">
                      {getJobTitle(selectedConversation)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4 bg-linear-to-br from-gray-50 via-white to-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto shadow-md">
                      <MessageCircle className="w-10 h-10 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold text-lg">
                        No messages yet.
                      </p>
                      <p className="text-gray-500 text-sm">
                        Start the conversation!
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <div
                        className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwnMessage = message.sender._id === user._id;
                  const prevMessage = index > 0 ? messages[index - 1] : null;
                  const showDateDivider =
                    !prevMessage ||
                    moment(message.createdAt).diff(
                      moment(prevMessage.createdAt),
                      "hours",
                    ) >= 6;

                  return (
                    <div key={message._id}>
                      {showDateDivider && (
                        <div className="flex items-center justify-center my-8">
                          <div className="flex-1 border-t border-gray-200/70"></div>
                          <span className="px-4 py-2 text-xs text-gray-500 font-medium bg-white rounded-full shadow-sm border border-gray-200/70 mx-4">
                            {moment(message.createdAt).calendar(null, {
                              sameDay: "[Today]",
                              lastDay: "[Yesterday]",
                              lastWeek: "dddd",
                              sameElse: "MMM DD, YYYY",
                            })}
                          </span>
                          <div className="flex-1 border-t border-gray-200/70"></div>
                        </div>
                      )}
                      <div
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                      >
                        <div
                          className={`flex gap-3 max-w-[85%] sm:max-w-lg ${isOwnMessage ? "flex-row-reverse" : ""}`}
                        >
                          {!isOwnMessage && (
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-sky-100 to-sky-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm mt-auto">
                              <img
                                src={message.sender.avatar || "/default.png"}
                                alt={message.sender.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div
                            className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`text-sm px-4 py-3 rounded-2xl wrap-break-word shadow-md ${
                                isOwnMessage
                                  ? "bg-linear-to-br from-sky-600 to-sky-700 text-white rounded-br-sm"
                                  : "bg-white border border-gray-200/70 rounded-bl-sm text-gray-900"
                              }`}
                            >
                              {message.content}
                            </div>
                            <div className="flex items-center gap-2 mt-2 px-1">
                              <span className="text-xs text-gray-500 font-medium">
                                {moment(message.createdAt).format("HH:mm")}
                              </span>
                              {isOwnMessage && (
                                <>
                                  {message.read ? (
                                    <CheckCheck className="w-4 h-4 text-sky-200" />
                                  ) : (
                                    <Check className="w-4 h-4 text-gray-400" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200/70 p-2 bg-white shadow-md">
              <div className="flex gap-4 max-w-5xl mx-auto">
                <div className="relative flex-1">
                  <input
                    autoComplete="off"
                    id="send_messages"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full p-4 pr-12 bg-white border border-gray-300 rounded-2xl focus:outline-none text-sm transition-all duration-200 placeholder:text-gray-400 shadow-sm outline-0"
                    disabled={sending}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-linear-to-br from-sky-600 to-sky-700 text-white p-4 rounded-2xl hover:from-sky-700 hover:to-sky-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0 shadow-md shadow-sky-600/30 hover:shadow-md hover:shadow-sky-600/40 hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
                >
                  {sending ? (
                    <div className="flex items-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span className="text-base">Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      <span className="text-base font-medium">Send</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-50">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-24 h-24 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <MessageCircle className="w-12 h-12 text-slate-500" />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                  Select a conversation
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Choose a conversation from the list to start chatting. Your
                  messages will appear here.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <div
                  className="w-3 h-3 bg-sky-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-sky-500 rounded-full animate-pulse"
                  style={{ animationDelay: "200ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-sky-500 rounded-full animate-pulse"
                  style={{ animationDelay: "400ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 top-20 bg-black/40 z-30 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Chat;
