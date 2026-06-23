"use client";

import React from "react";
import { Card, Button, Chip } from "@heroui/react";
import Image from "next/image";
import {
  FiClock,
  FiGrid,
  FiArrowRight,
  FiHeart,
  FiThumbsUp,
  FiStar,
  FiGlobe,
} from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomeRecipesClient({ recipes = [] }) {
  // Limit output matrix array to exactly 6 documents
  const limitedRecipes = recipes.slice(0, 6);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Layout Banner Metadata Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-divider pb-5 gap-4">
        <div>
          <Chip
            color="primary"
            variant="flat"
            size="sm"
            className="font-bold uppercase tracking-wider mb-2"
          >
            Chef's Master Inventory
          </Chip>
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Explore Our Top Recipes
          </h2>
          <p className="text-sm text-default-400 mt-1 font-medium">
            Handpicked culinary blueprints curated daily for your kitchen
            workspace.
          </p>
        </div>

        {/* Animated View All Button via framer-motion interaction parameters */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/recipes"
            color="primary"
            variant="ghost"
            className="font-bold group"
            endContent={
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            }
          >
            View All Recipes
          </Link>
        </motion.div>
      </div>

      {/* Grid Display Container Framework Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {limitedRecipes.map((recipe) => (
          <Card
            key={recipe._id}
            className="bg-content1 border border-divider rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Immersive Image Header Box Container */}
            <div className="relative w-full aspect-[4/3] bg-default-100 overflow-hidden group">
              {/* Animated Zoom Component Wrap for Next Image */}
              <motion.div
                className="w-full h-full relative"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Image
                  src={
                    recipe.recipeImage ||
                    "https://i.ibb.co/Rpxt5vHc/banner-image.jpg"
                  }
                  alt={recipe.recipeName}
                  fill
                  sizes="(max-w-7xl) 33vw"
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Absolute Positioned Data Badge Elements Overlay Grid */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                <Chip
                  size="sm"
                  color="secondary"
                  variant="solid"
                  className="font-bold shadow-md"
                >
                  {recipe.category}
                </Chip>

                {/* Administrative feature indicator verified flag logic */}
                {recipe.isFeatured && (
                  <Chip
                    size="sm"
                    color="warning"
                    variant="solid"
                    className="font-black text-black shadow-md text-[10px] tracking-wider uppercase"
                    startContent={<FiStar className="fill-current" />}
                  >
                    Featured
                  </Chip>
                )}
              </div>
            </div>

            {/* Inner Body Content Metrics Description Section */}
            <Card.Content className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg text-foreground line-clamp-1">
                  {recipe.recipeName}
                </h3>

                {/* New: Cuisine Location Tag */}
                <div className="flex items-center gap-1 text-xs text-default-400 font-semibold">
                  <FiGlobe className="text-success" />
                  <span>Origin: {recipe.cuisineType || "Global"}</span>
                </div>

                <p className="text-xs text-default-400 line-clamp-2 min-h-[32px] leading-relaxed pt-1">
                  {recipe.instructions ||
                    "Click detail workspace view to inspect the required workflow instructions pipeline..."}
                </p>
              </div>

              {/* Dynamic Interactive Stats Counter Aggregation Bar */}
              <div className="grid grid-cols-2 gap-2 bg-default-50 p-2.5 rounded-xl border border-divider/40 text-xs text-default-600 font-bold">
                <div className="flex items-center gap-1.5 justify-center">
                  <FiThumbsUp className="text-primary" />
                  <span>{recipe.likesCount ?? 0} Likes</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center border-l border-divider">
                  <FiHeart className="text-danger fill-current" />
                  <span>
                    {recipe.favouritesCount ?? recipe.favourite?.length ?? 0}{" "}
                    Saves
                  </span>
                </div>
              </div>

              {/* Bottom Preparation & Complexity Specification Footnotes */}
              <div className="flex items-center justify-between pt-1 text-xs text-default-400 font-semibold font-mono">
                <div className="flex items-center gap-1">
                  <FiClock />
                  <span>{recipe.preparationTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiGrid />
                  <span>{recipe.difficultyLevel} Tier</span>
                </div>
              </div>
            </Card.Content>

            {/* Action Routing Footer Controls Panel */}
            <Card.Footer className="bg-default-50/50 p-4 border-t border-divider/40 hover:bg-white hover:text-black transition-all duration-500 text-center">
              <motion.div
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href={`/recipes/${recipe._id}`}
                  fullWidth
                  size="md"
                  variant="flat"
                  color="primary"
                  className="font-bold tracking-tight"
                >
                  View Blueprint Details
                </Link>
              </motion.div>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  );
}
