/**
 * Extract YouTube Video ID from various YouTube URL formats
 * @param {string} url
 * @returns {string|null}
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // 1. Matches standard YouTube domains (youtube.com, youtu.be, m.youtube.com, etc.)
  const domainPattern = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/i;
  const domainMatch = trimmed.match(domainPattern);
  if (domainMatch && domainMatch[1]) {
    return domainMatch[1];
  }

  // 2. Pure 11-character YouTube video ID (base64url format only if not a general word or URL)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed) && !trimmed.includes('/') && !trimmed.includes('.') && !trimmed.includes('http')) {
    if (!/^[a-z]+(-[a-z]+)+$/.test(trimmed)) {
      return trimmed;
    }
  }

  return null;
}

/**
 * Get YouTube High Quality thumbnail URL
 * @param {string} videoId
 * @returns {string}
 */
export function getYouTubeThumbnailUrl(videoId) {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
