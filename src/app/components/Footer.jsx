"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaUtensils,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-divider bg-card">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-full bg-linear-to-r from-brand to-brand-strong flex items-center justify-center">
                <FaUtensils className="text-white text-lg" />
              </div>

              <h2 className="text-2xl font-bold bg-linear-to-r from-brand via-brand-strong to-warning bg-clip-text text-transparent">
                Recipe-Hub
              </h2>
            </motion.div>

            <p className="mt-4 text-default-500 leading-relaxed">
              Discover, share, and enjoy delicious recipes from around the
              world. Your favorite cooking companion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>

            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-brand transition">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/recipes"
                  className="hover:text-brand transition"
                >
                  Browse Recipes
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/user/overView"
                  className="hover:text-brand transition"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  href="/signIn"
                  className="hover:text-brand transition"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  href="/signUp"
                  className="hover:text-brand transition"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>

            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-default flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-default flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-default flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-default flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition"
              >
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>

            <div className="space-y-4 text-default-500">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-brand" />
                <span>support@recipehub.com</span>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-brand" />
                <span>+880 1234-567890</span>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-brand mt-1" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-default-200 pt-6 text-center text-sm text-default-500">
          © {currentYear} Recipe-Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
