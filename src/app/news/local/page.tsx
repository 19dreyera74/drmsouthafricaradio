import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/news/Breadcrumbs";
import NewsCard, { NewsGrid } from "@/components/news/NewsCard";
import { newsArticles, newsTags } from "@/lib/content";
import styles from "../page.module.css";

type Props = { searchParams: Promise<{ tag?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { tag } = await searchParams;
  const active = newsTags.find((t) => t === tag);
  return {
    title: active ? `${active} – Local DRM News South Africa` : "Local DRM News – Digital Radio in South Africa",
    description:
      "News from DRM SA Group: DRM demonstrations, partnerships, ICASA regulatory milestones and events across South Africa and Southern Africa.",
    alternates: { canonical: active ? `/news/local?tag=${encodeURIComponent(active)}` : "/news/local" },
  };
}

export default async function LocalNewsPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const active = newsTags.find((t) => t === tag);
  const items = active ? newsArticles.filter((a) => a.tag === active) : newsArticles;

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "News", href: "/news" },
    { label: "Local News", href: "/news/local" },
  ];
  if (active) crumbs.push({ label: active });

  return (
    <main>
      <header className={styles.header}>
        <div className="wrap">
          <Breadcrumbs items={crumbs} />
          <h1 className={styles.title}>{active ? `Local News: ${active}` : "Local News"}</h1>
          <p className={styles.sub}>DRM SA Group news from South Africa and the region.</p>
        </div>
      </header>

      <section className={styles.section}>
        <div className="wrap">
          <div className={styles.filters}>
            <Link href="/news/local" className={`${styles.filter} ${!active ? styles.filterActive : ""}`}>All</Link>
            {newsTags.map((t) => (
              <Link key={t} href={`/news/local?tag=${encodeURIComponent(t)}`} className={`${styles.filter} ${active === t ? styles.filterActive : ""}`}>
                {t}
              </Link>
            ))}
          </div>
          <NewsGrid>
            {items.map((a) => (
              <NewsCard key={a.slug} href={`/news/local/${a.slug}`} title={a.title} date={a.date} tag={a.tag} excerpt={a.excerpt} image={a.image} />
            ))}
          </NewsGrid>
        </div>
      </section>
    </main>
  );
}
