import Image from "next/image";
import styles from "./ImageText.module.css";
import Reveal from "@/components/Reveal";

type ImageTextProps = {
  title: string;
  body: string;
  image: string;
  caption?: string;
  reverse?: boolean;
  alt?: string;
  className?: string;
  /** Optional button under the text, e.g. a link to more on drm.org. */
  link?: { href: string; label: string };
};

export default function ImageText({ title, body, image, caption, reverse, alt = "", className = "", link }: ImageTextProps) {
  return (
    <section className={`${styles.section} wrap ${reverse ? styles.reverse : ""} ${className}`}>
      <div className={styles.grid}>
        <Reveal variant="scale">
          <div className={styles.imgWrap}>
            <Image src={image} alt={alt} fill sizes="(max-width: 860px) 100vw, 50vw" className={styles.img} />
          </div>
        </Reveal>
        <Reveal variant="blur" delay={100}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.body}>{body}</p>
            {caption && <p className={styles.caption}>{caption}</p>}
            {link && (
              <a href={link.href} target="_blank" rel="noreferrer" className={styles.button}>
                {link.label}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
