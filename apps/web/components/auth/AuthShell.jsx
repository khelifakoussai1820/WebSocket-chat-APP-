"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import Logo from "@/components/logo";

const fieldClass =
  "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black";

function Field({ label, error, children }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {children}
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}

export default function AuthShell({ mode }) {
  const isSignup = mode === "signup";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.error);
        return;
      }

      console.log("Account Created", result);
    } catch (error) {
      console.error("Signup error ", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-5 font-poppins sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left side */}
        <section className="relative hidden overflow-hidden bg-black p-12 text-white lg:flex lg:flex-col">
          <div className="relative z-10">
            <Logo inverted />
          </div>

          <div className="relative z-10 my-auto max-w-md">
            <span className="mb-6 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs text-gray-300">
              REAL-TIME CONVERSATIONS
            </span>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              {isSignup
                ? "Start a better conversation."
                : "Good to see you again."}
            </h1>

            <p className="mt-5 max-w-sm text-base leading-7 text-gray-400">
              {isSignup
                ? "Create your space and stay close to the people who matter."
                : "Pick up your conversations right where you left them."}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm text-gray-400">
            <span className="h-2 w-2 rounded-full bg-white" />
            Simple conversations. Real connections.
          </div>

          <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full border border-white/10" />

          <div className="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-linear-to-br from-gray-800 to-transparent opacity-60" />
        </section>

        {/* Right side */}
        <section className="flex flex-col px-6 py-8 sm:px-12 sm:py-12 lg:px-16">
          <div className="flex items-center justify-between lg:hidden">
            <Logo />

            <Link href="/" className="text-sm text-gray-500 hover:text-black">
              Back home
            </Link>
          </div>

          <Link
            href="/"
            className="ml-auto hidden text-sm text-gray-500 transition-colors hover:text-black lg:block"
          >
            ← Back home
          </Link>

          <div className="mx-auto my-auto w-full max-w-sm py-10">
            <p className="text-sm font-medium text-gray-500">
              {isSignup ? "JOIN GOSRA" : "WELCOME BACK"}
            </p>

            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-black">
              {isSignup ? "Create your account" : "Sign in to Gosra"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {isSignup ? "Already have an account?" : "New to Gosra"}{" "}
              <Link
                href={isSignup ? "/signin" : "/signup"}
                className="font-medium text-black underline underline-offset-4"
              >
                {isSignup ? "Sign in" : "Create an account"}
              </Link>
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-9 space-y-5"
              noValidate
            >
              {isSignup && (
                <>
                  {/* First name */}
                  <Field label="First name" error={errors.firstName?.message}>
                    <input
                      className={`${fieldClass} ${
                        errors.firstName ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Your first name"
                      autoComplete="given-name"
                      {...register("firstName", {
                        required: "Please enter your first name.",
                      })}
                    />
                  </Field>

                  {/* Last name */}
                  <Field label="Last name" error={errors.lastName?.message}>
                    <input
                      className={`${fieldClass} ${
                        errors.lastName ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Your last name"
                      autoComplete="family-name"
                      {...register("lastName", {
                        required: "Please enter your last name.",
                      })}
                    />
                  </Field>
                </>
              )}

              {/* Email */}
              <Field label="Email address" error={errors.email?.message}>
                <input
                  className={`${fieldClass} ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email", {
                    required: "Please enter your email address.",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email address.",
                    },
                  })}
                />
              </Field>

              {/* Password */}
              <Field label="Password" error={errors.password?.message}>
                <input
                  className={`${fieldClass} ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
                  type="password"
                  placeholder="••••••••"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  {...register("password", {
                    required: "Please enter your password.",
                    ...(isSignup && {
                      minLength: {
                        value: 8,
                        message: "Use at least 8 characters.",
                      },
                    }),
                  })}
                />
              </Field>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                {isSignup ? "Create account" : "Sign in"}
                <span className="ml-2">→</span>
              </button>
            </form>

            <p className="mt-7 text-center text-xs leading-5 text-gray-400">
              {isSignup
                ? "By creating an account, you agree to our Terms and Privacy Policy."
                : "Your conversations stay private and secure."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
