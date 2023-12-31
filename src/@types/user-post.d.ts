import { UserComment, UserSimple } from "./user-detail";


export interface UserPost {
    _id: string;
    contents: string;
    author: UserSimple;
    images: string[];
    comments: string[];
    likes: string[];
    dateCreated: string;
    _v: number;
}

export interface UserPostDetailed extends UserPost {
    comments: UserComment[];
}