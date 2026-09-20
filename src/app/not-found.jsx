"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { FaUtensils } from "react-icons/fa";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-br from-brand/10 via-background to-brand-strong/10" />

      <div className="absolute top-20 left-20 w-72 h-72 bg-brand/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-brand-strong/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Floating Icon */}
        <motion.div
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
          className="mx-auto mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-linear-to-r from-brand to-brand-strong flex items-center justify-center shadow-xl">
            <FaUtensils className="text-white text-4xl" />
          </div>
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-7xl md:text-9xl font-black bg-linear-to-r from-brand via-brand-strong to-warning bg-clip-text text-transparent"
        >
          404
        </motion.h1>

        {/* Heading */}
        <h2 className="mt-6 text-3xl md:text-4xl font-bold">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-default-500 text-lg">
          Looks like the recipe you are searching for has been eaten already 🍽️
          or the page doesn&#39;t exist anymore.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="font-semibold bg-info text-info-foreground px-4 py-2 rounded-xl"
          >
            Back to Home
          </Link>

          <Link
            href="/recipes"
            className="bg-accent text-accent-foreground px-4 py-2 rounded-xl"
          >
            Browse Recipes
          </Link>
        </div>

        {/* Bottom Text */}
        <p className="mt-8 text-sm text-default-400">
          Hungry for inspiration? Explore hundreds of delicious recipes on
          Recipe-Hub.
        </p>
      </motion.div>
    </section>
  );
}
