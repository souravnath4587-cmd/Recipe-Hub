"use client";

import React, { useState, useMemo } from "react";
import { Table, Button, Chip, Input } from "@heroui/react";
import { FiEye, FiTrash2, FiSearch, FiHeart } from "react-icons/fi";
import Link from "next/link";
import { updateRecipeFavouriteAction } from "@/app/lib/action/recipe";

export default function FavoriteRecipesTable({ initialFavorites = [], user }) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [filterValue, setFilterValue] = useState("");

  // Handle removing a recipe from favorites directly from the dashboard row matrix
  const handleUnfavorite = async (recipeId) => {
    const confirmUnfavorite = confirm(
      "Remove this recipe from your collection?",
    );
    if (!confirmUnfavorite) return;

    try {
      const data = await updateRecipeFavouriteAction(recipeId, {
        userId: user?.id,
      });

      if (data.success) {
        // Optimistically drop from layout dataset array loop
        setFavorites((prev) => prev.filter((item) => item._id !== recipeId));
      }
    } catch (error) {
      console.error("Failed to remove recipe execution track:", error);
    }
  };

  // Memoized layout runtime filtering query processing filter
  const filteredItems = useMemo(() => {
    return favorites.filter(
      (recipe) =>
        recipe.recipeName?.toLowerCase().includes(filterValue.toLowerCase()) ||
        recipe.category?.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [favorites, filterValue]);

  return (
    <div className="max-w-5xl md:w-7xl mx-auto p-6 space-y-6">
      {/* Header Management Toolbar Cluster Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <FiHeart className="text-danger fill-current" /> Saved Vault
            Blueprint Collections
          </h1>
          <p className="text-xs text-default-400 font-medium">
            Manage your personal curated inventory storage catalog pipelines.
          </p>
        </div>

        <Input
          isClearable
          className="w-full sm:max-w-[320px]"
          placeholder="Filter by title or origin tag..."
          startContent={<FiSearch className="text-default-400" />}
          value={filterValue}
          onValueChange={setFilterValue}
          variant="flat"
        />
      </div>

      {/* HeroUI v3.2.1 Core Compound Table Component implementation architecture */}
      <Table aria-label="Favorite Recipes Master Manifest">
        <Table.ScrollContainer>
          <Table.Content>
            <Table.Header>
              <Table.Column>Recipe Asset Pipeline</Table.Column>
              <Table.Column>Classification Group</Table.Column>
              <Table.Column>Execution Latency</Table.Column>
              <Table.Column>Complexity Tier</Table.Column>
              <Table.Column>Operational Controls</Table.Column>
            </Table.Header>

            <Table.Body
              emptyContent={
                "No matching saved recipe logs found in workspace records."
              }
            >
              {filteredItems.map((recipe) => (
                <Table.Row
                  key={recipe._id}
                  className="border-b border-divider/40"
                >
                  {/* Recipe Main Title Data Identifier Cell */}
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-sm">
                        {recipe.recipeName}
                      </span>
                      <span className="text-[10px] text-default-400 font-mono">
                        ID: {recipe._id}
                      </span>
                    </div>
                  </Table.Cell>

                  {/* Category Chip Badge Data Cell */}
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color="secondary"
                      className="font-bold uppercase tracking-wider"
                    >
                      {recipe.category || "General"}
                    </Chip>
                  </Table.Cell>

                  {/* Prep Time Context Tracker Cell */}
                  <Table.Cell>
                    <span className="text-xs font-semibold text-default-600">
                      {recipe.preparationTime || "N/A Metrics"}
                    </span>
                  </Table.Cell>

                  {/* Difficulty Metric System Cell */}
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="dot"
                      color={
                        recipe.difficultyLevel === "Easy"
                          ? "success"
                          : recipe.difficultyLevel === "Medium"
                            ? "warning"
                            : "danger"
                      }
                      className="font-medium"
                    >
                      {recipe.difficultyLevel || "Unrated"}
                    </Chip>
                  </Table.Cell>

                  {/* Interactive Operational Control Callbacks Row Cell Actions */}
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/recipes/${recipe._id}`}
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="primary"
                        radius="md"
                      >
                        <FiEye size={14} />
                      </Link>

                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="danger"
                        radius="md"
                        onPress={() => handleUnfavorite(recipe._id)}
                      >
                        <FiTrash2 size={14} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>

        <Table.Footer>
          <div className="p-3 flex justify-between items-center text-xs text-default-400 font-mono">
            <span>
              Pipeline Pool: {filteredItems.length} active documents mapped
            </span>
            <span>Status: Verified Safe Synchronization Terminal</span>
          </div>
        </Table.Footer>
      </Table>
    </div>
  );
}
