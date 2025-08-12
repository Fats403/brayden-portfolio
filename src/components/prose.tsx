import { cn } from "@/lib/utils";

type ProseProps = React.HTMLAttributes<HTMLDivElement>;

export function Prose({ className, ...props }: ProseProps) {
  return (
    <div
      className={cn(
        // responsive container
        "w-full",
        // base text
        "max-w-[42rem] leading-7 text-foreground/90",
        // headings
        "[&>h1]:scroll-m-20 [&>h1]:text-3xl [&>h1]:font-semibold [&>h1]:tracking-tight md:[&>h1]:text-4xl",
        "[&>h2]:mt-10 [&>h2]:scroll-m-20 [&>h2]:border-b [&>h2]:pb-2 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:border-border",
        "[&>h3]:mt-8 [&>h3]:scroll-m-20 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:tracking-tight",
        // paragraphs and small text
        "[&>p]:mt-4 [&>p]:text-foreground",
        "[&>small]:text-xs [&>small]:leading-none",
        // links (descendants)
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
        // lists
        "[&>ul]:my-4 [&>ul]:ml-6 [&>ul]:list-disc",
        "[&>ol]:my-4 [&>ol]:ml-6 [&>ol]:list-decimal",
        "[&_code]:rounded-md [&_code]:border [&_code]:border-border [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono",
        // pre/code blocks (descendants)
        "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-secondary [&_pre]:px-4 [&_pre]:py-3 [&_pre]:font-mono",
        "[&_pre>code]:text-sm",
        // reset inline-code styles inside pre blocks to avoid bleed
        "[&_pre_code]:m-0 [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none",
        // blockquote (descendants)
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:border-border",
        // hr
        "[&>hr]:my-10 [&>hr]:border-border",
        // tables (descendants – covers tables inside lists/blocks)
        "[&_table]:w-full [&_table]:my-6 [&_table]:text-sm",
        "[&_table th]:text-left [&_table th]:font-medium [&_table th]:text-foreground [&_table th]:pb-2",
        "[&_table td]:py-2 [&_table td]:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
