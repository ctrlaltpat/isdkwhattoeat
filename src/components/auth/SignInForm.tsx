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
      <div className="auth-container">
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="text-center">
              <Image
                src="/idkwhattoeat_logo.png"
                alt="IDKWhatToEat"
                width={232}
                height={48}
                className="auth-logo"
              />
            </div>

            <div className="auth-form-fields">
              <input
                type="text"
                name="username"
                placeholder="Username*"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="form-input"
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
                    className="form-input"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
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
                className="form-input"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-full-width"
              >
                {isSignUp ? "SIGN UP" : "SIGN IN"}
              </button>
            </div>

            <div className="auth-links">
              {isSignUp ? "Already registered?" : "Not registered?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="auth-link"
              >
                {isSignUp ? "Sign in." : "Sign up."}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Loading show={loading} />
    </>
  );
}
