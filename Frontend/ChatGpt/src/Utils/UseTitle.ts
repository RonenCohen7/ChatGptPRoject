import { useEffect } from "react";

export function useTitle(titleText: string): void {
    useEffect(() => {
        document.title = titleText;
    }, [titleText]);
}
