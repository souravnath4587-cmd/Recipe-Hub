import { getAllRecipeData } from "../lib/api/recipes";
import AllRecipesPage from "./AllRecipes";

const recipesPage = async () => {
  const allRecipes = await getAllRecipeData();
  return (
    <div>
      <AllRecipesPage allRecipes={allRecipes} />
    </div>
  );
};

export default recipesPage;
