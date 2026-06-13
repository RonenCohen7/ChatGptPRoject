import { useNavigate } from "react-router-dom";
import "./Page404.css";
import { useTitle } from "../../../Utils/UseTitle";

export function Page404() {
    useTitle("404 - Page Not Found");

    const navigate = useNavigate();

    return (
        <div className="Page404">

            <div className="error-card">

                <div className="error-icon">🤖</div>

                <h1>404</h1>

                <h2>Page Not Found</h2>

                <br></br>

                <p>
                    The page you are looking for doesn't exist
                    or has been moved.
                </p>

                <br></br>

                <button
                    className="home-btn"
                    onClick={() => navigate("/")}
                >
                    🏠
                </button>

            </div>

        </div>
    );
}