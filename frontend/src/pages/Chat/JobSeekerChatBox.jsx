import Navbar from "../../components/layout/Navbar";
import React from "react";
import Chat from "./Chat";

const JobSeekerChatBox = () => {
  return (
    <>
      <Navbar />
      <div className="mt-16">
        <Chat />
      </div>
    </>
  );
};

export default JobSeekerChatBox;
