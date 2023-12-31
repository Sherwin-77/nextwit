export interface UserSimple {
    _id: string;
    username: string;
    profile?: string;
}

export interface UserComment {
    _id: string;
    author: UserSimple;
    contents: String;
    likeCounts: number;
    dateCreated: string;
}