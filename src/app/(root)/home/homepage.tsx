"use client"
import InfinitePost from "@/components/infinite-post"
import SideBar from "@/components/sidebar"
import UploadPost from "@/components/upload-post"
import { signOut, useSession } from "next-auth/react";


export default function HomePage() {
    const { data: session, status } = useSession();
    if(session?.isExpired) signOut()
    return (
        <main className="w-full flex justify-center items-stretch">
            <div className="max-w-2xl mx-10 w-full flex flex-col">
                {status === "authenticated" && <UploadPost session={session} />}
                <InfinitePost session={session} status={status} />
            </div>
            <div className="w-[350px] m-3 ms-10 hidden md:block">
                <SideBar />
            </div>
        </main>
    )
}