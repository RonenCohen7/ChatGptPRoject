import { useEffect, useRef, useState } from "react";
import "./Home.css";
import type { Conversation } from "../../../Models/ConversationModel";
import { conversationService } from "../../../Service/ConversationService";
import type { Message } from "../../../Models/MessageModel";
import { chatService } from "../../../Service/chatService";
import { useTitle } from "../../../Utils/UseTitle";
import { notify } from "../../../Utils/Notify";
import { appConfig } from "../../../Utils/AppConfig";
import gpt_home_image from "../../../assets/gpt_home_image.jpeg";
import { detectLanguage, t } from "../../../Utils/Locale";


export function Home() {
    useTitle("Home 🏠");

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        conversationService.getAllConversations()
            .then(data => setConversations(data))
            .catch(err => notify.error(err));
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!isLoading && selectedConversation) {
            inputRef.current?.focus();
        }
    }, [isLoading, selectedConversation]);

    function getUserLanguage() {
        const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content;
        return detectLanguage(content, lastUserMessage);
    }

    async function selectConversation(conversation: Conversation) {
        setSelectedConversation(conversation);

        try {
            const data = await chatService.getMessagesByConversation(conversation._id!);
            setMessages(data);
        } catch (err) {
            notify.error(err);
        }
    }

    async function sendMessage() {
        const lang = getUserLanguage();

        if (!selectedConversation) {
            notify.error(t("selectConversation", lang));
            return;
        }

        if (!content.trim()) {
            notify.error(t("enterMessage", lang));
            return;
        }

        if (isLoading) return;

        try {
            setIsLoading(true);
            const result = await chatService.sendMessage(
                selectedConversation._id!,
                content
            );

            setMessages(prev => [
                ...prev,
                result.user_message,
                result.assistant_message,
            ]);

            setContent("");
        } catch (err) {
            notify.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    function renderMessageContent(message: Message) {
        const contentType = message.content_type ?? "text";

        if (contentType === "image") {
            return (
                <img
                    src={`${appConfig.serverUrl}${message.content}`}
                    alt="Generated"
                    className="message-media"
                />
            );
        }

        if (contentType === "video") {
            return (
                <video
                    controls
                    src={`${appConfig.serverUrl}${message.content}`}
                    className="message-media"
                />
            );
        }

        return <p>{message.content}</p>;
    }

    async function addConversation() {
        try {
            const newConversation = await conversationService.addConversation({ title: "New Conversation" });

            setConversations(prev => [...prev, newConversation]);
            setSelectedConversation(newConversation);
            setMessages([]);
        } catch (err) {
            notify.error(err);
        }
    }

    async function deleteConversation(conversation: Conversation, event: React.MouseEvent) {
        event.stopPropagation();

        const lang = getUserLanguage();
        const confirmed = window.confirm(t("deleteConfirm", lang, conversation.title));
        if (!confirmed) return;

        try {
            await conversationService.deleteConversation(conversation._id!);

            setConversations(prev => prev.filter(c => c._id !== conversation._id));

            if (selectedConversation?._id === conversation._id) {
                setSelectedConversation(null);
                setMessages([]);
            }

            notify.success(t("conversationDeleted", lang));
        } catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="Home">
            <img src={gpt_home_image} alt="" className="gpt-home-image" aria-hidden="true" />
            <div className="home-content">
                <h2>Conversation</h2>

                <button type="button" className="new-conversation-btn" onClick={addConversation}>
                    <span className="new-conversation-label">I'm ready to chat 🙏 click here</span>
                </button>

                <div className="conversation-list">
                    {conversations.map(conversation => (
                        <div
                            key={conversation._id}
                            className={selectedConversation?._id === conversation._id
                                ? "conversation-item selected"
                                : "conversation-item"
                            }
                            onClick={() => selectConversation(conversation)}
                        >
                            <h3>{conversation.title}</h3>
                            <button
                                className="delete-conversation-btn"
                                title="Delete conversation"
                                onClick={(e) => deleteConversation(conversation, e)}
                            >
                                🗑️
                            </button>
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
                                    className={message.role === "user" ? "message user-message" : "message assistant-message"}
                                >
                                    <span className="icon">
                                        {message.role === "user" ? "👤" : "🤖"}
                                    </span>
                                    {renderMessageContent(message)}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="message assistant-message loading-message">
                                    <span className="icon">🤖</span>
                                    <p>{t("generatingResponse", getUserLanguage())}</p>
                                </div>
                            )}

                            <div ref={messagesEndRef}></div>
                        </div>

                        <div className="send-area">
                            <input
                                ref={inputRef}
                                type="text"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendMessage();
                                    }
                                }}
                                placeholder={getUserLanguage() === "he" ? "כתוב הודעה" : "Write your message"}
                                disabled={isLoading}
                            />

                            <button onClick={sendMessage} disabled={isLoading}>
                                {isLoading ? "..." : "Send"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
