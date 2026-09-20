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
  FiZap,
} from "react-icons/fi";
import { createRecipe } from "@/app/lib/action/recipe";
import { SiAdblock } from "react-icons/si";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AddRecipeForm({ recipeCreator }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();

  // AI draft panel state (separate from the recipe fields it fills in)
  const [aiIdea, setAiIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Asks /api/ai/recipe for a draft and prefills the form below.
  // Nothing is saved here - the user still reviews and submits.
  const handleGenerate = async () => {
    const idea = aiIdea.trim();
    if (!idea) {
      toast.error("Describe the dish you want first.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Gemini capacity errors are transient - the button stays enabled so the
        // user can simply press it again.
        toast.error(data?.error || "Could not generate a recipe. Try again.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        recipeName: data.recipeName ?? prev.recipeName,
        category: data.category ?? prev.category,
        cuisineType: data.cuisineType ?? prev.cuisineType,
        difficultyLevel: data.difficultyLevel ?? prev.difficultyLevel,
        // The API returns preparationTime; this form's state calls it prepTime.
        prepTime: data.preparationTime ?? prev.prepTime,
        // The API returns string[]; this textarea is newline-delimited and is
        // split back into an array on submit.
        ingredients: Array.isArray(data.ingredients)
          ? data.ingredients.join("\n")
          : prev.ingredients,
        instructions: data.instructions ?? prev.instructions,
      }));

      toast.success("Draft ready. Review and edit before saving.");
    } catch (error) {
      console.error("AI generate failed:", error);
      toast.error("Could not reach the AI service. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
      status: "pending",
      recipeCreatorId: recipeCreator.id,
    };

    console.log("Ready to insert into recipes Collection:", recipeDocument);

    const payload = await createRecipe(recipeDocument);
    // if(payload.in)

    // Simulate standard collection writing network delay state variables
    setTimeout(() => {
      toast.success("Recipe successfully saved to recipes Collection!");
      setIsSubmitting(false);
      router.refresh();
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
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 min-h-screen text-foreground bg-background">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit}>
          <Fieldset className="space-y-6">
            {/* Header Legend block configuration */}
            <Fieldset.Legend className="flex flex-col gap-1 pb-2 border-b border-border w-full">
              <span className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FiPlus className="text-brand" /> ADD NEW RECIPE
              </span>
              <p className="text-xs text-default-500">
                Fill in the parameters below to catalog this entry inside your
                recipes collection.
              </p>
            </Fieldset.Legend>
            {recipeCreator?.status === "block" ? (
              <>
                <p className="text-danger flex gap-4 items-center">
                  <SiAdblock size={40} />
                  Your account is currently blocked. Please contact support for
                  assistance.
                </p>
              </>
            ) : (
              <>
                {/* AI draft panel - prefills the fields below, saves nothing */}
                <div className="rounded-xl border border-brand/30 bg-background p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <FiZap className="text-brand" />
                    <span className="text-sm font-semibold text-foreground">
                      Generate with AI
                    </span>
                  </div>
                  <p className="text-xs text-default-500">
                    Describe a dish and AI will draft the fields below. Everything
                    stays editable before you save.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <TextField
                      className="flex-1 flex flex-col gap-1.5"
                      aria-label="Describe the dish you want AI to draft"
                    >
                      <Input
                        type="text"
                        placeholder="e.g. spicy thai green curry with chicken"
                        value={aiIdea}
                        maxLength={300}
                        onChange={(e) => setAiIdea(e.target.value)}
                        className="w-full bg-input border border-input-line rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-default-400"
                      />
                    </TextField>
                    {/* type=button: without it this would submit the form */}
                    <Button
                      type="button"
                      onPress={handleGenerate}
                      isDisabled={isGenerating || !aiIdea.trim()}
                      className="bg-accent hover:bg-accent-hover text-accent-foreground font-semibold rounded-lg px-5 disabled:opacity-50"
                    >
                      <span className="flex items-center gap-2">
                        <FiZap className={isGenerating ? "animate-pulse" : undefined} />
                        {isGenerating ? "Generating..." : "Generate"}
                      </span>
                    </Button>
                  </div>
                </div>

                <Fieldset.Group className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 w-full">
                  {/* Recipe Name */}
                  <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                    <Label className="text-xs font-semibold text-default-600">
                      Recipe Name
                    </Label>
                    <div className="relative flex items-center">
                      <FiBook className="absolute left-3 text-default-500 z-10" />
                      <Input
                        type="text"
                        placeholder="e.g. Traditional Spicy Chicken Biryani"
                        value={formData.recipeName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recipeName: e.target.value,
                          })
                        }
                        required
                        className="w-full bg-input border border-input-line focus-within:border-ring rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-default-400 outline-none transition"
                      />
                    </div>
                    <Description className="text-[11px] text-default-500">
                      Provide a clear, identifying catalog name.
                    </Description>
                    <FieldError className="hidden" />
                  </TextField>

                  {/* Category */}
                  <TextField className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-default-600">
                      Category
                    </Label>
                    <div className="relative flex items-center">
                      <FiLayers className="absolute left-3 text-default-500 z-10" />
                      <Input
                        type="text"
                        placeholder="e.g. Main Course, Dessert"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        required
                        className="w-full bg-input border border-input-line focus-within:border-ring rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-default-400 outline-none transition"
                      />
                    </div>
                    <Description className="hidden" />
                    <FieldError className="hidden" />
                  </TextField>

                  {/* Cuisine Type */}
                  <TextField className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-default-600">
                      Cuisine Type
                    </Label>
                    <div className="relative flex items-center">
                      <FiGlobe className="absolute left-3 text-default-500 z-10" />
                      <Input
                        type="text"
                        placeholder="e.g. South Asian, Italian"
                        value={formData.cuisineType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cuisineType: e.target.value,
                          })
                        }
                        required
                        className="w-full bg-input border border-input-line focus-within:border-ring rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-default-400 outline-none transition"
                      />
                    </div>
                    <Description className="hidden" />
                    <FieldError className="hidden" />
                  </TextField>

                  {/* Preparation Time */}
                  <TextField className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-default-600">
                      Preparation Time
                    </Label>
                    <div className="relative flex items-center">
                      <FiClock className="absolute left-3 text-default-500 z-10" />
                      <Input
                        type="text"
                        placeholder="e.g. 45 Mins, 1.5 Hours"
                        value={formData.prepTime}
                        onChange={(e) =>
                          setFormData({ ...formData, prepTime: e.target.value })
                        }
                        required
                        className="w-full bg-input border border-input-line focus-within:border-ring rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-default-400 outline-none transition"
                      />
                    </div>
                    <Description className="hidden" />
                    <FieldError className="hidden" />
                  </TextField>

                  {/* Difficulty Level */}
                  <TextField className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-default-600">
                      Difficulty Level
                    </Label>
                    <div className="relative flex items-center">
                      <FiSmile className="absolute left-3 text-default-500 z-10" />
                      <select
                        value={formData.difficultyLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            difficultyLevel: e.target.value,
                          })
                        }
                        className="w-full bg-input border border-input-line focus-within:border-ring rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-default-400 outline-none transition appearance-none cursor-pointer"
                      >
                        <option value="Easy">
                          Easy
                        </option>
                        <option value="Medium">
                          Medium
                        </option>
                        <option value="Hard">
                          Hard
                        </option>
                      </select>
                    </div>
                    <Description className="hidden" />
                    <FieldError className="hidden" />
                  </TextField>

                  {/* Image Upload Block Interface */}
                  <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2 bg-input border border-input-line rounded-xl p-4">
                    <span className="text-xs font-semibold text-default-600">
                      Recipe Image Display Cover
                    </span>
                    <div className="flex items-center gap-4 mt-1">
                      <label className="flex flex-col items-center justify-center w-14 h-14 bg-surface-secondary hover:bg-surface-hover border border-dashed border-border rounded-xl cursor-pointer transition shrink-0 group">
                        <FiUploadCloud
                          className="text-default-500 group-hover:text-brand transition"
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
                        <span className="text-xs text-foreground font-medium truncate">
                          {imageFile
                            ? imageFile.name
                            : "Select cover image file..."}
                        </span>
                        <span className="text-[10px] text-default-500">
                          Asset will auto-upload straight to ImgBB ecosystem
                        </span>
                      </div>
                      {logoPreview && (
                        <img
                          src={logoPreview}
                          alt="Preview Cache"
                          className="w-12 h-12 object-cover rounded-lg border border-border ml-auto"
                        />
                      )}
                    </div>
                  </div>

                  {/* Ingredients Multi-line Entry */}
                  <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                    <Label className="text-xs font-semibold text-default-600">
                      Ingredients
                    </Label>
                    <textarea
                      placeholder="Enter each ingredient on a brand new line..."
                      value={formData.ingredients}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ingredients: e.target.value,
                        })
                      }
                      rows={4}
                      required
                      className="w-full bg-input border border-input-line focus-within:border-ring rounded-xl p-3 text-sm text-foreground placeholder:text-default-400 outline-none transition resize-none"
                    />
                    <Description className="text-[11px] text-default-500">
                      Separating values cleanly line-by-line transforms them
                      into an iterable array schema.
                    </Description>
                    <FieldError className="hidden" />
                  </TextField>

                  {/* Instructions text area */}
                  <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                    <Label className="text-xs font-semibold text-default-600">
                      Instructions
                    </Label>
                    <textarea
                      placeholder="Describe step-by-step processing parameters..."
                      value={formData.instructions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instructions: e.target.value,
                        })
                      }
                      rows={5}
                      required
                      className="w-full bg-input border border-input-line focus-within:border-ring rounded-xl p-3 text-sm text-foreground placeholder:text-default-400 outline-none transition resize-none"
                    />
                    <Description className="hidden" />
                    <FieldError className="hidden" />
                  </TextField>
                </Fieldset.Group>

                {/* Actions Submission Area */}
                <Fieldset.Actions className="flex justify-end pt-4 border-t border-border w-full">
                  <Button
                    type="submit"
                    isDisabled={isSubmitting}
                    className="bg-accent hover:bg-accent-hover text-accent-foreground font-bold h-11 px-6 rounded-xl text-sm transition shadow-lg shadow-accent/10 flex items-center gap-2"
                  >
                    {!isSubmitting && <FiCheck size={16} />}
                    Save Recipe Document
                  </Button>
                </Fieldset.Actions>
              </>
            )}
            {/* Core Fields Grid Group */}
          </Fieldset>
        </form>
      </div>
    </div>
  );
}
