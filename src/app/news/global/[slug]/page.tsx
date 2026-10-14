import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/news/Breadcrumbs";
import NewsCard, { NewsGrid, formatDate } from "@/components/news/NewsCard";
import { getGlobalItem, getGlobalNews } from "@/lib/global-news";
import styles from "../../page.module.css";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getGlobalNews()).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = await getGlobalItem(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.summary,
    // Full article lives on drm.org; point search engines at the original.
    alternates: { canonical: g.link },
    openGraph: { type: "article", title: g.title, description: g.summary, url: `/news/global/${g.slug}`, publishedTime: g.date, images: g.image ? [g.image] : ["/images/hero-radios.jpg"] },
  };
}

export default async function GlobalArticle({ params }: Props) {
  const { slug } = await params;
  const g = await getGlobalItem(slug);
  if (!g) notFound();
  const related = (await getGlobalNews()).filter((x) => x.slug !== g.slug).slice(0, 3);

  return (
    <main>
      <header className={styles.header}>
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "News", href: "/news" },
              { label: "Global News", href: "/news/global" },
              { label: g.tag, href: "/news/global" },
              { label: g.title },
            ]}
          />
          <h1 className={styles.title}>{g.title}</h1>
          <div className={styles.articleMeta}>
            <span className={styles.articleTag}>{g.tag}</span>
            <time dateTime={g.date}>{formatDate(g.date)}</time>
            <span>DRM Consortium</span>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <div className={`wrap ${styles.article}`}>
          {g.image && (
            <div className={styles.articleHero}>
              <Image src={g.image} alt={g.title} fill priority sizes="(max-width: 860px) 100vw, 820px" className={styles.articleHeroContain} />
            </div>
          )}
          <div className={styles.articleBody}>
            <p>{g.summary}</p>
          </div>
          <div className={styles.actions}>
            <a href={g.link} target="_blank" rel="noopener" className={styles.btn}>Read the full article on drm.org</a>
            <Link href="/news/global" className={styles.btnGhost}>← All global news</Link>
          </div>
          <p className={styles.source}>Source: DRM Consortium, drm.org</p>
        </div>
      </section>

      {related.length > 0 && (
        <section className={styles.sectionAlt}>
          <div className="wrap">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>More global news</h2>
            </div>
            <NewsGrid>
              {related.map((r) => (
                <NewsCard key={r.slug} href={`/news/global/${r.slug}`} title={r.title} date={r.date} tag={r.tag} excerpt={r.summary} image={r.image} />
              ))}
            </NewsGrid>
          </div>
        </section>
      )}
    </main>
  );
}
