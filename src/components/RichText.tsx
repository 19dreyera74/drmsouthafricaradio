import { Fragment, type ReactNode } from "react";

// Renders text containing [label](url) links, **bold** and *italic*, as used in localNews.
const TOKEN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;

function render(text: string, keyPrefix = ""): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    const key = `${keyPrefix}${i}`;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const external = /^https?:/.test(link[2]);
      return (
        <a key={key} href={link[2]} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {link[1]}
        </a>
      );
    }
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={key}>{render(bold[1], `${key}-`)}</strong>;
    const italic = part.match(/^\*([^*]+)\*$/);
    if (italic) return <em key={key}>{render(italic[1], `${key}-`)}</em>;
    return <Fragment key={key}>{part}</Fragment>;
  });
}

export default function RichText({ text }: { text: string }) {
  return <>{render(text)}</>;
}

export function plainText(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}
