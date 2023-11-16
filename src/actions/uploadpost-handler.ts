"use server"

import { revalidatePath, revalidateTag } from "next/cache"

export default async function handleSubmit(prevState: any, formData: FormData) {
    try {
        // Temp code to log as guest
        const r1 = await fetch(`${process.env.NEXT_API_URL}/user/${process.env.GUEST_USERNAME}?type=username`, {cache: "no-store"})
        let userId
        if (!r1.ok) {
            if (r1.status == 404) {
                // Simulate signup if not found
                const r2 = await fetch(`${process.env.NEXT_API_URL}/signup`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    cache: "no-store",
                    body: JSON.stringify({
                        username: process.env.GUEST_USERNAME,
                        password: process.env.GUEST_PASSWORD,
                        email: process.env.GUEST_EMAIL
                    })
                })
                if(!r2.ok) return {message: "Failed to signup as guest", isError: true}
                const data = await r2.json()
                userId = data._id
            } else return {message: "Failed to login as guest", isError: true}
        } else {
            const data = await r1.json()
            userId = data._id
        }

        const res = await fetch(`${process.env.NEXT_API_URL}/post`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            cache: "no-store",
            body: JSON.stringify({
                author: userId,
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
        else return { message: `Failed to upload error status ${res.status}`, isError: true }
    } catch (e) {
        return { message: "Failed to upload", isError: true }
    }
}