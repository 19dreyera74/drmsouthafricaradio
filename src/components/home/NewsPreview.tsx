import Link from "next/link";
import styles from "./NewsPreview.module.css";
import Reveal from "@/components/Reveal";
import NewsCard, { NewsGrid } from "@/components/news/NewsCard";
import { newsArticles } from "@/lib/content";

export default function NewsPreview() {
  const latest = newsArticles.slice(0, 3);
  return (
    <section className={styles.section}>
      <div className="wrap">
        <Reveal as="div" className={styles.head}>
          <h2 className={styles.title}>From the newsroom</h2>
          <Link href="/news" className={styles.link}>
            All news →
          </Link>
        </Reveal>
        <NewsGrid>
          {latest.map((a) => (
            <NewsCard key={a.slug} href={`/news/local/${a.slug}`} title={a.title} date={a.date} tag={a.tag} excerpt={a.excerpt} image={a.image} />
          ))}
        </NewsGrid>
      </div>
    </section>
  );
}
