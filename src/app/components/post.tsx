import { UserIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import { useState, useEffect } from "react"

interface Props {
    userName: string,
    createdAt: Date,
    content: string,
    mediasUrl: string[]
    profileUrl?: string,
}

export default function Post(props: Props) {
    let oneHeight = 510
    let oneWidth = 510

    // See: https://github.com/vercel/next.js/discussions/38263#discussioncomment-3070160
    const [curDate, setCurDate] = useState(props.createdAt.toDateString())
    useEffect(() => {
        setCurDate(props.createdAt.toLocaleString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }))
    })

    if (props.mediasUrl.length > 1) oneHeight = 255
    if (props.mediasUrl.length > 2) oneWidth = 255
    return (
        <article className="cursor-pointer p-3 flex border border-slate-300">
            <div className="me-5">
                {props.profileUrl ? <Image src={props.profileUrl} height={50} width={50} alt="Profile" /> : <UserIcon className="h-auto w-[50px]" />}
            </div>
            <div className="flex flex-col">
                <div>
                    <span className="me-3">{props.userName}</span>
                    <span className="text-slate-500">{curDate}</span>
                </div>
                <p>{props.content}</p>
                <div className="my-3 max-h-[510px] max-w-[510px] w-[510px] mb-3 overflow-hidden rounded-3xl">
                    {props.mediasUrl.map((url, i) => <Image key={i} placeholder="blur" blurDataURL="/logo.png" src={url} width={510} height={510} quality={50} className="object-cover" alt="post images" />)}
                </div>
            </div>
        </article>
    )
}