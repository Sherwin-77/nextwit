"use client"

import NavBar from "@/app/components/navbar"
import { useEffect, useRef } from "react"


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
  return (
    <>
      <header className="fixed w-full top-0 transition-all" ref={navbarRef} >
        <NavBar />
      </header>
      <div className="mt-[77px]"></div>
      {children}
    </>
  )
}
