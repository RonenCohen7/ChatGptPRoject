import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../../PageArea/Home/Home";
import { About } from "../../About/About";

export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
