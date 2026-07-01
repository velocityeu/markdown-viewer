import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { MarkdownImage } from "./MarkdownImage";
import { SearchHighlight } from "./SearchHighlight";

interface MarkdownViewerProps {
  content: string;
  baseDirectory: string;
  zoom: number;
  searchQuery: string;
}

export function MarkdownViewer({
  content,
  baseDirectory,
  zoom,
  searchQuery,
}: MarkdownViewerProps) {
  return (
    <article
      className="markdown-body"
      style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
    >
      <SearchHighlight query={searchQuery}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ src, alt, ...props }) => (
            <MarkdownImage
              src={src}
              alt={alt}
              baseDirectory={baseDirectory}
              {...props}
            />
          ),
          a: ({ href, children, ...props }) => (
            <a href={href} target="_blank" rel="noreferrer" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      </SearchHighlight>
    </article>
  );
}