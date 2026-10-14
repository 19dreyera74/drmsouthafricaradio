import Link from "next/link";
import styles from "./news.module.css";
import { absolute } from "@/lib/site";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items, light }: { items: Crumb[]; light?: boolean }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absolute(c.href) } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className={`${styles.crumbs} ${light ? styles.crumbsLight : ""}`}>
      <ol>
        {items.map((c, i) => (
          <li key={i}>
            {c.href && i < items.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
