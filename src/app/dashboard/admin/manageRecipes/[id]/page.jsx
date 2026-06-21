import { getRecipeData } from "@/app/lib/api/recipes";
import { getUsers } from "@/app/lib/api/users";
import React from "react";
import { Card, Chip, Avatar } from "@heroui/react";
import Image from "next/image";
import {
  FiUser,
  FiClock,
  FiBarChart,
  FiGlobe,
  FiBookOpen,
  FiMail,
  FiCalendar,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

const RecipeDetailPage = async ({ params }) => {
  const { id } = await params;

  // Fetch source arrays
  const users = await getUsers();
  const recipeData = await getRecipeData(id);

  // Find the distinct creator profile matching the reference token string
  const selectedUser = users.find(
    (user) => user._id === recipeData.recipeCreatorId,
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-foreground min-h-screen bg-background">
      {/* Page Title Header Section Banner */}
      <div className="flex flex-col gap-1 pb-4 border-b border-divider">
        <h1 className="text-3xl font-black tracking-tight">
          Recipe & Creator Audit Panel
        </h1>
        <p className="text-default-500 text-sm">
          Administrative breakdown for document trace item:{" "}
          <span className="text-primary font-mono">{recipeData._id}</span>
        </p>
      </div>

      {/* Two-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Comprehensive Recipe Metrics Card (Occupies 2 fractions on wide views) */}
        <div className="lg:col-span-2">
          <Card className="bg-content1 border border-divider rounded-2xl overflow-hidden shadow-sm">
            {/* Structural Banner Asset Container */}
            <div className="relative w-full h-64 sm:h-80 bg-default-100 border-b border-divider">
              <Image
                src={
                  recipeData.recipeImage ||
                  "https://i.ibb.co/Rpxt5vHc/banner-image.jpg"
                }
                alt={recipeData.recipeName}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Chip
                  color="secondary"
                  variant="solid"
                  className="font-bold shadow-md"
                >
                  {recipeData.category}
                </Chip>
              </div>
            </div>

            <Card.Header className="flex flex-col items-start gap-1 p-6">
              <Card.Title className="text-2xl font-black text-foreground">
                {recipeData.recipeName}
              </Card.Title>
              <Card.Description className="text-default-400 font-mono text-xs">
                Published ID: {recipeData._id}
              </Card.Description>
            </Card.Header>

            {/* <Divider className="mx-6 w-[calc(100%-3rem)]" /> */}

            <Card.Content className="p-6 space-y-6">
              {/* Quick Spec Metadata Row Blocks Grid */}
              <div className="grid grid-cols-3 gap-4 bg-default-50 p-4 rounded-xl border border-divider/60">
                <div className="flex flex-col items-center justify-center text-center">
                  <FiClock className="text-primary mb-1" size={18} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-default-400">
                    Prep Time
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {recipeData.preparationTime}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-x border-divider">
                  <FiBarChart className="text-warning mb-1" size={18} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-default-400">
                    Difficulty
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {recipeData.difficultyLevel}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <FiGlobe className="text-success mb-1" size={18} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-default-400">
                    Cuisine
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {recipeData.cuisineType}
                  </span>
                </div>
              </div>

              {/* Ingredients Arrays Processing Block Section */}
              <div className="space-y-2">
                <h3 className="text-md font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full"></span>{" "}
                  Ingredients List
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {recipeData.ingredients?.map((item, index) => (
                    <Chip
                      key={index}
                      variant="flat"
                      color="default"
                      className="font-medium text-sm"
                    >
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Instructions Paragraph String block parsing context */}
              <div className="space-y-2">
                <h3 className="text-md font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full"></span>{" "}
                  Preparation Instructions
                </h3>
                <p className="text-sm text-default-600 leading-relaxed bg-default-50/50 p-4 rounded-xl border border-divider/30">
                  {recipeData.instructions}
                </p>
              </div>
            </Card.Content>

            <Card.Footer className="bg-default-50/40 p-4 border-t border-divider/60 flex justify-between items-center text-xs text-default-400">
              <span className="flex items-center gap-1">
                <FiCalendar /> Indexed:{" "}
                {new Date(recipeData.createdAt).toLocaleDateString()}
              </span>
            </Card.Footer>
          </Card>
        </div>

        {/* Right Column: Complete Creator Account Integrity Card (Occupies 1 fraction) */}
        <div className="lg:col-span-1">
          <Card className="bg-content1 border border-divider rounded-2xl shadow-sm overflow-hidden">
            <Card.Header className="flex flex-col items-center gap-4 pt-8 pb-4 text-center">
              <Image
                src={selectedUser?.image}
                alt={selectedUser?.name}
                width={60}
                height={60}
              />
              {/* <Avatar
                isBordered
                className="w-24 h-24 text-large"
                radius="full"
                color={selectedUser?.role === "admin" ? "danger" : "primary"}
                src={
                  selectedUser?.image ||
                  "https://lh3.googleusercontent.com/a/ACg8ocLAFavPt6Nw6ohvN43RStqteZLcJWC2OAwzEUhpgQzBMIYNf4w=s96-c"
                }
                name={selectedUser?.name || "Anonymous User"}
              /> */}
              <div className="space-y-1">
                <Card.Title className="text-xl font-black text-foreground">
                  {selectedUser?.name || "Account Deleted / Missing"}
                </Card.Title>
                <Card.Description className="text-xs font-mono text-default-400">
                  UID: {recipeData.recipeCreatorId}
                </Card.Description>
              </div>
            </Card.Header>

            {/* <Divider className="mx-6 w-[calc(100%-3rem)]" /> */}

            <Card.Content className="p-6 space-y-4">
              {/* Account Parameter Entry Row Blocks Layout items cells */}
              <div className="flex items-center justify-between py-2 border-b border-divider/50">
                <span className="text-xs text-default-400 font-medium flex items-center gap-2">
                  <FiMail size={14} /> Email Address
                </span>
                <span className="text-xs font-semibold text-foreground max-w-[180] truncate">
                  {selectedUser?.email || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-divider/50">
                <span className="text-xs text-default-400 font-medium flex items-center gap-2">
                  <FiShield size={14} /> Security Access Role
                </span>
                <Chip
                  size="sm"
                  color={selectedUser?.role === "admin" ? "danger" : "default"}
                  variant="flat"
                  className="font-bold uppercase tracking-wide text-[10px]"
                >
                  {selectedUser?.role || "User"}
                </Chip>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-divider/50">
                <span className="text-xs text-default-400 font-medium flex items-center gap-2">
                  <FiCheckCircle size={14} /> Email Verified
                </span>
                <Chip
                  size="sm"
                  variant="soft"
                  color={selectedUser?.emailVerified ? "success" : "warning"}
                  className="font-bold text-xs"
                >
                  {selectedUser?.emailVerified ? "Verified" : "Pending"}
                </Chip>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-default-400 font-medium flex items-center gap-2">
                  <FiCalendar size={14} /> Profile Created
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {selectedUser?.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </Card.Content>

            <Card.Footer className="bg-default-50/40 p-4 border-t border-divider/60 flex items-center justify-center">
              <span className="text-[11px] text-default-400 font-medium italic flex items-center gap-1">
                <FiUser /> Administrative Directory System View
              </span>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
