"use client";

import { Badge } from "@heroui/react";
import Image from "next/image";
import { isValidImageSrc } from "@/app/lib/imageSrc";
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

  const planLabel =
    user?.plan === "user_free"
      ? "FREE"
      : user?.plan === "user_pro"
        ? "PRO"
        : "PREMIUM";

  const avatar = (size) =>
    isValidImageSrc(user?.image) ? (
      <Image
        src={user.image}
        alt="User"
        width={size}
        height={size}
        className="rounded-full"
      />
    ) : (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-default-100 flex items-center justify-center text-lg font-bold text-default-500 uppercase"
      >
        {user?.name?.[0] || "?"}
      </div>
    );

  return (
    <>
      {/* Mobile: the sidebar is hidden below md, so these screens need their own
          nav. A horizontally scrollable pill bar keeps every destination one tap
          away without a drawer to open. */}
      <div className="md:hidden border-b border-border bg-card">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative shrink-0">
            {avatar(40)}
            <Badge
              className="absolute -bottom-1 -right-1 text-white"
              color="warning"
              size="sm"
            >
              {planLabel}
            </Badge>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm truncate">{user?.name}</h2>
            <p className="text-xs text-default-500 truncate">{user?.email}</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-default-500 hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop: shrink-0 so the nav keeps its width instead of being squeezed
          by a wide table in the main column. */}
      <aside className="hidden md:flex w-64 shrink-0 bg-card border-r border-border flex-col p-5">
        <h1 className="text-2xl font-bold mb-4">Recipe-Hub</h1>
        <div className="mb-4">
          <div className="flex flex-col gap-2 relative">
            <Badge
              className="absolute top-0 left-10 text-white"
              color="warning"
              size="sm"
            >
              {planLabel}
            </Badge>
            <div className="ml-2">{avatar(60)}</div>
            <div className="min-w-0">
              <h2 className="font-bold text-xl truncate">{user?.name}</h2>
              <p className="text-sm truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-default-500 hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
