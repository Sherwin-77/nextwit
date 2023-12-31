import { UserPost, UserPostDetailed } from "@/@types/user-post";
import { HeartIcon as FullHeartIcon } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect} from "react";

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
  const createdAt = new Date(props.dateCreated);
  const [curDate, setCurDate] = useState(createdAt.toDateString());
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(props.likes.length);
  const { push } = useRouter();
  const handleLike = (e: any) => {
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
  });
  useEffect(() => {
    if (status == "authenticated") {
      setLiked(props.likes.indexOf(session?.user.id) != -1);
    }
  }, [status]);
  return (
    <article
      className="p-3 mb-3 rounded flex border border-gray-300 dark:border-gray-600 bg-sky-100 dark:bg-gray-900 hover:cursor-pointer"
      onClick={() => {
        push(`/post/${btoa(props._id)}`);
      }}
    >
      <div className="me-5">
        {props.author.profile ? (
          <Image
            src={props.author.profile}
            height={50}
            width={50}
            alt="Profile"
          />
        ) : (
          <UserCircleIcon className="h-auto w-[50px]" />
        )}
      </div>
      <div className="flex flex-col">
        <div>
          <span className="me-3">{props.author.username}</span>
          <span className="text-slate-500">{curDate}</span>
        </div>
        <p>{props.contents}</p>
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
            <span className="font-medium">{props.comments.length}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
