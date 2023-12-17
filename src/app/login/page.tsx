"use client";

import SubmitButton from "@/components/submit-button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Loading from "../loading";

export default function LoginPage() {
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const { data: session, status } = useSession();
  if (status === "loading") return <Loading />;
  if (status === "authenticated" && session.user) return redirect("/home");
  return (
    <main className="flex flex-col justify-center items-center p-10">
      <h1 className="text-3xl mb-10">Login</h1>
      <form
        className="max-w-xs bg-sky-600 dark:bg-gray-900 dark:shadow-neon rounded-xl py-3 px-5 flex flex-col"
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
          });
          setLoading(false);
          if (!res || res.error) {
            setErr("invalid email or password");
          } 
        }}
      >
        <label htmlFor="username" className="mb-1">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="px-3 py-2 mb-5 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300 inline"
          required
        />
        <label htmlFor="password" className="mb-1">
          Password
        </label>
        <div className="relative inline-flex">
          <input
            type={passwordHidden ? "password" : "text"}
            name="password"
            id="password"
            className=" ps-3 pe-10 py-2 mb-5 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300"
            required
          />
          <div onClick={() => setPasswordHidden((prev) => !prev)}>
            {passwordHidden ? (
              <EyeIcon className="absolute top-2 right-2 w-6 hover:cursor-pointer" />
            ) : (
              <EyeSlashIcon className="absolute top-2 right-2 w-6 hover:cursor-pointer" />
            )}
          </div>
        </div>
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
      </form>
    </main>
  );
}
