import "./About.css";
import { useTitle } from "../../Utils/UseTitle";

export function About() {
    useTitle("About");

    return (
        <div className="About">
            <div className="about-card">

                <div className="about-badge">🤖 Full Stack AI Project</div>

                <h1>About ChatGPT</h1>

                <p>
                    This project is a full stack ChatGPT web application.
                    The user can create conversations, send messages,
                    and receive answers from OpenAI through a Python FastAPI backend.
                    The assistant can also generate images and videos when requested in chat.
                </p>

                <div className="about-section">
                    <h2>Features</h2>
                    <p>
                        Text chat with GPT-4o-mini • AI image generation (gpt-image-1) •
                        AI video generation (Sora) • Conversation history in MongoDB •
                        Media messages with image and video display
                    </p>
                </div>

                <div className="about-section">
                    <h2>Technologies</h2>
                    <p>
                        React • TypeScript • Python • FastAPI • MongoDB • REST API • OpenAI API
                    </p>
                </div>

                <div className="about-section">
                    <h2>Developer</h2>
                    <p>Developed by Ronen Cohen 👨‍💻</p>
                </div>

            </div>
        </div>
    );
}