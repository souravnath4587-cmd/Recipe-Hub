"use client";

import React from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FiShield, FiHome, FiLogOut } from "react-icons/fi";
import { authClient } from "../lib/auth-client";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    authClient.signOut();
    // Add your sign-out or session-clearing code logic here if needed
    console.log("Clearing invalid session parameters...");
    router.push("/signIn");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#09090b] text-foreground p-6">
      <div className="w-full max-w-md mx-auto text-center border border-divider bg-surface dark:bg-[#121214] rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Decorative Top Accent Glow line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-danger-500 via-amber-500 to-danger-500" />

        {/* Warning Shield Alert Identity Graphic Header Block */}
        <div className="flex justify-center">
          <div className="p-4 bg-danger-500/10 text-danger rounded-2xl border border-danger-500/20 animate-pulse">
            <FiShield size={48} />
          </div>
        </div>

        {/* Informative Error Message Text Blocks */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight uppercase text-white">
            Access Denied
          </h1>
          <p className="text-xs text-danger-500 font-bold tracking-widest uppercase">
            Error Code: 403 Forbidden
          </p>
          <p className="text-sm text-default-400 leading-relaxed pt-2">
            Your account profile credentials do not possess the required
            structural security clearances or roles necessary to look at this
            dashboard registry route.
          </p>
        </div>

        {/* Secondary Informational Disclaimer Segment Panel */}
        <div className="p-3 bg-default-50 dark:bg-[#1c1c1f] rounded-xl border border-divider text-left text-xs text-default-500">
          💡 <strong className="text-default-700">Need access?</strong> If you
          believe this is an error, try signing out and logging back in with
          your designated administrative profile account credentials.
        </div>

        {/* Action Button Navigation Footer Panel */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onPress={() => router.push("/")}
            className="flex-1 bg-default-100 hover:bg-default-200 text-foreground font-semibold h-11 rounded-xl text-sm transition-transform flex items-center justify-center gap-2"
          >
            <FiHome size={16} />
            Back to Home
          </Button>

          <Button
            onPress={handleLogout}
            className="flex-1 bg-danger text-white font-bold h-11 rounded-xl text-sm transition-transform shadow-lg shadow-danger-500/10 flex items-center justify-center gap-2"
          >
            <FiLogOut size={16} />
            Switch Account
          </Button>
        </div>
      </div>
    </div>
  );
}
