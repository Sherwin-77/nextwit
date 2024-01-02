"use client";
import { UserPost, UserPostDetailed } from "@/@types/user-post";
import {
  UserCircleIcon,
  HeartIcon as FullHeartIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SendComment from "@/components/send-comment";
import { useContext, useEffect, useRef } from "react";
import { PostContext } from "@/contexts/PostContext";
import Link from "next/link";

export default function PostPage({
  post,
  session,
  status,
}: {
  post: UserPostDetailed;
  session: Session | null;
  status: "authenticated" | "unauthenticated";
}) {
  let oneHeight = 510;
  let oneWidth = 510;
  if (post.images.length > 1) oneHeight = 255;
  if (post.images.length > 2) oneWidth = 255;

  // See: https://github.com/vercel/next.js/discussions/38263#discussioncomment-3070160
  const curDate = new Date(post.dateCreated).toLocaleString();
  const likes = post.likes.length;
  const liked = post.likes.indexOf(session?.user.id) != -1 ?? false;
  const { posts, setPosts } = useContext(PostContext);
  const { push, refresh } = useRouter();
  const refreshed = useRef(false);
  useEffect(() => {
    if(!refreshed.current) return;
    let skip = false;
    const newPost = posts.map((v) => {
      if (v._id === post._id) {
        if (
          v.comments.length === post.comments.length &&
          v.likes.length === post.likes.length &&
          v.contents === post.contents
        ) {
          skip = true;
          return v;
        }
        return post;
      } else return v;
    });
    if (!skip) setPosts(newPost);
  }, [post]);
  useEffect(() => {
    if(!refreshed.current) {
      refresh();
      refreshed.current = true;
    };
  }, [status]);
  const handleLike = (e: any) => {
    e.stopPropagation();
    if (status === "unauthenticated") push("/login");
    else
      fetch(`${window.location.origin}/api/like/${post._id}`, {
        method: liked ? "DELETE" : "POST",
      })
        .then((r) => {
          if (r.ok) {
            refresh();
          }
        })
        .catch((err) => console.error(err));
  };
  const deleteComment = (commentId: string) => {
    if (status === "unauthenticated") push("/login");
    else
      fetch(`${window.location.origin}/api/comment/${commentId}`, {
        method: "DELETE",
      })
        .then((r) => {
          if (r.ok) {
            refresh();
          }
        })
        .catch((err) => console.error(err));
  };
  return (
    <main className="w-full flex justify-around items-stretch p-12 flex flex-col">
      <article className="border py-5 px-8 border-gray-400 dark:border-gray-600 bg-sky-100 dark:bg-gray-900 rounded-md w-full mb-8">
        <div className="flex">
        <Link className="flex items-center gap-3 mb-5" href={`/profile/${post.author.username}`} >

          {post.author.profile ? (
            <Image
              src={post.author.profile}
              height={50}
              width={50}
              alt="Profile"
            />
          ) : (
            <UserCircleIcon className="h-auto w-[50px]" />
          )}
          <span className="font-bold">@{post.author.username}</span>
        </Link>
          <span className="ms-auto text-slate-500">{curDate}</span>
        </div>
        <p className="mb-5">{post.contents}</p>
        <div className="flex gap-5">
          <div className="flex gap-1 justify-center items-center aligns-center hover:cursor-pointer hover:">
            {liked ? (
              <FullHeartIcon
                className="w-10 p-1 transition-all hover:bg-red-700/50 rounded-full text-red-600"
                onClick={handleLike}
              />
            ) : (
              <HeartIcon
                className="w-10 p-1 transition-all hover:bg-red-700/50 rounded-full"
                onClick={handleLike}
              />
            )}
            <span className="font-medium">{likes}</span>
          </div>
          <div className="flex gap-1 justify-center items-center aligns-center hover:cursor-pointer">
            <ChatBubbleOvalLeftIcon className="w-10 p-1 transition-all hover:bg-sky-500/50 rounded-full" />
            <span className="font-medium">{post.comments.length}</span>
          </div>
        </div>
      </article>
      <section className="border border-gray-400 dark:border-gray-600 rounded-md bg-sky-100 dark:bg-gray-900 pt-1">
        {session && <SendComment session={session} postId={post._id} />}
        {post.comments.map((obj) => {
          return (
            <div
              key={obj._id}
              className="mb-3 pt-3 border-t border-gray-400 dark:border-gray-600 px-7"
            >
              <div className="flex items-center gap-1 mb-1">
                {obj.author.profile ? (
                  <Image
                    src={obj.author.profile}
                    height={30}
                    width={30}
                    alt="Profile"
                  />
                ) : (
                  <UserCircleIcon className="h-auto w-[30px]" />
                )}
                <span className="font-semibold">@{obj.author.username}</span>
                {session && session.user.id == obj.author._id && (
                  <TrashIcon
                    className="ms-auto w-8 p-1 hover:cursor-pointer transition-all hover:bg-red-700/50 rounded-full"
                    onClick={() => deleteComment(obj._id)}
                  />
                )}
              </div>
              <p className="p-1">{obj.contents}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
