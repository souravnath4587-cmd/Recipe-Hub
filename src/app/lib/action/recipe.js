"use server";

import { serverDelete, serverMutation } from "../core/server";

export const createRecipe = async (newRecipeData) => {
  return serverMutation("/api/recipes", newRecipeData, "POST");
};

export const recipeDelete = async (id) => {
  return serverDelete("/api/myRecipes/", id);
};

// Dynamic PUT updating logic route mapping pipeline
export const updateRecipeAction = async (id, updatedRecipeData) => {
  return serverMutation(`/api/myRecipes/${id}`, updatedRecipeData, "PUT");
};
