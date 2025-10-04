const formatMarkdownToHTML = (text: string): string => {
    // 1. Convert newlines to <br> tags
    let html = text.replace(/\n/g, '<br>');

    // 2. Convert **bold** and *italic* syntax to HTML tags
    // Bold: finds text between **...**
    html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    // Italic: finds text between *...*
    html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');

    // 3. Handle list items (simple simulation for list-like text)
    // Removed unnecessary escape character (\-) for cleaner regex.
    html = html.replace(/(\d+\. |\* | - )/g, '<span style="display:inline-block; width: 1.5rem;"></span>$1');

    return html;
};
export default formatMarkdownToHTML;