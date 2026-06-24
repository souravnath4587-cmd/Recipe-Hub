"use client";

import React, { useState, useEffect } from "react";
import {
  Fieldset,
  TextField,
  Label,
  Input,
  Button,
  Avatar,
} from "@heroui/react";
import {
  FiUser,
  FiMail,
  FiUploadCloud,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";
import { authClient } from "@/app/lib/auth-client";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  // Sync state cleanly when the async better-auth session data resolves
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "" });
      setImagePreview(user.image || "");
    }
  }, [user]);

  // Handle local avatar file replacement
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgbb = async (file) => {
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
    if (!IMGBB_API_KEY) {
      console.error(
        "Missing NEXT_PUBLIC_IMAGE_UPLOAD_API key environment variable",
      );
      return null;
    }

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
      return data?.data?.url || null;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = user?.image || "";

    // 1. Upload new image if a new file asset was selected
    if (imageFile) {
      const uploadedUrl = await uploadToImgbb(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    try {
      // 2. Call better-auth directly to update database values on your server
      const { data, error } = await authClient.updateUser({
        name: formData.name,
        image: finalImageUrl,
      });

      if (error) {
        alert(`Failed to update profile: ${error.message}`);
      } else {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Profile mutation error:", error);
      alert("An unexpected error occurred during your profile save.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl md:w-7xl mx-auto p-6 min-h-screen text-foreground bg-background">
      <div className="bg-surface dark:bg-[#121214] border border-divider rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit}>
          <Fieldset className="space-y-8">
            {/* Header Legend Layout Block */}
            <Fieldset.Legend className="flex flex-col gap-1 pb-4 border-b border-divider w-full">
              <span className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2">
                <FiUser className="text-amber-500" /> My Profile Setup
              </span>
              <p className="text-xs text-default-400">
                Manage your public profile identity records. Email addresses are
                fixed system constants.
              </p>
            </Fieldset.Legend>

            {/* Interactive Profile Avatar Grid Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-default-50 dark:bg-[#1c1c1f] border border-divider rounded-xl">
              <div className="relative group shrink-0">
                <Avatar
                  src={imagePreview || undefined}
                  name={formData.name || "User"}
                  className="w-24 h-24 text-large rounded-2xl border-2 border-divider object-cover"
                />
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-2xl cursor-pointer text-white text-[10px] font-semibold gap-1">
                  <FiUploadCloud size={16} />
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="flex flex-col text-center sm:text-left min-w-0">
                <h3 className="text-lg font-bold text-foreground truncate">
                  {user?.name || "Loading..."}
                </h3>
                <p className="text-sm text-default-500 truncate mb-2">
                  {user?.email || ""}
                </p>
                <span className="text-[11px] text-default-400">
                  Click the avatar image overlay to select a new profile
                  photograph picture asset.
                </span>
              </div>
            </div>

            {/* Core Editable Form Fields Layout */}
            <Fieldset.Group className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-2">
              {/* Profile Name Field */}
              <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                <Label className="text-xs font-semibold text-default-700 dark:text-zinc-300">
                  Full Name / Display Name
                </Label>
                <div className="relative flex items-center">
                  <FiUser className="absolute left-3 text-default-400 z-10" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Enter your public identifier identity description"
                    className="w-full bg-default-50 dark:bg-[#1c1c1f] border border-divider rounded-xl pl-10 pr-4 py-2 text-sm text-foreground outline-none transition-colors"
                  />
                </div>
              </TextField>

              {/* Immutable Email Field (Display Only) */}
              <TextField className="flex flex-col gap-1.5 col-span-1 md:col-span-2 opacity-60">
                <Label className="text-xs font-semibold text-default-700 dark:text-zinc-300">
                  Registered Email Address (Locked)
                </Label>
                <div className="relative flex items-center cursor-not-allowed">
                  <FiMail className="absolute left-3 text-default-400 z-10" />
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    readOnly
                    className="w-full bg-default-100 dark:bg-zinc-800/40 border border-divider rounded-xl pl-10 pr-4 py-2 text-sm text-default-500 outline-none select-none"
                  />
                </div>
              </TextField>
            </Fieldset.Group>

            {/* Action Form Footer Save Panel */}
            <Fieldset.Actions className="flex justify-end pt-4 border-t border-divider w-full">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-11 px-6 rounded-xl text-sm transition-transform shadow-lg shadow-amber-500/10 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <FiRefreshCw className="animate-spin" size={16} />
                ) : (
                  <FiCheck size={16} />
                )}
                Update Profile Info
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </form>
      </div>
    </div>
  );
}
