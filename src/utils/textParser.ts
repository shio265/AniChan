export function parseHtmlText(text?: string | null, maxLength: number | null = null): string {
    if (!text) return '';
    
    let cleaned = text;
    
    // Replace <br> tags with newlines
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    
    // Replace </p> and </div> with double newlines for paragraph separation
    cleaned = cleaned.replace(/<\/(p|div)>/gi, '\n\n');
    
    // Remove all other HTML tags
    cleaned = cleaned.replace(/<[^>]+>/g, '');
    
    // Decode HTML entities
    cleaned = cleaned
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec))
        .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCharCode(parseInt(hex, 16)));
    
    // Remove excessive newlines (more than 2 consecutive)
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    // Trim whitespace
    cleaned = cleaned.trim();
    
    // Truncate if maxLength is specified
    if (maxLength && cleaned.length > maxLength) {
        cleaned = cleaned.slice(0, maxLength).trim();
        // Try to cut at the last complete sentence or word
        const lastPeriod = cleaned.lastIndexOf('.');
        const lastSpace = cleaned.lastIndexOf(' ');
        
        if (lastPeriod > maxLength * 0.8) {
            cleaned = cleaned.slice(0, lastPeriod + 1);
        } else if (lastSpace > maxLength * 0.8) {
            cleaned = cleaned.slice(0, lastSpace);
        }
        
        cleaned += '...';
    }
    
    return cleaned;
}
