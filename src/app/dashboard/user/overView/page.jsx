import { Card } from "@heroui/react";
import {
  FiBookOpen,
  FiHeart,
  FiThumbsUp,
  FiCheckCircle,
  FiActivity,
  FiUsers,
  FiShield,
  FiBriefcase,
} from "react-icons/fi";

import {
  getAllRecipeData,
  getLoggedInCreatorRecipesData,
} from "@/app/lib/api/recipes";
import { getUserSession } from "@/app/lib/core/session";

export default async function page() {
  const user = await getUserSession();

  // ==========================================
  // BRANCH 1: REGULAR USER ROLE RENDERING
  // ==========================================
  const allRecipesdata = await getAllRecipeData();
  const userRecipesData = await getLoggedInCreatorRecipesData();
  const favouriteCount = allRecipesdata.filter((recipe) =>
    recipe.favourite?.includes(user?.id),
  ).length;
  const totalLikes = allRecipesdata
    .filter((recipe) => recipe.favourite?.includes(user?.id))
    // likesCount is added by the backend and is missing on older recipe
    // documents. Without the fallback one undefined turns the whole sum into
    // NaN, which React then warns about when it renders.
    .reduce((sum, recipe) => sum + (recipe.likesCount ?? 0), 0);
  const firstFavouriteItem = allRecipesdata.filter((recipe) =>
    recipe.favourite?.includes(user?.id),
  )[0];

  const userData = {
    name: user?.name || "Chef",
    stats: {
      totalRecipes: userRecipesData.length,
      totalFavorites: favouriteCount,
      totalLikes: totalLikes,
    },
    membership: {
      status: "PREMIUM MEMBER",
      badgeText: "Premium Badge",
      description: "Unlock premium recipes and exclusive access.",
    },
    activity: {
      latestRecipe: allRecipesdata[0]?.recipeName || "None Added Yet",
      latestFavorite: firstFavouriteItem?.recipeName,
      status:
        user?.plan === "user_free"
          ? "FREE"
          : user?.plan === "user_pro"
            ? "PRO"
            : "PREMIUM",
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-foreground min-h-screen bg-background">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          👋 Welcome Back,{" "}
          <span className="text-brand">{userData.name}</span>
        </h1>
        <p className="text-default-400 text-sm">
          Manage your recipes and track your activity.
        </p>
      </div>

      {/* Stats Cards Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Recipes */}
        <Card className="bg-card border border-divider rounded-2xl shadow-sm p-4">
          <Card.Header className="flex flex-row items-center gap-4 p-2">
            <div className="p-3 bg-brand/10 text-brand rounded-xl">
              <FiBookOpen size={24} />
            </div>
            <div>
              <Card.Title className="text-default-400 text-xs font-medium uppercase tracking-wider block">
                Total Recipes
              </Card.Title>
              <Card.Description className="text-2xl font-bold text-foreground mt-0.5 block">
                {userData.stats.totalRecipes}
              </Card.Description>
            </div>
          </Card.Header>
        </Card>

        {/* Total Favorites */}
        <Card className="bg-card border border-divider rounded-2xl shadow-sm p-4">
          <Card.Header className="flex flex-row items-center gap-4 p-2">
            <div className="p-3 bg-danger/10 text-danger rounded-xl">
              <FiHeart size={24} />
            </div>
            <div>
              <Card.Title className="text-default-400 text-xs font-medium uppercase tracking-wider block">
                Total Favorites
              </Card.Title>
              <Card.Description className="text-2xl font-bold text-foreground mt-0.5 block">
                {userData.stats.totalFavorites}
              </Card.Description>
            </div>
          </Card.Header>
        </Card>

        {/* Total Likes */}
        <Card className="bg-card border border-divider rounded-2xl shadow-sm p-4">
          <Card.Header className="flex flex-row items-center gap-4 p-2">
            <div className="p-3 bg-info/10 text-info rounded-xl">
              <FiThumbsUp size={24} />
            </div>
            <div>
              <Card.Title className="text-default-400 text-xs font-medium uppercase tracking-wider block">
                Total Likes
              </Card.Title>
              <Card.Description className="text-2xl font-bold text-foreground mt-0.5 block">
                {userData.stats.totalLikes}
              </Card.Description>
            </div>
          </Card.Header>
        </Card>
      </div>

      {/* Split Section: Membership Card & Activity Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="md:col-span-3 bg-linear-to-br from-default-100 to-card border border-brand/20 rounded-2xl p-6 shadow-md relative overflow-hidden">
          <Card.Header className="flex flex-col items-start gap-1 p-0">
            <Card.Title className="flex items-center gap-2 text-lg font-bold text-brand uppercase tracking-wider">
              👑{" "}
              {user?.plan === "user_free"
                ? "Free Member"
                : user?.plan === "user_pro"
                  ? "Pro Member"
                  : "Premium Member"}
            </Card.Title>
            <Card.Description className="text-xs text-default-400 mt-1 block">
              Current Tier Status
            </Card.Description>
          </Card.Header>

          <Card.Content className="p-0 py-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-default-700 font-medium">
                Status:
              </span>
              <span className="bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 rounded-md font-bold tracking-wide uppercase text-xs">
                {user?.plan === "user_free"
                  ? "Free Member"
                  : user?.plan === "user_pro"
                    ? "Pro Member"
                    : "Premium Member"}
              </span>
            </div>
            <p className="text-default-600 text-sm max-w-sm leading-relaxed">
              {userData.membership.description}
            </p>
          </Card.Content>

          <Card.Footer className="p-0 pt-2 flex justify-start">
            <div className="flex items-center gap-1.5 font-medium px-4 py-1.5 rounded-lg text-sm text-brand bg-brand/10 border border-brand/20">
              <FiCheckCircle size={14} />
              <span>{userData.membership.badgeText}</span>
            </div>
          </Card.Footer>
        </Card>

        <Card className="md:col-span-2 bg-card border border-divider rounded-2xl p-6 shadow-sm">
          <Card.Header className="flex flex-col items-start gap-1 p-0 pb-4 border-b border-divider">
            <Card.Title className="flex items-center gap-2 text-default-800 text-base font-semibold tracking-tight">
              <FiActivity className="text-brand" size={18} />
              <span>📈 Quick Activity</span>
            </Card.Title>
          </Card.Header>

          <Card.Content className="p-0 pt-4 flex flex-col gap-4 text-sm">
            <div className="flex justify-between items-center bg-input p-2.5 rounded-xl border border-input-line">
              <span className="text-default-500 font-medium">
                Latest Recipe
              </span>
              <span className="text-default-800 font-semibold text-right max-w-[150px] truncate">
                {userData.activity.latestRecipe}
              </span>
            </div>

            <div className="flex justify-between items-center bg-input p-2.5 rounded-xl border border-input-line">
              <span className="text-default-500 font-medium">
                Latest Favorite
              </span>
              <span className="text-default-800 font-semibold text-right max-w-[150px] truncate">
                {userData.activity.latestFavorite}
              </span>
            </div>

            <div className="flex justify-between items-center bg-input p-2.5 rounded-xl border border-input-line">
              <span className="text-default-500 font-medium">
                Membership Status
              </span>
              <span className="text-brand font-semibold">
                {userData.activity.status}
              </span>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
