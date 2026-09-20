"use client";

import React, { useState } from "react";
import { Table, Button, Tooltip, Avatar, Chip } from "@heroui/react";
import { FiEdit2, FiTrash2, FiClock, FiEye } from "react-icons/fi";
import { recipeDelete } from "@/app/lib/action/recipe";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { isValidImageSrc } from "@/app/lib/imageSrc";

export default function MyRecipesTable({ allRecipes, recipeCreator }) {
  const [recipes, setRecipes] = useState(allRecipes);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedRecipe, setSelectedRecipe] = useState(null);
  // const [modalType, setModalType] = useState("");

  // const handleActionClick = (id) => {
  //   console.log(id);

  //   // if (type === "edit") {
  //   //   // Navigate dynamically using the string variant of the id
  //   //   router.push(`/myRecipes/update/${recipe._id}`);
  //   // } else {
  //   //   setSelectedRecipe(recipe);
  //   //   setIsModalOpen(true);
  //   // }
  // };

  const handleDeleteConfirm = async (id) => {
    const deleteRecipe = await recipeDelete(id);
    if (deleteRecipe.deletedCount > 0) {
      toast.success("Successfully deleted..");
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
    } else {
      toast.error(error.message);
    }
  };

  const difficultyColors = {
    Easy: "success",
    Medium: "warning",
    Hard: "danger",
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 min-h-screen text-foreground bg-background ">
      <div className="flex flex-col gap-1 pb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          My Recipes Collection
        </h1>
        <p className="text-xs text-default-500">
          View, update, or remove recipes you have cataloged.
        </p>
      </div>
      {recipeCreator.status === "block" && (
        <p className="text-red-600 my-2 font-semibold">
          All your actions are currently disabled. Please contact the
          administrator.{" "}
        </p>
      )}

      {/* We use custom classNames to hook into semantic tokens.
        Light Mode: background becomes white/light gray surfaces
        Dark Mode: transitions into dark card finishes automatically
      */}
      <Table className="shadow-sm rounded-2xl overflow-hidden border border-divider">
        <Table.ScrollContainer>
          <Table.Content aria-label="User registered recipes control log panel">
            <Table.Header>
              <Table.Column isRowHeader className="bg-default-100 dark:bg-zinc-800/60 text-default-600 dark:text-zinc-400 font-semibold text-xs py-4">
                Recipe
              </Table.Column>
              <Table.Column className="bg-default-100 dark:bg-zinc-800/60 text-default-600 dark:text-zinc-400 font-semibold text-xs py-4">
                Category
              </Table.Column>
              <Table.Column className="bg-default-100 dark:bg-zinc-800/60 text-default-600 dark:text-zinc-400 font-semibold text-xs py-4">
                Cuisine
              </Table.Column>
              <Table.Column className="bg-default-100 dark:bg-zinc-800/60 text-default-600 dark:text-zinc-400 font-semibold text-xs py-4">
                Difficulty
              </Table.Column>
              <Table.Column className="bg-default-100 dark:bg-zinc-800/60 text-default-600 dark:text-zinc-400 font-semibold text-xs py-4">
                Prep Time
              </Table.Column>
              <Table.Column className="bg-default-100 dark:bg-zinc-800/60 text-default-600 dark:text-zinc-400 font-semibold text-xs py-4 text-center">
                Actions
              </Table.Column>
            </Table.Header>

            <Table.Body className="bg-surface dark:bg-zinc-900/40">
              {recipes.map((recipe, index) => (
                <Table.Row
                  key={index}
                  className="border-b border-divider hover:bg-default-50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <Table.Cell className="py-4">
                    <div className="flex items-center gap-3">
                      {isValidImageSrc(recipe.recipeImage) ? (
                        <Image
                          src={recipe.recipeImage}
                          alt={recipe.recipeName}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover border border-divider shrink-0 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 shrink-0 rounded-full border border-divider bg-default-100 flex items-center justify-center text-xs font-bold text-default-500 uppercase">
                          {recipe.recipeName?.[0] || "?"}
                        </div>
                      )}
                      <span className="font-medium text-sm truncate max-w-[180px]">
                        {recipe.recipeName}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell className="text-default-700 dark:text-zinc-300 text-sm">
                    {recipe.category}
                  </Table.Cell>
                  <Table.Cell className="text-default-700 dark:text-zinc-300 text-sm">
                    {recipe.cuisineType}
                  </Table.Cell>

                  <Table.Cell>
                    <Chip
                      color={
                        difficultyColors[recipe.difficultyLevel] || "default"
                      }
                      variant="flat"
                      size="sm"
                      className="font-semibold text-xs"
                    >
                      {recipe.difficultyLevel}
                    </Chip>
                  </Table.Cell>

                  <Table.Cell className="text-default-700 dark:text-zinc-300 text-sm">
                    <div className="flex items-center gap-1.5 text-default-500">
                      <FiClock size={13} className="text-amber-500" />
                      <span>{recipe.preparationTime}</span>
                    </div>
                  </Table.Cell>

                  <Table.Cell className="text-center py-4">
                    <div className="flex justify-center items-center gap-1">
                      <Tooltip content="View Details" closeDelay={0}>
                        <Link
                          href={`/recipes/${recipe._id}`}
                          aria-disabled={recipeCreator?.status === "block"}
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-md text-default-400 hover:text-amber-500 transition-colors ${
                            recipeCreator?.status === "block"
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        >
                          <FiEye size={16} />
                        </Link>
                      </Tooltip>
                      <Tooltip content="Edit Details" closeDelay={0}>
                        <Link
                          href={`/dashboard/user/myRecipes/${recipe._id}`}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-default-400 hover:text-amber-500 transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                      </Tooltip>
                      <Tooltip
                        content="Delete Recipe"
                        color="danger"
                        closeDelay={0}
                      >
                        <Button
                          isIconOnly
                          variant="danger-soft"
                          size="sm"
                          isDisabled={recipeCreator?.status === "block"}
                          className="text-default-400 hover:text-danger min-w-0"
                          onClick={() => handleDeleteConfirm(recipe._id)}
                        >
                          <FiTrash2 size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer />
      </Table>

      {/* Modal matching theme structure
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        backdrop="blur"
        classNames={{
          base: "bg-surface dark:bg-zinc-950 border border-divider text-foreground max-w-md rounded-2xl mx-4 p-5",
        }}
      >
        {modalType === "edit" ? (
          <>
            <div className="text-lg font-bold pb-2">
              Update Recipe Parameters
            </div>
            <div className="text-sm text-default-500 py-3">
              Modify configuration layers cleanly for{" "}
              <span className="font-semibold text-foreground">
                {selectedRecipe?.recipeName}
              </span>
              .
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-divider">
              <Button
                variant="bordered"
                className="text-default-500"
                onPress={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                color="warning"
                className="font-bold text-black dark:text-white"
                onPress={() => setIsModalOpen(false)}
              >
                Save Changes
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-lg font-bold pb-2 text-danger">
              Confirm Destruction
            </div>
            <div className="text-sm text-default-500 py-3">
              Are you absolutely sure you want to permanently delete{" "}
              <span className="font-semibold text-foreground">
                {selectedRecipe?.recipeName}
              </span>{" "}
              from your records?
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-divider">
              <Button
                variant="bordered"
                className="text-default-500"
                onPress={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                className="font-bold"
                onPress={handleDeleteConfirm}
              >
                Delete Document
              </Button>
            </div>
          </>
        )}
      </Modal> */}
    </div>
  );
}
