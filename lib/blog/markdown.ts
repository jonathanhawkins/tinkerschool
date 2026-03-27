/**
 * Lightweight markdown-to-HTML converter.
 *
 * Handles the basics: headings, paragraphs, bold, italic, links, lists,
 * code blocks, and inline code. Not a full spec implementation -- just
 * enough for simple blog posts.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sanitize a URL for use in an href attribute.
 * Only allows http:, https:, and mailto: protocols. Rejects javascript:,
 * data:, vbscript:, and other dangerous schemes to prevent XSS.
 */
function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  // Reject empty or whitespace-only URLs
  if (!trimmed) return "";
  // Check for safe protocols (case-insensitive)
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("/") ||
    lower.startsWith("#")
  ) {
    return escapeHtml(trimmed);
  }
  // Block everything else (javascript:, data:, vbscript:, etc.)
  return "";
}

function processInline(line: string): string {
  // First, escape all HTML in the raw text to prevent XSS injection.
  // Then selectively re-introduce safe markdown-derived HTML elements.
  line = escapeHtml(line);

  // Inline code (must run before bold/italic to avoid conflicts inside backticks)
  line = line.replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>');

  // Bold
  line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic (single asterisk, but not inside a word boundary like a*b*c)
  line = line.replace(/(?<!\w)\*(.+?)\*(?!\w)/g, "<em>$1</em>");

  // Links -- sanitize the URL to prevent javascript: and other dangerous schemes
  line = line.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, text: string, url: string) => {
      const safeUrl = sanitizeUrl(url);
      if (!safeUrl) return text; // Strip the link, keep the text
      return `<a href="${safeUrl}" class="blog-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
  );

  return line;
}

export function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const htmlParts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      i++; // skip closing ```
      const langAttr = lang ? ` data-language="${escapeHtml(lang)}"` : "";
      htmlParts.push(
        `<pre class="blog-code-block"${langAttr}><code>${codeLines.join("\n")}</code></pre>`
      );
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      htmlParts.push(
        `<h3 class="blog-h3">${processInline(line.slice(4))}</h3>`
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      htmlParts.push(
        `<h2 class="blog-h2">${processInline(line.slice(3))}</h2>`
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(`<li>${processInline(lines[i].slice(2))}</li>`);
        i++;
      }
      htmlParts.push(`<ul class="blog-ul">${items.join("")}</ul>`);
      continue;
    }

    // Ordered list
    const orderedMatch = line.match(/^\d+\.\s/);
    if (orderedMatch) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          `<li>${processInline(lines[i].replace(/^\d+\.\s/, ""))}</li>`
        );
        i++;
      }
      htmlParts.push(`<ol class="blog-ol">${items.join("")}</ol>`);
      continue;
    }

    // Blank line -- skip
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph -- collect consecutive non-empty, non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ") &&
      !lines[i].startsWith("- ") &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      htmlParts.push(
        `<p class="blog-p">${processInline(paraLines.join(" "))}</p>`
      );
    }
  }

  return htmlParts.join("\n");
}
