"use client"

interface PostResponse {
  id: number,
  author: string,
  width: number,
  height: number,
  url: string,
  download_url: string
}

import { useState, useEffect, useRef } from "react"
import { safeFetch } from "../utils/fetchHandler"
import Post from "./post"
import Loading from "../loading"

export default function InfinitePost() {
  const [posts, setPosts] = useState<PostResponse[]>([{
    id: 6969,
    author: "Sewenty",
    width: 702,
    height: 1199,
    url:"/tes.jpg",
    download_url:"/tes.jpg"
  }])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageRef = useRef<number>(page)
  const observerTarget = useRef(null);
  async function fetchPost() {
    setError(null)
    setIsLoading(true)
    console.log(`Fetch page ${pageRef.current}`)
    try {
      const data = await safeFetch(`https://picsum.photos/v2/list?page=${pageRef.current}`)
      setPosts((prev) => [...prev, ...data])
      setPage(prev => prev + 1)
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
      {posts.map((data, i) => (<Post key={i} userName={data.author} createdAt={new Date(Date.now())} content="UwU" mediasUrl={[data.download_url]} />))}
      {isLoading && <Loading />}
      {error && <p>Failed to refresh: {error}</p>}
      <div ref={observerTarget} className="p-3"></div>
    </>
  )
}


