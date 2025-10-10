import { marked } from "marked";
import DOMPurify from "dompurify";

marked.use({
  breaks: true,
  renderer: {
    heading(text) {
      return `<h2>${text}</h2>`; // no auto IDs
    },
  },
});

const formatMarkdownToHTML = async (text: string): Promise<string> => {
    const cleaned = text
      .replace(/\[object Object\]/g, '')
      .replace(/(#+)([A-Za-z])/g, "$1 $2");


  const html = await marked.parse(cleaned); // await handles both string or Promise<string>
  return DOMPurify.sanitize(html);
};

export default formatMarkdownToHTML;