"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUtensils,
  FaMoon,
  FaSun,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { authClient } from "../lib/auth-client";
import Image from "next/image";
import { Button } from "@heroui/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  console.log(user);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Recipes", href: "/recipes" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 dark:bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <FaUtensils className="text-white text-lg" />
            </div>

            <h1 className="text-2xl font-extrabold bg-linear-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
              Recipe-Hub
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="relative font-medium group"
              >
                {item.name}

                <span className="absolute left-0 -bottom-1 h-[2] w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard">DashBoard</Link>
                <Button
                  variant="danger-soft"
                  onPress={() => authClient.signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/signIn">Login</Link>
                <Link href="/signUp">Register</Link>
              </>
            )}
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setDark(!dark)}
              className="w-10 h-10 rounded-full dark:bg-zinc-800 flex items-center justify-center border-2"
            >
              {dark ? <FaSun /> : <FaMoon />}
            </button>
            {user ? (
              <div className="flex flex-row gap-4 items-center">
                <p>
                  Welcome{" "}
                  <span className="uppercase text-orange-500 font-semibold">
                    {user?.name}
                  </span>
                </p>
                <Image
                  src={user?.image}
                  alt="User Image."
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-green-500"
                ></Image>
              </div>
            ) : (
              <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500">
                <FaUserCircle className="w-full h-full text-orange-500" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          className="fixed top-0 right-0 h-screen w-72 bg-orange-500 dark:bg-zinc-900 shadow-2xl lg:hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-xl">Menu</h2>

              <FaTimes
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-6">
              {navLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-lg font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <Button
                  className="rounded-none w-full"
                  variant="danger"
                  onPress={() => authClient.signOut()}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/signIn">Login</Link>
                  <Link href="/signUp">Register</Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
