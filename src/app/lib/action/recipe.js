"use server";

import { serverDelete, serverMutation } from "../core/server";

export const createRecipe = async (newRecipeData) => {
  return serverMutation("/api/recipes", newRecipeData);
};

export const recipeDelete = async (id) => {
  return serverDelete("/api/myRecipes/", id);
};
