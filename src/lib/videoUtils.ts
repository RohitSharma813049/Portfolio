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

  // YouTube watch?v=ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    const id = watchMatch[1];
    return {
      isVideoFile: false,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      videoId: id,
    };
  }

  // YouTube shorts/ID
  const shortsMatch = trimmed.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    const id = shortsMatch[1];
    return {
      isVideoFile: false,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      videoId: id,
    };
  }

  // YouTube youtu.be/ID
  const youtuBeMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch && youtuBeMatch[1]) {
    const id = youtuBeMatch[1];
    return {
      isVideoFile: false,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      videoId: id,
    };
  }

  // YouTube embed/ID
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (embedMatch && embedMatch[1]) {
    const id = embedMatch[1];
    return {
      isVideoFile: false,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      videoId: id,
    };
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
    embedUrl: trimmed,
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
