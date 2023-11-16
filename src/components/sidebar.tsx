import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ResponseError, safeFetch } from "../app/utils/fetchHandler"
import Loading from "../app/loading"
import { UserCircleIcon } from "@heroicons/react/20/solid"


interface UsersResponse {
    _id: string,
    username: string,
    bio?: string,
    profile?: string
}

export default function SideBar() {
    const [suggestions, setSuggestions] = useState<UsersResponse[]>()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Related to https://stackoverflow.com/questions/77190419/why-useeffect-runs-multiple-times-in-next-js
    const fetched = useRef(false)

    async function getSuggestion() {
        if (fetched.current) return
        fetched.current = true
        setErrorMessage(null)
        try {
            const data = await safeFetch("api/users")
            setSuggestions(data as UsersResponse[])
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
        <div className="flex flex-col bg-sky-200 dark:bg-gray-800 rounded-xl overflow-hidden">
            <span className="font-bold text-xl p-3">Suggested</span>
            {suggestions ? suggestions.map((obj) => (
                <div className="flex flex-col hover:bg-neutral-100 dark:hover:bg-gray-900 p-3 hover:cursor-pointer" key={obj._id}>
                    <div className="flex items-center">
                        {
                            obj.profile ?
                                <div className="border rounded-full m-3">
                                    <Image src={obj.profile} alt="Profile picture" width={50} height={50} />
                                </div>
                                :
                                <span className="w-[50px] me-3 my-1">
                                    <UserCircleIcon />
                                </span>
                        }
                        {obj.username}
                    </div>
                    <span className="text-slate-500">{obj.bio ? obj.bio : "No description yet"}</span>
                </div>
            )) :
                <div className="p-3">
                    {errorMessage ?? <Loading />}
                </div>
            }
        </div>
    )
}