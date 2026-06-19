import { serverFetch } from "../core/server";
import { getUserSession } from "../core/session";



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
