import axios from "axios"
import { appConfig } from "../Utils/AppConfig"
import type { Message } from "../Models/MessageModel"



class ChatService {


    //Get message by Conversation Id
    public async getMessagesByConversation(conversationId:string):Promise<Message[]>{
        const response = await axios.get<Message[]>(
            `${appConfig.chatUrl}/${conversationId}`
        );
        return response.data
    }




    public async sendMessage(conversationId: string, content: string){
        const response = await axios.post(appConfig.chatUrl, {
            conversation_id: conversationId,
            content: content
        });

        return response.data
    }


}


export const chatService = new ChatService();
