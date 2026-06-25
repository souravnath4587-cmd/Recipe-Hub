"use client";

import React from "react";
import { Button, Card, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { FiArrowRight, FiMapPin, FiCompass } from "react-icons/fi";

const destinations = [
  {
    id: "bangladesh",
    country: "Bangladesh",
    flag: "🇧🇩",
    count: 142,
    foods: ["Kacchi Biryani", "Bhuna Khichuri", "Hilsa Curry"],
    image:
      "https://images.unsplash.com/photo-1626139575231-64d4b3bfa092?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "japan",
    country: "Japan",
    flag: "🇯🇵",
    count: 185,
    foods: ["Sushi", "Ramen", "Tempura"],
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "italy",
    country: "Italy",
    flag: "🇮🇹",
    count: 240,
    foods: ["Pizza", "Pasta", "Risotto"],
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "thailand",
    country: "Thailand",
    flag: "🇹🇭",
    count: 118,
    foods: ["Pad Thai", "Tom Yum", "Mango Sticky Rice"],
    image:
      "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "india",
    country: "India",
    flag: "🇮🇳",
    count: 295,
    foods: ["Butter Chicken", "Biryani", "Masala Dosa"],
    image:
      "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "france",
    country: "France",
    flag: "🇫🇷",
    count: 164,
    foods: ["Croissant", "Ratatouille", "Crêpes"],
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
  },
];

// Animation presets
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function ExploreDestinations() {
  return (
    <section className="w-full bg-background py-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
          <FiCompass className="animate-spin-slow" /> Global Gastronomy
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center justify-center gap-2.5">
          <span>🌍</span> Explore Recipes by Destination
        </h2>
        <p className="text-sm md:text-base text-default-500 font-medium leading-relaxed">
          Discover authentic flavors and traditional cooking styles from the
          world's most popular travel destinations.
        </p>
      </motion.div>

      {/* Grid Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {destinations.map((dest) => (
          <motion.div
            key={dest.id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="h-full group"
          >
            <Card className="relative h-[380px] w-full overflow-hidden border border-divider/60 group-hover:border-orange-500/50 bg-content1 shadow-sm transition-all duration-300 p-0 rounded-2xl">
              {/* Card Image Cover Layer */}
              <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={`${dest.country} background scene landscape`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Advanced Dark Gradient Mesh Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />
              </div>

              {/* Badges Overlay Header Section */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <Chip
                  size="md"
                  variant="solid"
                  className="bg-black/40 backdrop-blur-md text-white font-extrabold text-lg px-2 border border-white/10 rounded-xl shadow-md h-10"
                >
                  {dest.flag}{" "}
                  <span className="ml-1 text-sm tracking-tight">
                    {dest.country}
                  </span>
                </Chip>

                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-orange-500 text-white font-black text-[11px] shadow-sm tracking-tight"
                >
                  {dest.count} Recipes
                </Chip>
              </div>

              {/* Main Content Info Block (Bottom Anchored) */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs tracking-wide uppercase">
                    <FiMapPin className="shrink-0" />
                    <span>Signature Dishes</span>
                  </div>

                  {/* Famous Foods Horizontal Wrapped List */}
                  <div className="flex flex-wrap gap-1.5">
                    {dest.foods.map((food, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white/10 dark:bg-zinc-900/60 backdrop-blur-sm text-zinc-100 font-semibold px-2.5 py-1 rounded-lg border border-white/5"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Call To Action Button Interaction element */}
                <Button
                  fullWidth
                  className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-black text-xs tracking-tight shadow-lg opacity-95 group-hover:opacity-100 h-11 transition-all"
                  endContent={
                    <FiArrowRight
                      className="group-hover:translate-x-1.5 transition-transform duration-200 stroke-[3]"
                      size={14}
                    />
                  }
                >
                  Explore Recipes
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Global View All Secondary Action Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center pt-4"
      >
        <Button
          variant="bordered"
          color="warning"
          className="border-2 font-black text-xs tracking-tight px-8 h-12 rounded-xl text-orange-600 dark:text-amber-400 border-orange-500/30 hover:border-orange-500"
        >
          View All Global Destinations
        </Button>
      </motion.div>
    </section>
  );
}
