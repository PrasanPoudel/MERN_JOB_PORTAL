import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  ArrowLeft,
  X,
  MessageCircle,
  Loader,
  BriefcaseBusiness,
  UserCheck,
  Check,
  CheckCheck,
  User,
  ArrowRight,
  Mail,
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
        let adminConversations = (response.data || []).map((conv) => ({
          application: { _id: conv.user._id },
          user: conv.user,
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount,
        }));

        if (
          userIdParam &&
          !adminConversations.find((c) => c.user._id === userIdParam)
        ) {
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
                className="bg-sky-600 text-white px-8 py-3.5 rounded-xl  hover:bg-sky-700 transition-all duration-200 shadow-md shadow-sky-600/30 hover:shadow-lg hover:shadow-sky-600/40 hover:-translate-y-0.5"
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
                    className="bg-sky-600 text-white px-8 py-3.5 rounded-xl  hover:bg-sky-700 transition-all duration-200 shadow-md shadow-sky-600/30 hover:shadow-lg hover:shadow-sky-600/40 hover:-translate-y-0.5"
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
                    className="bg-sky-600 text-white px-8 py-3.5 rounded-xl  hover:bg-sky-700 transition-all duration-200 shadow-md shadow-sky-600/30 hover:shadow-lg hover:shadow-sky-600/40 hover:-translate-y-0.5"
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
      <div className="h-[calc(100vh-5rem)] flex bg-linear-to-br from-gray-50 to-white">
        <div
          className={`${
            isMobile
              ? `fixed inset-0 top-20 transition-transform duration-300 ease-in-out z-40 ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "w-full md:w-96 lg:w-104"
          } bg-white border-r border-gray-200 flex flex-col shadow-lg md:shadow-none`}
        >
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-white to-gray-50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {conversations.length} conversation
                {conversations.length !== 1 ? "s" : ""}
              </p>
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
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
                  className={`w-full p-2 border-b border-gray-100 hover:bg-gray-100 transition-all duration-200 flex gap-2 items-start group ${
                    isSelected
                      ? "bg-sky-50 hover:bg-sky-100 border-l-4 border-l-sky-600"
                      : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-sky-100 to-sky-200 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
                      <img
                        src={getOtherPartyAvatar(conv) || "/default.png"}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-sky-600 text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-md">
                        {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-baseline justify-between mb-1">
                      <p className=" text-gray-900 truncate text-base">
                        {getOtherPartyName(conv)}
                      </p>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-500 shrink-0 ml-2 font-medium">
                          {moment(conv.lastMessage.createdAt).calendar(null, {
                            sameDay: "LT",
                            lastDay: "[Yesterday]",
                            lastWeek: "ddd",
                            sameElse: "MMM D",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-gray-600 truncate mb-2">
                      {isAdmin ? (
                        <>
                          {conv.user.role === "employer" ? (
                            <>
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              {conv.user.email}
                            </>
                          ) : (
                            <>
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              {conv.user.email}
                            </>
                          )}
                        </>
                      ) : conv.isAdminConversation ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span className="text-sky-600 font-medium">
                            KAAMSETU
                          </span>
                        </>
                      ) : (
                        <>
                          {user.role === "jobSeeker" ? (
                            <>
                              <BriefcaseBusiness className="w-3.5 h-3.5 shrink-0" />
                              {conv.jobTitle}
                            </>
                          ) : (
                            <>
                              <BriefcaseBusiness className="w-3.5 h-3.5 shrink-0" />
                              {conv.jobTitle}
                            </>
                          )}
                        </>
                      )}
                    </p>
                    {conv.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedConversation ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <div className="border-b border-gray-200 px-4 md:px-6 py-4 flex items-center gap-3 bg-white shadow-sm">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-xl shrink-0 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-sky-100 to-sky-200 flex items-center justify-center overflow-hidden shadow-sm">
                  <img
                    src={
                      getOtherPartyAvatar(selectedConversation) ||
                      "/default.png"
                    }
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-base truncate">
                  {getOtherPartyName(selectedConversation)}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-gray-500 truncate mt-0.5">
                  {isAdmin ? (
                    selectedConversation.user.role === "employer" ? (
                      <BriefcaseBusiness className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                    )
                  ) : selectedConversation.isAdminConversation ? (
                    <UserCheck className="w-3.5 h-3.5 shrink-0 text-sky-600" />
                  ) : user.role === "jobSeeker" ? (
                    <BriefcaseBusiness className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <div className="flex gap-1 items-center">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      <BriefcaseBusiness className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  )}
                  <span className="truncate font-medium">
                    {getJobTitle(selectedConversation)}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4 bg-linear-to-br from-gray-50 via-white to-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-linear-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No messages yet. Start the conversation!
                    </p>
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
                        <div className="flex items-center justify-center my-6">
                          <div className="flex-1 border-t border-gray-200"></div>
                          <span className="px-4 py-1.5 text-xs text-gray-500  bg-white rounded-full shadow-sm border border-gray-200">
                            {moment(message.createdAt).calendar(null, {
                              sameDay: "[Today]",
                              lastDay: "[Yesterday]",
                              lastWeek: "dddd",
                              sameElse: "MMM DD, YYYY",
                            })}
                          </span>
                          <div className="flex-1 border-t border-gray-200"></div>
                        </div>
                      )}
                      <div
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      >
                        <div
                          className={`flex gap-2.5 max-w-[85%] sm:max-w-lg ${isOwnMessage ? "flex-row-reverse" : ""}`}
                        >
                          {!isOwnMessage && (
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-sky-100 to-sky-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm mt-auto">
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
                              className={`text-sm px-4 py-2.5 rounded-2xl wrap-break-word shadow-sm ${
                                isOwnMessage
                                  ? "bg-sky-600 text-white rounded-br-md"
                                  : "bg-white border border-gray-200 rounded-bl-md text-gray-900"
                              }`}
                            >
                              {message.content}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 px-1">
                              <span className="text-xs text-gray-400 font-medium">
                                {moment(message.createdAt).format("HH:mm")}
                              </span>
                              {isOwnMessage && (
                                <>
                                  {message.read ? (
                                    <CheckCheck className="w-4 h-4 text-sky-600" />
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

            <div className="border-t border-gray-200 p-4 md:p-6 bg-white shadow-md">
              <div className="flex gap-3 max-w-4xl mx-auto">
                <input
                  id="chatbox"
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
                  className="flex-1 px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm transition-all duration-200 placeholder:text-gray-400"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-sky-600 text-white p-3.5 rounded-2xl hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0 shadow-md shadow-sky-600/30 hover:shadow-lg hover:shadow-sky-600/40 hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
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
          <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-lg">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

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
