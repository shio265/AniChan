import { getLocalizedMessage } from '../utils/localizations.js';

type ReplyableInteraction = {
    locale: string;
    replied: boolean;
    deferred: boolean;
    editReply(message: string): Promise<unknown>;
    reply(message: string): Promise<unknown>;
};

export async function handleInteractionError(
    error: unknown,
    interaction: ReplyableInteraction,
    messageKey = 'error_reply',
): Promise<void> {
    console.error(getLocalizedMessage('global', 'error'), error);

    const errorMessage = getLocalizedMessage('global', messageKey, interaction.locale);
    try {
        if (interaction.replied || interaction.deferred) {
            await interaction.editReply(errorMessage);
            return;
        }

        await interaction.reply(errorMessage);
    } catch (replyError) {
        console.error(getLocalizedMessage('global', 'error'), replyError);
    }
}
