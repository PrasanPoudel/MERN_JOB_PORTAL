import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  ArrowLeft,
  X,
  MessageCircle,
  Loader,
  BriefcaseBusiness,
  ShieldUser,
  Check,
  CheckCheck,
  Users,
  ArrowRight,
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

  const getConvId = (conv) => {
    if (isAdmin) return conv.user._id;
    if (conv.isAdminConversation) return "admin";
    return conv.application._id;
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);

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
          setSelectedConversation(selected);
          fetchMessages(userIdParam);
        } else if (adminConversations.length > 0) {
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
          if (selected) {
            setSelectedConversation(selected);
            fetchMessages(applicationId);
          }
        } else if (allConversations.length > 0) {
          setSelectedConversation(allConversations[0]);
          fetchMessages(getConvId(allConversations[0]));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to load conversations",
      );
    } finally {
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
      setMessages(response.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load messages");
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

  useEffect(() => {
    if (!selectedConversation) return;
    const interval = setInterval(
      () => fetchMessages(getConvId(selectedConversation)),
      5000,
    );
    return () => clearInterval(interval);
  }, [selectedConversation, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (conversations.length === 0 && !selectedConversation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-6" />
          <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
            No active conversations
          </h3>
          {isAdmin ? (
            <>
              <p className="text-sm text-gray-600 mb-6">
                Start a conversation by selecting a user from the user
                management panel
              </p>
              <button
                onClick={() => navigate("/admin-users-management")}
                className="bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
              >
                Manage Users
              </button>
            </>
          ) : (
            <>
              {user.role === "jobSeeker" && (
                <>
                  <p className="text-sm text-gray-600 mb-6">
                    You can start chatting once your application reaches the
                    interview stage
                  </p>
                  <button
                    onClick={() => navigate("/applied-applications")}
                    className="bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
                  >
                    View Applications
                  </button>
                </>
              )}
              {user.role === "employer" && (
                <>
                  <p className="text-sm text-gray-600 mb-6">
                    No job has "In Interview" stage candidate right now.
                  </p>
                  <button
                    onClick={() => navigate("/manage-jobs")}
                    className="bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
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
    if (conv.isAdminConversation) return "Platform Admin";
    return conv.jobTitle || "Job Application";
  };

  return (
    <>
      <div className="h-[calc(100vh-5rem)] flex bg-white">
        {/* Sidebar */}
        <div
          className={`${
            isMobile
              ? `fixed inset-0 top-20 transition-transform duration-200 z-40 ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "w-80"
          } bg-white border-r border-gray-200 flex flex-col`}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {(selectedConversation && conversations.length === 0
              ? [selectedConversation]
              : conversations
            ).map((conv) => {
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
                  className={`w-full py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex gap-3 items-start ${
                    isSelected ? "bg-sky-50" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={getOtherPartyAvatar(conv) || "/default.png"}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-gray-900 truncate text-sm">
                      {getOtherPartyName(conv)}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-gray-600 truncate mb-1">
                      {isAdmin ? (
                        <>
                          {conv.user.role === "employer" ? (
                            <>
                              <BriefcaseBusiness className="w-4 h-4" />
                              {conv.user.email}
                            </>
                          ) : (
                            <>
                              <Users className="w-4 h-4" />
                              {conv.user.email}
                            </>
                          )}
                        </>
                      ) : conv.isAdminConversation ? (
                        <>
                          <ShieldUser className="w-4 h-4 text-sky-600" />
                          Platform Admin
                        </>
                      ) : (
                        <>
                          {user.role === "jobSeeker" ? (
                            <>
                              <BriefcaseBusiness className="w-4 h-4" />
                              {conv.jobTitle}
                            </>
                          ) : (
                            <>
                              <Users className="w-4 h-4" />
                              {conv.jobTitle}
                            </>
                          )}
                        </>
                      )}
                    </p>
                    {conv.lastMessage && (
                      <div className="flex items-baseline gap-2 text-xs text-gray-600 justify-between">
                        <p className="flex gap-2 items-center min-w-0">
                          {conv.unreadCount > 0 && (
                            <span className="inline-block bg-sky-600 text-white text-xs rounded-full px-2 py-0.5 shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                          <span className="truncate">
                            {conv.lastMessage.content}
                          </span>
                        </p>
                        <span className="text-xs text-gray-700 shrink-0 ml-2">
                          {moment(conv.lastMessage.createdAt).format("LT")}
                        </span>
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
            {/* Header */}
            <div className="border-b border-gray-200 p-4 flex items-center gap-3 bg-white">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={getOtherPartyAvatar(selectedConversation) || "/default.png"}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {getOtherPartyName(selectedConversation)}
                </p>
                <p className="flex items-center gap-2 text-xs text-gray-500 truncate">
                  {isAdmin ? (
                    selectedConversation.user.role === "employer" ? (
                      <BriefcaseBusiness className="w-4 h-4 shrink-0" />
                    ) : (
                      <Users className="w-4 h-4 shrink-0" />
                    )
                  ) : selectedConversation.isAdminConversation ? (
                    <ShieldUser className="w-4 h-4 shrink-0 text-sky-600" />
                  ) : user.role === "jobSeeker" ? (
                    <BriefcaseBusiness className="w-4 h-4 shrink-0" />
                  ) : (
                    <div className="flex gap-1 items-center">
                      <Users className="w-4 h-4 shrink-0" />
                      <ArrowRight className="w-4 h-4 shrink-0" />
                      <BriefcaseBusiness className="w-4 h-4 shrink-0" />
                    </div>
                  )}
                  <span className="truncate">
                    {getJobTitle(selectedConversation)}
                  </span>
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
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
                        <div className="flex items-center justify-center my-4">
                          <div className="flex-1 border-t border-gray-300"></div>
                          <span className="px-3 text-xs text-gray-500 font-medium">
                            {moment(message.createdAt).format("MMM DD, YYYY")}
                          </span>
                          <div className="flex-1 border-t border-gray-300"></div>
                        </div>
                      )}
                      <div
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-2 max-w-[75%] sm:max-w-md ${isOwnMessage ? "flex-row-reverse" : ""}`}
                        >
                          {!isOwnMessage && (
                            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0 overflow-hidden">
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
                              className={`text-sm px-4 py-2 rounded-2xl break-words ${
                                isOwnMessage
                                  ? "bg-sky-600 text-white rounded-br-none"
                                  : "bg-white border border-gray-200 rounded-bl-none text-gray-900"
                              }`}
                            >
                              {message.content}
                            </div>
                            <div className="flex items-center gap-1 mt-1 px-1">
                              <span className="text-xs text-gray-500">
                                {moment(message.createdAt).format("HH:mm")}
                              </span>
                              {isOwnMessage && (
                                <>
                                  {message.read ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-sky-600" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-gray-400" />
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

            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-sky-600 text-white p-3 rounded-full hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
                >
                  {sending ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 top-20 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Chat;
