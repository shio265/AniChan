type TitledMedia = {
    title?: {
        romaji?: string | null;
    } | null;
};

function normalizeMediaTitle(title: string): string {
    return title.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
}

export function uniqueMediaTitles(media: TitledMedia[], fallback: string): string[] {
    const titles = new Map<string, string>();

    for (const item of media) {
        const title = item.title?.romaji?.trim() || fallback;
        const key = normalizeMediaTitle(title);

        if (!titles.has(key)) {
            titles.set(key, title);
        }
    }

    return [...titles.values()];
}
