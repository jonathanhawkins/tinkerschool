import { getAllPosts } from "@/lib/blog/posts";

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = "https://tinkerschool.ai";

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TinkerSchool Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Expert guides on homeschooling, afterschooling, STEM activities, AI-powered learning, and hands-on education for kids ages 5-12.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <copyright>Copyright ${new Date().getFullYear()} TinkerSchool. Open Source.</copyright>
    <image>
      <url>${baseUrl}/images/chip.png</url>
      <title>TinkerSchool Blog</title>
      <link>${baseUrl}/blog</link>
    </image>${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
