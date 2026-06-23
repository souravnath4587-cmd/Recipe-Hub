import { getAllRecipeData } from "@/app/lib/api/recipes";
import FeaturedRecipesSection from "../components/FeaturedRecipesSection";

const FeaturePage = async () => {
  const allRecipes = await getAllRecipeData();
  return (
    <div>
      <FeaturedRecipesSection recipes={allRecipes} />
    </div>
  );
};

export default FeaturePage;
