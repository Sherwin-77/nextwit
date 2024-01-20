"use client";
import { UserPost, UserPostDetailed } from "@/@types/user-post";
import {
  UserCircleIcon,
  HeartIcon as FullHeartIcon,
  TrashIcon,
  PencilSquareIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SendComment from "@/components/send-comment";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { PostContext } from "@/contexts/PostContext";
import Link from "next/link";
import ConfirmPopup from "@/components/confirm-popup";
import { Dialog, Transition } from "@headlessui/react";
import SubmitButton from "@/components/submit-button";
import { useFormState } from "react-dom";
import handleEditContent from "@/actions/editcontent-handler";

const initialState = {
  message: null,
  isError: false,
  reload: undefined,
};

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

  const curDate = new Date(post.dateCreated).toLocaleString();
  const likes = post.likes.length;
  const binded = session ? handleEditContent.bind(null, post._id, session) : async (prev: any) => ({message: "Not logged in", isError: true});

  const liked = post.likes.indexOf(session?.user.id) != -1 ?? false;
  const [state, formAction] = useFormState(binded, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const { posts, setPosts } = useContext(PostContext);
  const { push, refresh, replace } = useRouter();
  const refreshed = useRef(false);

  // Force refresh and sync with home (Temporary fix, check out FIXME at page.tsx)
  useEffect(() => {
    if (!refreshed.current) return;
    setPosts((prev) => {
      const newPost = prev.map((v) => {
        if (v._id === post._id) {
          if (
            v.comments.length === post.comments.length &&
            v.likes.length === post.likes.length &&
            v.contents === post.contents
          ) {
            return v;
          }
          return post;
        } else return v;
      });
      return newPost
    });
  }, [post, setPosts]);
  useEffect(() => {
    if (!refreshed.current) {
      refresh();
      refreshed.current = true;
    }
  }, [status, refresh]);

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
  const deletePost = () => {
    if (status === "unauthenticated") push("/login");
    fetch(`${window.location.origin}/api/post/${post._id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          replace("/home");
        }
      })
      .catch((err) => console.error(err));
  };
  if(state.reload) window.location.reload();
  return (
    <>
      <ConfirmPopup
        popupTitle="Delete Post"
        message="Are you sure to permanently delete this post? This action cannot be undone"
        afterConfirm={deletePost}
        popupState={deletePrompt}
        setPopupState={setDeletePrompt}
      />
      <Transition show={isEditing} as={Fragment}>
        <Dialog
          className="relative z-50"
          open={isEditing}
          onClose={() => setIsEditing(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex flex-col w-screen items-center justify-center">
              <Dialog.Panel className="mx-auto max-w-sm rounded bg-sky-100 dark:bg-gray-900 p-5">
                <Dialog.Title className="font-bold text-blue-500 mb-1">
                  Set Contents
                </Dialog.Title>
                <form className="p-5 mb-3" action={formAction}>
                  <textarea
                    name="contents"
                    id="upload-contents"
                    className="p-1 resize-none transition-all my-3 bg-sky-100 focus:outline-neutral-100 dark:focus:outline-sky-400 outline-none focus:bg-white dark:bg-gray-700 dark:focus:bg-gray-600 text-slate-950 dark:text-white"
                    defaultValue={post.contents}
                    required
                  ></textarea>
                  <div className="flex justify-end mb-3">
                    <SubmitButton message="Edit" loadingMessage="Editing" />
                  </div>
                  <span
                    className={
                      "flex justify-end " +
                      (state?.isError ? "text-red-600" : "text-green-600")
                    }
                  >
                    {state?.message}
                  </span>
                </form>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
      <main className="w-full flex justify-around items-stretch p-5 md:p-12 flex flex-col">
        <article className="border py-5 px-3 border-gray-400 dark:border-gray-600 bg-sky-100 dark:bg-gray-900 rounded-md w-full mb-8">
          <div className="flex">
            <span className="flex items-center mb-5 flex-wrap overflow-hidden">
              <Link
                className="flex items-center gap-3"
                href={`/profile/${post.author.username}`}
              >
                {post.author.profile ? (
                  <Image
                    src={post.author.profile}
                    height={50}
                    width={50}
                    alt="Profile"
                  />
                ) : (
                  <UserCircleIcon className="h-auto w-10" />
                )}
                <span className="font-bold break-all">@{post.author.username}</span>
              </Link>
              <span className="md:ms-5 text-slate-500">{curDate}</span>
            </span>
            {session &&
              session.user.id == post.author._id &&
              !isEditing &&
              !deletePrompt && (
                <div className="ms-3 md:ms-auto flex gap-3 [&>*]:h-8 [&>*:hover]:cursor-pointer [&>*]:rounded-full [&>*]:p-1">
                  <PencilSquareIcon
                    className="hover:bg-blue-500"
                    onClick={() => setIsEditing(true)}
                  />
                  <TrashIcon
                    className="hover:bg-red-500"
                    onClick={() => setDeletePrompt(true)}
                  />
                </div>
              )}
          </div>
          <p className="whitespace-pre-wrap break-words mb-5">{post.contents}</p>
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
        <section className="border border-gray-400 dark:border-gray-600 rounded-md bg-sky-100 dark:bg-gray-900">
          {session && !isEditing && !deletePrompt && (
            <SendComment session={session} postId={post._id} />
          )}
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
                  {session &&
                    (session.user.id == obj.author._id ||
                      session?.user.id == post.author._id) &&
                    !isEditing &&
                    !deletePrompt && (
                      <TrashIcon
                        className="ms-auto w-8 p-1 hover:cursor-pointer transition-all hover:bg-red-700/50 rounded-full"
                        onClick={() => deleteComment(obj._id)}
                      />
                    )}
                </div>
                <p className="p-1 break-words">{obj.contents}</p>
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
