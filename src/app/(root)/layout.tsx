"use client"

import NavBar from "@/components/navbar"
import { useEffect, useRef, useState } from "react"
import { PostContext } from "@/contexts/PostContext"
import { UserPost } from "@/@types/user-post"
import { signOut, useSession } from "next-auth/react"


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navbarRef = useRef<HTMLDivElement>(null)
  let prevScroll: number | undefined;
  function navbarScroll() {
    let currentScroll = window.scrollY || document.documentElement.scrollTop
    if (!navbarRef.current) return
    if (prevScroll && currentScroll > prevScroll && currentScroll > 10) {
      navbarRef.current.style.top = `-${navbarRef.current.clientHeight * 2}px`
    } else {
      navbarRef.current.style.top = '0px'
    }
    prevScroll = currentScroll
  }
  const { data: session, status } = useSession();
  useEffect(() => {
    window.addEventListener("scroll", navbarScroll)
    return () => {
      window.removeEventListener("scroll", navbarScroll)
    }
  })
  const [posts, setPosts] = useState<UserPost[]>([{
    _id: "Any",
    contents: "This is caption of contents lorem",
    author: {
      _id: "anyID",
      username: "SewentySewen"
    },
    images: ["/tes.jpg"],
    comments: [],
    likes: [],
    dateCreated: new Date().toDateString(),
    _v: 1
  }])
  if(status == "authenticated" && session.isExpired){
    signOut({redirect: false}).then()
    return
  }
  // FIXME: Check out https://github.com/vercel/next.js/issues/58699 later
  return (
    <>
      <header className="fixed w-full top-0 transition-all" ref={navbarRef} >
        <NavBar session={session} status={status} />
      </header>
      <div className="mt-[77px]"></div>
      <PostContext.Provider value={{
        posts: posts,
        setPosts: setPosts
      }}>
        {children}
      </PostContext.Provider>
    </>
  )
}
