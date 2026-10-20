import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/news/Breadcrumbs";
import NewsCard, { NewsGrid, formatDate } from "@/components/news/NewsCard";
import PostBody from "@/components/news/PostBody";
import { articleTags, localNews, newsArticles } from "@/lib/content";
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
      tags: articleTags(a),
      images: a.image ? [a.image] : ["/images/hero-radios.jpg"],
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.excerpt },
  };
}

export default async function LocalArticle({ params }: Props) {
  const { slug } = await params;
  const a = newsArticles.find((x) => x.slug === slug);
  if (!a) notFound();

  const post = localNews.find((x) => x.slug === a.slug);
  const related = newsArticles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const heroImage = post?.image || a.image;
  const showHero = Boolean(heroImage) && !post?.noHero;
  const tags = articleTags(a);
  const isLogo = post?.imageFit === "contain" || (heroImage ? /member-|partners\//.test(heroImage) : false);
  const video = post?.video || a.video;
  const gallery = post?.gallery || a.gallery;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    dateModified: a.date,
    articleSection: a.tag,
    keywords: [...articleTags(a), ...(localNews.find((x) => x.slug === a.slug)?.hashtags || [])].join(", "),
    image: [absolute(heroImage || "/images/hero-radios.jpg")],
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
            {tags.map((t) => (
              <Link key={t} href={`/news/local?tag=${encodeURIComponent(t)}`} className={styles.articleTag}>
                {t}
              </Link>
            ))}
            <time dateTime={a.date}>{formatDate(a.date)}</time>
            <span>DRM SA Group</span>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <div className={`wrap ${styles.article}`}>
          {showHero && heroImage && (
            <div className={styles.articleHero}>
              <Image src={heroImage} alt={a.title} fill priority sizes="(max-width: 860px) 100vw, 820px" className={isLogo ? styles.articleHeroContain : styles.img} />
            </div>
          )}
          {post ? (
            <PostBody blocks={post.body} className={styles.articleBody} />
          ) : (
            <div className={styles.articleBody}>
              {a.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          {post?.hashtags && (
            <p className={styles.hashtags}>
              {post.hashtags.map((h) => (
                <span key={h}>#{h}</span>
              ))}
            </p>
          )}
          {gallery && (
            <>
              {post?.galleryTitle && <h2 className={styles.galleryTitle}>{post.galleryTitle}</h2>}
              <div className={styles.gallery}>
                {gallery.map((src) => (
                  <a className={styles.galleryItem} key={src} href={src} target="_blank" rel="noreferrer">
                    <Image src={src} alt="" fill sizes="(max-width: 700px) 50vw, 270px" className={styles.img} />
                  </a>
                ))}
              </div>
            </>
          )}
          <div className={styles.actions}>
            {video && (
              <a href={video} target="_blank" rel="noreferrer" className={styles.btn}>Watch the demonstration</a>
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
