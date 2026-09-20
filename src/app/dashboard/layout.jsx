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
      {/* Column on mobile (nav bar sits above the content), row from md up. */}
      <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
        {/* Sidebar */}
        <DashboardSideBar user={user} />

        {/* Main Content
            min-w-0 is what stops a wide child - the data tables - from forcing
            this flex item past the viewport and scrolling the whole page
            sideways. Without it a flex item's min-width defaults to auto. */}
        <main className="flex-1 min-w-0 w-full">{children}</main>
      </div>
    </>
  );
};

export default DashBoardLayoutPage;
