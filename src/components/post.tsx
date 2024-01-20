import { UserPost, UserPostDetailed } from "@/@types/user-post";
import { HeartIcon as FullHeartIcon } from "@heroicons/react/24/solid";
import {
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ConfirmPopup from "./confirm-popup";
import Link from "next/link";

export default function Post({
  props,
  session,
  status,
}: {
  props: UserPost | UserPostDetailed;
  session: Session | null;
  status: "authenticated" | "unauthenticated" | "loading";
}) {
  let oneHeight = 510;
  let oneWidth = 510;
  if (props.images.length > 1) oneHeight = 255;
  if (props.images.length > 2) oneWidth = 255;

  // See: https://github.com/vercel/next.js/discussions/38263#discussioncomment-3070160
  const createdAt = useMemo(
    () => new Date(props.dateCreated),
    [props.dateCreated]
  );
  const [curDate, setCurDate] = useState(createdAt.toDateString());
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(props.likes.length);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const { push } = useRouter();
  const handleLike = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === "loading") return;
    if (status === "unauthenticated") push("/login");
    else
      fetch(`${window.location.origin}/api/like/${props._id}`, {
        method: liked ? "DELETE" : "POST",
      })
        .then((r) => {
          if (r.ok) {
            setLikes(likes + (liked ? -1 : 1));
            setLiked(!liked);
          }
        })
        .catch((err) => console.error(err));
  };
  const executeDelete = () => {
    if (status === "loading") return;
    if (status === "unauthenticated") push("/login");
    fetch(`${window.location.origin}/api/post/${props._id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          window.location.reload();
        }
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    setCurDate(
      createdAt.toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [createdAt]);
  useEffect(() => {
    if (status == "authenticated") {
      setLiked(props.likes.indexOf(session?.user.id) != -1);
    }
  }, [status, props.likes, session]);
  return (
    <>
      <ConfirmPopup
        popupTitle="Delete Post"
        message="Are you sure to permanently delete this post? This action cannot be undone"
        afterConfirm={executeDelete}
        popupState={deletePrompt}
        setPopupState={setDeletePrompt}
      />
      <Link href={`/post/${btoa(props._id)}`}>
        <article className="p-3 mb-3 rounded flex border border-gray-300 dark:border-gray-600 bg-sky-100 dark:bg-gray-900">
          <div className="me-3 md:me-5">
            {props.author.profile ? (
              <Image
                src={props.author.profile}
                height={50}
                width={50}
                alt="Profile"
              />
            ) : (
              <UserCircleIcon className="h-auto w-10" />
            )}
          </div>
          <div className="flex flex-col w-full">
            <div className="flex">
              <div className="flex gap-3 mb-1 items-center flex-wrap overflow-hidden">
                <span className="font-bold">{props.author.username}</span>
                <span className="text-slate-500">{curDate}</span>
              </div>
              {session && session.user.id == props.author._id && (
                <TrashIcon
                  className=" p-1 hover:bg-red-500 rounded-full md:ms-auto h-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeletePrompt(true);
                  }}
                />
              )}
            </div>
            <p className="whitespace-pre-wrap line-clamp-3 break-all">
              {props.contents}
            </p>
            <div className="my-3 max-h-[510px] max-w-[510px] mb-3 overflow-hidden rounded-3xl">
              {props.images.map((url, i) => (
                <Image
                  key={i}
                  placeholder="blur"
                  blurDataURL="/logo.png"
                  src={url}
                  width={510}
                  height={510}
                  quality={50}
                  className="object-cover"
                  alt="post images"
                />
              ))}
            </div>
            <div className="flex gap-5">
              <div className="flex gap-1 justify-center items-center hover:cursor-pointer">
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
              <div className="flex gap-1 justify-center items-center hover:cursor-pointer">
                <ChatBubbleOvalLeftIcon className="w-10 p-1 transition-all hover:bg-sky-500/50 rounded-full" />
                <span className="font-medium">{props.comments.length}</span>
              </div>
              <div
                className="flex justify-center items-center transition-all rounded-full hover:bg-sky-500/50 p-1 hover:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(
                    `${window.location.origin}/post/${btoa(props._id)}`
                  );
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 1000);
                }}
              >
                <LinkIcon className="w-7" />
              </div>
              {copied && <span className="text-green-500 text-sm">Link copied</span>}
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}
