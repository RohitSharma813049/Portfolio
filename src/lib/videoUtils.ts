export interface VideoEmbedInfo {
  isVideoFile: boolean;
  embedUrl: string;
  thumbnail: string;
  videoId?: string;
}

export function getVideoEmbedInfo(url?: string): VideoEmbedInfo {
  if (!url || typeof url !== "string") {
    return { isVideoFile: false, embedUrl: "", thumbnail: "" };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { isVideoFile: false, embedUrl: "", thumbnail: "" };
  }

  // Direct video file (.mp4, .webm, .ogg, .mov, Cloudinary/S3 video)
  if (
    trimmed.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ||
    trimmed.includes("/video/upload/") ||
    trimmed.includes("s3.") ||
    trimmed.includes("amazonaws.com")
  ) {
    return { isVideoFile: true, embedUrl: trimmed, thumbnail: "" };
  }

  // Parse YouTube URLs reliably
  try {
    if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) {
      let videoId = "";
      if (trimmed.includes("youtu.be/")) {
        const parts = trimmed.split("youtu.be/");
        if (parts[1]) videoId = parts[1].split("?")[0].split("/")[0];
      } else if (trimmed.includes("youtube.com/shorts/")) {
        const parts = trimmed.split("youtube.com/shorts/");
        if (parts[1]) videoId = parts[1].split("?")[0].split("/")[0];
      } else if (trimmed.includes("youtube.com/embed/")) {
        const parts = trimmed.split("youtube.com/embed/");
        if (parts[1]) videoId = parts[1].split("?")[0].split("/")[0];
      } else if (trimmed.includes("v=")) {
        const fullUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
        const urlObj = new URL(fullUrl);
        videoId = urlObj.searchParams.get("v") || "";
      }

      if (videoId) {
        return {
          isVideoFile: false,
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          videoId,
        };
      }
    }
  } catch (e) {
    console.error("YouTube URL parsing error:", e);
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const id = vimeoMatch[1];
    return {
      isVideoFile: false,
      embedUrl: `https://player.vimeo.com/video/${id}`,
      thumbnail: "",
      videoId: id,
    };
  }

  // Loom
  if (trimmed.includes("loom.com/share/")) {
    const loomId = trimmed.split("loom.com/share/")[1]?.split("?")[0];
    if (loomId) {
      return {
        isVideoFile: false,
        embedUrl: `https://www.loom.com/embed/${loomId}`,
        thumbnail: "",
        videoId: loomId,
      };
    }
  }

  // Google Drive view -> preview
  if (trimmed.includes("drive.google.com/file/d/")) {
    const driveUrl = trimmed.replace(/\/view(\?.*)?$/, "/preview");
    return {
      isVideoFile: false,
      embedUrl: driveUrl,
      thumbnail: "",
    };
  }

  // Fallback
  return {
    isVideoFile: false,
    embedUrl: trimmed.startsWith("http") ? trimmed : `https://${trimmed}`,
    thumbnail: "",
  };
}

export function formatExternalUrl(url?: string): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
