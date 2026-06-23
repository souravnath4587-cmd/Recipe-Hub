import { getAllRecipeData } from "@/app/lib/api/recipes";
import HomeRecipesClient from "../components/HomeRecipesClient";

const RecipesPage = async () => {
  const recipes = await getAllRecipeData();

  return (
    <div className="bg-background min-h-screen py-8">
      <HomeRecipesClient recipes={recipes} />
    </div>
  );
};

export default RecipesPage;
