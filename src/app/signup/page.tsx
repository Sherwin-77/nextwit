"use client";

import handleSignup from "@/actions/signup-handler";
import SubmitButton from "@/components/submit-button";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { redirect } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Loading from "../loading";

const initialState = {
  message: null,
  isError: false,
  redirect: undefined,
};

export default function SignUp() {
  const [formState, formAction] = useFormState(handleSignup, initialState);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [remember, setRemember] = useState(false);
  const [inputStatus, setStatus] = useState({
    username: false,
    email: false,
    password: false,
  });
  const { data: session, status } = useSession();
  useEffect(() => {
    const checkApi = () => {
      fetch("api/signup-test", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          const newStatus = {
            username: true,
            email: true,
            password: true,
          };
          for (const obj of r.errors) {
            // obj.field already checked here so just declare the type
            if (obj.path in newStatus)
              newStatus[obj.path as "username" | "email" | "password"] = false;
          }
          setStatus(newStatus);
        });
    };
    const caller = setTimeout(() => {
      checkApi();
    }, 1500);
    return () => {
      clearTimeout(caller);
    };
  }, [username, email, password]);
  const disabled = Object.values(inputStatus).every(Boolean);
  if (status === "loading") return <Loading />;
  if (status === "authenticated" && session.user) return redirect("/home");
  if (formState.redirect && !formState.isError) {
    signIn("credentials", {
      redirect: false,
      username,
      password,
      longer: remember,
    });
  }
  return (
    <main className="flex flex-col justify-center items-center p-10">
      <h1 className="text-3xl mb-10">Get your account now</h1>
      <form
        action={formAction}
        className="max-w-xs bg-sky-600 dark:bg-gray-900 dark:shadow-neon rounded-xl py-3 ps-5 pe-2 flex flex-col"
      >
        <label htmlFor="username" className="mb-1">
          Username
        </label>
        <div>
          <input
            type="text"
            name="username"
            id="username"
            className="px-3 py-2 mb-5 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300 inline"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {inputStatus.username ? (
            <CheckBadgeIcon className="h-8 ms-1 inline text-green-400 dark:text-green-500" />
          ) : (
            <XCircleIcon className="ms-1 h-8 inline text-red-400 dark:text-red-500" />
          )}
        </div>
        <label htmlFor="email" className="mb-1">
          Email
        </label>
        <div>
          <input
            name="email"
            type="email"
            id="email"
            className="px-3 py-2 mb-5 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {inputStatus.email ? (
            <CheckBadgeIcon className="h-8 ms-1 inline text-green-400 dark:text-green-500" />
          ) : (
            <XCircleIcon className="h-8 ms-1 inline text-red-400 dark:text-red-500" />
          )}
        </div>
        <label htmlFor="password" className="mb-1">
          Password
        </label>
        <div>
          <div className="relative inline-flex">
            <input
              type={passwordHidden ? "password" : "text"}
              name="password"
              id="password"
              // LMAO hardcode size moment
              className="max-w-[250px] ps-3 pe-10 py-2 mb-3 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300"
              onChange={(e) => setPassword(e.target.value)}
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
          {inputStatus.password ? (
            <CheckBadgeIcon className="h-8 ms-1 inline text-green-400 dark:text-green-500" />
          ) : (
            <XCircleIcon className="h-8 ms-1 inline text-red-400 dark:text-red-500" />
          )}
        </div>
        <span
          className={
            "flex justify-end mb-1 me-5 " +
            (formState?.isError ? "text-red-600" : "text-green-600")
          }
        >
          {formState?.message}
        </span>
        <div className="flex items-center mb-3">
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
        <SubmitButton
          message="Signup"
          loadingMessage="Loading"
          disabled={!disabled}
        />
      </form>
    </main>
  );
}
