import { useEffect, useState , useRef} from "react";
import "./Home.css";
import type { Conversation } from "../../../Models/ConversationModel";
import { conversationService } from "../../../Service/ConversationService";
import type { Message } from "../../../Models/MessageModel";
import { chatService } from "../../../Service/chatService";
import { useTitle } from "../../../Utils/UseTitle";



export function Home() {


    useTitle("Home 🏠")

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        conversationService.getAllConversations()
        .then(data => setConversations(data))
        .catch(err => console.log(err));

    }, []);


    useEffect(()=> {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        })
    },[messages])


    async function selectConversation(conversation: Conversation){
        setSelectedConversation(conversation);
        console.log("Select conversation");

        try {
            const data = await chatService.getMessagesByConversation(conversation._id!);
            setMessages(data)
        }
        catch (err) {
            console.log(err);

        }
    }

    async function sendMessage(){
        if(!selectedConversation) return;
        if(!content.trim()) return;

        try {
            const result = await chatService.sendMessage(
                selectedConversation._id!,
                content
            );

            setMessages(prev =>  [
                ...prev,
            result.user_message,
            result.assistant_message])

            setContent("")
        }
        catch (err) {
            console.log(err);

        }
    }


    async function addConversation(){
        console.log("Button click...");
        
        try {
            const newConversation = await conversationService.addConversation({title: "New Conversation"});

            setConversations(prev => [...prev,newConversation]);
            setSelectedConversation(newConversation);
            setMessages([])
        }
        catch(err){
            console.log(err);

        }
    }





    return (
        <div className="Home">
           <h2>Conversation</h2>

           <button className="new-conversation-btn" onClick={addConversation}> How can i help you 🙏</button>

           <div className="conversation-list">
            {conversations.map(conversation => (

                <div key={conversation._id} className={selectedConversation?._id === conversation._id
                    ? "conversation-item selected" : "conversation-item"
                }
                onClick={()=> selectConversation(conversation)}
                >
                    <h3>{conversation.title}</h3>
                </div>
             ))}

           </div>
             {selectedConversation && (

                <div className="selected-conversation">

                    <h2>{selectedConversation.title}</h2>

                    <div className="messages">

                        {messages.map(message => (
                            <div 
                                key={message._id}
                                className= {message.role == "user" ? "message user-message" : "message assistant-message"}
                            >
                                <span className="icon">
                                    {message.role === "user" ? "👤" : "🤖"}

                                </span>
                                <p>{message.content}</p>

                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>

                    </div>

                   <div className="send-area">
                        <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder="Write your message"/>

                        <button onClick={sendMessage}>Send</button>
                   </div>
                </div>
             )}
        </div>

    );
}
