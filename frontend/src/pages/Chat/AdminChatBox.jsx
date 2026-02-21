import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Chat from "../Chat/Chat";

const AdminChatBox = () => {
  return (
    <DashboardLayout activeMenu={"admin-chat-box"}>
      <Chat isAdmin={true} />
    </DashboardLayout>
  );
};

export default AdminChatBox;
