"use client";
import { Fragment, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import {
  XMarkIcon,
  HomeIcon,
  Bars4Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";
import { safeFetch } from "@/app/utils/fetchHandler";
import { Session } from "next-auth";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/home", current: false, icon: HomeIcon },
  { name: "Search", href: "#", current: false, icon: MagnifyingGlassIcon },
  { name: "Chat", href: "#", current: false, icon: ChatBubbleLeftEllipsisIcon },
];

const iconClass = "h-8 w-8 mx-3";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar({session, status}: {session: Session | null, status: "authenticated" | "loading" | "unauthenticated"}) {
  const pathName = usePathname();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  navigation.map((obj) => {
    obj.current = obj.href === pathName;
    return obj;
  });
  useEffect(() => {
    if (status === "authenticated") {
      // I swear this relative url is askldfjk
      safeFetch(`${window.location.origin}/api/user/${session?.user.id}`).then((r) =>
        setImageUrl(r.profile)
      );
    }
  }, [status, session]);
  return (
    <Disclosure as="nav" className="bg-sky-500/30 dark:bg-indigo-500/30 backdrop-blur-xl">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-black dark:text-gray-400 hover:bg-gray-300 hover:text-black dark:hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset dark:focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <div className="w-8">
                      <XMarkIcon />
                    </div>
                  ) : (
                    <div className="w-8">
                      <Bars4Icon />
                    </div>
                  )}
                </Disclosure.Button>
              </div>
              {/* Logo */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center me-5">
                  <Link href="/">
                    <Image
                      src="/logo.png"
                      height={100}
                      width={100}
                      alt="logo"
                      className="h-10 w-auto"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-neutral-100 dark:bg-gray-900"
                            : "hover:bg-gray-300 text-gray-900 dark:text-gray-400 hover:text-black dark:hover:bg-indigo-600 dark:hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        <item.icon className={iconClass} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Side */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full p-1 text-gray-900 dark:text-gray-400 hover:text-white focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View Notification</span>
                  <BellIcon className={iconClass} />
                </button>

                {/* Profile dropdown */}
                {status === "authenticated" ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        {imageUrl ? (
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={imageUrl}
                            alt="Profilos imagos"
                          />
                        ) : (
                          <UserCircleIcon className="w-10 h-10 text-white"/>
                        )}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-75"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-100"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-75"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/profile"
                              className={classNames(
                                active ? "bg-gray-100 dark:bg-gray-900" : "",
                                "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                              )}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/setting"
                              className={classNames(
                                active ? "bg-gray-100 dark:bg-gray-900" : "",
                                "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={async () => await signOut()}
                              className={classNames(
                                active ? "bg-gray-100 dark:bg-gray-900" : "",
                                "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link href="/login">Log In</Link>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:text-white dark:hover:bg-indigo-600",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
