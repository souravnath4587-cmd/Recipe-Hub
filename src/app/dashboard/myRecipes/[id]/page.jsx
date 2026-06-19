import { getRecipeData } from "@/app/lib/api/recipes";
import UpdateRecipeForm from "./UpdateRecipeForm";

const page = async ({ params }) => {
  const { id } = await params;

  const selectedRecipe = await getRecipeData(id);
  console.log(selectedRecipe);

  return (
    <div>
      <UpdateRecipeForm initialRecipeData={selectedRecipe} />
    </div>
  );
};

export default page;
