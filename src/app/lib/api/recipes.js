import { serverFetch } from "../core/server";
import { getUserSession } from "../core/session";

export const getAllRecipeData = async () => {
  return serverFetch("/api/allRecipes");
};

export const getRecipeData = async (id) => {
  return serverFetch(`/api/myRecipe/${id}`);
};

export const getRecipeCreatorData = async (recipeCreatorId) => {
  return serverFetch(`/api/myRecipes?recipeCreatorId=${recipeCreatorId}`);
};

export const getLoggedInCreatorRecipesData = async () => {
  const user = await getUserSession();
  return getRecipeCreatorData(user?.id);
};

// export const getRecruiterCompany = async (recruiterId) => {
//   return serverFetch(`/api/myCompanies?recruiterId=${recruiterId}`);
// };

// export const getLoggedInRecruiterCompany = async () => {
//   const user = await getUserSession();
//   return getRecruiterCompany(user?.id);
// };
