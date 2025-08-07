import * as React from "react";

export const MDXComponents = {
  a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} className="text-primary underline-offset-2 hover:underline" />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr {...props} className="my-10 border-border" />
  ),
};
