"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { safeFetch } from "../app/utils/fetchHandler"
import Post from "./post"
import Loading from "../app/loading"
import { PostContext } from "@/contexts/PostContext"

export default function InfinitePost() {
  const {posts, setPosts} = useContext(PostContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ref by page number
  const [page, setPage] = useState(1)
  const pageRef = useRef<number>(page)

  // NEW: Ref by lastDate
  const [lastDate, setLastDate] = useState(new Date())
  const lastDateRef = useRef<Date>(lastDate)
  const observerTarget = useRef(null);
  async function fetchPost() {
    setError(null)
    setIsLoading(true)
    try {
      // const data = await safeFetch(`https://picsum.photos/v2/list?page=${pageRef.current}`)
      const data = await safeFetch(`api/posts?lastDate=${lastDateRef.current.toISOString()}&limit=5`)
      setPosts((prev) => [...prev, ...data])
      const cur = data.length > 0 ?  new Date(data[data.length-1].dateCreated) : new Date()
      setLastDate(cur)
      setPage((prev) => prev + 1)
    } catch (e) {
      if (typeof e === "string") setError(e);
      else if (e instanceof Error) setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    pageRef.current = page
  }, [page])
  useEffect(() => {
    lastDateRef.current = lastDate
  }, [lastDate])
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading) {
          fetchPost();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => {
      observer.disconnect()
    }
  }, [observerTarget]);
  return (
    <>
      {posts.map((data, i) => (<Post key={i} props={data}/>))}
      {isLoading && <Loading />}
      {error && <p>Failed to refresh: {error}</p>}
      <div ref={observerTarget} className="p-3"></div>
    </>
  )
}


