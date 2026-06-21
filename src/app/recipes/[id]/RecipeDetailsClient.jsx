"use client";

import React, { useState } from "react";
import {
  Card,
  Button,
  Chip,
  Modal,
  TextField,
  TextArea,
  useOverlayState,
} from "@heroui/react";
import Image from "next/image";
import {
  FiHeart,
  FiThumbsUp,
  FiAlertTriangle,
  FiCreditCard,
  FiClock,
  FiGrid,
  FiGlobe,
  FiThumbsDown,
} from "react-icons/fi";

export default function RecipeDetailsClient({ initialRecipe }) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isVoting, setIsVoting] = useState(false);

  const modalState = useOverlayState();
  const totalIngredients = recipe.ingredients?.length ?? 0;

  // Handles the API loop for Likes
  const handleLikeToggle = async (recipeId) => {
    if (isVoting) return; // Guard clause to prevent spam clicks
    setIsVoting(true); // Disable buttons immediately
    try {
      const res = await fetch(
        `http://localhost:5000/api/recipes/${recipeId}/vote`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ direction: "up" }),
        },
      );
      const data = await res.json();

      // FIXED: Update the active recipe object's counter property directly
      setRecipe((prev) => ({ ...prev, likesCount: data.likesCount }));

      // Toggle button highlights
      setIsLiked((prev) => !prev);
      setIsDisliked(false);
    } catch (error) {
      console.error("Failed to register like step:", error);
      setIsVoting(false);
    }
  };

  // Handles the API loop for Dislikes
  const handleDislikeToggle = async (recipeId) => {
    if (isVoting) return; // Guard clause
    setIsVoting(true); // Disable buttons immediately
    try {
      const res = await fetch(
        `http://localhost:5000/api/recipes/${recipeId}/vote`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ direction: "down" }),
        },
      );
      const data = await res.json();

      // FIXED: Update the active recipe object's counter property directly
      setRecipe((prev) => ({ ...prev, likesCount: data.likesCount }));

      // Toggle button highlights
      setIsDisliked((prev) => !prev);
      setIsLiked(false);
    } catch (error) {
      console.error("Failed to register dislike step:", error);
      isVoting(false);
    }
  };

  const handleFavoriteToggle = () => {
    setIsFavorited((prev) => !prev);
    alert(
      isFavorited
        ? "Removed from saved favorites."
        : "Added to your dashboard favorites collection!",
    );
  };

  const submitReportHandler = (closeFn) => {
    if (!reportReason.trim()) return alert("Please specify a reason.");
    console.log(`Reporting ID ${recipe._id}:`, reportReason);
    alert(
      "Report filed successfully. Our moderation team will audit this entry shortly.",
    );
    setReportReason("");
    closeFn();
  };

  const handlePurchasePayment = async () => {
    alert(
      `Initializing secure Stripe network tunnel for: ${recipe.recipeName}`,
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen bg-background text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column Media Box */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-content1 border border-divider rounded-2xl overflow-hidden shadow-sm relative">
            <div className="relative w-full aspect-square bg-default-100">
              <Image
                src={
                  recipe.recipeImage ||
                  "https://i.ibb.co/Rpxt5vHc/banner-image.jpg"
                }
                alt={recipe.recipeName || "name of recipe"}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Chip
                  color="secondary"
                  variant="solid"
                  className="font-bold shadow-md"
                >
                  {recipe.category}
                </Chip>
              </div>
            </div>

            <Card.Content className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-default-50/50 border-t border-divider/60">
              <div className="flex items-center justify-center bg-gray-700 p-2 rounded-xl gap-2 border w-full">
                <Button
                  isIconOnly
                  radius="full"
                  variant={isLiked ? "solid" : "flat"}
                  color={isLiked ? "primary" : "default"}
                  isDisabled={isVoting}
                  onPress={() => handleLikeToggle(recipe._id)}
                >
                  <FiThumbsUp
                    size={16}
                    className={isLiked ? "fill-current" : ""}
                  />
                </Button>

                <Button
                  isIconOnly
                  radius="full"
                  variant={isDisliked ? "solid" : "flat"}
                  color={isDisliked ? "danger" : "default"}
                  onPress={() => handleDislikeToggle(recipe._id)}
                  isDisabled={isVoting}
                >
                  <FiThumbsDown
                    size={16}
                    className={isDisliked ? "fill-current" : ""}
                  />
                </Button>

                {/* Securely displays the reactive state value from our API callback */}
                <span className="text-xs font-bold text-white px-1">
                  {recipe.likesCount ?? 0} Score
                </span>
              </div>

              <div className="flex items-center justify-center bg-gray-700 p-2 rounded-xl gap-2 border w-full text-white">
                <Button
                  isIconOnly
                  radius="full"
                  variant={isFavorited ? "solid" : "flat"}
                  color={isFavorited ? "danger" : "default"}
                  onPress={handleFavoriteToggle}
                >
                  <FiHeart
                    size={16}
                    className={isFavorited ? "fill-current" : ""}
                  />
                </Button>
                <span className="text-xs font-bold">Favourite</span>
              </div>

              <div className="flex items-center justify-center bg-gray-700 p-2 rounded-xl gap-2 border w-full text-white">
                <Button
                  isIconOnly
                  radius="full"
                  variant="flat"
                  color="warning"
                  onPress={modalState.open}
                >
                  <FiAlertTriangle size={16} />
                </Button>
                <span className="text-xs font-bold">Report</span>
              </div>
            </Card.Content>
          </Card>

          {/* Premium Stripe Payment Card */}
          <Card className="bg-content1 border-2 border-primary/20 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
                Premium Unlock
              </span>
              <h3 className="text-xl font-black text-foreground">
                Own This Recipe Blueprint
              </h3>
              <p className="text-xs text-default-400">
                Get instant offline access, scaling guides, and cooking tools.
              </p>
            </div>
            <Button
              className="w-full bg-black text-white dark:bg-white dark:text-black font-black tracking-tight text-md h-12 shadow-md"
              radius="xl"
              startContent={<FiCreditCard size={18} />}
              onPress={handlePurchasePayment}
            >
              Purchase Recipe Access
            </Button>
          </Card>
        </div>

        {/* Right Column Specifications Data Card */}
        <div className="lg:col-span-7">
          <Card className="bg-content1 border border-divider rounded-2xl shadow-sm overflow-hidden">
            <Card.Header className="flex flex-col items-start gap-1 p-6">
              <Card.Title className="text-3xl font-black tracking-tight text-foreground">
                {recipe.recipeName}
              </Card.Title>
              <Card.Description className="text-xs font-mono text-default-400">
                Document Index: {recipe._id}
              </Card.Description>
            </Card.Header>

            <Card.Content className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4 bg-default-50 p-4 rounded-xl border border-divider/60">
                <div className="flex flex-col items-center justify-center text-center">
                  <FiClock className="text-primary mb-1" size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-default-400">
                    Prep Metric
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {recipe.preparationTime}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-x border-divider">
                  <FiGrid className="text-warning mb-1" size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-default-400">
                    Complexity
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {recipe.difficultyLevel}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <FiGlobe className="text-success mb-1" size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-default-400">
                    Origin
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {recipe.cuisineType}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-black tracking-wider text-foreground uppercase flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full"></span>{" "}
                  Required Elements ({totalIngredients})
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {recipe.ingredients?.map((item, index) => (
                    <Chip
                      key={index}
                      variant="flat"
                      color="default"
                      className="font-semibold text-sm px-2.5"
                    >
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-black tracking-wider text-foreground uppercase flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full"></span>{" "}
                  Method Workflow Instructions
                </h4>
                <p className="text-sm text-default-600 leading-relaxed bg-default-50/50 p-4 rounded-xl border border-divider/30 font-medium">
                  {recipe.instructions}
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* HeroUI v3.2.1 Compound Modal Overlay Implementation */}
      <Modal state={modalState}>
        <Modal.Backdrop variant="blur" />
        <Modal.Container>
          <Modal.Dialog>
            {({ close }) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading className="text-xl font-black">
                    Flag Recipe Publication
                  </Modal.Heading>
                </Modal.Header>
                <Modal.Body className="py-4 space-y-4">
                  <p className="text-sm text-default-500">
                    Help enforce community standards. Specify details regarding{" "}
                    <span className="font-bold text-foreground">
                      {recipe.recipeName}
                    </span>
                    :
                  </p>

                  <TextField name="reportDetails">
                    <TextArea
                      placeholder="Explain why this entry should be audited..."
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      rows={4}
                      fullWidth
                    />
                  </TextField>
                </Modal.Body>
                <Modal.Footer className="flex gap-2 justify-end">
                  <Button
                    color="default"
                    variant="flat"
                    className="font-bold"
                    onPress={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    className="font-bold"
                    onPress={() => submitReportHandler(close)}
                  >
                    Submit Safety Flag
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </div>
  );
}
