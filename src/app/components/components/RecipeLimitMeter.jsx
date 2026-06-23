"use client";

import React from "react";
import { Card, Chip, Button } from "@heroui/react";
import { FiLock, FiUnlock, FiTrendingUp } from "react-icons/fi";
import Link from "next/link";

export default function RecipeLimitMeter({
  planName,
  recipesLength,
  maxAllowed,
  hasReachedLimit,
  usagePercentage,
}) {
  // Set Tailwind design values depending on the state of usage
  const progressBgColor = hasReachedLimit
    ? "bg-danger"
    : usagePercentage >= 75
      ? "bg-warning"
      : "bg-success";

  return (
    <Card
      className={`w-full p-6 border bg-content1/60 backdrop-blur-md rounded-2xl shadow-sm transition-all relative overflow-hidden ${
        hasReachedLimit ? "border-danger/40 bg-danger-50/10" : "border-divider"
      }`}
    >
      {/* Decorative Accent Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-warning-500/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        {/* Left Side: Progress Metrics Panel */}
        <div className="space-y-3 grow w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <Chip
              size="sm"
              variant="flat"
              color={hasReachedLimit ? "danger" : "warning"}
              className="font-black uppercase tracking-wider text-[10px] px-2"
            >
              Current Tier: {planName}
            </Chip>

            <Chip
              size="sm"
              variant="dot"
              color={hasReachedLimit ? "danger" : "success"}
              className="font-bold text-[11px] border-none"
            >
              {hasReachedLimit ? "Limit Locked" : "Verified to Post"}
            </Chip>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
              {hasReachedLimit ? (
                <>
                  <FiLock className="text-danger shrink-0" size={18} />
                  <span>Monthly Recipe Cap Exceeded</span>
                </>
              ) : (
                <>
                  <FiUnlock className="text-success shrink-0" size={18} />
                  <span>Recipe Quota Balance</span>
                </>
              )}
            </h2>
            <p className="text-xs text-default-400 font-medium">
              {hasReachedLimit
                ? "You have maximized your subscription allowance. Upgrade to reset boundaries instantly."
                : `You have submitted ${recipesLength} out of your ${maxAllowed} total monthly allowed recipes.`}
            </p>
          </div>

          {/* Custom Pure-Tailwind Progress Bar (Error Free) */}
          <div className="space-y-1.5 pt-2 max-w-xl">
            <div className="w-full bg-default-100 dark:bg-default-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressBgColor} transition-all duration-500 ease-out`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-bold text-default-500 tracking-tight">
              <span>{recipesLength} Active</span>
              <span className="font-mono">
                {Math.round(usagePercentage)}% Capacity
              </span>
              <span>Max Cap: {maxAllowed}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Upgrade Call-To-Action Button */}
        {hasReachedLimit && (
          <div className="shrink-0 w-full md:w-auto border-t md:border-t-0 border-divider/60 pt-4 md:pt-0 flex items-center">
            <Link href="/pricing" className="w-full md:w-auto">
              <Button
                color="warning"
                variant="solid"
                className="font-black text-black text-xs w-full md:w-auto px-6 shadow-lg bg-linear-to-r from-amber-400 to-orange-500"
                startContent={<FiTrendingUp className="stroke-3" size={14} />}
              >
                Expand My Quota
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
