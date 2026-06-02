

export interface Message {
    _id?: string;
    conversationId?:string;
    role: "user"| "assistant";
    content:string;
    createdAt?:string
}
