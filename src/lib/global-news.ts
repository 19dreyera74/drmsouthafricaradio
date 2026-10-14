// Global news comes from the DRM Consortium's public RSS feed. We publish a
// summary page per item and point the canonical URL back to drm.org, so the
// original source keeps the search credit for the full article.
const FEED_URL = "https://www.drm.org/feed/";

export type GlobalItem = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  link: string;
  image?: string;
  tag: string;
};

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#8211;": "–",
  "&#8212;": "—",
  "&#8216;": "‘",
  "&#8217;": "’",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8230;": "…",
  "&nbsp;": " ",
};

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#?\w+;/g, (m) => ENTITIES[m] ?? (m.startsWith("&#") ? String.fromCharCode(Number(m.slice(2, -1))) : m));
}

function stripTags(s: string) {
  return decode(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function pick(block: string, tag: string) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1] : "";
}

function slugFromLink(link: string) {
  const parts = link.replace(/\/$/, "").split("/");
  return parts[parts.length - 1] || "item";
}

export async function getGlobalNews(): Promise<GlobalItem[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    return items.map((block) => {
      const link = decode(pick(block, "link")).trim();
      const content = pick(block, "content:encoded");
      const img = (decode(content).match(/<img[^>]+src="([^"]+)"/) || [])[1];
      const summary = stripTags(pick(block, "description"))
        .replace(/\s*The post .*$/, "")
        .replace(/\s*\[…\]\s*$/, "…");
      return {
        slug: slugFromLink(link),
        title: stripTags(pick(block, "title")),
        date: new Date(pick(block, "pubDate")).toISOString(),
        summary: summary.length > 320 ? summary.slice(0, 317).replace(/\s+\S*$/, "") + "…" : summary,
        link,
        image: img,
        tag: stripTags(pick(block, "category")) || "DRM Consortium",
      };
    });
  } catch {
    return [];
  }
}

export async function getGlobalItem(slug: string) {
  const items = await getGlobalNews();
  return items.find((i) => i.slug === slug);
}
