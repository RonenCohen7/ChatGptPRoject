import { NavLink } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import { HiHome, HiInformationCircle } from "react-icons/hi2";
import "./Menu.css";

export function Menu() {
    return (
        <nav className="Menu">
            <span className="brand" data-tooltip="ChatGPT">
                <RiRobot2Line />
            </span>

            <div className="links">
                <NavLink to="/" end className="menu-link" data-tooltip="Home">
                    <HiHome />
                </NavLink>
                <NavLink to="/about" className="menu-link" data-tooltip="About">
                    <HiInformationCircle />
                </NavLink>
            </div>
        </nav>
    );
}
