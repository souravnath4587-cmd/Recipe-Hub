"use client";

import { Badge } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiSquares2X2,
  HiPlusCircle,
  HiBookOpen,
  HiShoppingBag,
  HiHeart,
  HiUser,
} from "react-icons/hi2";

export default function DashboardSideBar({ user }) {
  const pathname = usePathname();

  const sidebarLinks = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: HiSquares2X2,
    },
    {
      name: "Add Recipe",
      href: "/dashboard/addRecipe",
      icon: HiPlusCircle,
    },
    {
      name: "My Recipes",
      href: "/dashboard/myRecipes",
      icon: HiBookOpen,
    },
    {
      name: "My Purchased Recipes",
      href: "/dashboard/purchasedRecipes",
      icon: HiShoppingBag,
    },
    {
      name: "Favorites",
      href: "/dashboard/favorite",
      icon: HiHeart,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: HiUser,
    },
  ];
  return (
    <aside className="hidden md:flex w-64 bg-zinc-950 border-r border-white/10 flex-col p-5">
      <h1 className="text-2xl font-bold mb-4">Recipe-Hub</h1>
      <div className="mb-4">
        <div className=" flex flex-col gap-2 items-left relative">
          <Badge
            className="absolute t-0 left-10 w-[60] text-white"
            color="warning"
            size="sm"
          >
            Premium
          </Badge>
          <div className="userImage ">
            <Image
              src={user?.image || "/avatar.png"}
              alt="User"
              width={60}
              height={60}
              className="rounded-full ml-2"
            ></Image>
          </div>
          <div>
            <h2 className="font-bold text-xl">{user?.name}</h2>
            <p className=" text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {sidebarLinks.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
        {/* <Link
          href="/dashboard"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10"
        >
          <MdDashboard />
          Overview
        </Link> */}

        {/* <Link
          href="/dashboard/addRecipe"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
        >
          <MdFactory />
          Add Recipe
        </Link>

        <Link
          href="/dashboard/recipes"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
        >
          <FaBriefcase />
          MY RECIPES
        </Link>
        <Link
          href="/dashboard/purchase"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
        >
          <FaMoneyBills />
          MY PURCHASED RECIPES
        </Link>

        <Link
          href="/dashboard/favourite"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
        >
          <FaCog />
          FAVORITES
        </Link>
        <Link
          href="/dashboard/profile"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5"
        >
          <FaCog />
          Profile
        </Link> */}
      </nav>
    </aside>
  );
}
