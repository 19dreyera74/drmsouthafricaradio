import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/news/Breadcrumbs";
import NewsCard, { NewsGrid, formatDate } from "@/components/news/NewsCard";
import { newsArticles } from "@/lib/content";
import { SITE_NAME, absolute } from "@/lib/site";
import styles from "../../page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return newsArticles.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = newsArticles.find((x) => x.slug === slug);
  if (!a) return {};
  const url = `/news/local/${a.slug}`;
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.excerpt,
      url,
      publishedTime: a.date,
      section: a.tag,
      images: a.image ? [a.image] : ["/images/hero-radios.jpg"],
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.excerpt },
  };
}

export default async function LocalArticle({ params }: Props) {
  const { slug } = await params;
  const a = newsArticles.find((x) => x.slug === slug);
  if (!a) notFound();

  const related = newsArticles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const isLogo = a.image ? /member-|partners\//.test(a.image) : false;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    dateModified: a.date,
    articleSection: a.tag,
    image: [absolute(a.image || "/images/hero-radios.jpg")],
    mainEntityOfPage: absolute(`/news/local/${a.slug}`),
    author: { "@type": "Organization", name: SITE_NAME, url: absolute("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absolute("/images/logo-transparent.png") } },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className={styles.header}>
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "News", href: "/news" },
              { label: "Local News", href: "/news/local" },
              { label: a.tag, href: `/news/local?tag=${encodeURIComponent(a.tag)}` },
              { label: a.title },
            ]}
          />
          <h1 className={styles.title}>{a.title}</h1>
          <div className={styles.articleMeta}>
            <span className={styles.articleTag}>{a.tag}</span>
            <time dateTime={a.date}>{formatDate(a.date)}</time>
            <span>DRM SA Group</span>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <div className={`wrap ${styles.article}`}>
          {a.image && (
            <div className={styles.articleHero}>
              <Image src={a.image} alt={a.title} fill priority sizes="(max-width: 860px) 100vw, 820px" className={isLogo ? styles.articleHeroContain : styles.img} />
            </div>
          )}
          <div className={styles.articleBody}>
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {a.gallery && (
            <div className={styles.gallery}>
              {a.gallery.map((src) => (
                <div className={styles.galleryItem} key={src}>
                  <Image src={src} alt="" fill sizes="270px" className={styles.img} />
                </div>
              ))}
            </div>
          )}
          <div className={styles.actions}>
            {a.video && (
              <a href={a.video} target="_blank" rel="noreferrer" className={styles.btn}>Watch the demonstration</a>
            )}
            <Link href="/news/local" className={styles.btnGhost}>← All local news</Link>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="wrap">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>More local news</h2>
          </div>
          <NewsGrid>
            {related.map((r) => (
              <NewsCard key={r.slug} href={`/news/local/${r.slug}`} title={r.title} date={r.date} tag={r.tag} excerpt={r.excerpt} image={r.image} />
            ))}
          </NewsGrid>
        </div>
      </section>
    </main>
  );
}
