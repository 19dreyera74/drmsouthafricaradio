import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { nav, siteMeta } from "@/lib/content";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <a href="https://www.drm.org/" target="_blank" rel="noreferrer" className={styles.brand}>
            <Image
              src="/images/drm-consortium/drm-logo-subtitle.webp"
              alt="DRM – Digital Radio Mondiale"
              width={1024}
              height={282}
              className={styles.drmLogo}
            />
          </a>
          <p className={styles.desc}>
            DRM SA Group promotes <strong>Digital Radio Mondiale</strong>, the ITU-recommended, ETSI-published open
            standard for digital radio.
          </p>
          <a href="https://www.drm.org/" target="_blank" rel="noreferrer" className={styles.drmLink}>
            Visit drm.org →
          </a>
        </div>

        <div>
          <div className={styles.heading}>Navigate</div>
          <ul className={styles.list}>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className={styles.heading}>Contact</div>
          <ul className={styles.list}>
            <li>
              <a href={siteMeta.phoneHref}>{siteMeta.phone}</a>
            </li>
            <li>
              <a href={`mailto:${siteMeta.email}`}>{siteMeta.email}</a>
            </li>
            <li>
              <a href={siteMeta.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <Link href="/" className={styles.saBrand} aria-label="DRM SA Group home">
          <Image src="/images/logo-transparent.png" alt="DRM SA Group" width={352} height={139} className={styles.logoImg} />
        </Link>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} DRM SA Group NPC Reg No: 2022/888959/08. All rights reserved.</span>
        <span>Member of the global DRM Consortium network.</span>
      </div>
    </footer>
  );
}
