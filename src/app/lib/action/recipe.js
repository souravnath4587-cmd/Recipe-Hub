"use server";

import { serverDelete, serverMutation } from "../core/server";

export const createRecipe = async (newRecipeData) => {
  return serverMutation("/api/recipes", newRecipeData, "POST");
};

export const recipeDelete = async (id) => {
  return serverDelete("/api/myRecipes/", id);
};

export const reportDelete = async (id) => {
  return serverDelete("/api/reports/", id);
};

// Dynamic PUT updating logic route mapping pipeline
export const updateRecipeAction = async (id, updatedRecipeData) => {
  return serverMutation(`/api/myRecipes/${id}`, updatedRecipeData, "PUT");
};

// Dynamic PUT updating logic route mapping pipeline
export const updateRecipeLikeAction = async (id, updatedRecipeData) => {
  return serverMutation(`/api/recipes/${id}/vote`, updatedRecipeData, "PATCH");
};
// Dynamic PUT updating logic route mapping pipeline
export const updateRecipeFavouriteAction = async (id, updatedRecipeData) => {
  return serverMutation(
    `/api/recipes/${id}/favourite`,
    updatedRecipeData,
    "PATCH",
  );
};
// Dynamic PUT updating logic route mapping pipeline
export const updateRecipeFeature = async (id, updatedRecipeData) => {
  return serverMutation(
    `/api/recipes/${id}/feature`,
    updatedRecipeData,
    "PATCH",
  );
};

export const userReportAction = async (updatedRecipeData) => {
  return serverMutation(`/api/reports`, updatedRecipeData, "POST");
};
