import type { Metadata } from "next";
import Breadcrumbs from "@/components/news/Breadcrumbs";
import NewsCard, { NewsGrid } from "@/components/news/NewsCard";
import { getGlobalNews } from "@/lib/global-news";
import styles from "../page.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Global DRM News – Digital Radio Mondiale Worldwide",
  description:
    "The latest Digital Radio Mondiale news from the DRM Consortium: broadcasts, receivers, emergency warning, policy and events around the world.",
  alternates: { canonical: "/news/global" },
};

export default async function GlobalNewsPage() {
  const items = await getGlobalNews();
  return (
    <main>
      <header className={styles.header}>
        <div className="wrap">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: "Global News" }]} />
          <h1 className={styles.title}>Global News</h1>
          <p className={styles.sub}>Digital Radio Mondiale news from the DRM Consortium, updated automatically from drm.org.</p>
        </div>
      </header>
      <section className={styles.section}>
        <div className="wrap">
          {items.length ? (
            <NewsGrid>
              {items.map((g) => (
                <NewsCard key={g.slug} href={`/news/global/${g.slug}`} title={g.title} date={g.date} tag={g.tag} excerpt={g.summary} image={g.image} />
              ))}
            </NewsGrid>
          ) : (
            <p className={styles.empty}>Global news is temporarily unavailable. Visit drm.org for the latest.</p>
          )}
        </div>
      </section>
    </main>
  );
}
