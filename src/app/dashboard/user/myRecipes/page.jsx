import { getLoggedInCreatorRecipesData } from "@/app/lib/api/recipes";
import MyRecipesTable from "./MyRecipesTable";
import { getUserSession } from "@/app/lib/core/session";

const myRecipesPage = async () => {
  const recipeCreator = await getUserSession();
  const allRecipes = await getLoggedInCreatorRecipesData();

  return (
    <div>
      <MyRecipesTable allRecipes={allRecipes} recipeCreator={recipeCreator} />
    </div>
  );
};

export default myRecipesPage;
