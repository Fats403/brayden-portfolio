"use client";

import * as React from "react";

type CodeBlockProps = React.HTMLAttributes<HTMLPreElement> & {
  ["data-language"]?: string;
};

export default function CodeBlock(props: CodeBlockProps) {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  async function onCopy() {
    const el = preRef.current;
    if (!el) return;
    const code = el.innerText; // copy asplain text
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <div className="relative group">
      <button
        onClick={onCopy}
        type="button"
        aria-label="Copy code"
        className="absolute right-2 top-2 z-10 rounded border border-border bg-background/80 px-2 py-1 text-xs text-foreground/80 backdrop-blur hover:bg-background opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre ref={preRef} {...props} />
    </div>
  );
}
