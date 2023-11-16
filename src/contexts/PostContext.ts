import { UserPost } from "@/@types/user-post"
import {createContext, SetStateAction, Dispatch} from "react"

export const PostContext = createContext<{
    posts: UserPost[],
    setPosts: Dispatch<SetStateAction<UserPost[]>>
}>({
    posts: [],
    setPosts: (prev) => prev
})