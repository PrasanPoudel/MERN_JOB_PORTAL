import Navbar from "../../components/layout/Navbar";
import Chat from "./Chat";

const JobSeekerChatBox = () => {
  return (
    <>
      <Navbar />
      <div className="mt-24">
        <Chat />
      </div>
    </>
  );
};

export default JobSeekerChatBox;
