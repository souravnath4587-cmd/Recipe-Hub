"use client";

import { Badge } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiAlertTriangle,
  FiBookOpen,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";
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
  console.log(user);

  const userLinks = [
    {
      name: "Overview",
      href: "/dashboard/user/overView",
      icon: HiSquares2X2,
    },
    {
      name: "Add Recipe",
      href: "/dashboard/user/addRecipe",
      icon: HiPlusCircle,
    },
    {
      name: "My Recipes",
      href: "/dashboard/user/myRecipes",
      icon: HiBookOpen,
    },
    {
      name: "My Purchased Recipes",
      href: "/dashboard/user/purchasedRecipes",
      icon: HiShoppingBag,
    },
    {
      name: "Favorites",
      href: "/dashboard/user/favorite",
      icon: HiHeart,
    },
    {
      name: "Profile",
      href: "/dashboard/user/profile",
      icon: HiUser,
    },
  ];
  const adminLinks = [
    {
      name: "Overview",
      href: "/dashboard/admin/adminMenu",
      icon: HiSquares2X2,
    },
    {
      name: "Manage Users",
      href: "/dashboard/admin/manageUsers",
      icon: FiUser,
    },
    {
      name: "Manage Recipes",
      href: "/dashboard/admin/manageRecipes",
      icon: FiBookOpen,
    },
    {
      name: "Reports",
      href: "/dashboard/admin/reports",
      icon: FiAlertTriangle,
    },
    {
      name: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: FiDollarSign,
    },
  ];

  const roleBaseMap = {
    user: userLinks,
    admin: adminLinks,
  };
  const navItems = roleBaseMap[user?.role || "user"];
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
            {user?.plan === "user_free"
              ? "FREE"
              : user?.plan === "user_pro"
                ? "PRO"
                : "PREMIUM"}
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
        {navItems.map((item, index) => {
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
      </nav>
    </aside>
  );
}
