"use client";

import React from "react";
import { Card, Button } from "@heroui/react";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiUsers,
  FiHeart,
  FiZap,
  FiArrowRight,
  FiUserPlus,
} from "react-icons/fi";

const features = [
  {
    id: 1,
    title: "Share Your Recipes",
    description:
      "Publish your favorite recipes and inspire food enthusiasts around the world.",
    icon: FiBookOpen,
    gradient: "from-orange-500/20 to-red-500/5",
    iconColor: "text-orange-500",
    borderColor: "hover:border-orange-500/40",
  },
  {
    id: 2,
    title: "Build Your Audience",
    description:
      "Grow your profile, gain followers, and showcase your culinary expertise.",
    icon: FiUsers,
    gradient: "from-red-500/20 to-amber-500/5",
    iconColor: "text-red-500",
    borderColor: "hover:border-red-500/40",
  },
  {
    id: 3,
    title: "Save Favorite Recipes",
    description:
      "Create your personal collection by saving recipes you love for easy access anytime.",
    icon: FiHeart,
    gradient: "from-amber-500/20 to-orange-500/5",
    iconColor: "text-amber-500",
    borderColor: "hover:border-amber-500/40",
  },
  {
    id: 4,
    title: "Unlock More Publishing Power",
    description:
      "Upgrade to Pro or Premium plans to publish more recipes and access exclusive creator benefits.",
    icon: FiZap,
    gradient: "from-orange-600/20 to-red-600/5",
    iconColor: "text-orange-600",
    borderColor: "hover:border-orange-600/40",
  },
];

// Stagger entry configurations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function WhyJoin() {
  return (
    <section className="w-full bg-background py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-16 overflow-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
          <FiUserPlus /> Hub Community
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center justify-center gap-2.5">
          🍽️ Why Join Recipe-Hub?
        </h2>
        <p className="text-sm md:text-base text-default-500 font-medium leading-relaxed">
          Become part of a growing community of food lovers, home cooks, and
          culinary creators.
        </p>
      </motion.div>

      {/* Feature Grid using HeroUI v3 Dot Notation Anatomy */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feat) => {
          const IconComponent = feat.icon;
          return (
            <motion.div
              key={feat.id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              {/* FIXED: Using clean structural layout tokens to minimize module import bugs */}
              <Card
                className={`h-full bg-content1 border border-divider/60 transition-all duration-300 shadow-sm rounded-2xl overflow-hidden relative group p-6 flex flex-col items-start space-y-4 ${feat.borderColor}`}
              >
                {/* Ambient Blur Backdrop Effect */}
                <div
                  className={`absolute top-0 left-0 w-32 h-32 bg-linear-to-br ${feat.gradient} rounded-br-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                {/* Card Icon Header */}
                <div className="p-3.5 bg-default-50 dark:bg-zinc-900/60 rounded-xl border border-divider group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <IconComponent
                    className={`${feat.iconColor} stroke-[2.5]`}
                    size={24}
                  />
                </div>

                {/* Card Text Content */}
                <div className="space-y-2 grow relative z-10">
                  <h3 className="text-base font-extrabold tracking-tight text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-default-400 font-medium leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Call To Action Panel Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="max-w-4xl mx-auto pt-4"
      >
        <div className="w-full bg-linear-to-br from-default-50 to-default-100/50 dark:from-zinc-900/40 dark:to-zinc-900/10 border border-divider rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-bl-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-tr-full blur-3xl pointer-events-none" />

          <div className="space-y-1.5 relative z-10">
            <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
              Ready to Start Your Culinary Journey?
            </h3>
            <p className="text-xs text-default-400 font-medium max-w-md mx-auto md:mx-0">
              Set up your profile, organize your kitchen dashboard configs, and
              begin tracking premium creators today.
            </p>
          </div>

          <Button
            size="lg"
            className="bg-linear-to-r from-red-500 via-orange-500 to-amber-500 text-white font-black text-xs tracking-tight shadow-xl shadow-orange-500/10 px-8 h-12 rounded-xl shrink-0 group relative z-10"
            endContent={
              <FiArrowRight
                className="group-hover:translate-x-1 transition-transform stroke-3"
                size={14}
              />
            }
          >
            Join Recipe-Hub Today
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
