import RichText from "@/components/RichText";
import type { PostBlock } from "@/lib/content";

// Full drmsa.org post text: paragraphs, subheadings and (nested) lists, with [text](url) links.
export default function PostBody({ blocks, className }: { blocks: PostBlock[]; className?: string }) {
  return (
    <div className={className}>
      {blocks.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p key={i}>
              <RichText text={block} />
            </p>
          );
        }
        if ("heading" in block) return <h2 key={i}>{block.heading}</h2>;
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
      })}
    </div>
  );
}
