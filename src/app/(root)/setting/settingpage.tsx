"use client";
import { UserSimple } from "@/@types/user-detail";
import handleSaveProfile from "@/actions/saveprofile-handler";
import { Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  message: null,
  isError: false,
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="ms-5 bg-green-500 rounded-md p-3 font-bold hover:bg-green-700 disabled:opacity-60"
      disabled={pending}
    >
      {pending && (
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-5 h-5 mr-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
      )}
      Save changes
    </button>
  );
}

export default function SettingPage({
  user,
  session,
}: {
  user: UserSimple;
  session: Session;
}) {
  const binded = handleSaveProfile.bind(null, session);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ?? "");
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [state, formAction] = useFormState(binded, initialState);
  const router = useRouter();
  const showWarning =
    username != user.username ||
    bio != (user.bio ?? "") ||
    email != user.email ||
    !!newPassword;
  useEffect(() => {
    if (state.message && !state.isError) {
      state.message = null,
      router.refresh()
    }
  }, [state]);
  if (!showWarning) {
    (state.message = null), (state.isError = false);
    if (oldPassword) setOldPassword("");
  }
  return (
    <main className="w-full">
      <form
        action={formAction}
        className="w-full flex justify-center items-stretch"
      >
        <div className="m-10 p-10 border border-gray-500 rounded-xl flex flex-col">
          <h1 className="text-xl mx-auto">Settings</h1>
          <div className="mb-3">
            {user.profile ? (
              <Image
                src={user.profile}
                alt="Profile photo"
                width={80}
                height={80}
                className="border rounded-full mb-3 me-5"
              />
            ) : (
              <UserCircleIcon />
            )}
          </div>
          <label htmlFor="username" className="mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="border border-gray-500 px-3 py-2 mb-5 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300 inline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
            required
          />
          <label htmlFor="bio" className="mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            id="bio"
            className="p-1 resize-none transition-all mb-5 bg-sky-100 focus:outline-neutral-100 dark:focus:outline-sky-400 outline-none focus:bg-white dark:bg-gray-700 dark:focus:bg-gray-600 text-slate-950 dark:text-white"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
          <label htmlFor="email" className="mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="border border-gray-500 px-3 py-2 mb-5 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300 inline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="new-password" className="mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            id="new-password"
            className="border border-gray-500 px-3 py-2 mb-5 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300 inline"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
          />
          <div
            className={
              "flex flex-col transition-opacity " +
              (newPassword ? "" : "opacity-50")
            }
          >
            <label htmlFor="old-password" className="mb-1">
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              id="old-password"
              className="border border-gray-500 px-3 py-2 mb-5 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300 inline"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={!newPassword}
              minLength={8}
              required={!!newPassword}
            />
          </div>
        </div>
        <div className="fixed bottom-0">
          <Transition
            show={showWarning}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <div className="mx-auto bg-slate-300 dark:bg-slate-800 p-3 rounded-t-lg flex items-center justify-center">
              <span className="me-12">Careful - You have unsaved changes!</span>
              {state?.isError && (
                <span className="me-6 text-red-600">{state.message}</span>
              )}
              <button
                className="hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setUsername(user.username);
                  setBio(user.bio ?? "");
                  setEmail(user.email);
                  setNewPassword("");
                  setOldPassword("");
                }}
              >
                Reset
              </button>
              <SaveButton />
            </div>
          </Transition>
        </div>
      </form>
    </main>
  );
}
