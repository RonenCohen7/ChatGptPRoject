export type AppLanguage = "he" | "en";

export function isHebrew(text: string): boolean {
    return /[\u0590-\u05FF]/.test(text);
}

export function detectLanguage(...texts: (string | undefined)[]): AppLanguage {
    for (const text of texts) {
        if (!text) continue;

        if (isHebrew(text) || text.toLowerCase().startsWith("he")) {
            return "he";
        }
    }
    return "en";
}

const messages = {
    selectConversation: {
        he: "יש לבחור שיחה תחילה.",
        en: "Please select a conversation first.",
    },
    enterMessage: {
        he: "יש להזין הודעה.",
        en: "Please enter a message.",
    },
    generatingResponse: {
        he: "מייצר תגובה... (יצירת וידאו עשויה לקחת מספר דקות)",
        en: "Generating response... (video may take a few minutes)",
    },
    conversationDeleted: {
        he: "השיחה נמחקה",
        en: "Conversation deleted",
    },
    deleteConfirm: {
        he: (title: string) => `למחוק את "${title}"? לא ניתן לבטל.`,
        en: (title: string) => `Delete "${title}"? This cannot be undone.`,
    },
    genericError: {
        he: "אירעה שגיאה, נסה שוב.",
        en: "Some error, please try again.",
    },
} as const;

export function t<K extends keyof typeof messages>(
    key: K,
    lang: AppLanguage,
    ...args: (typeof messages)[K]["en"] extends (...a: infer A) => string ? A : []
): string {
    const entry = messages[key];
    const value = entry[lang];

    if (typeof value === "function") {
        return (value as (title: string) => string)(...(args as [string]));
    }

    return value;
}
