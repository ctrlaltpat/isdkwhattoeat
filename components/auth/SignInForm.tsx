"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { api } from "@/lib/api";
import { notify } from "@/lib/toast";
import Loading from "@/components/ui/Loading";

export default function SignInForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await api.createUser(formData);
        notify.success("Account created! Please sign in.");
        setIsSignUp(false);
        setFormData((prev) => ({
          ...prev,
          email: "",
          firstName: "",
          lastName: "",
        }));
      } else {
        const result = await signIn("credentials", {
          username: formData.username,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          notify.error("Invalid username or password");
        } else {
          notify.success("Welcome back! :)");
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-8 flex flex-col items-center">
              <Image
                src="/idkwhattoeat_logo.png"
                alt="IDKWhatToEat"
                width={232}
                height={48}
                className="h-12 w-auto mb-4"
              />
            </div>

            <div className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username*"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />

              {isSignUp && (
                <>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name*"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </>
              )}

              <input
                type="password"
                name="password"
                placeholder="Password*"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isSignUp ? "SIGN UP" : "SIGN IN"}
              </button>
            </div>

            <p className="text-center mt-6 text-gray-600">
              {isSignUp ? "Already registered?" : "Not registered?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:underline font-medium"
              >
                {isSignUp ? "Sign in." : "Sign up."}
              </button>
            </p>
          </form>
        </div>
      </div>
      <Loading show={loading} />
    </>
  );
}
