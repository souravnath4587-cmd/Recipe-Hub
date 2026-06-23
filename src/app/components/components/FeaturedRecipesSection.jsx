"use client";

import React, { useMemo } from "react";
import { Card, Button, Chip } from "@heroui/react";
import Image from "next/image";
import {
  FiStar,
  FiClock,
  FiHeart,
  FiThumbsUp,
  FiArrowRight,
  FiGlobe,
} from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FeaturedRecipesSection({ recipes = [] }) {
  // Filter the data pool to only show items permitted by the admin
  const featuredRecipes = useMemo(() => {
    return recipes.filter((recipe) => recipe.isFeatured === true);
  }, [recipes]);

  if (featuredRecipes.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto p-6 my-12 bg-default-50/40 rounded-3xl border border-divider/60 backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* --- LEFT SIDE: HEADER CONTENT COLUMN --- */}
        <div className="lg:col-span-4 space-y-4 pr-0 lg:pr-4">
          <div className="inline-flex items-center gap-2 bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-sm">
            <FiStar className="fill-current animate-pulse" size={12} />
            Admin Spotlight
          </div>

          <h2 className="text-4xl font-black tracking-tight text-foreground leading-tight">
            Elite Culinary <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-warning-500 to-amber-600">
              Masterpieces
            </span>
          </h2>

          <p className="text-sm text-default-500 leading-relaxed font-medium">
            These exceptional recipes have been individually reviewed, tested,
            and verified by our head administrative chefs for flawless
            execution.
          </p>

          <div className="pt-2">
            <Button
              as={Link}
              href="/allRecipes?filter=featured"
              color="warning"
              variant="flat"
              className="font-bold text-xs tracking-tight shadow-sm"
              endContent={<FiArrowRight />}
            >
              Explore Full Spotlight
            </Button>
          </div>
        </div>

        {/* --- RIGHT SIDE: SLIDER CARDS BODY COLUMN --- */}
        <div className="lg:col-span-8 overflow-x-auto pb-4 flex gap-6 scrollbar-hide snap-x snap-mandatory">
          {featuredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              className="min-w-[300] sm:min-w-[340] max-w-[340] snap-start"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
              whileHover={{ y: -8 }}
            >
              {/* Exact HeroUI 3.2.1 Compound Syntax Card Component Frame */}
              <Card className="bg-content1 border border-divider rounded-2xl overflow-hidden h-full shadow-sm relative flex flex-col justify-between">
                {/* Embedded Media Canvas Box */}
                <div className="relative w-full aspect-16/10 bg-default-100 overflow-hidden">
                  <Image
                    src={
                      recipe.recipeImage ||
                      "https://i.ibb.co.com/JWqSWj60/burger2.jpg"
                    }
                    alt={recipe.recipeName}
                    fill
                    sizes="(max-w-7xl) 25vw"
                    className="object-cover"
                  />

                  {/* Origin Tag Overlay Badge */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <Chip
                      size="sm"
                      variant="solid"
                      className="bg-black/60 text-white dark:bg-white/70 dark:text-black backdrop-blur-md font-bold"
                      startContent={<FiGlobe />}
                    >
                      {recipe.cuisineType}
                    </Chip>
                  </div>
                </div>

                {/* Card Header Structure Section */}
                <Card.Header className="flex flex-col items-start gap-1 p-5 pb-2">
                  <div className="flex items-center justify-between w-full">
                    <Card.Title className="text-xl font-black text-foreground line-clamp-1 tracking-tight">
                      {recipe.recipeName}
                    </Card.Title>
                    <Chip
                      size="sm"
                      color="warning"
                      variant="flat"
                      className="font-bold text-[10px] uppercase"
                    >
                      {recipe.category}
                    </Chip>
                  </div>

                  <Card.Description className="text-xs font-mono text-default-400">
                    ID Index Reference: {recipe._id.substring(0, 8)}
                  </Card.Description>
                </Card.Header>

                {/* Card Content Component Data Core */}
                <Card.Content className="p-5 pt-0 space-y-4 grow">
                  <p className="text-xs text-default-500 line-clamp-2 leading-relaxed font-medium">
                    {recipe.instructions}
                  </p>

                  {/* Operational Metrics Subgrid */}
                  <div className="grid grid-cols-2 gap-2 bg-default-50 p-2 rounded-xl border border-divider/40 text-[11px] font-bold text-default-600">
                    <div className="flex items-center gap-1.5 justify-center">
                      <FiThumbsUp className="text-primary" />
                      <span>{recipe.likesCount ?? 0} Votes</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center border-l border-divider">
                      <FiHeart className="text-danger fill-current" />
                      <span>
                        {recipe.favouritesCount ??
                          recipe.favourite?.length ??
                          0}{" "}
                        Saves
                      </span>
                    </div>
                  </div>
                </Card.Content>

                {/* Card Footer Structural Interactive Target Element */}
                <Card.Footer className="bg-default-50/50 p-4 border-t border-divider/40 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-semibold text-default-400">
                    <FiClock />
                    <span>
                      {recipe.preparationTime} ({recipe.difficultyLevel})
                    </span>
                  </div>

                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link
                      href={`/recipes/${recipe._id}`}
                      size="sm"
                      color="warning"
                      variant="solid"
                      className="font-black text-xs shadow-sm"
                    >
                      Open Blueprint
                    </Link>
                  </motion.div>
                </Card.Footer>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
