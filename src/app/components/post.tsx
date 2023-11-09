import { UserPost } from "@/@types/user-post"
import { UserCircleIcon, UserIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import { useState, useEffect } from "react"


export default function Post({props}: {props: UserPost}) {
    let oneHeight = 510
    let oneWidth = 510

    // See: https://github.com/vercel/next.js/discussions/38263#discussioncomment-3070160
    const createdAt = new Date(props.dateCreated)
    const [curDate, setCurDate] = useState(createdAt.toDateString())
    useEffect(() => {
        setCurDate(createdAt.toLocaleString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }))
    })
    if (props.images.length > 1) oneHeight = 255
    if (props.images.length > 2) oneWidth = 255
    return (
        <article className="cursor-pointer p-3 flex border border-slate-300">
            <div className="me-5">
                {props.author.profile ? <Image src={props.author.profile} height={50} width={50} alt="Profile" /> : <UserCircleIcon className="h-auto w-[50px]" />}
            </div>
            <div className="flex flex-col">
                <div>
                    <span className="me-3">{props.author.username}</span>
                    <span className="text-slate-500">{curDate}</span>
                </div>
                <p>{props.contents}</p>
                <div className="my-3 max-h-[510px] max-w-[510px] mb-3 overflow-hidden rounded-3xl">
                    {props.images.map((url, i) => <Image key={i} placeholder="blur" blurDataURL="/logo.png" src={url} width={510} height={510} quality={50} className="object-cover" alt="post images" />)}
                </div>
            </div>
        </article>
    )
}