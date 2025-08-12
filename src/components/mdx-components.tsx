import * as React from "react";
import CodeBlock from "./mdx/code-block";
import Link from "./mdx/link";
import EasingPlayground from "./mdx/easing-playground";
import Video from "./mdx/video";

export const MDXComponents = {
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock {...props} />
  ),
  Video,
  EasingPlayground,
};
