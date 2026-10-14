import Link from "next/link";
import Image from "next/image";
import styles from "./news.module.css";

type Props = {
  href: string;
  title: string;
  date: string;
  tag: string;
  excerpt?: string;
  image?: string;
};

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
}

export default function NewsCard({ href, title, date, tag, excerpt, image }: Props) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.cardImg}>
        <Image
          src={image || "/images/hero-radios.jpg"}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px"
          className={`${styles.cover} ${image && /member-|partners\/|news\/(hot1027|lsofsa)\./.test(image) ? styles.logoFit : ""}`}
        />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.meta}>
          <span className={styles.tag}>{tag}</span>
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
        <span className={styles.more}>Read article →</span>
      </div>
    </Link>
  );
}

export function NewsGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
