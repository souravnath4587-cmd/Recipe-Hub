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
import {
  updateRecipeFavouriteAction,
  updateRecipeLikeAction,
  userReportAction,
} from "@/app/lib/action/recipe";
import { toast } from "react-toastify";
import { uploadPaymetsData } from "@/app/lib/action/payments";
import { useRouter } from "next/navigation";

export default function RecipeDetailsClient({
  initialRecipe,
  user,
  purchasedRecipesCount = 0,
}) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const [reportReason, setReportReason] = useState("Spam");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const router = useRouter();

  const modalState = useOverlayState();
  const totalIngredients = recipe.ingredients?.length ?? 0;

  // Handles the API loop for Likes
  const handleLikeToggle = async (recipeId) => {
    if (isVoting) return; // Guard clause to prevent spam clicks
    setIsVoting(true); // Disable buttons immediately
    try {
      const data = await updateRecipeLikeAction(recipeId, { direction: "up" });
      if (data.likesCount > recipe.likesCount) {
        toast.success("Your support means a lot to me. Thank you!");
        // FIXED: Update the active recipe object's counter property directly
        setRecipe((prev) => ({ ...prev, likesCount: data.likesCount }));

        // Toggle button highlights
        setIsLiked((prev) => !prev);
        setIsDisliked(false);
      }
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
      const data = await updateRecipeLikeAction(recipeId, {
        direction: "down",
      });
      if (data.likesCount < recipe.likesCount) {
        toast.success(
          "Experiencing an issue? Please share your feedback or report the problem below. ",
        );

        setRecipe((prev) => ({ ...prev, likesCount: data.likesCount }));

        // Toggle button highlights
        setIsDisliked((prev) => !prev);
        setIsLiked(false);
      }

      // FIXED: Update the active recipe object's counter property directly
    } catch (error) {
      console.error("Failed to register dislike step:", error);
      isVoting(false);
    }
  };

  const handleFavoriteToggle = async (recipeId, id) => {
    if (isFavoriteLoading) return; // Prevent double clicks
    setIsFavoriteLoading(true);

    try {
      const data = await updateRecipeFavouriteAction(recipeId, { userId: id });

      console.log(data);

      if (data.favoritesCount > 0) {
        toast.success(
          `Great choice! This recipe is now in your favorites. "${user?.name}"`,
        );
      } else {
        toast.error("You've stopped following this recipe.");
      }
      setIsFavorited(data.isFavorited); // Sets state to true/false based on MongoDB array state

      // Update your recipe object context tracking locally if you display a count:
      setRecipe((prev) => ({
        ...prev,
        favouritesCount: data.favoritesCount,
      }));
    } catch (error) {
      console.error("Failed updating your saved choices library:", error);
    } finally {
      setIsFavoriteLoading(false); // Unlock the button trigger action
    }
  };

  const submitReportHandler = async (recipeId, id) => {
    setIsSubmittingReport(true);

    try {
      const data = await userReportAction({
        recipeId: recipeId,
        userId: id, // Replace with your actual authenticated user state context
        reason: reportReason,
        details: additionalDetails,
      });

      if (data.success) {
        toast.success(
          "Thank you. This recipe has been flagged for moderation review.",
        );
        setAdditionalDetails("");
        modalState.close(); // Programmatically close the modal overlay layer
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Failed to submit report packet:", error);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const userPlan = user?.plan || "user_free";

  // Client-side validation metrics matching server rules
  const isFreePlan = userPlan === "user_free";
  const isProCapReached = userPlan === "user_pro" && purchasedRecipesCount >= 5;
  const isPremiumCapReached =
    userPlan === "user_premium" && purchasedRecipesCount >= 10;

  const shouldDisableButton =
    isFreePlan || isProCapReached || isPremiumCapReached;

  // Generate helper warning texts depending on why the button is locked
  let buttonLabel = "Purchase Recipe Access";
  if (isFreePlan) buttonLabel = "Free Tier Restriced";
  if (isProCapReached) buttonLabel = "Pro Purchase Cap Reached (5/5)";
  if (isPremiumCapReached) buttonLabel = "Premium Purchase Cap Reached (20/20)";

  const handlePurchasePayment = async (recipeId) => {
    try {
      setIsLoading(true);

      // 1. This is where you would normally invoke your Stripe checkout flow.
      // Assuming a successful checkout returns a mock transaction string:
      const mockTransactionId =
        "ch_" + Math.random().toString(36).substring(2, 11);

      // 2. Transmit payload directly to your Express Server route
      const payload = {
        userId: user?.id,
        userEmail: user?.email,
        recipeId: recipeId,
        transactionId: mockTransactionId,
        userPlan: userPlan,
      };
      const response = await uploadPaymetsData(payload);
      console.log(response);

      if (response.success) {
        toast.success("Success! Recipe unlocked successfully.");
        // Refresh to reflect changes
        router.push("/dashboard/user/purchasedRecipes");
      } else {
        toast.error(`Purchase Denied: ${response.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected transaction system error happened.");
    } finally {
      setIsLoading(false);
    }
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

                {/* Securely displays the reactive state value from our API callback */}
                <span className="text-xs font-extrabold text-center uppercase text-white px-1">
                  {recipe.likesCount ?? 0} Likes
                </span>
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
              </div>

              <div className="flex items-center justify-center bg-gray-700 p-2 rounded-xl gap-2 border w-full text-white">
                <Button
                  isIconOnly
                  radius="full"
                  variant={isFavorited ? "solid" : "flat"}
                  color={isFavorited ? "danger" : "default"}
                  onPress={() => handleFavoriteToggle(recipe._id, user?.id)}
                  isDisabled={isFavoriteLoading} // Disables interaction while awaiting DB confirmation
                  isLoading={isFavoriteLoading} // Shows nice native loading feedback circle
                >
                  {!isFavoriteLoading && (
                    <FiHeart
                      size={16}
                      className={isFavorited ? "fill-current" : ""}
                    />
                  )}
                </Button>
                <span className="text-xs font-bold">
                  {recipe.favouritesCount ?? 0} Saves
                </span>
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
                Pro and Premium User can Unlock
              </span>
              <h3 className="text-xl font-black text-foreground">
                Own This Recipe Blueprint
              </h3>
              <p className="text-xs text-default-400">
                Get instant offline access, scaling guides, and cooking tools.
              </p>
            </div>
            <Button
              className="w-full bg-black text-white dark:bg-white dark:text-black font-black tracking-tight text-md h-12 shadow-md disabled:opacity-50"
              radius="xl"
              startContent={<FiCreditCard size={18} />}
              isDisabled={shouldDisableButton}
              isLoading={isLoading}
              onPress={() => handlePurchasePayment(recipe._id)}
            >
              {buttonLabel}
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

      {/* HeroUI v3.2.1 EXACT MODAL COMPONENT SPECIFICATION DEMO LAYOUT */}
      <Modal state={modalState}>
        <Modal.Backdrop variant="blur">
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />

              <Modal.Header>
                <FiAlertTriangle className="text-warning mt-1" size={20} />
                <Modal.Heading className="text-xl font-black">
                  Flag This Publication
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body className="space-y-4 py-2">
                {/* Reason Selection Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-default-500 uppercase tracking-wider">
                    Select Core Violation Reason
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-default-100 border border-divider text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-warning"
                  >
                    <option value="Spam">1. Spam</option>
                    <option value="Offensive Content">
                      2. Offensive Content
                    </option>
                    <option value="Copyright Issue">3. Copyright Issue</option>
                  </select>
                </div>

                {/* Additional Written Context */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-default-500 uppercase tracking-wider">
                    Additional Context (Optional)
                  </label>
                  <TextField name="reportDetails">
                    <TextArea
                      placeholder="Provide specific links or explanations supporting this report action..."
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      rows={4}
                      fullWidth
                    />
                  </TextField>
                </div>
              </Modal.Body>

              <Modal.Footer className="flex gap-2 justify-end border-t border-divider/40 pt-3">
                <Button
                  color="default"
                  variant="flat"
                  className="font-bold"
                  onPress={modalState.close}
                  isDisabled={isSubmittingReport}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  className="font-bold"
                  onPress={() => submitReportHandler(recipe._id, user?.id)}
                  isLoading={isSubmittingReport}
                  isDisabled={isSubmittingReport}
                >
                  Submit Safety Flag
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
