import { getRecipeData } from "@/app/lib/api/recipes";
import RecipeDetailsClient from "./RecipeDetailsClient";
import { getUserSession } from "@/app/lib/core/session";
import { getPlanById } from "@/app/lib/api/plan";
import { redirect } from "next/navigation";
// import { uploadPaymetsData } from "@/app/lib/action/payments";

export default async function RecipeDetailPage({ params }) {
  const { id } = await params;
  const selectedRecipeData = await getRecipeData(id);
  // const data = await uploadPaymetsData();

  const user = await getUserSession();
  const plan = await getPlanById(user?.plan || "user_free");
  const purchaseRecipeLimit = plan?.purchaseRecipeLimit;

  if (!user) {
    redirect(`/signIn?redirect=/recipes/${id}`);
  }

  if (!selectedRecipeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-default-500 font-medium">
          Recipe dataset could not be found.
        </p>
      </div>
    );
  }

  // Forward the pristine dataset straight into our responsive administrative layout
  return (
    <RecipeDetailsClient
      initialRecipe={selectedRecipeData}
      user={user}
      purchasedRecipesCount={purchaseRecipeLimit}
      // uploadPaymetsData={data}
    />
  );
}
