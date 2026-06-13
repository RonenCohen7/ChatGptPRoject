

export interface Message {
    _id?: string;
    conversation_id?: string;
    role: "user"| "assistant";
    content:string;
    content_type?: "text" | "image" | "video";
    create_at?: string
}
