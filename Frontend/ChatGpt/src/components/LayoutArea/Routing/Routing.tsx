import { Route, Routes } from "react-router-dom";
import { Home } from "../../PageArea/Home/Home";
import { About } from "../../About/About";
import { Page404 } from "../../PageArea/Page404/Page404";

export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            <Route path="*" element= {<Page404 />} />
                
        </Routes>
    );
}
