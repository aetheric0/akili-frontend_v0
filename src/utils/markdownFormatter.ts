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
      .replace(/\[object Object\]/g, '');


  const html = await marked.parse(cleaned); // await handles both string or Promise<string>
  return DOMPurify.sanitize(html);
};

export default formatMarkdownToHTML;