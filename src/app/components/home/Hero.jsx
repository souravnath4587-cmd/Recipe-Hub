"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function HeroBanner() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/PGGhvd7r/banner-image.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6"
        >
          <span className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-400 text-orange-300 backdrop-blur-sm">
            🍽️ Discover & Share Amazing Recipes
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight"
        >
          Cook, Share &
          <span className="block bg-linear-to-r from-orange-400 via-red-400 to-yellow-300 bg-clip-text text-transparent">
            Explore Delicious Recipes
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
        >
          Join Recipe-Hub and discover thousands of mouthwatering recipes, share
          your culinary creations, and connect with food lovers from around the
          world.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/recipes">
            <button className="group px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-300 flex items-center gap-3 shadow-xl">
              Explore Recipes
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>

          <Link href="/signUp">
            <button className="px-8 py-4 rounded-full border border-white/30 backdrop-blur-md text-white hover:bg-white/10 transition-all duration-300">
              Join Community
            </button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto"
        >
          <div>
            <h3 className="text-3xl font-bold text-orange-400">500+</h3>
            <p className="text-gray-300 text-sm">Recipes</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-orange-400">1K+</h3>
            <p className="text-gray-300 text-sm">Food Lovers</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-orange-400">100+</h3>
            <p className="text-gray-300 text-sm">Chefs</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
