"use client";

import React, { useState } from "react";
import { Card, Table, Button, Chip, Input, Tooltip } from "@heroui/react";
import {
  FiSearch,
  FiBookOpen,
  FiTrash2,
  FiEdit3,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { updateRecipeFeature } from "@/app/lib/action/recipe";

export default function ManageRecipesPage({ allRecipes }) {
  // Use database records directly as state default baseline fallback
  const [recipes, setRecipes] = useState(allRecipes || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdatingFeature, setIsUpdatingFeature] = useState(false);

  // Handler: Toggle Feature State targeting Database Key `_id`
  const handleToggleFeature = async (recipeId) => {
    if (isUpdatingFeature) return;
    setIsUpdatingFeature(true);

    try {
      // const res = await fetch(
      //   `http://localhost:5000/api/recipes/${recipeId}/feature`,
      //   {
      //     method: "PATCH",
      //     headers: { "Content-Type": "application/json" },
      //   },
      // );
      // const data = await res.json();

      const data = await updateRecipeFeature(recipeId);

      if (data.success) {
        toast.success(`${data.message}`);
        // Synchronize backend response state with local state array tree
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe._id === recipeId
              ? { ...recipe, isFeatured: data.isFeatured }
              : recipe,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to toggle recipe feature state metadata:", error);
    } finally {
      setIsUpdatingFeature(false);
    }
  };

  // Handler: Deletion Pipeline targeting Database Key `_id`
  const handleDeleteRecipe = (recipeId) => {
    if (confirm("Are you sure you want to permanently delete this recipe?")) {
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeId),
      );
    }
  };

  // Handler: Edit Trigger
  const handleEditRecipe = (recipeId) => {
    alert(`Opening interface to update database item payload ID: ${recipeId}`);
  };

  // Safe structural filtering pipeline checking database parameters with fallbacks
  const filteredRecipes = (recipes || []).filter((recipe) => {
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
    <div className="max-w-5xl md:w-7xl mx-auto p-6 space-y-6 text-foreground min-h-screen bg-background">
      {/* Top Controls Header banner layout info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-divider">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <FiBookOpen className="text-warning" /> Manage Recipes
          </h1>
          <p className="text-default-500 text-sm">
            Monitor shared user publications, assign global promotional badges,
            or enforce structural deletion workflows.
          </p>
        </div>

        {/* Catalog Query Input field filtering values */}
        <Input
          isClearable
          className="w-full md:max-w-xs"
          placeholder="Search by title, category, cuisine..."
          startContent={<FiSearch className="text-default-400" />}
          value={searchQuery}
          onValueChange={setSearchQuery}
          variant="flat"
        />
      </div>

      {/* Main Table Interface Layout Grid Box */}
      <Card className="bg-content1 border border-divider rounded-2xl p-4 shadow-sm">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Administrative indexing directory grid panel mapping database data entries">
              <Table.Header>
                <Table.Column
                  isRowHeader
                  className="bg-default-100 text-default-700 font-bold"
                >
                  RECIPE CONTENT
                </Table.Column>

                <Table.Column className="bg-default-100 text-default-700 font-bold">
                  CUISINE / REGION
                </Table.Column>
                <Table.Column className="bg-default-100 text-default-700 font-bold">
                  LIKES
                </Table.Column>
                <Table.Column className="bg-default-100 text-default-700 font-bold">
                  DATE PUBLISHED
                </Table.Column>
                <Table.Column className="bg-default-100 text-default-700 font-bold">
                  PROMOTION STATUS
                </Table.Column>
                <Table.Column className="bg-default-100 text-default-700 font-bold text-center">
                  ACTIONS
                </Table.Column>
              </Table.Header>

              <Table.Body
                emptyContent={
                  "No database matches returned for specified search terms context."
                }
              >
                {filteredRecipes.map((recipe) => (
                  <Table.Row
                    key={recipe._id}
                    className="border-b border-divider/50 last:border-none hover:bg-default-50/50 transition-colors"
                  >
                    {/* Primary Identifier Content layout wrapping Next Image payload dynamically */}
                    <Table.Cell>
                      <div className="flex items-center gap-4 py-1">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-default-100 border border-divider flex-shrink-0">
                          <Image
                            src={
                              recipe.recipeImage ||
                              "https://i.ibb.co/Rpxt5vHc/banner-image.jpg"
                            }
                            alt={
                              recipe.recipeName ||
                              "Recipe visual thumbnail asset preview"
                            }
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold tracking-tight text-foreground line-clamp-1">
                            {recipe.recipeName}
                          </span>
                          <span className="text-[11px] font-medium text-default-400 uppercase tracking-wider mt-0.5">
                            {recipe.category || "Unassigned"}
                          </span>
                        </div>
                      </div>
                    </Table.Cell>

                    {/* Cuisine Details metadata block columns item cells */}
                    <Table.Cell>
                      <Chip
                        size="sm"
                        variant="flat"
                        className="font-semibold text-xs text-default-600"
                      >
                        {recipe.cuisineType || "Global"}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <Chip
                        size="sm"
                        variant="flat"
                        className="font-semibold text-xs text-default-600"
                      >
                        {recipe.likesCount || "Global"}
                      </Chip>
                    </Table.Cell>

                    {/* Datetime parsing logic arrays block layout row */}
                    <Table.Cell className="text-sm text-default-500 whitespace-nowrap">
                      {recipe.createdAt
                        ? new Date(recipe.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </Table.Cell>

                    {/* Promotion tracking conditions block indicators badge chip toggled status elements */}
                    <Table.Cell>
                      {recipe.isFeatured ? (
                        <Chip
                          size="sm"
                          variant="soft"
                          color="warning"
                          className="font-bold text-xs"
                          startContent={
                            <FiCheckCircle className="ml-1" size={12} />
                          }
                        >
                          Featured on Feed
                        </Chip>
                      ) : (
                        <span className="text-xs text-default-400 italic pl-2">
                          Standard Entry
                        </span>
                      )}
                    </Table.Cell>

                    {/* Action Controls targeting current Database item array identifier elements properties */}
                    <Table.Cell>
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Toggle Promo Feature status trigger buttons */}
                        <Tooltip
                          content={
                            recipe.isFeatured
                              ? "Remove from main feed"
                              : "Promote onto main landing feed showcases"
                          }
                        >
                          <Button
                            isIconOnly
                            size="sm;."
                            variant={recipe.isFeatured ? "solid" : "flat"}
                            color="warning"
                            onPress={() => handleToggleFeature(recipe._id)}
                          >
                            <FiStar
                              size={14}
                              className={
                                recipe.isFeatured ? "fill-current" : ""
                              }
                            />
                          </Button>
                        </Tooltip>

                        {/* Edit metadata block handler controls item actions */}
                        <Tooltip content="Edit recipe configuration properties">
                          <Link
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="default"
                            href={`/dashboard/admin/manageRecipes/${recipe._id}`}
                          >
                            <FiEdit3 size={14} />
                          </Link>
                        </Tooltip>

                        {/* Database Document Deletion removal controls buttons triggers */}
                        <Tooltip content="Permanently wipe entry document log">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="danger"
                            onPress={() => handleDeleteRecipe(recipe._id)}
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </Tooltip>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
          <Table.Footer className="text-xs text-default-400 p-2 border-t border-divider/50">
            Index ledger counts total of {filteredRecipes.length} structural
            entries actively parsed.
          </Table.Footer>
        </Table>
      </Card>
    </div>
  );
}
