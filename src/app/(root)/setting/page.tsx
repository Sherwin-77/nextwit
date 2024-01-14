import { notFound, redirect } from "next/navigation";
import SettingPage from "./settingpage";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  const res = await fetch(`${process.env.NEXT_API_URL}/user/${session?.user.id}`)
  if(!res) return notFound() // This normally shouldnt be triggered
  const user = await res.json()
  return <SettingPage user={user} session={session} />;
}
