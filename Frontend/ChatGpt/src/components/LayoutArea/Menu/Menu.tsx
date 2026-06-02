import { NavLink } from "react-router-dom";
import "./Menu.css";

export function Menu() {
    return (
        <nav className="Menu">
            <span className="brand">ChatGPT 🤖</span>

            <div className="links">
                <NavLink to="/" end>Home</NavLink>
                <NavLink to="/about">About</NavLink>
            </div>
        </nav>
    );
}
