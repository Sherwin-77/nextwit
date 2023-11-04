"use client"
import InfinitePost from "@/app/components/infinitescroll"
import SideBar from "@/app/components/sidebar"


export default function HomePage() {
    return (
        <main className="w-full flex justify-center items-stretch">
            <div className="max-w-2xl ms-10 m-3 w-full flex flex-col">
                <InfinitePost />
            </div>
            <div className="w-[350px] m-3 ms-10 hidden md:block">
                <SideBar />
            </div>
        </main>
    )
}