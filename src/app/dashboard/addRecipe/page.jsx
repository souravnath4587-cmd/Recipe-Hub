import { getUserSession } from "@/app/lib/core/session";
import AddRecipeForm from "./AddRecipeForm";

const RecipePage = async () => {
  const user = await getUserSession();

  return (
    <div>
      <AddRecipeForm recipeCreator={user} />
    </div>
  );
};

export default RecipePage;
