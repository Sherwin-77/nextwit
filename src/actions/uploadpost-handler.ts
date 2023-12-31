"use server"

import { Session } from "next-auth"
import { revalidateTag } from "next/cache"

export default async function handleSubmit(session: Session, prevState: any, formData: FormData) {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}/post`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${session.accessToken}`,
                "Content-Type": "application/json"
            },
            cache: "no-store",
            body: JSON.stringify({
                contents: formData.get("contents"),
                images: []
            })
        })
        revalidateTag("UserPosts")
        if (res.ok) {
            const data = await res.json()
            const resPost = await fetch(`${process.env.NEXT_API_URL}/post/${data.postID}`)
            if(!resPost.ok) return {message: "Upload success but failed to load post", isError: true}
            const resData = await resPost.json()
            return { message: "Upload success", isError: false, userPost: resData, postID: resData._id}
        }
        else if(res.status == 401) return {message: "Unauthorized error. Please try to re-login", isError: true}
        else return { message: `Failed to upload error status ${res.status}`, isError: true }
    } catch (e) {
        return { message: "Failed to upload", isError: true }
    }
}