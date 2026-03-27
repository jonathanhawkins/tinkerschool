import { describe, it, expect } from "vitest";

import { markdownToHtml } from "./markdown";

// ---------------------------------------------------------------------------
// XSS Prevention Tests
// ---------------------------------------------------------------------------

describe("markdownToHtml — XSS prevention", () => {
  it("escapes HTML tags in paragraph text", () => {
    const result = markdownToHtml('<script>alert("xss")</script>');
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });

  it("escapes HTML tags in heading text", () => {
    const result = markdownToHtml('## <img src=x onerror=alert(1)>');
    expect(result).not.toContain("<img");
    expect(result).toContain("&lt;img");
  });

  it("escapes HTML tags in list items", () => {
    const result = markdownToHtml('- <div onmouseover="alert(1)">hover me</div>');
    expect(result).not.toContain("<div");
    expect(result).toContain("&lt;div");
  });

  it("escapes HTML in ordered list items", () => {
    const result = markdownToHtml('1. <iframe src="evil.com"></iframe>');
    expect(result).not.toContain("<iframe");
    expect(result).toContain("&lt;iframe");
  });

  it("blocks javascript: URLs in links", () => {
    // eslint-disable-next-line no-script-url
    const result = markdownToHtml("[click me](javascript:alert(1))");
    expect(result).not.toContain("javascript:");
    // The link text should still be present but without the dangerous href
    expect(result).toContain("click me");
  });

  it("blocks data: URLs in links", () => {
    const result = markdownToHtml(
      "[click](data:text/html,<script>alert(1)</script>)",
    );
    expect(result).not.toContain("data:");
    expect(result).toContain("click");
  });

  it("blocks vbscript: URLs in links", () => {
    const result = markdownToHtml("[click](vbscript:MsgBox)");
    expect(result).not.toContain("vbscript:");
  });

  it("allows safe https links", () => {
    const result = markdownToHtml("[Google](https://google.com)");
    expect(result).toContain('href="https://google.com"');
    expect(result).toContain("Google");
  });

  it("allows safe http links", () => {
    const result = markdownToHtml("[Site](http://example.com)");
    expect(result).toContain('href="http://example.com"');
  });

  it("allows mailto: links", () => {
    const result = markdownToHtml("[email](mailto:test@example.com)");
    expect(result).toContain('href="mailto:test@example.com"');
  });

  it("allows relative links starting with /", () => {
    const result = markdownToHtml("[about](/about)");
    expect(result).toContain('href="/about"');
  });

  it("allows anchor links starting with #", () => {
    const result = markdownToHtml("[section](#section-1)");
    expect(result).toContain('href="#section-1"');
  });

  it("escapes special characters in link URLs", () => {
    const result = markdownToHtml("[link](https://example.com/path?q=test&x=1)");
    // Ampersand should be escaped in the href attribute
    expect(result).toContain("&amp;");
  });

  it("escapes HTML in code blocks", () => {
    const md = '```\n<script>alert("xss")</script>\n```';
    const result = markdownToHtml(md);
    expect(result).not.toContain("<script>alert");
    expect(result).toContain("&lt;script&gt;");
  });

  it("escapes HTML in inline code", () => {
    const result = markdownToHtml('Use `<script>` tags');
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });
});

// ---------------------------------------------------------------------------
// Basic Rendering Tests
// ---------------------------------------------------------------------------

describe("markdownToHtml — basic rendering", () => {
  it("renders paragraphs", () => {
    const result = markdownToHtml("Hello world");
    expect(result).toContain("<p");
    expect(result).toContain("Hello world");
  });

  it("renders h2 headings", () => {
    const result = markdownToHtml("## My Heading");
    expect(result).toContain("<h2");
    expect(result).toContain("My Heading");
  });

  it("renders h3 headings", () => {
    const result = markdownToHtml("### Sub Heading");
    expect(result).toContain("<h3");
    expect(result).toContain("Sub Heading");
  });

  it("renders bold text", () => {
    const result = markdownToHtml("This is **bold** text");
    expect(result).toContain("<strong>bold</strong>");
  });

  it("renders italic text", () => {
    const result = markdownToHtml("This is *italic* text");
    expect(result).toContain("<em>italic</em>");
  });

  it("renders unordered lists", () => {
    const result = markdownToHtml("- item one\n- item two");
    expect(result).toContain("<ul");
    expect(result).toContain("<li>item one</li>");
    expect(result).toContain("<li>item two</li>");
  });

  it("renders ordered lists", () => {
    const result = markdownToHtml("1. first\n2. second");
    expect(result).toContain("<ol");
    expect(result).toContain("<li>first</li>");
    expect(result).toContain("<li>second</li>");
  });

  it("renders code blocks with language", () => {
    const result = markdownToHtml("```python\nprint('hi')\n```");
    expect(result).toContain("blog-code-block");
    expect(result).toContain('data-language="python"');
    // Code block content uses escapeHtml which escapes < > & " but not single quotes
    expect(result).toContain("print('hi')");
  });

  it("adds target=_blank and rel=noopener to links", () => {
    const result = markdownToHtml("[link](https://example.com)");
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
  });
});
