"use client"

import NavBar from "@/app/components/navbar"
import { useEffect, useRef, useState } from "react"
import { PostContext } from "../contexts/PostContext"
import { UserPost } from "@/@types/user-post"


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
  return (
    <>
      <header className="fixed w-full top-0 transition-all" ref={navbarRef} >
        <NavBar />
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
