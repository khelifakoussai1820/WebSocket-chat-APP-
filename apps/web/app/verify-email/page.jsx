"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Logo from "@/components/logo";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: data.code,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.error);
        return;
      }

      router.push("/signin");
    } catch (error) {
      console.error("EMAIL VERIFICATION ERROR:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-5 font-poppins sm:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-lg items-center justify-center rounded-[2rem] bg-white px-6 py-12 shadow-sm sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <Logo />
          </div>

          <p className="text-sm font-medium text-gray-500">VERIFY YOUR EMAIL</p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black">
            Check your inbox
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            We sent a 6-digit verification code to your email address. Enter it
            below to verify your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Verification code
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] text-black outline-none transition placeholder:text-gray-300 focus:border-black ${
                  errors.code ? "border-red-500" : "border-gray-200"
                }`}
                {...register("code", {
                  required: "Please enter your verification code.",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Code must contain 6 digits.",
                  },
                })}
              />

              {errors.code && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.code.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Verify email"}
              {!isSubmitting && <span className="ml-2">→</span>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
