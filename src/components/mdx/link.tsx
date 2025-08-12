"use client";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function CodeBlock(props: LinkProps) {
  const isExternal =
    typeof props.href === "string" && /^https?:\/\//.test(props.href);
  const { className, ...rest } = props;
  return (
    <a
      {...rest}
      href={props.href}
      target={isExternal ? "_blank" : props.target}
      rel={isExternal ? "noopener noreferrer" : props.rel}
    />
  );
}
