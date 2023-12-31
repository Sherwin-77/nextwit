import { UserPost, UserPostDetailed } from "@/@types/user-post"
import {createContext, SetStateAction, Dispatch} from "react"

export const PostContext = createContext<{
    posts: (UserPost | UserPostDetailed)[],
    setPosts: Dispatch<SetStateAction<(UserPost | UserPostDetailed)[]>>
}>({
    posts: [],
    setPosts: (prev) => prev
})