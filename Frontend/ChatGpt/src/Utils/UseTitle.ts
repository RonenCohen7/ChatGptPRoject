import { useEffect } from "react";

// Custom Hook:
export function useTitle(titleText: string): void {
    useEffect(() => {
        document.title = titleText;
    }, []);
}

