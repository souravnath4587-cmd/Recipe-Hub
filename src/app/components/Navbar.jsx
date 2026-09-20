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
import { useHydrated } from "../lib/useHydrated";
import { isValidImageSrc } from "../lib/imageSrc";
import Image from "next/image";
import { Button } from "@heroui/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const hydrated = useHydrated();
  const { data: session } = authClient.useSession();

  // The server cannot see the client-side session, so it always renders the
  // logged-out nav. Reading `session` during the first client render too would
  // make the two disagree and trigger a hydration mismatch. Gate on `mounted`
  // so server and first client render match, then swap in the real state.
  const user = hydrated ? session?.user : null;

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
    { name: "Plans", href: "/pricing" },
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

                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={`/dashboard${user?.role === "admin" ? "/admin/adminMenu" : "/user/overView"}`}
                >
                  DashBoard
                </Link>
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
              <div className="flex flex-row gap-4 items-center min-w-0">
                <p className="hidden xl:block truncate">
                  Welcome{" "}
                  <span className="uppercase text-orange-500 font-semibold">
                    {user?.name}
                  </span>
                </p>
                {/* Email/password accounts have no image, and stored values are
                    not validated - next/image throws on both. */}
                {isValidImageSrc(user?.image) ? (
                  <Image
                    src={user.image}
                    alt="User Image."
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-green-500 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 shrink-0 rounded-full border-2 border-green-500 flex items-center justify-center font-bold uppercase text-orange-500">
                    {user?.name?.[0] || "?"}
                  </div>
                )}
              </div>
            ) : (
              <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500">
                <FaUserCircle className="w-full h-full text-orange-500" />
              </button>
            )}
          </div>

          {/* Mobile controls: the theme toggle lives beside the burger so it is
              reachable without opening the drawer. */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full dark:bg-zinc-800 flex items-center justify-center border-2"
            >
              {dark ? <FaSun /> : <FaMoon />}
            </button>
            <button
              className="text-2xl"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          {/* Backdrop: tapping outside is the gesture people expect for closing
              a drawer, and it also dims the page behind it. */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            className="fixed top-0 right-0 z-50 h-screen w-72 max-w-[85vw] overflow-y-auto bg-orange-500 dark:bg-zinc-900 shadow-2xl lg:hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-bold text-xl">Menu</h2>

                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              {user && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/20">
                  {isValidImageSrc(user?.image) ? (
                    <Image
                      src={user.image}
                      alt="User Image."
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-green-500 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 shrink-0 rounded-full border-2 border-green-500 flex items-center justify-center font-bold uppercase">
                      {user?.name?.[0] || "?"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{user?.name}</p>
                    <p className="text-xs opacity-80 truncate">{user?.email}</p>
                  </div>
                </div>
              )}

              {/* Every link closes the drawer - navigating with it still open
                  leaves it covering the page it just moved to. */}
              <div className="flex flex-col gap-6">
                {navLinks.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link
                      href={`/dashboard${user?.role === "admin" ? "/admin/adminMenu" : "/user/overView"}`}
                      onClick={() => setMenuOpen(false)}
                      className="text-lg font-medium"
                    >
                      DashBoard
                    </Link>
                    <Button
                      className="rounded-none w-full"
                      variant="danger"
                      onPress={() => {
                        setMenuOpen(false);
                        authClient.signOut();
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signIn"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signUp"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg font-medium"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </nav>
  );
}
