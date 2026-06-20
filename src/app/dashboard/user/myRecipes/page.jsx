import { getLoggedInCreatorRecipesData } from "@/app/lib/api/recipes";
import MyRecipesTable from "./MyRecipesTable";

const myRecipesPage = async () => {
  const allRecipes = await getLoggedInCreatorRecipesData();

  return (
    <div>
      <MyRecipesTable allRecipes={allRecipes} />
    </div>
  );
};

export default myRecipesPage;
