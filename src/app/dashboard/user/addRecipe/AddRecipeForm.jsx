"use client";

import React, { useState } from "react";
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
  FiPlus,
  FiBook,
  FiClock,
  FiLayers,
  FiGlobe,
  FiSmile,
  FiUploadCloud,
  FiCheck,
} from "react-icons/fi";
import { createRecipe } from "@/app/lib/action/recipe";
// import { createRecipe } from "@/app/lib/action/recipe";

export default function AddRecipeForm({ recipeCreator }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Core Recipe Form State values tracking your specified fields
  const [formData, setFormData] = useState({
    recipeName: "",
    category: "",
    cuisineType: "",
    difficultyLevel: "Easy",
    prepTime: "",
    ingredients: "",
    instructions: "",
  });

  // ImgBB Upload Pipeline Helper Function
  const uploadToImgbb = async (file) => {
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API; // Replace with your valid API key
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
      return data.data.url; // Returns direct static image url hosting path
    } catch (error) {
      console.error("Imgbb image upload failed:", error);
      return null;
    }
  };

  // Immediate local state asset preview caching handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Form Processing Submission Layer
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = "";

    // Upload asset to cloud filesystem if a file exists
    if (imageFile) {
      const uploadedUrl = await uploadToImgbb(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    // Normalized data document payload schema ready for your recipes Collection ingestion
    const recipeDocument = {
      recipeName: formData.recipeName,
      recipeImage: finalImageUrl,
      category: formData.category,
      cuisineType: formData.cuisineType,
      difficultyLevel: formData.difficultyLevel,
      preparationTime: formData.prepTime,
      ingredients: formData.ingredients
        .split("\n")
        .filter((item) => item.trim() !== ""), // splits items array cleanly by lines
      instructions: formData.instructions,
      createdAt: new Date().toISOString(),
      recipeCreatorId: recipeCreator.id,
    };

    console.log("Ready to insert into recipes Collection:", recipeDocument);

    const payload = await createRecipe(recipeDocument);
    console.log(payload);
    // if(payload.in)

    // Simulate standard collection writing network delay state variables
    setTimeout(() => {
      alert("Recipe successfully saved to recipes Collection!");
      setIsSubmitting(false);
      // Optional: resets local values state
      setFormData({
        recipeName: "",
        category: "",
        cuisineType: "",
        difficultyLevel: "Easy",
        prepTime: "",
        ingredients: "",
        instructions: "",
      });
      setLogoPreview("");
      setImageFile(null);
    }, 1500);
  };

  return (
    <div className="max-w-5xl md:w-7xl mx-auto p-6 min-h-screen text-zinc-100 bg-[#09090b]">
      <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit}>
          <Fieldset className="space-y-6">
            {/* Header Legend block configuration */}
            <Fieldset.Legend className="flex flex-col gap-1 pb-2 border-b border-zinc-800 w-full">
              <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <FiPlus className="text-amber-500" /> ADD NEW RECIPE
              </span>
              <p className="text-xs text-zinc-400">
                Fill in the parameters below to catalog this entry inside your
                recipes collection.
              </p>
            </Fieldset.Legend>

            {/* Core Fields Grid Group */}
            <Fieldset.Group className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 w-full">
              {/* Recipe Name */}
              <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                <Label className="text-xs font-semibold text-zinc-300">
                  Recipe Name
                </Label>
                <div className="relative flex items-center">
                  <FiBook className="absolute left-3 text-zinc-500 z-10" />
                  <Input
                    type="text"
                    placeholder="e.g. Traditional Spicy Chicken Biryani"
                    value={formData.recipeName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipeName: e.target.value })
                    }
                    required
                    className="w-full bg-[#1c1c1f] border border-zinc-800 focus-within:border-amber-500/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-600 outline-none transition"
                  />
                </div>
                <Description className="text-[11px] text-zinc-500">
                  Provide a clear, identifying catalog name.
                </Description>
                <FieldError className="hidden" />
              </TextField>

              {/* Category */}
              <TextField className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-zinc-300">
                  Category
                </Label>
                <div className="relative flex items-center">
                  <FiLayers className="absolute left-3 text-zinc-500 z-10" />
                  <Input
                    type="text"
                    placeholder="e.g. Main Course, Dessert"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    className="w-full bg-[#1c1c1f] border border-zinc-800 focus-within:border-amber-500/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-600 outline-none transition"
                  />
                </div>
                <Description className="hidden" />
                <FieldError className="hidden" />
              </TextField>

              {/* Cuisine Type */}
              <TextField className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-zinc-300">
                  Cuisine Type
                </Label>
                <div className="relative flex items-center">
                  <FiGlobe className="absolute left-3 text-zinc-500 z-10" />
                  <Input
                    type="text"
                    placeholder="e.g. South Asian, Italian"
                    value={formData.cuisineType}
                    onChange={(e) =>
                      setFormData({ ...formData, cuisineType: e.target.value })
                    }
                    required
                    className="w-full bg-[#1c1c1f] border border-zinc-800 focus-within:border-amber-500/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-600 outline-none transition"
                  />
                </div>
                <Description className="hidden" />
                <FieldError className="hidden" />
              </TextField>

              {/* Preparation Time */}
              <TextField className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-zinc-300">
                  Preparation Time
                </Label>
                <div className="relative flex items-center">
                  <FiClock className="absolute left-3 text-zinc-500 z-10" />
                  <Input
                    type="text"
                    placeholder="e.g. 45 Mins, 1.5 Hours"
                    value={formData.prepTime}
                    onChange={(e) =>
                      setFormData({ ...formData, prepTime: e.target.value })
                    }
                    required
                    className="w-full bg-[#1c1c1f] border border-zinc-800 focus-within:border-amber-500/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-600 outline-none transition"
                  />
                </div>
                <Description className="hidden" />
                <FieldError className="hidden" />
              </TextField>

              {/* Difficulty Level */}
              <TextField className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-zinc-300">
                  Difficulty Level
                </Label>
                <div className="relative flex items-center">
                  <FiSmile className="absolute left-3 text-zinc-500 z-10" />
                  <select
                    value={formData.difficultyLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficultyLevel: e.target.value,
                      })
                    }
                    className="w-full bg-[#1c1c1f] border border-zinc-800 focus-within:border-amber-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition appearance-none cursor-pointer"
                  >
                    <option value="Easy" className="text-zinc-800">
                      Easy
                    </option>
                    <option value="Medium" className="text-zinc-800">
                      Medium
                    </option>
                    <option value="Hard" className="text-zinc-800">
                      Hard
                    </option>
                  </select>
                </div>
                <Description className="hidden" />
                <FieldError className="hidden" />
              </TextField>

              {/* Image Upload Block Interface */}
              <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 bg-[#1c1c1f] border border-zinc-800 rounded-xl p-4">
                <span className="text-xs font-semibold text-zinc-300">
                  Recipe Image Display Cover
                </span>
                <div className="flex items-center gap-4 mt-1">
                  <label className="flex flex-col items-center justify-center w-14 h-14 bg-[#222226] hover:bg-zinc-800 border border-dashed border-zinc-700 rounded-xl cursor-pointer transition shrink-0 group">
                    <FiUploadCloud
                      className="text-zinc-400 group-hover:text-amber-500 transition"
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
                    <span className="text-xs text-zinc-200 font-medium truncate">
                      {imageFile
                        ? imageFile.name
                        : "Select cover image file..."}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Asset will auto-upload straight to ImgBB ecosystem
                    </span>
                  </div>
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Preview Cache"
                      className="w-12 h-12 object-cover rounded-lg border border-zinc-700 ml-auto"
                    />
                  )}
                </div>
              </div>

              {/* Ingredients Multi-line Entry */}
              <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                <Label className="text-xs font-semibold text-zinc-300">
                  Ingredients
                </Label>
                <textarea
                  placeholder="Enter each ingredient on a brand new line..."
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({ ...formData, ingredients: e.target.value })
                  }
                  rows={4}
                  required
                  className="w-full bg-[#1c1c1f] border border-zinc-800 focus-within:border-amber-500/50 rounded-xl p-3 text-sm text-white placeholder-zinc-600 outline-none transition resize-none"
                />
                <Description className="text-[11px] text-zinc-500">
                  Separating values cleanly line-by-line transforms them into an
                  iterable array schema.
                </Description>
                <FieldError className="hidden" />
              </TextField>

              {/* Instructions text area */}
              <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                <Label className="text-xs font-semibold text-zinc-300">
                  Instructions
                </Label>
                <textarea
                  placeholder="Describe step-by-step processing parameters..."
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  rows={5}
                  required
                  className="w-full bg-[#1c1c1f] border border-zinc-800 focus-within:border-amber-500/50 rounded-xl p-3 text-sm text-white placeholder-zinc-600 outline-none transition resize-none"
                />
                <Description className="hidden" />
                <FieldError className="hidden" />
              </TextField>
            </Fieldset.Group>

            {/* Actions Submission Area */}
            <Fieldset.Actions className="flex justify-end pt-4 border-t border-zinc-800 w-full">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-11 px-6 rounded-xl text-sm transition shadow-lg shadow-amber-500/10 flex items-center gap-2"
              >
                {!isSubmitting && <FiCheck size={16} />}
                Save Recipe Document
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </form>
      </div>
    </div>
  );
}
