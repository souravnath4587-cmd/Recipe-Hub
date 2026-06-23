"use client";

import React from "react";
import { Card, Table, Chip, Avatar } from "@heroui/react";
import {
  FiUsers,
  FiBookOpen,
  FiBriefcase,
  FiShield,
  FiAlertTriangle,
  FiTrendingUp,
} from "react-icons/fi";
import mockAdminStats from "@/app/lib/getMokAdminstats";

export default function AdminOverviewPage({ users, recipes, reports }) {
  const { stats, recentReports, recentPremiumSignups } = mockAdminStats;
  const totalUsers = users.length;
  const totalRecipes = recipes.length;
  const totalReports = reports.length;
  const reportsWithRecipe = reports.map((report) => {
    const recipe = recipes.find((recipe) => recipe._id === report.recipeId);

    return {
      ...report,
      recipeName: recipe?.recipeName || "Recipe Not Found",
    };
  });

  return (
    // Replaced hardcoded bg-[#09090b] with the responsive bg-background token
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-foreground min-h-screen bg-background">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-1 pb-2 border-b border-divider">
        {/* Replaced text-white with adaptive text-foreground */}
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
          ⚙️ Recipe-Hub <span className="text-danger">Admin Dashboard</span>
        </h1>
        <p className="text-default-500 text-sm">
          System health monitoring panel, content moderation queries, and
          transaction summaries.
        </p>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        {/* Swapped custom background strings for bg-content1 (HeroUI's default semantic card background) */}
        <Card className="bg-content1 border border-divider rounded-2xl p-4 shadow-sm">
          <Card.Header className="flex flex-row items-center gap-4 p-2">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/10">
              <FiUsers size={24} />
            </div>
            <div>
              <span className="text-default-500 text-xs font-semibold uppercase tracking-wider block">
                Total Users
              </span>
              <span className="text-2xl font-black text-foreground mt-0.5 block">
                {totalUsers}
              </span>
            </div>
          </Card.Header>
        </Card>

        {/* Total Recipes */}
        <Card className="bg-content1 border border-divider rounded-2xl p-4 shadow-sm">
          <Card.Header className="flex flex-row items-center gap-4 p-2">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/10">
              <FiBookOpen size={24} />
            </div>
            <div>
              <span className="text-default-500 text-xs font-semibold uppercase tracking-wider block">
                Total Recipes
              </span>
              <span className="text-2xl font-black text-foreground mt-0.5 block">
                {totalRecipes}
              </span>
            </div>
          </Card.Header>
        </Card>

        {/* Total Premium Members */}
        <Card className="bg-content1 border border-divider rounded-2xl p-4 shadow-sm">
          <Card.Header className="flex flex-row items-center gap-4 p-2">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl border border-purple-500/10">
              <FiBriefcase size={24} />
            </div>
            <div>
              <span className="text-default-500 text-xs font-semibold uppercase tracking-wider block">
                Premium Members
              </span>
              <span className="text-2xl font-black text-foreground mt-0.5 block">
                {stats.totalPremiumMembers.toLocaleString()}
              </span>
            </div>
          </Card.Header>
        </Card>

        {/* Total Reports */}
        <Card className="bg-content1 border border-divider rounded-2xl p-4 shadow-sm">
          <Card.Header className="flex flex-row items-center gap-4 p-2">
            <div className="p-3 bg-danger-500/10 text-danger rounded-xl border border-danger-500/10">
              <FiShield size={24} />
            </div>
            <div>
              <span className="text-default-500 text-xs font-semibold uppercase tracking-wider block">
                Active Reports
              </span>
              <span className="text-2xl font-black text-foreground mt-0.5 block">
                {totalReports}
              </span>
            </div>
          </Card.Header>
        </Card>
      </div>

      {/* Two-Column Log Tables Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Moderation Queue (Reports) */}
        <Card className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 pb-4 mb-2 border-b border-divider">
            <FiAlertTriangle className="text-danger" size={18} />
            <h2 className="text-md font-bold text-foreground uppercase tracking-wide">
              Pending Moderation Logs
            </h2>
          </div>

          {/* Removed className="dark" forcing so it defaults to your system context */}
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Recent content reports queue table">
                <Table.Header>
                  <Table.Column
                    isRowHeader
                    className="bg-default-100 text-default-700 font-bold"
                  >
                    RECIPE
                  </Table.Column>
                  <Table.Column className="bg-default-100 text-default-700 font-bold">
                    REASON
                  </Table.Column>
                  <Table.Column className="bg-default-100 text-default-700 font-bold text-right">
                    DATE
                  </Table.Column>
                </Table.Header>
                <Table.Body>
                  {reportsWithRecipe.map((report) => (
                    <Table.Row
                      key={report._id}
                      className="border-b border-divider/50 last:border-none"
                    >
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">
                            {report.recipeName}
                          </span>
                          <span className="text-[11px] text-default-500">
                            {report.recipeId}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Chip
                          size="sm"
                          color="danger"
                          variant="soft"
                          className="font-medium text-[11px]"
                        >
                          {report.reason}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell className="text-right text-xs text-default-500">
                        {report.createdAt}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Card>

        {/* Premium Conversions Stream */}
        <Card className="bg-content1 border border-divider rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 pb-4 mb-2 border-b border-divider">
            <FiTrendingUp className="text-purple-500" size={18} />
            <h2 className="text-md font-bold text-foreground uppercase tracking-wide">
              Recent Premium Signups
            </h2>
          </div>

          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Premium conversion streaming ledger">
                <Table.Header>
                  <Table.Column
                    isRowHeader
                    className="bg-default-100 text-default-700 font-bold"
                  >
                    SUBSCRIBER
                  </Table.Column>
                  <Table.Column className="bg-default-100 text-default-700 font-bold text-right">
                    TIER PLAN
                  </Table.Column>
                </Table.Header>
                <Table.Body>
                  {recentPremiumSignups.map((signup, idx) => (
                    <Table.Row
                      key={idx}
                      className="border-b border-divider/50 last:border-none"
                    >
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            size="sm"
                            src={`https://i.pravatar.cc/150?u=${signup.email}`}
                            name={signup.name}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">
                              {signup.name}
                            </span>
                            <span className="text-[11px] text-default-500">
                              {signup.email}
                            </span>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <Chip
                          size="sm"
                          color="secondary"
                          variant="soft"
                          className="font-bold text-xs"
                        >
                          {signup.tier}
                        </Chip>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Card>
      </div>
    </div>
  );
}
