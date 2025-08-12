import React from "react";

export default function Video({
  caption,
  className,
  ...props
}: React.VideoHTMLAttributes<HTMLVideoElement> & {
  caption?: string;
}) {
  return (
    <figure className="my-6">
      <video
        {...props}
        className={`w-full rounded-lg border border-border bg-black ${
          className ?? ""
        }`}
        controls
        playsInline
        preload={props.preload ?? "metadata"}
      />
      {caption ? (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
