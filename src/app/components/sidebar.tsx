import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ResponseError, safeFetch } from "../utils/fetchHandler"
import Loading from "../loading"

interface UserInfo {
    id: number,
    email: string,
    username: string,
    image: string,
    userAgent: string
}
interface UserResponse {
    limit: number,
    skip: 0,
    total: number,
    users: UserInfo[]
}

export default function SideBar() {
    const [suggestions, setSuggestions] = useState<UserResponse>()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Related to https://stackoverflow.com/questions/77190419/why-useeffect-runs-multiple-times-in-next-js
    const fetched = useRef(false)

    async function getSuggestion() {
        if (fetched.current) return
        fetched.current = true
        setErrorMessage(null)
        try {
            const data = await safeFetch("api/users")
            setSuggestions(data as UserResponse)
        } catch (err) {
            if (err instanceof ResponseError) {
                setErrorMessage(`Failed to fetch error status ${err.response.status}`)
            } else {
                setErrorMessage("Unknown error occured")
            }
        }
    }
    useEffect(() => {
        getSuggestion()
    })
    return (
        <div className="flex flex-col bg-neutral-100 dark:bg-gray-800 rounded-xl p-3">
            <span className="font-bold text-xl mb-3">Suggested</span>
            {suggestions ? suggestions.users.map((obj) => (
                <div className="flex flex-col mb-3" key={obj.username}>
                    <div className="flex items-center">
                        <div className="border rounded-full m-3">
                            <Image src={obj.image} alt="Profile picture" width={50} height={50} />
                        </div>
                        {obj.username}
                    </div>
                    <span className="text-slate-500">{obj.userAgent}</span>
                </div>
            )) : errorMessage ?? <Loading />}
        </div>
    )
}