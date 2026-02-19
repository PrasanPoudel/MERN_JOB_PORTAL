import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  ArrowLeft,
  X,
  MessageCircle,
  Loader,
  BriefcaseBusiness,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import moment from "moment";

const Chat = () => {
  const { user } = useAuth();
  const { applicationId } = useParams();
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

  // Check if mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.MESSAGES.GET_CONVERSATIONS,
      );
      setConversations(response.data || []);

      // If applicationId is provided, select that conversation
      if (applicationId) {
        const selected = response.data?.find(
          (conv) => conv.application._id === applicationId,
        );
        if (selected) {
          setSelectedConversation(selected);
          fetchMessages(applicationId);
        }
      } else if (response.data?.length > 0) {
        setSelectedConversation(response.data[0]);
        fetchMessages(response.data[0].application._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (convId) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.MESSAGES.GET_CONVERSATION(convId),
      );
      setMessages(response.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load messages");
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const response = await axiosInstance.post(
        API_PATHS.MESSAGES.SEND_MESSAGE,
        {
          applicationId: selectedConversation.application._id,
          recipientId:
            user.role === "jobSeeker"
              ? selectedConversation.application.job.company._id
              : selectedConversation.application.applicant._id,
          content: newMessage,
        },
      );

      setMessages([...messages, response.data]);
      setNewMessage("");
      toast.success("Message sent");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error("Chat not available for this application");
      } else {
        toast.error("Failed to send message");
      }
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Auto-refresh messages every 5 seconds
  useEffect(() => {
    if (!selectedConversation) return;

    const interval = setInterval(() => {
      fetchMessages(selectedConversation.application._id);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedConversation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 mb-6">
            <MessageCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
            No active conversations
          </h3>
          {user.role === "jobSeeker" && (
            <>
              <p className="text-sm text-gray-600 mb-6 px-2">
                You can start chatting once your application reaches the
                interview stage
              </p>
              <button
                onClick={() => navigate("/applied-applications")}
                className="bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors duration-200 cursor-pointer"
              >
                View Applications
              </button>
            </>
          )}
          {user.role === "employer" && (
            <>
              <p className="text-sm text-gray-600 mb-6 px-2">
                No job has "In Interview" stage candidate right now.
              </p>
              <button
                onClick={() => navigate("/manage-jobs")}
                className="bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors duration-200 cursor-pointer"
              >
                Manage Jobs
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const getOtherPartyName = (conversation) => {
    if (user.role === "jobSeeker") {
      return conversation.companyName || "Employer";
    } else {
      return conversation.applicantName || "Applicant";
    }
  };

  const getOtherPartyAvatar = (conversation) => {
    if (user.role === "jobSeeker") {
      return conversation.application?.job?.company?.avatar;
    } else {
      return conversation.applicantAvatar;
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-5rem)] flex bg-white">
        {/* Sidebar - Conversations List */}
        <div
          className={`${
            isMobile
              ? `fixed inset-0 top-20 transition-transform duration-200 transform z-40 ${
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
            {conversations.map((conversation) => (
              <button
                key={conversation.application._id}
                onClick={() => {
                  setSelectedConversation(conversation);
                  fetchMessages(conversation.application._id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full py-2 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 flex gap-3 items-start ${
                  selectedConversation?.application._id ===
                  conversation.application._id
                    ? "bg-sky-50"
                    : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {getOtherPartyAvatar(conversation) ? (
                    <img
                      src={getOtherPartyAvatar(conversation)}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sky-600 font-semibold text-sm">
                      {getOtherPartyName(conversation).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div>
                    <p className="font-semibold text-gray-900 truncate text-sm">
                      {getOtherPartyName(conversation)}
                    </p>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-gray-600 truncate mb-1">
                    <BriefcaseBusiness className="w-4 h-4" />
                    {conversation.jobTitle}
                  </p>
                  {conversation.lastMessage && (
                    <div className="flex items-baseline gap-2 text-xs text-gray-600 break-all justify-between mb-1">
                     <p className="flex gap-2 items-center">
                      {conversation.unreadCount > 0 && (
                        <span className="inline-block bg-sky-600 text-white text-xs rounded-full px-2 py-0.5">
                          {conversation.unreadCount}
                        </span>
                      )}
                      <span className="truncate max-w-36">
                        {conversation.lastMessage.content}
                      </span>
                      </p>
                      <span className="text-xs text-gray-700 shrink-0">
                        {conversation.lastMessage
                          ? moment(conversation.lastMessage.createdAt).format(
                              "LT",
                            )
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden">
                  {getOtherPartyAvatar(selectedConversation) ? (
                    <img
                      src={getOtherPartyAvatar(selectedConversation)}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sky-600 font-semibold text-xs">
                      {getOtherPartyName(selectedConversation)
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">
                    {getOtherPartyName(selectedConversation)}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <BriefcaseBusiness className="w-4 h-4 " />
                    {selectedConversation.jobTitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwnMessage = message.sender._id === user._id;
                  const previousMessage =
                    index > 0 ? messages[index - 1] : null;
                  const showDateDivider = previousMessage
                    ? moment(message.createdAt).diff(
                        moment(previousMessage.createdAt),
                        "hours",
                      ) >= 6
                    : true;

                  const showTimestamp = previousMessage
                    ? moment(message.createdAt).diff(
                        moment(previousMessage.createdAt),
                        "minutes",
                      ) >= 15
                    : true;

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
                          className={`flex gap-2 max-w-xs ${
                            isOwnMessage ? "flex-row-reverse" : ""
                          }`}
                        >
                          {!isOwnMessage && (
                            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0 overflow-hidden text-xs font-semibold text-sky-600">
                              {message.sender.avatar ? (
                                <img
                                  src={message.sender.avatar}
                                  alt={message.sender.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                message.sender.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          )}
                          <div
                            className={`flex flex-col ${isOwnMessage ? "items-end" : ""}`}
                          >
                            <div
                              className={`text-sm sm:text-base px-4 py-2 rounded-2xl ${
                                isOwnMessage
                                  ? "bg-sky-600 text-white rounded-br-none"
                                  : "bg-white border border-gray-200 rounded-bl-none text-gray-900"
                              } break-all`}
                            >
                              {message.content}
                            </div>
                            {showTimestamp && (
                              <span className="text-xs text-gray-500 mt-1 px-2">
                                {moment(message.createdAt).format(
                                  "MMM DD, HH:mm",
                                )}
                              </span>
                            )}
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
                  className="flex bg-sky-600 text-white p-3 rounded-full hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
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

      {/* Mobile overlay for sidebar */}
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
