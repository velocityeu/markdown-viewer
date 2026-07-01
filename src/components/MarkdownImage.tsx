import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

interface MarkdownImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  baseDirectory: string;
}

export function MarkdownImage({
  src,
  alt,
  baseDirectory,
  ...props
}: MarkdownImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(
    typeof src === "string" ? src : undefined,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const resolveImage = async () => {
      if (!src || typeof src !== "string") {
        return;
      }

      if (
        src.startsWith("http://") ||
        src.startsWith("https://") ||
        src.startsWith("data:")
      ) {
        setResolvedSrc(src);
        return;
      }

      try {
        const absolutePath = await invoke<string>("resolve_image_path", {
          baseDir: baseDirectory,
          src,
        });
        if (!cancelled) {
          setResolvedSrc(convertFileSrc(absolutePath));
          setFailed(false);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      }
    };

    void resolveImage();

    return () => {
      cancelled = true;
    };
  }, [baseDirectory, src]);

  if (failed) {
    return (
      <span className="broken-image" title={typeof src === "string" ? src : ""}>
        Image unavailable
      </span>
    );
  }

  return <img src={resolvedSrc} alt={alt ?? ""} loading="lazy" {...props} />;
}