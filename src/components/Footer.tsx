import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { nav, siteMeta } from "@/lib/content";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.brand}>
            <Image src="/images/logo-transparent.png" alt="DRM SA Group" width={352} height={139} className={styles.logoImg} />
          </div>
          <p className={styles.desc}>
            The regional home of Digital Radio Mondiale — the ITU-recommended, ETSI-published
            open standard bringing crystal-clear, future-ready digital sound to Southern
            Africa&apos;s broadcasters.
          </p>
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

        {/* The DRM standard, as the DRM Consortium asked us to show it. */}
        <div className={styles.drm}>
          <a href="https://www.drm.org/" target="_blank" rel="noreferrer" aria-label="DRM Consortium – drm.org">
            <Image
              src="/images/drm-consortium/drm-logo-subtitle.webp"
              alt="DRM – Digital Radio Mondiale"
              width={1024}
              height={282}
              className={styles.drmLogo}
            />
          </a>
          <a href="https://www.drm.org/" target="_blank" rel="noreferrer" className={styles.drmLink}>
            Visit drm.org →
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} DRM SA Group NPC Reg No: 2022/888959/08. All rights reserved.</span>
        <span>Member of the global DRM Consortium network.</span>
      </div>
    </footer>
  );
}
