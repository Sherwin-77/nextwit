import { Metadata, ResolvingMetadata } from "next";
import ProfilePage from "./profilepage";
import { safeFetch } from "@/app/utils/fetchHandler";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Props = {
  params: { username: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const pr = params.username;
  if (!pr)
    return {
      title: "Profile",
      description: "Get your account now",
    };
  const username = `${pr[params.username.length - 1]}`; // Username params aint username anymore
  // See not so helpful solution: https://github.com/vercel/next.js/issues/48344
  // Try catch aint working here
  const dt = await fetch(
    `${process.env.NEXT_API_URL}/user/${username}?type=username`
  );
  if (!dt.ok)
    return {
      title: "Profile",
      description: "Get your account now",
    };
  const user = await dt.json();
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `@${user.username}` ?? "Profile",
    description: user.bio ?? `Profile of ${user.username ?? "?"}`,
    openGraph: {
      images: previousImages,
    },
  };
}

async function getUser(query: string, strategy: "uid" | "username") {
  try {
    const data = await safeFetch(
      `${process.env.NEXT_API_URL}/user/${query}?withpost=1&type=${strategy}`
    );
    return data;
  } catch (err) {
    return null;
  }
}

export default async function Page({ params, searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const status = session ? "authenticated" : "unauthenticated"
  if(status == "unauthenticated" && !params.username) return redirect("/login")
  const user = await (async () => {
    if (params.username)
      return await getUser(
        params.username[params.username.length - 1],
        "username"
      );
    else return await getUser(session?.user.id, "uid");
  })();
  if (!user) return notFound();
  return <ProfilePage user={user} session={session} status={status} />;
}
