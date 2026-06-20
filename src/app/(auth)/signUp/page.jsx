"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Form,
  TextField,
  Label,
  Input,
  Description,
  Button,
  FieldError,
} from "@heroui/react";
import { FaGoogle, FaUtensils } from "react-icons/fa";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const { email, photo, password, name, role = "user" } = data;
    const { data: res, error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: photo,
      role,
      callbackURL: "/",
    });

    console.log("Register User", res);
    if (!res) {
      toast.error(error.message);
    } else {
      toast.success("Registation successfully done..");
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-linear-to-br from-orange-100 via-white to-red-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      {/* Background Glow */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />

      <div className="container mx-auto px-6 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
          {/* Left Side */}
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

            <h2 className="mt-8 text-4xl font-bold">
              Join Our Food Community 🍽️
            </h2>

            <p className="mt-4 text-default-500 text-lg max-w-md">
              Create your account and start sharing recipes, discovering new
              dishes, and connecting with food lovers.
            </p>
          </motion.div>

          {/* Signup Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-white/20 shadow-2xl rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-center mb-2">
                Create Account
              </h2>

              <p className="text-center text-default-500 mb-8">
                Welcome to Recipe-Hub
              </p>

              <Form onSubmit={handleSubmit} className="space-y-5">
                <TextField
                  isRequired
                  name="name"
                  type="text"
                  validate={(value) => {
                    if (!/^[A-Za-z\s]+$/.test(value)) {
                      return "Only letters are allowed";
                    }
                    return null;
                  }}
                >
                  <Label>Name</Label>
                  <Input placeholder="Please Enter Your name." />
                  <FieldError />
                </TextField>
                <TextField
                  isRequired
                  name="photo"
                  type="text"
                  // validate={(value) => {
                  //   if (!/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(value)) {
                  //     return "Enter a valid image URL";
                  //   }
                  //   return null;
                  // }}
                >
                  <Label>Photo</Label>
                  <Input placeholder="Enter your image url" />
                  <FieldError />
                </TextField>
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
                  minLength={6}
                  name="password"
                  type="password"
                  value={password}
                  onChange={(value) => setPassword(value)}
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
                    Must be at least 6 characters with 1 uppercase and 1 number
                  </Description>
                  <FieldError />
                </TextField>
                <TextField
                  isRequired
                  name="confirmPassword"
                  type="password"
                  validate={(value) => {
                    if (value !== password) {
                      return "Passwords do not match";
                    }
                    return null;
                  }}
                >
                  <Label>Confirm Password</Label>
                  <Input placeholder="Confirm your password" />
                  <FieldError />
                </TextField>

                {/* Register Button */}
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white font-semibold"
                >
                  Create Account
                </Button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="border-t" />

                  <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-white dark:bg-zinc-900 px-3 text-sm text-default-500">
                    OR
                  </span>
                </div>

                {/* Login Link */}
                <p className="text-center text-sm text-default-500">
                  Already have an account?{" "}
                  <Link
                    href="/signIn"
                    className="text-orange-500 font-semibold hover:underline"
                  >
                    Sign In
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
