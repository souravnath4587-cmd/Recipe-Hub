import { getUserSession } from "@/app/lib/core/session";
import AddRecipeForm from "./AddRecipeForm";
import { getPlanById } from "@/app/lib/api/plan";
import { getLoggedInCreatorRecipesData } from "@/app/lib/api/recipes";
import RecipeLimitMeter from "@/app/components/components/RecipeLimitMeter";
import { FaCircleInfo } from "react-icons/fa6";

const RecipePage = async () => {
  const user = await getUserSession();
  const plan1 = await getPlanById(user?.plan || "user_free");
  const userRecipes = await getLoggedInCreatorRecipesData();

  const recipesLength = userRecipes?.length || 0;
  const maxAllowed = plan1?.maxApplicationRecipePerMonth || 3; // Using your JSON key name
  const hasReachedLimit = recipesLength >= maxAllowed;

  // Calculate structural percentage cleanly matching your snippet tracking properties
  const usagePercentage = Math.min((recipesLength / maxAllowed) * 100, 100);

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Limit Display Card Component */}
        <RecipeLimitMeter
          planName={plan1?.name || "Free Plan"}
          recipesLength={recipesLength}
          maxAllowed={maxAllowed}
          hasReachedLimit={hasReachedLimit}
          usagePercentage={usagePercentage}
        />

        {/* Your AddRecipeForm component down here */}
      </div>
      {hasReachedLimit ? (
        /* Lockout State View */
        <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mb-3">
            <FaCircleInfo className="w-5 h-5" />
          </div>
          <h4 className="text-base font-semibold text-zinc-200">
            Recipe Publishing Limit Reached
          </h4>

          <p className="text-sm text-zinc-500 max-w-sm mt-1">
            You have reached the maximum number of recipes allowed under your
            current plan. Upgrade your membership to continue publishing more
            recipes.
          </p>
        </div>
      ) : (
        <AddRecipeForm recipeCreator={user} />
      )}
    </div>
  );
};

export default RecipePage;
