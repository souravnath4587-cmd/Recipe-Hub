"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Fieldset,
  TextField,
  Label,
  Input,
  Description,
  FieldError,
  Button,
} from "@heroui/react";
import {
  FiEdit3,
  FiBook,
  FiClock,
  FiLayers,
  FiGlobe,
  FiSmile,
  FiUploadCloud,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import { updateRecipeAction } from "@/app/lib/action/recipe"; // Your server action matching createRecipe template
import { toast } from "react-toastify";

export default function UpdateRecipeForm({ initialRecipeData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(
    initialRecipeData.recipeImage || "",
  );
  const [imageFile, setImageFile] = useState(null);

  // Pre-populate values directly from your document schema layout
  const [formData, setFormData] = useState({
    recipeName: initialRecipeData.recipeName || "",
    category: initialRecipeData.category || "",
    cuisineType: initialRecipeData.cuisineType || "",
    difficultyLevel: initialRecipeData.difficultyLevel || "Easy",
    prepTime: initialRecipeData.preparationTime || "",
    // Recombine your string array cleanly back into newline separated entries for textareas
    ingredients: Array.isArray(initialRecipeData.ingredients)
      ? initialRecipeData.ingredients.join("\n")
      : initialRecipeData.ingredients || "",
    instructions: initialRecipeData.instructions || "",
  });

  const uploadToImgbb = async (file) => {
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
    const body = new FormData();
    body.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: body,
        },
      );
      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error("Imgbb image upload failed:", error);
      return null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Default to the original image URL if no new asset was selected
    let finalImageUrl = initialRecipeData.recipeImage;

    if (imageFile) {
      const uploadedUrl = await uploadToImgbb(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    const updatedDocument = {
      recipeName: formData.recipeName,
      recipeImage: finalImageUrl,
      category: formData.category,
      cuisineType: formData.cuisineType,
      difficultyLevel: formData.difficultyLevel,
      preparationTime: formData.prepTime,
      ingredients: formData.ingredients
        .split("\n")
        .filter((item) => item.trim() !== ""),
      instructions: formData.instructions,
    };

    // Trigger update via your Server Action file path targeting document ID string
    const result = await updateRecipeAction(
      initialRecipeData._id,
      //   initialRecipeData._id,
      updatedDocument,
    );
    if (result.modifiedCount > 0) {
      setIsSubmitting(false);
      toast.success("Recipe document updated successfully!");
      router.push("/dashboard/user/myRecipes"); // Redirect cleanly back to overview logs table
    } else {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-5xl md:w-7xl mx-auto p-6 min-h-screen text-foreground bg-background">
      {/* Return Back Navigation */}
      <Button
        variant="light"
        startContent={<FiArrowLeft />}
        className="mb-4 text-default-500 hover:text-foreground"
        onPress={() => router.push("/dashboard/myRecipes")}
      >
        Back to Recipes
      </Button>

      <div className="bg-surface dark:bg-[#121214] border border-divider rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit}>
          <Fieldset className="space-y-6">
            <Fieldset.Legend className="flex flex-col gap-1 pb-2 border-b border-divider w-full">
              <span className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FiEdit3 className="text-amber-500" /> UPDATE RECIPE
              </span>
              <p className="text-xs text-default-400">
                Modify parameters below to update this entry inside your
                collection logs.
              </p>
            </Fieldset.Legend>

            <Fieldset.Group className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 w-full">
              {/* Recipe Name */}
              <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                <Label className="text-xs font-semibold text-default-700 dark:text-zinc-300">
                  Recipe Name
                </Label>
                <div className="relative flex items-center">
                  <FiBook className="absolute left-3 text-default-400 z-10" />
                  <Input
                    type="text"
                    value={formData.recipeName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipeName: e.target.value })
                    }
                    required
                    className="w-full bg-default-50 dark:bg-[#1c1c1f] border border-divider rounded-xl pl-10 pr-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>
              </TextField>

              {/* Category */}
              <TextField className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-default-700 dark:text-zinc-300">
                  Category
                </Label>
                <div className="relative flex items-center">
                  <FiLayers className="absolute left-3 text-default-400 z-10" />
                  <Input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    className="w-full bg-default-50 dark:bg-[#1c1c1f] border border-divider rounded-xl pl-10 pr-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>
              </TextField>

              {/* Cuisine Type */}
              <TextField className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-default-700 dark:text-zinc-300">
                  Cuisine Type
                </Label>
                <div className="relative flex items-center">
                  <FiGlobe className="absolute left-3 text-default-400 z-10" />
                  <Input
                    type="text"
                    value={formData.cuisineType}
                    onChange={(e) =>
                      setFormData({ ...formData, cuisineType: e.target.value })
                    }
                    required
                    className="w-full bg-default-50 dark:bg-[#1c1c1f] border border-divider rounded-xl pl-10 pr-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>
              </TextField>

              {/* Preparation Time */}
              <TextField className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-default-700 dark:text-zinc-300">
                  Preparation Time
                </Label>
                <div className="relative flex items-center">
                  <FiClock className="absolute left-3 text-default-400 z-10" />
                  <Input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) =>
                      setFormData({ ...formData, prepTime: e.target.value })
                    }
                    required
                    className="w-full bg-default-50 dark:bg-[#1c1c1f] border border-divider rounded-xl pl-10 pr-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>
              </TextField>

              {/* Difficulty Level */}
              <TextField className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-default-700 dark:text-zinc-300">
                  Difficulty Level
                </Label>
                <div className="relative flex items-center">
                  <FiSmile className="absolute left-3 text-default-400 z-10" />
                  <select
                    value={formData.difficultyLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficultyLevel: e.target.value,
                      })
                    }
                    className="w-full bg-default-50 dark:bg-[#1c1c1f] border border-divider rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground outline-none cursor-pointer appearance-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </TextField>

              {/* Cover Asset Block */}
              <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 bg-default-50 dark:bg-[#1c1c1f] border border-divider rounded-xl p-4">
                <span className="text-xs font-semibold text-default-700 dark:text-zinc-300">
                  Recipe Image Display Cover
                </span>
                <div className="flex items-center gap-4 mt-1">
                  <label className="flex flex-col items-center justify-center w-14 h-14 bg-default-100 dark:bg-[#222226] border border-dashed border-divider rounded-xl cursor-pointer transition shrink-0 group">
                    <FiUploadCloud
                      className="text-default-400 group-hover:text-amber-500 transition"
                      size={18}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium truncate">
                      {imageFile
                        ? imageFile.name
                        : "Keep existing or select new visual layout..."}
                    </span>
                  </div>
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-divider ml-auto"
                    />
                  )}
                </div>
              </div>

              {/* Ingredients */}
              <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                <Label className="text-xs font-semibold text-default-700 dark:text-zinc-300">
                  Ingredients
                </Label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({ ...formData, ingredients: e.target.value })
                  }
                  rows={4}
                  required
                  className="w-full bg-default-50 dark:bg-[#1c1c1f] border border-divider rounded-xl p-3 text-sm text-foreground outline-none resize-none"
                />
              </TextField>

              {/* Instructions */}
              <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                <Label className="text-xs font-semibold text-default-700 dark:text-zinc-300">
                  Instructions
                </Label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  rows={5}
                  required
                  className="w-full bg-default-50 dark:bg-[#1c1c1f] border border-divider rounded-xl p-3 text-sm text-foreground outline-none resize-none"
                />
              </TextField>
            </Fieldset.Group>

            <Fieldset.Actions className="flex justify-end pt-4 border-t border-divider w-full">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-11 px-6 rounded-xl text-sm"
              >
                {!isSubmitting && <FiCheck size={16} />} Save Changes
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </form>
      </div>
    </div>
  );
}
