import {
  about,
  caseStudies,
  localNews,
  membershipTiers,
  newsArticles,
  siteMeta,
  whatIsDrm,
  type PostBlock,
} from "@/lib/content";
import { getGlobalNews } from "@/lib/global-news";

export type SearchResult = {
  title: string;
  href: string;
  kind: "Page" | "Local news" | "Global news";
  snippet: string;
  date?: string;
};

type Entry = Omit<SearchResult, "snippet"> & { text: string };

// [label](url), **bold** and *italic* markup → plain words.
const plain = (s: string) =>
  s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");

// Every string inside a value (objects, arrays, post blocks), joined.
function words(value: unknown): string {
  if (typeof value === "string") return plain(value);
  if (Array.isArray(value)) return value.map(words).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(words).join(" ");
  return "";
}

const blocksText = (blocks: PostBlock[]) =>
  words(blocks.map((b) => (typeof b === "object" && "figure" in b ? b.alt : typeof b === "object" && "split" in b ? b.split : b)));

const pages: Entry[] = [
  { title: "Home", href: "/", kind: "Page", text: words([siteMeta.tagline, siteMeta.fullName, caseStudies]) },
  { title: "What is DRM", href: "/what-is-drm", kind: "Page", text: words(whatIsDrm) },
  { title: "Membership", href: "/membership", kind: "Page", text: words(membershipTiers) },
  { title: "About Us", href: "/about-us", kind: "Page", text: words(about) },
  { title: "News", href: "/news", kind: "Page", text: "Local DRM news from South Africa and global Digital Radio Mondiale news" },
  {
    title: "Contact",
    href: "/contact",
    kind: "Page",
    text: `Contact us email phone ${siteMeta.email} ${siteMeta.phone} membership demonstrations partnerships`,
  },
  { title: "Privacy Policy", href: "/privacy", kind: "Page", text: "Privacy policy personal information data POPIA" },
];

const local: Entry[] = newsArticles.map((a): Entry => {
  const post = localNews.find((p) => p.slug === a.slug);
  return {
    title: a.title,
    href: `/news/local/${a.slug}`,
    kind: "Local news",
    date: a.date,
    text: [a.excerpt, words(a.body), post ? blocksText(post.body) : "", a.tag, ...(a.tags || [])].join(" "),
  };
});

const normalise = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function snippet(text: string, terms: string[]) {
  const clean = text.replace(/\s+/g, " ").trim();
  const lower = normalise(clean);
  const at = Math.min(...terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0), clean.length);
  if (at >= clean.length) return clean.slice(0, 160) + (clean.length > 160 ? "…" : "");
  const start = Math.max(0, clean.lastIndexOf(" ", Math.max(0, at - 60)));
  const end = Math.min(clean.length, start + 180);
  return (start > 0 ? "…" : "") + clean.slice(start, end).trim() + (end < clean.length ? "…" : "");
}

export async function search(query: string, limit = 12): Promise<SearchResult[]> {
  const terms = normalise(query).split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];

  const global: Entry[] = (await getGlobalNews()).map((g): Entry => ({
    title: g.title,
    href: `/news/global/${g.slug}`,
    kind: "Global news",
    date: g.date,
    text: `${g.summary} ${g.tag}`,
  }));

  return [...pages, ...local, ...global]
    .map((entry) => {
      const title = normalise(entry.title);
      const text = normalise(entry.text);
      // Every term must appear somewhere; title hits count most.
      if (!terms.every((t) => title.includes(t) || text.includes(t))) return null;
      const score = terms.reduce((s, t) => s + (title.includes(t) ? 10 : 0) + Math.min(text.split(t).length - 1, 5), 0);
      return { entry, score };
    })
    .filter((r): r is { entry: Entry; score: number } => r !== null)
    .sort((a, b) => b.score - a.score || (b.entry.date || "").localeCompare(a.entry.date || ""))
    .slice(0, limit)
    .map(({ entry }) => ({
      title: entry.title,
      href: entry.href,
      kind: entry.kind,
      date: entry.date,
      snippet: snippet(entry.text, terms),
    }));
}
