import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import type { Message } from "../Models/MessageModel";

const axiosInstance = axios.create({
    timeout: 300000,
});

class ChatService {

    public async getMessagesByConversation(conversationId: string): Promise<Message[]> {
        const response = await axiosInstance.get<Message[]>(
            `${appConfig.chatUrl}/${conversationId}`
        );
        return response.data;
    }

    public async sendMessage(conversationId: string, content: string) {
        const response = await axiosInstance.post(appConfig.chatUrl, {
            conversation_id: conversationId,
            content: content,
        });

        return response.data;
    }
}

export const chatService = new ChatService();
