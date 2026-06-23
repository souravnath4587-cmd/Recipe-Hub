import { getAllRecipeData } from "@/app/lib/api/recipes";
import { getUserSession } from "@/app/lib/core/session";
import FavoriteRecipesTable from "./favoriteRecipesTable";

const favouritePage = async () => {
  const user = await getUserSession();
  const allRecipes = await getAllRecipeData();
  const favouriteRecipes = allRecipes.filter((recipe) =>
    recipe.favourite?.includes(user.id),
  );

  return (
    <div>
      <FavoriteRecipesTable initialFavorites={favouriteRecipes} user={user} />
    </div>
  );
};

export default favouritePage;
