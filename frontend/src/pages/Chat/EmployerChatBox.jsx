import React from 'react'
import DashboardLayout from "../../components/layout/DashboardLayout";
import Chat from "./Chat";

const EmployerChatBox = () => {
  return (
    <DashboardLayout activeMenu={"EmployerChatBox"}>
      <Chat/>
    </DashboardLayout>
  )
}

export default EmployerChatBox