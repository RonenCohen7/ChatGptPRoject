import "./About.css";

export function About() {
    return (
        <div className="About">
            <div className="about-card">

                <div className="about-badge">🤖 Full Stack AI Project</div>

                <h1>About ChatGPT</h1>

                <p>
                    This project is a full stack ChatGPT web application.
                    The user can create conversations, send messages,
                    and receive answers from OpenAI through a Python FastAPI backend.
                </p>

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