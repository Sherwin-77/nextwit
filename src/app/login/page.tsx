"use client";

import SubmitButton from "@/components/submit-button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Loading from "@/app/loading";
import Link from "next/link";

export default function LoginPage() {
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [remember, setRemember] = useState(false);
  const { data: session, status } = useSession();
  if (status === "loading") return <Loading />;
  if (status === "authenticated" && session.user) return redirect("/home");
  return (
    <main className="flex flex-col justify-center items-center p-10">
      <h1 className="text-3xl mb-10 uppercase">Login</h1>
      <form
        className="border border-gray-300 shadow-md dark:border-none max-w-xs dark:bg-gray-900 dark:shadow-neon rounded-xl py-5 px-5 flex flex-col"
        onSubmit={async (e) => {
          // Ref https://stackoverflow.com/questions/71956621/next-auth-4-session-returns-null-next-js
          e.preventDefault();
          setLoading(true);
          setErr(null);
          const target = e.currentTarget
            .elements as typeof e.currentTarget.elements & {
            username: { value: string };
            password: { value: string };
          };
          // This hack getting out of hand
          const username = target.username.value;
          const password = target.password.value;
          const res = await signIn("credentials", {
            redirect: false,
            username,
            password,
            longer: remember,
          });
          setLoading(false);
          if (!res || res.error) {
            setErr(res?.error ?? "Invalid username/password");
          }
        }}
      >
        <div className="relative inline-block mb-5">
          <input
            type="text"
            className="border border-gray-400 dark:border-none ps-3  md:pe-10 peer pt-5 pb-2 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300"
            name="username"
            id="username"
            placeholder=""
            maxLength={30}
            required
          />
          <label
            htmlFor="username"
            className="absolute peer-placeholder-shown:top-1/2 top-3 left-3 -translate-y-1/2 cursor-text text-xs peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs text-gray-500 dark:text-gray-300 transition-all"
          >
            Username
          </label>
        </div>
        <div className="relative inline-flex mb-5">
          <input
            type={passwordHidden ? "password" : "text"}
            name="password"
            id="password"
            className="border border-gray-400 dark:border-none ps-3 md:pe-10 peer pt-5 pb-2 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300"
            placeholder=""
            minLength={8}
            required
          />
            <label
            htmlFor="password"
            className="absolute peer-placeholder-shown:top-1/2 top-3 left-3 -translate-y-1/2 cursor-text text-xs peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs text-gray-500 dark:text-gray-300 transition-all"
          >
            Password
          </label>
          <div onClick={() => setPasswordHidden((prev) => !prev)}>
            {passwordHidden ? (
              <EyeIcon className="absolute top-3 right-2 w-7 hover:cursor-pointer" />
            ) : (
              <EyeSlashIcon className="absolute top-3 right-2 w-7 hover:cursor-pointer" />
            )}
          </div>
        </div>

        <div className="flex items-center mb-5">
          <input
            className="me-3"
            type="checkbox"
            name="remember"
            id="remember"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          <label htmlFor="remember" className="opacity-60">
            Remember me for 90 days
          </label>
        </div>
        <span></span>
        <span
          className={
            "flex justify-end mb-2 me-3 " +
            (err ? "text-red-600" : "text-green-600")
          }
        >
          {err}
        </span>
        <SubmitButton
          message="Login"
          loadingMessage="Loading"
          doPending={loading}
        />
        <span className="mt-3 mb-1">
          <span className="opacity-60">Don&apos;t have account?</span>{" "}
          <Link
            className="no-underline hover:underline opacity-100 text-sky-600"
            href="/signup"
          >
            Sign up
          </Link>
        </span>
      </form>
    </main>
  );
}
