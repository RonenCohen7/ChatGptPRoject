

export interface Message {
    _id?: string;
    conversation_id?: string;
    role: "user"| "assistant";
    content:string;
    create_at?: string
}
