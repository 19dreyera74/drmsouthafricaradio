import Image from "next/image";
import styles from "./MemberWall.module.css";
import Reveal from "@/components/Reveal";
import { partners } from "@/lib/content";

// Continuous right-to-left logo strip. The list is rendered twice so the
// loop is seamless; the second copy is hidden from screen readers.
export default function MemberWall() {
  const row = (hidden: boolean) =>
    partners.map((p) => (
      <li key={`${p.name}-${hidden}`} className={styles.item} aria-hidden={hidden || undefined}>
        {p.logo ? (
          <span className={styles.logoBox}>
            <Image src={p.logo} alt={hidden ? "" : p.name} fill sizes="180px" loading="eager" unoptimized={p.logo.endsWith(".svg")} className={styles.logo} />
          </span>
        ) : (
          <span className={styles.wordmark}>{p.name}</span>
        )}
        <span className={styles.note}>{p.note}</span>
      </li>
    ));

  return (
    <section className={styles.section}>
      <div className="wrap">
        <Reveal as="div" className={styles.head}>
          <h2 className={styles.title}>Partners and members</h2>
          <p className={styles.subtitle}>
            Broadcasters, engineers and technology partners building South Africa&apos;s digital radio
            future with us.
          </p>
        </Reveal>
      </div>
      <div className={styles.viewport}>
        <ul className={styles.track}>
          {row(false)}
          {row(true)}
        </ul>
      </div>
    </section>
  );
}
