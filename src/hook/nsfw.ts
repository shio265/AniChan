import { isNSFWFilterEnabled } from '../utils/guildSettings.js';
import { getLocalizedMessage } from '../utils/localizations.js';

const NSFW_GENRES = ['Ecchi', 'Hentai'];

type NSFWReplyableInteraction = {
    guildId: string | null;
    locale: string;
    editReply(message: string): Promise<unknown>;
};

export function isNSFWBlocked(genres: string[] | null | undefined, guildId: string | null): boolean {
    if (!genres) return false;
    return isNSFWFilterEnabled(guildId ?? '') && genres.some(genre => NSFW_GENRES.includes(genre));
}

export async function replyNSFWBlocked(
    interaction: NSFWReplyableInteraction,
    genres: string[] | null | undefined,
    mediaName: string
): Promise<boolean> {
    if (!isNSFWBlocked(genres, interaction.guildId)) return false;

    const blockMessage = `**${getLocalizedMessage('global', 'nsfw_block', interaction.locale)} ${mediaName}**\n${getLocalizedMessage('global', 'nsfw_block_reason', interaction.locale)}`;
    await interaction.editReply(blockMessage);
    return true;
}
