import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { safeFetch } from "@/app/utils/fetchHandler";
import { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import PostPage from "./postpage";
import {headers} from "next/headers"

type Props = {
  params: { postId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const dt = await fetch(`${process.env.NEXT_API_URL}/post/${params.postId}`, {next: {revalidate: 60}});
  if (!dt.ok)
    return {
      title: "Post",
      description: "Get your account now",
    };
  const post = await dt.json();
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${post.author.username} 's Post` ?? "Profile",
    description: post.contents,
    openGraph: {
      images: previousImages,
    },
  };
}
async function getPost(postId: string) {
  try {
    const data = await safeFetch(`${process.env.NEXT_API_URL}/post/${postId}`, {cache: "no-store"});
    return data;
  } catch (err) {
    return null;
  }
}
// FIXME: Check out https://github.com/vercel/next.js/issues/51788
export default async function Page({ params, searchParams }: Props) {
  const reg =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  if (!reg.test(params.postId)) return notFound();
  const post = await getPost(atob(params.postId));
  if (!post) return notFound();
  const session = await getServerSession(authOptions);
  const status = session ? "authenticated" : "unauthenticated";
  return <PostPage post={post} session={session} status={status} />;
}

export const dynamic = "force-dynamic"
