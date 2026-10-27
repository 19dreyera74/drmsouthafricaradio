import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import ImageText from "@/components/ImageText";
import { membershipTiers, siteMeta } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "DRM Membership for Broadcasters in South Africa",
  alternates: { canonical: "/membership" },
  description:
    "Three membership tiers for broadcasters, institutions and independent creators driving DRM adoption across Southern Africa.",
};

const steps = [
  { title: "Download the form", body: "Get the DRM SA Group membership application form below." },
  { title: "Attach your documents", body: "Broadcast licence for licensed broadcasters, or business registration / letterhead for non-broadcasters." },
  { title: "Email it in", body: `Send the completed form with billing information to ${siteMeta.email}.` },
  { title: "Activate", body: "DRM SA reviews your application and emails an invoice. Membership is active once payment is received." },
];

const consortiumFit = [
  "Receiver and equipment manufacturers",
  "Motor vehicle manufacturers",
  "System integrators",
  "Signal distributors",
];

export default function MembershipPage() {
  return (
    <main>
      <PageHero
        title="Join the movement shaping the future of African radio"
        sub="DRM SA is calling on forward-thinking broadcasters, media innovators and industry stakeholders to become part of South Africa's digital radio revolution."
        image="/images/membership-poster.jpg"
        video="/videos/membership-journey.mp4"
      />

      <section className={`${styles.section} ${styles.tiersSection} wrap`}>
        <div className={styles.grid}>
          {membershipTiers.map((t, i) => (
            <Reveal key={t.tier} delay={i * 80} variant="scale">
              <TiltCard>
                <div className={styles.card}>
                  <h2 className={styles.tier}>{t.tier}</h2>
                  <div>
                    <span className={styles.eligHeading}>Ideal for</span>
                    <ul className={styles.eligList} style={{ marginTop: 10 }}>
                      {t.eligibility.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </div>
                  <p className={styles.benefit}>{t.benefit}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <ImageText
        image="/images/bes-2023-team.jpg"
        alt="The DRM team at the BES Expo 2023"
        title="Part of a global network"
        body="DRM SA works alongside the wider DRM Consortium, meeting broadcasters, regulators and receiver manufacturers at industry events around the world. Members join that network, not just a local group."
        caption="The DRM team at the BES Expo, 2023."
        className={styles.afterTiers}
      />

      <section className={`${styles.sectionAlt} wrap`}>
        <Reveal as="div" className={styles.stepsHead}>
          <h2 className={styles.title}>How to apply</h2>
          <p className={styles.sub}>
            Once your application is reviewed and approved, you&apos;ll receive your membership
            invoice by email. Membership becomes active once payment is received.
          </p>
        </Reveal>

        <div className={styles.steps}>
          {steps.map((s, i) => (
            <Reveal as="div" key={s.title} className={styles.step} delay={i * 70} variant="line">
              <span className={styles.stepNum}>0{i + 1}</span>
              <p className={styles.stepBody}>{s.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal as="div" className={styles.downloadRow} delay={280}>
          <a
            href="/documents/DRM-SA-Group-Membership-Application.pdf"
            className={styles.downloadBtn}
            download
          >
            Download application form
          </a>
          <span className={styles.downloadNote}>PDF · DRM SA Group Membership Application</span>
        </Reveal>
      </section>

      <section className={`${styles.section} wrap`} aria-labelledby="consortium-title">
        <Reveal as="div" className={styles.consortium}>
          <div className={styles.consortiumText}>
            <span className={styles.eyebrow}>Going global?</span>
            <h2 id="consortium-title" className={styles.title}>
              Join the DRM Consortium
            </h2>
            <p className={styles.sub}>
              If your organisation is a local receiver or equipment manufacturer, a motor vehicle manufacturer, a system
              integrator or a signal distributor that wants to offer its products and services globally, joining the DRM
              Consortium can be an option. The Consortium is the international body behind the Digital Radio Mondiale
              standard, connecting members with broadcasters, manufacturers and regulators around the world.
            </p>
            <a href="https://www.drm.org/membership/" target="_blank" rel="noreferrer" className={styles.downloadBtn}>
              Explore DRM Consortium membership
            </a>
            <p className={styles.consortiumNote}>
              DRM Consortium membership is separate from DRM SA Group membership and is arranged directly with the
              Consortium.
            </p>
          </div>
          <div className={styles.consortiumPanel}>
            <span className={styles.eligHeading}>A good fit for</span>
            <ul className={styles.eligList}>
              {consortiumFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
