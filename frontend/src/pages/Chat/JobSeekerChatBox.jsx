import Navbar from "../../components/layout/Navbar";
import Chat from "./Chat";

const JobSeekerChatBox = () => {
  return (
    <>
      <Navbar />
      <div className="mt-16 sm:px-4">
        <Chat />
      </div>
    </>
  );
};

export default JobSeekerChatBox;
