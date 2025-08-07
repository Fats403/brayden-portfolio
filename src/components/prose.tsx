import { cn } from "@/lib/utils"; // if you have a cn helper; otherwise inline className joins

type ProseProps = React.HTMLAttributes<HTMLDivElement>;

export function Prose({ className, ...props }: ProseProps) {
  return (
    <div
      className={cn(
        // base text
        "leading-7 text-foreground/90",
        // headings
        "[&>h1]:scroll-m-20 [&>h1]:text-3xl [&>h1]:font-semibold [&>h1]:tracking-tight md:[&>h1]:text-4xl",
        "[&>h2]:mt-10 [&>h2]:scroll-m-20 [&>h2]:border-b [&>h2]:pb-2 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:border-border",
        "[&>h3]:mt-8 [&>h3]:scroll-m-20 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:tracking-tight",
        // paragraphs and small text
        "[&>p]:mt-4 [&>p]:text-foreground",
        "[&>small]:text-xs [&>small]:leading-none",
        // links
        "[&>a]:text-primary [&>a]:underline-offset-2 hover:[&>a]:underline",
        // lists
        "[&>ul]:my-4 [&>ul]:ml-6 [&>ul]:list-disc",
        "[&>ol]:my-4 [&>ol]:ml-6 [&>ol]:list-decimal",
        "[&>li]:mt-1.5 [&>li>p]:m-0",
        // code inline
        "[&>code]:rounded-md [&>code]:border [&>code]:border-border [&>code]:bg-secondary [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:text-sm",
        // pre/code blocks
        "[&>pre]:my-6 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-border [&>pre]:bg-secondary [&>pre]:px-4 [&>pre]:py-3",
        "[&>pre>code]:text-sm",
        // blockquote
        "[&>blockquote]:mt-6 [&>blockquote]:border-l-2 [&>blockquote]:pl-4 [&>blockquote]:text-muted-foreground [&>blockquote]:border-border",
        // hr
        "[&>hr]:my-10 [&>hr]:border-border",
        // tables
        "[&>table]:w-full [&>table]:my-6 [&>table]:text-sm",
        "[&>table th]:text-left [&>table th]:font-medium [&>table th]:text-foreground [&>table th]:pb-2",
        "[&>table td]:py-2 [&>table td]:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
