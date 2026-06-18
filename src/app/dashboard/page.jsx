"use client";

import React from "react";
import { Card } from "@heroui/react";
import {
  FiBookOpen,
  FiHeart,
  FiThumbsUp,
  FiCheckCircle,
  FiActivity,
  FiAward,
} from "react-icons/fi";

export default function OverviewPage() {
  // Mock data representing the state from your text layout
  const userData = {
    name: "Sourav",
    stats: {
      totalRecipes: 24,
      totalFavorites: 18,
      totalLikes: 127,
    },
    membership: {
      status: "PREMIUM MEMBER",
      badgeText: "Premium Badge",
      description: "Unlock premium recipes and exclusive access.",
    },
    activity: {
      latestRecipe: "Chicken Biryani",
      latestFavorite: "Thai Soup",
      status: "Premium",
    },
  };

  return (
    <div className="max-w-5xl md:w-7xl mx-auto  p-6 space-y-6 text-zinc-100 min-h-screen bg-[#09090b]   ">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          👋 Welcome Back,{" "}
          <span className="text-amber-500">{userData.name}</span>
        </h1>
        <p className="text-zinc-400 text-sm">
          Manage your recipes and track your activity.
        </p>
      </div>

      {/* Stats Cards Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Recipes */}
        <Card className="bg-[#121214] border border-zinc-800 rounded-2xl shadow-sm p-4">
          <Card.Header className="flex flex-row items-center gap-4 p-2">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <FiBookOpen size={24} />
            </div>
            <div>
              <Card.Title className="text-zinc-400 text-xs font-medium uppercase tracking-wider block">
                Total Recipes
              </Card.Title>
              <Card.Description className="text-2xl font-bold text-white mt-0.5 block">
                {userData.stats.totalRecipes}
              </Card.Description>
            </div>
          </Card.Header>
          <Card.Content />
          <Card.Footer />
        </Card>

        {/* Total Favorites */}
        <Card className="bg-[#121214] border border-zinc-800 rounded-2xl shadow-sm p-4">
          <Card.Header className="flex flex-row items-center gap-4 p-2">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
              <FiHeart size={24} />
            </div>
            <div>
              <Card.Title className="text-zinc-400 text-xs font-medium uppercase tracking-wider block">
                Total Favorites
              </Card.Title>
              <Card.Description className="text-2xl font-bold text-white mt-0.5 block">
                {userData.stats.totalFavorites}
              </Card.Description>
            </div>
          </Card.Header>
          <Card.Content />
          <Card.Footer />
        </Card>

        {/* Total Likes */}
        <Card className="bg-[#121214] border border-zinc-800 rounded-2xl shadow-sm p-4">
          <Card.Header className="flex flex-row items-center gap-4 p-2">
            <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl">
              <FiThumbsUp size={24} />
            </div>
            <div>
              <Card.Title className="text-zinc-400 text-xs font-medium uppercase tracking-wider block">
                Total Likes
              </Card.Title>
              <Card.Description className="text-2xl font-bold text-white mt-0.5 block">
                {userData.stats.totalLikes}
              </Card.Description>
            </div>
          </Card.Header>
          <Card.Content />
          <Card.Footer />
        </Card>
      </div>

      {/* Core Split Section: Membership Card & Quick Activity Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Premium Membership Area (Takes 3 Columns) */}
        <Card className="md:col-span-3 bg-linear-to-br from-[#1c1917] to-[#121214] border border-amber-500/20 rounded-2xl p-6 shadow-md relative overflow-hidden">
          <Card.Header className="flex flex-col items-start gap-1 p-0">
            <Card.Title className="flex items-center gap-2 text-lg font-bold text-amber-500 uppercase tracking-wider ">
              👑 Premium Membership
            </Card.Title>
            <Card.Description className="text-xs text-zinc-400 mt-1 block">
              Current Tier Status
            </Card.Description>
          </Card.Header>

          <Card.Content className="p-0 py-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-300 font-medium">Status:</span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold tracking-wide uppercase text-xs">
                {userData.membership.status}
              </span>
            </div>
            <p className="text-zinc-300 text-sm max-w-sm leading-relaxed">
              {userData.membership.description}
            </p>
          </Card.Content>

          <Card.Footer className="p-0 pt-2 flex justify-start">
            <div className="flex items-center gap-1.5 font-medium px-4 py-1.5 rounded-lg text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20">
              <FiCheckCircle size={14} />
              <span>{userData.membership.badgeText}</span>
            </div>
          </Card.Footer>
        </Card>

        {/* Quick Activity Section (Takes 2 Columns) */}
        <Card className="md:col-span-2 bg-[#121214] border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <Card.Header className="flex flex-col items-start gap-1 p-0 pb-4 border-b border-zinc-800">
            <Card.Title className="flex items-center gap-2 text-zinc-200 text-md font-semibold tracking-tight">
              <FiActivity className="text-amber-500" size={18} />
              <span>📈 Quick Activity</span>
            </Card.Title>
            <Card.Description className="hidden" />
          </Card.Header>

          <Card.Content className="p-0 pt-4 flex flex-col gap-4 text-sm">
            {/* Latest Recipe */}
            <div className="flex justify-between items-center bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/50">
              <span className="text-zinc-400 font-medium">Latest Recipe</span>
              <span className="text-zinc-200 font-semibold text-right max-w-[150] truncate">
                {userData.activity.latestRecipe}
              </span>
            </div>

            {/* Latest Favorite */}
            <div className="flex justify-between items-center bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/50">
              <span className="text-zinc-400 font-medium">Latest Favorite</span>
              <span className="text-zinc-200 font-semibold text-right max-w-[150] truncate">
                {userData.activity.latestFavorite}
              </span>
            </div>

            {/* Membership Status */}
            <div className="flex justify-between items-center bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/50">
              <span className="text-zinc-400 font-medium">
                Membership Status
              </span>
              <span className="text-amber-400 font-semibold">
                {userData.activity.status}
              </span>
            </div>
          </Card.Content>
          <Card.Footer />
        </Card>
      </div>
    </div>
  );
}
