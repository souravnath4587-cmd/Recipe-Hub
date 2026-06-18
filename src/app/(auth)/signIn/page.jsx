"use client";

import {
  Form,
  Input,
  Button,
  FieldError,
  Description,
  Label,
  TextField,
} from "@heroui/react";
import { FaUtensils } from "react-icons/fa";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";

export default function SignInPage() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const { email, password } = data;

    const { data: res, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });
    if (!res) {
      toast.error(error.message);
    } else {
      toast.success("Login successfully done..");
    }

    console.log("Login User", data);
  };
  const handleGoogleSignIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    if (!data) {
      toast.error(error.message);
    } else {
      toast.success("Successfully Done...");
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-linear-to-br from-orange-100 via-white to-red-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />

      <div className="container mx-auto px-6 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <FaUtensils className="text-white text-2xl" />
              </div>

              <h1 className="text-5xl font-extrabold bg-linear-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Recipe-Hub
              </h1>
            </div>

            <h2 className="mt-8 text-4xl font-bold">Welcome Back Chef 👨‍🍳</h2>

            <p className="mt-4 text-default-500 text-lg max-w-md">
              Discover amazing recipes, save your favorites, and share your
              cooking journey with food lovers around the world.
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-white/20 shadow-2xl rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-center mb-2">Sign In</h2>

              <p className="text-center text-default-500 mb-8">
                Login to continue your cooking adventure
              </p>

              <Form onSubmit={handleSubmit} className="space-y-5">
                <TextField
                  isRequired
                  name="email"
                  type="email"
                  validate={(value) => {
                    if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                    ) {
                      return "Please enter a valid email address";
                    }
                    return null;
                  }}
                >
                  <Label>Email</Label>
                  <Input placeholder="john@example.com" />
                  <FieldError />
                </TextField>
                <TextField
                  isRequired
                  minLength={8}
                  name="password"
                  type="password"
                  validate={(value) => {
                    if (value.length < 6) {
                      return "Password must be at least 6 characters";
                    }
                    if (!/[A-Z]/.test(value)) {
                      return "Password must contain at least one uppercase letter";
                    }
                    if (!/[0-9]/.test(value)) {
                      return "Password must contain at least one number";
                    }
                    return null;
                  }}
                >
                  <Label>Password</Label>
                  <Input placeholder="Enter your password" />
                  <Description>
                    Must be at least 8 characters with 1 uppercase and 1 number
                  </Description>
                  <FieldError />
                </TextField>

                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white font-semibold"
                >
                  Login
                </Button>

                <div className="relative py-2">
                  <div className="border-t" />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-white dark:bg-zinc-900 px-3 text-sm text-default-500">
                    OR
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle /> Google SignIn
                </Button>
                {/* Login Link */}
                <p className="text-center text-sm text-default-500">
                  You don&#39;t have any acoount?{" "}
                  <Link
                    href="/signUp"
                    className="text-orange-500 font-semibold hover:underline"
                  >
                    Create an account.
                  </Link>
                </p>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
