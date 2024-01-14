export interface UserSimple {
    _id: string;
    username: string;
    email: string;
    bio?: string;
    profile?: string;
}

export interface UserComment {
    _id: string;
    author: UserSimple;
    contents: String;
    likeCounts: number;
    dateCreated: string;
}