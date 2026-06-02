import axios from "axios";
import type { Conversation } from "../Models/ConversationModel";
import { appConfig } from "../Utils/AppConfig";




class ConversationService {
    // Get All Conversation
    public async getAllConversations(): Promise<Conversation[]> {
        const response = await axios.get<Conversation[]>(appConfig.conversationUrl)
        return response.data

    }

    //Get One Conversation
    public async getOneConversation(id:string): Promise<Conversation> {
        const response = await axios.get<Conversation>(`${appConfig.conversationUrl}/${id}`)
        return response.data
    }


    //Create new Conversation
    public async addConversation(conversation:Conversation): Promise<Conversation>{
        const response = await axios.post<Conversation>(appConfig.conversationUrl,conversation);
        return response.data

    }


    //Delete Conversation
    public async deleteConversation(_id: string): Promise<void> {
        await axios.delete(`${appConfig.conversationUrl}/${_id}`)
    }




}



export const conversationService = new ConversationService();
