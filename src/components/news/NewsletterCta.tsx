import styles from "./NewsletterCta.module.css";

const NEWSLETTERS_URL = "https://www.drm.org/news/newsletters/";

// Call to action for the DRM Consortium newsletters. Sign-up happens on
// drm.org, so subscribers land on the Consortium's own mailing list.
export default function NewsletterCta() {
  return (
    <aside className={`wrap ${styles.wrap}`} aria-labelledby="newsletter-cta-title">
      <div className={styles.card}>
        <svg className={styles.icon} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
        </svg>
        <div className={styles.text}>
          <h2 id="newsletter-cta-title" className={styles.title}>
            Subscribe to the DRM Consortium newsletters
          </h2>
          <p className={styles.body}>
            Get the monthly <strong>DRM Newsletter</strong> and the quarterly <strong>DRM Africa Newsletter</strong> from
            the DRM Consortium, with the latest broadcasts, receivers, events and news from Digital Radio Mondiale
            around the world.
          </p>
        </div>
        <div className={styles.actions}>
          <a href={NEWSLETTERS_URL} target="_blank" rel="noreferrer" className={styles.button}>
            Subscribe
          </a>
          <a href={NEWSLETTERS_URL} target="_blank" rel="noreferrer" className={styles.pastLink}>
            Read past issues →
          </a>
        </div>
      </div>
    </aside>
  );
}
