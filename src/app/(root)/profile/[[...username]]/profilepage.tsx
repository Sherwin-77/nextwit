"use client";
import { useState, useEffect, useRef } from "react";

import { safeFetch, ResponseError } from "@/app/utils/fetchHandler";

import InfinitePost from "@/components/infinite-post";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { UserPost } from "@/@types/user-post";
import Image from "next/image";

interface UserResponse {
  username: string;
  profile?: string;
  bio?: string;
  contents: UserPost[];
}

type Props = {
  params: { username?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function ProfilePage({ params, searchParams }: Props) {
  const [user, setUser] = useState<UserResponse>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: session, status } = useSession();

  // Related to https://stackoverflow.com/questions/77190419/why-useeffect-runs-multiple-times-in-next-js
  const fetched = useRef(false);

  async function getUser(query: string, strategy: "uid" | "username") {
    if (fetched.current) return;
    fetched.current = true;
    setErrorMessage(null);
    try {
      const data = await safeFetch(
        `api/user/${query}?withpost=1&type=${strategy}`
      );
      console.log(data);
      setUser(data as UserResponse);
    } catch (err) {
      if (err instanceof ResponseError) {
        setErrorMessage(`Failed to fetch error status ${err.response.status}`);
      } else {
        setErrorMessage("Unknown error occured");
      }
    }
  }
  useEffect(() => {
    if (!params.username && status == "loading") return;
    else {
      if (params.username) getUser(params.username, "username");
      else getUser(session?.user.id, "uid");
    }
  }, [status]);
  if (!params.username) {
    if (status == "loading") return <Loading />;
    if (status == "unauthenticated") return redirect("/login");
  }
  return (
    <main className="w-full flex justify-center items-stretch">
      <div className="ms-10 m-3 w-full flex flex-col">
        {user ? 
        <div className="border p-5 rounded mb-3">
            <Image src={user.profile ?? "/logo.png"} alt="Profile photo" width={120} height={120} className="border rounded-full mb-3 me-5 inline"/>
            <span>{user.username}</span>
        </div> 
        : errorMessage ?? <Loading />}
        <InfinitePost />
      </div>
    </main>
  );
}
