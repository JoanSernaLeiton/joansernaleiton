import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-semibold",
  };

  return (
    <li className="my-4 rounded-lg border border-skin-line bg-skin-card p-5 transition-colors focus-within:border-skin-accent hover:border-skin-accent">
      <a
        href={href}
        className="inline-block text-lg font-medium text-skin-accent underline-offset-4 hover:underline"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
      <p className="mt-1 text-skin-muted">{description}</p>
    </li>
  );
}
