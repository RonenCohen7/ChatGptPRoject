import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { detectLanguage, t } from "./Locale";

class Notify {

    private notyf = new Notyf({
        position: { x: "center", y: "top" },
        duration: 3000,
        dismissible: true,
        ripple: true,
    });

    public success(message: string): void {
        this.notyf.success(message);
    }

    public error(err: unknown): void {
        const message = this.extractErrorMessage(err);
        this.notyf.error(message);
    }

    private extractErrorMessage(err: unknown): string {
        if (typeof err === "string") return err;

        if (err && typeof err === "object") {
            const axiosLike = err as {
                response?: { data?: unknown };
                message?: string;
            };

            if (typeof axiosLike.response?.data === "string") {
                return axiosLike.response.data;
            }

            const data = axiosLike.response?.data;
            if (data && typeof data === "object" && "message" in data) {
                const message = (data as { message?: unknown }).message;
                if (typeof message === "string") return message;
            }

            if (typeof axiosLike.message === "string") return axiosLike.message;
        }

        return t("genericError", detectLanguage(navigator.language));
    }
}

export const notify = new Notify();
