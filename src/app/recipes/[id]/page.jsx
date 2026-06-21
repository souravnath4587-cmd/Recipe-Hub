// app/recipes/[id]/page.js
import { getRecipeData } from "@/app/lib/api/recipes";
import RecipeDetailsClient from "./RecipeDetailsClient";
import React from "react";

export default async function RecipeDetailPage({ params }) {
  const { id } = await params;
  const selectedRecipeData = await getRecipeData(id);

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
  return <RecipeDetailsClient initialRecipe={selectedRecipeData} />;
}
