import React from "react";
import ManageRecipesPage from "./ManageRecipes";
import { getAllRecipeData } from "@/app/lib/api/recipes";

const page = async () => {
  const allRecipesData = await getAllRecipeData();
  console.log(allRecipesData);

  return (
    <div>
      <ManageRecipesPage allRecipes={allRecipesData} />
    </div>
  );
};

export default page;
