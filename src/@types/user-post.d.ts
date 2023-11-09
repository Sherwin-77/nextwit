export interface UserPost {
    _id: string;
    contents: string;
    author: {
        _id: string;
        username: string;
        profile?: string;
    }
    images: string[];
    comments: string[];
    likes: string[];
    dateCreated: string;
    _v: number;
}