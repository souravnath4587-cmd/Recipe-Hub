"use client";
import DashboardSideBar from "../components/components/DashboardSidebar";
import Navbar from "../components/Navbar";
import { authClient } from "../lib/auth-client";
import { useHydrated } from "../lib/useHydrated";

const DashBoardLayoutPage = ({ children }) => {
  const hydrated = useHydrated();
  const { data: session } = authClient.useSession();
  // Same hydration guard as Navbar: the server cannot see the client session,
  // so the first client render must not read it either.
  const user = hydrated ? session?.user : null;
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
