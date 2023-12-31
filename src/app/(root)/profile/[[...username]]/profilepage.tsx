"use client";
import { useState, useEffect, useRef } from "react";

import Loading from "@/app/loading";
import { UserPost } from "@/@types/user-post";
import Image from "next/image";
import Post from "@/components/post";
import { Session } from "next-auth";

interface UserResponse {
  _id: string;
  username: string;
  profile?: string;
  bio?: string;
  contents: UserPost[];
}

export default function ProfilePage({user, session, status}: {user: UserResponse, session: Session | null, status: "authenticated" | "unauthenticated"}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => {
    if(user) window.history.replaceState(window.history.state, '', `/profile/${user.username}`);
  })
  return (
    <main className="w-full flex justify-center items-stretch">
      <div className="ms-10 m-3 max-w-5xl w-full flex flex-col">
        {user ? (
          <>
            <div className="border border-gray-500 rounded-xl p-5 mb-8">
              <Image
                src={user.profile ?? "/logo.png"}
                alt="Profile photo"
                width={80}
                height={80}
                className="border rounded-full mb-3 me-5"
              />
              <span className="font-bold">@{user.username}</span>
              {user.bio ? 
              <p>{user.bio}</p>
              : 
              <p className="opacity-50">No bio yet</p>
              }
            </div>
            {user?.contents.map((data, i) => (
              <Post key={i} props={data} status={status} session={session} />
            ))}
          </>
        ) : (
          errorMessage ?? <Loading />
        )}
      </div>
    </main>
  );
}
