"use client";

import React, { useState } from "react";
import { Card, Input, Button, Chip } from "@heroui/react";
import Image from "next/image";
import {
  FiSearch,
  FiClock,
  FiBookOpen,
  FiActivity,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";

export default function AllRecipesPage({ allRecipes = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Clean filtering logic with fallbacks to avoid crashes
  const filteredRecipes = allRecipes.filter((recipe) => {
    const name = recipe?.recipeName || "";
    const category = recipe?.category || "";
    const cuisine = recipe?.cuisineType || "";

    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen bg-background text-foreground">
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-divider">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            Explore Global Recipes
          </h1>
          <p className="text-default-500 text-sm">
            Discover {allRecipes.length} culinary masterpieces crafted by our
            community chefs.
          </p>
        </div>

        {/* Eye-catching Search Input */}
        <Input
          isClearable
          className="w-full md:max-w-xs"
          placeholder="Search recipes, tags, origins..."
          startContent={<FiSearch className="text-default-400" size={18} />}
          value={searchQuery}
          onValueChange={setSearchQuery}
          variant="flat"
          radius="lg"
        />
      </div>

      {/* Main Grid Layout - Matches your reference card aspect ratios closely */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-divider rounded-2xl bg-content1/50">
          <p className="text-default-400 font-medium">
            No recipes match your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe, index) => {
            // Derived fallback or array lengths safely parsing input data commas or strict arrays
            const totalIngredients = Array.isArray(recipe.ingredients)
              ? recipe.ingredients.length
              : recipe.ingredients?.split(",")?.length || 1;

            // Mocking high-rated or trending states for visual appeal like your image template
            const isTrending = index % 3 === 0;
            const dynamicRating = (4.5 + (index % 5) * 0.1).toFixed(2);

            return (
              <Card
                key={recipe._id}
                className="bg-content1 border border-divider rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Upper Media Banner Segment */}
                <div className="relative w-full h-56 bg-default-100 overflow-hidden">
                  <Image
                    src={
                      recipe.recipeImage ||
                      "https://i.ibb.co/Rpxt5vHc/banner-image.jpg"
                    }
                    alt={recipe.recipeName}
                    fill
                    sizes="(max-w-7xl) 25vw, 33vw, 50vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />

                  {/* Absolute Card Float Overlay Elements */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {isTrending && (
                      <Chip
                        size="sm"
                        className="bg-white/95 text-black font-extrabold text-[11px] px-2 py-0.5 rounded-md shadow-sm border border-black/5"
                        variant="flat"
                      >
                        Trending this Week
                      </Chip>
                    )}
                    <Chip
                      size="sm"
                      color="secondary"
                      className="font-bold text-[10px] tracking-wide uppercase px-2 shadow-sm"
                    >
                      {recipe.category}
                    </Chip>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Chip
                      size="sm"
                      className="bg-[#d2f34c] text-black font-bold text-xs shadow-sm border border-black/5"
                      startContent={
                        <FiStar className="fill-current text-black" size={12} />
                      }
                    >
                      {dynamicRating}
                    </Chip>
                  </div>
                </div>

                {/* Header Meta Content Blocks */}
                <Card.Header className="flex flex-col items-start gap-3 p-4 pb-1">
                  {/* Icon Metric Info Bar */}
                  <div className="flex items-center gap-4 text-default-500 text-xs font-semibold w-full">
                    <span className="flex items-center gap-1">
                      <FiClock size={14} className="text-default-400" />
                      {recipe.preparationTime || "25 min"}
                    </span>
                    <span className="flex items-center gap-1 border-x border-divider px-3">
                      <FiBookOpen size={14} className="text-default-400" />
                      {totalIngredients} Ingredients
                    </span>
                    <span className="flex items-center gap-1">
                      <FiActivity size={14} className="text-default-400" />
                      {recipe.difficultyLevel || "Easy"}
                    </span>
                  </div>

                  {/* Title */}
                  <Card.Title className="text-xl font-extrabold tracking-tight text-foreground line-clamp-1 w-full pt-1">
                    {recipe.recipeName}
                  </Card.Title>

                  {/* Description / Instructions Preview string */}
                  <Card.Description className="text-default-500 text-sm line-clamp-2 leading-relaxed">
                    {recipe.instructions ||
                      "A perfect quick alternative option ideal for delicious and memorable weekend meals."}
                  </Card.Description>
                </Card.Header>

                {/* Empty element block for clean anatomy consistency alignment mapping */}
                <Card.Content className="px-4 py-0" />

                {/* Footer Action segment */}
                <Card.Footer className="p-4 pt-2">
                  <Button
                    className="w-full bg-black text-white dark:bg-white dark:text-black font-bold text-sm h-11 shadow-sm hover:opacity-90 transition-opacity"
                    radius="xl"
                    endContent={<FiArrowRight size={16} />}
                    onPress={() =>
                      (window.location.href = `/recipes/${recipe._id}`)
                    }
                  >
                    View Recipe
                  </Button>
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
