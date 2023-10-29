"use client"
import { useState, useEffect, useRef } from "react"

import { safeFetch, ResponseError } from "@/app/utils/fetchHandler"

import InfinitePost from "@/app/components/infinitescroll"
import SideBar from "@/app/components/sidebar"
import Loading from "@/app/loading"

interface UserResponse {
    username: string,
}

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}



export default function ProfilePage({params, searchParams}: Props) {
    const [user, setUser] = useState<UserResponse>()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Related to https://stackoverflow.com/questions/77190419/why-useeffect-runs-multiple-times-in-next-js
    const fetched = useRef(false)

    async function getUser() {
        if (fetched.current) return
        fetched.current = true
        setErrorMessage(null)
        try {
            const data = await safeFetch(`api/user/${params.id}`)
            setUser(data as UserResponse)
        } catch (err) {
            if (err instanceof ResponseError) {
                setErrorMessage(`Failed to fetch error status ${err.response.status}`)
            } else {
                setErrorMessage("Unknown error occured")
            }
        }
    }
    useEffect(() => {
        getUser()
    })
    return (
        <main className="w-full flex justify-center items-stretch">
            <div className="max-w-2xl ms-10 m-3 w-full flex flex-col">
                <div className="border">
                    <h1>Profile</h1>
                    {user ? user.username : errorMessage ?? <Loading />}
                </div>
                <InfinitePost />
            </div>
            <div className="w-[350px] m-3 ms-10">
                <SideBar />
            </div>
        </main>
    )
}