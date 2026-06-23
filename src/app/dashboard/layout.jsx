"use client";
import DashboardSideBar from "../components/components/DashboardSidebar";
import Navbar from "../components/Navbar";
import { authClient } from "../lib/auth-client";

const DashBoardLayoutPage = ({ children }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-row">
        {/* Sidebar */}
        <DashboardSideBar user={user} />

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </>
  );
};

export default DashBoardLayoutPage;
