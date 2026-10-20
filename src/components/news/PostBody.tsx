import Image from "next/image";
import RichText from "@/components/RichText";
import type { PostBlock } from "@/lib/content";
import styles from "./PostBody.module.css";

// Full drmsa.org post text: paragraphs, subheadings, (nested) lists, a lead line,
// centred figures and text-beside-image rows, with [text](url), **bold** and *italic*.
export default function PostBody({ blocks, className }: { blocks: PostBlock[]; className?: string }) {
  return <div className={className}>{blocks.map((block, i) => renderBlock(block, i))}</div>;
}

function renderBlock(block: PostBlock, i: number) {
  if (typeof block === "string") {
    return (
      <p key={i}>
        <RichText text={block} />
      </p>
    );
  }
  if ("heading" in block) return <h2 key={i}>{block.heading}</h2>;
  if ("lead" in block)
    return (
      <p key={i} className={styles.lead}>
        <RichText text={block.lead} />
      </p>
    );
  if ("figure" in block)
    return (
      <figure key={i} className={styles.figure}>
        <Image
          src={block.figure}
          alt={block.alt}
          width={block.width || 1200}
          height={block.height || 675}
          sizes="(max-width: 860px) 100vw, 820px"
          className={styles.figureImg}
        />
      </figure>
    );
  if ("split" in block)
    return (
      <div key={i} className={styles.split}>
        <div className={styles.splitText}>{block.split.map((b, j) => renderBlock(b, j))}</div>
        <div className={`${styles.splitMedia} ${block.fit === "contain" ? styles.splitLogo : ""}`}>
          <Image src={block.image} alt={block.alt} width={block.width} height={block.height} sizes="(max-width: 700px) 100vw, 340px" className={styles.splitImg} />
        </div>
      </div>
    );
  return (
    <ul key={i}>
      {block.list.map((item, j) =>
        typeof item === "string" ? (
          <li key={j}>
            <RichText text={item} />
          </li>
        ) : (
          <li key={j}>
            <RichText text={item.text} />
            <ul>
              {item.items.map((sub, k) => (
                <li key={k}>
                  <RichText text={sub} />
                </li>
              ))}
            </ul>
          </li>
        )
      )}
    </ul>
  );
}
