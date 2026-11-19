import React from 'react';

/**
 * Replaces any occurrence of marathon with Mini-Marathon using a non-breaking hyphen (\u2011)
 * so it will NEVER wrap or split across lines in plain strings, alt attributes, or titles.
 */
export const formatMiniMarathonText = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str
    .replace(/(?<!mini[-‑\u2011 ])marathon/gi, (match) =>
      match === match.toUpperCase() ? 'MINI\u2011MARATHON' : 'Mini\u2011Marathon'
    )
    .replace(/mini[- ]marathon/gi, (match) =>
      match === match.toUpperCase()
        ? 'MINI\u2011MARATHON'
        : match[0] === match[0].toUpperCase()
        ? 'Mini\u2011Marathon'
        : 'mini\u2011marathon'
    );
};

/**
 * React JSX formatter that wraps any Mini-Marathon variation in
 * an inline-block whitespace-nowrap span with a non-breaking hyphen (\u2011),
 * guaranteeing it always stays on one line together.
 */
export const renderNoBreakMiniMarathon = (content) => {
  if (!content) return content;
  if (typeof content !== 'string') return content;

  // First ensure marathon -> Mini-Marathon with non-breaking hyphen
  const formatted = formatMiniMarathonText(content);
  // Split on any variation of Mini-Marathon
  const parts = formatted.split(/(MINI[\u2011\-‑]MARATHON|Mini[\u2011\-‑]Marathon|mini[\u2011\-‑]marathon)/g);

  if (parts.length === 1) return formatted;

  return parts.map((part, idx) => {
    if (/^mini[\u2011\-‑]marathon$/i.test(part)) {
      return (
        <span key={idx} className="whitespace-nowrap inline-block" style={{ whiteSpace: 'nowrap' }}>
          {part.replace(/[\-‑]/g, '\u2011')}
        </span>
      );
    }
    return part;
  });
};

export default renderNoBreakMiniMarathon;
