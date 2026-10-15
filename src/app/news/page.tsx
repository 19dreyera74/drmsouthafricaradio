import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/news/Breadcrumbs";
import NewsCard, { NewsGrid } from "@/components/news/NewsCard";
import { newsArticles } from "@/lib/content";
import { getGlobalNews } from "@/lib/global-news";
import styles from "./page.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "DRM News – Local and Global Digital Radio News",
  description:
    "Local DRM news from South Africa and global Digital Radio Mondiale news from the DRM Consortium: demonstrations, partnerships, regulation and events.",
  alternates: { canonical: "/news" },
  openGraph: { title: "DRM News – Local and Global", url: "/news", images: ["/images/ibc-booth.jpg"] },
};

const ibc = ["ibc-booth", "ibc-2", "ibc-3", "ibc-6", "ibc-4", "ibc-8"];

export default async function NewsPage() {
  const global = (await getGlobalNews()).slice(0, 6);
  const local = newsArticles.slice(0, 6);

  return (
    <main>
      <PageHero
        title="DRM news, local and global"
        sub="What DRM SA is doing in South Africa, and what is happening with Digital Radio Mondiale around the world."
        image="/images/ibc-booth.jpg"
      />

      <div className={`wrap ${styles.crumbBar}`}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News" }]} />
      </div>

      <section className={styles.sectionAfterCrumbs} id="local">
        <div className="wrap">
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>Local News</h2>
              <p className={styles.sectionSub}>Demonstrations, partnerships and regulatory milestones from DRM SA.</p>
            </div>
            <Link href="/news/local" className={styles.allLink}>All local news →</Link>
          </div>
          <NewsGrid>
            {local.map((a) => (
              <NewsCard key={a.slug} href={`/news/local/${a.slug}`} title={a.title} date={a.date} tag={a.tag} excerpt={a.excerpt} image={a.image} />
            ))}
          </NewsGrid>
        </div>
      </section>

      <section className={styles.sectionAlt} id="global">
        <div className="wrap">
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>Global News</h2>
              <p className={styles.sectionSub}>The latest from the DRM Consortium, updated automatically from drm.org.</p>
            </div>
            <Link href="/news/global" className={styles.allLink}>All global news →</Link>
          </div>
          {global.length ? (
            <NewsGrid>
              {global.map((g) => (
                <NewsCard key={g.slug} href={`/news/global/${g.slug}`} title={g.title} date={g.date} tag={g.tag} excerpt={g.summary} image={g.image} />
              ))}
            </NewsGrid>
          ) : (
            <p className={styles.empty}>Global news is temporarily unavailable. Visit drm.org for the latest.</p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className="wrap">
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>On the exhibition floor</h2>
              <p className={styles.sectionSub}>
                The DRM stand at IBC, the international broadcast exhibition: live demonstrations,
                receiver launches and the people building digital radio.
              </p>
            </div>
          </div>
          <div className={styles.ibcGrid}>
            {ibc.map((name, i) => (
              <Reveal key={name} delay={i * 60} variant="scale" className={styles.ibcItem}>
                <Image src={`/images/${name}.jpg`} alt="DRM stand at the IBC broadcast exhibition" fill sizes="(max-width: 760px) 50vw, 400px" className={styles.img} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
