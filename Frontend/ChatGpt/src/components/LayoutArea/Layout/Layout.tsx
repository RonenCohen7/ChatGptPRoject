import "./Layout.css";
import { Menu } from "../Menu/Menu";
import { Routing } from "../Routing/Routing";

export function Layout() {
    return (
        <div className="Layout">
            <header>
                <Menu />
            </header>

            <main>
                <Routing />
            </main>
        </div>
    );
}
