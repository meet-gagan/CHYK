import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle,
  Eye,
  RotateCcw,
  Save,
  Pause,
  Play,
  Sparkles,
  Info,
} from 'lucide-react';

const DEFAULT_ENGLISH =
  '🕉️ Celebrate Magamasam with Devotion | 7 Feb – 8 Mar 2027 | Registrations Open!';
const DEFAULT_TELUGU =
  '🕉️ భక్తిశ్రద్ధలతో మాఘమాస వేడుకల్లో పాల్గొనండి | ఫిబ్రవరి 7 – మార్చి 8, 2027 | రిజిస్ట్రేషన్లు ప్రారంభం!';

export const ScrollingAnnouncementEditor = ({
  section,
  sectionIndex,
  onToggleEnabled,
  onContentChange,
  onSave,
  onReset,
  saving = false,
  hasUnsavedChanges = false,
}) => {
  const [isPausedManually, setIsPausedManually] = useState(false);

  const isEnabled = Boolean(section?.isEnabled);
  const englishField = (section?.fields || []).find((f) => f.key === 'english_content');
  const teluguField = (section?.fields || []).find((f) => f.key === 'telugu_content');
  const linkField = (section?.fields || []).find((f) => f.key === 'link_url');

  const englishContent = englishField?.value ?? DEFAULT_ENGLISH;
  const teluguContent = teluguField?.value ?? DEFAULT_TELUGU;
  const linkUrl = linkField?.value ?? '/sswt#maha-shivaratri';

  return (
    <div className="rounded-3xl bg-[var(--bg-secondary)] border-2 border-orange-500/30 overflow-hidden shadow-2xl transition-all">
      <style>{`
        @keyframes scrollAnnouncementAdmin {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .announcement-marquee-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: scrollAnnouncementAdmin 28s linear infinite;
          will-change: transform;
        }
        .announcement-marquee-track.is-paused {
          animation-play-state: paused !important;
        }
        .announcement-preview-box:hover .announcement-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .announcement-marquee-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="p-5 sm:p-6 bg-gradient-to-r from-orange-500/15 via-[var(--bg-tertiary)] to-[var(--bg-secondary)] border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-black font-heading text-[var(--text-primary)]">
                Scrolling Announcement Management
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                  isEnabled
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                  }`}
                />
                {isEnabled ? 'ON (Visible)' : 'OFF (Hidden)'}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
              Manage the English and Telugu announcements displayed as a continuously scrolling notification on the Chinmaya Mission homepage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onReset && (
            <button
              type="button"
              onClick={() => onReset(sectionIndex)}
              disabled={saving}
              title="Revert announcement to last saved values"
              className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6 bg-[var(--bg-primary)]/40">
        
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <label
                htmlFor="toggle-scrolling-announcement-admin"
                className="text-sm font-extrabold text-[var(--text-primary)] cursor-pointer select-none"
              >
                Display Scrolling Announcement
              </label>
              <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                Homepage Notification Banner
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              When turned ON, the single-line continuous right-to-left scrolling banner is displayed right below the website header on the Chinmaya Mission homepage.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-[var(--text-muted)] select-none">
              {isEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              id="toggle-scrolling-announcement-admin"
              type="button"
              role="switch"
              aria-checked={isEnabled}
              onClick={() => onToggleEnabled(sectionIndex)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                isEnabled ? 'bg-orange-500' : 'bg-slate-700'
              }`}
            >
              <span className="sr-only">Display Scrolling Announcement</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          <div className="space-y-2 p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                <span>English Announcement</span>
                <span className="text-[10px] font-mono font-normal text-[var(--text-muted)]">
                  (Sequence: 1st)
                </span>
              </label>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {englishContent.length} chars
              </span>
            </div>

            <textarea
              rows={3}
              value={englishContent}
              onChange={(e) =>
                onContentChange(sectionIndex, 'english_content', e.target.value)
              }
              placeholder="🕉️ Celebrate Magamasam with Devotion | 7 Feb – 8 Mar 2027 | Registrations Open!"
              className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] leading-relaxed focus:outline-hidden focus:border-orange-500 transition-colors font-sans"
            />
            <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Full text and special characters (like 🕉️, |, –, !) are preserved.</span>
            </p>
          </div>

          <div className="space-y-2 p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                <span>Telugu Announcement</span>
                <span className="text-[10px] font-mono font-normal text-[var(--text-muted)]">
                  (Sequence: 2nd)
                </span>
              </label>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {teluguContent.length} chars
              </span>
            </div>

            <textarea
              rows={3}
              value={teluguContent}
              onChange={(e) =>
                onContentChange(sectionIndex, 'telugu_content', e.target.value)
              }
              placeholder="🕉️ భక్తిశ్రద్ధలతో మాఘమాస వేడుకల్లో పాల్గొనండి | ఫిబ్రవరి 7 – మార్చి 8, 2027 | రిజిస్ట్రేషన్లు ప్రారంభం!"
              style={{
                fontFamily:
                  "'Tiro Telugu', 'Hind Guntur', 'Noto Sans Telugu', system-ui, sans-serif",
                lineHeight: 1.7,
              }}
              className="w-full p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] leading-relaxed focus:outline-hidden focus:border-orange-500 transition-colors"
            />
            <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Telugu Unicode script is preserved exactly as entered without automatic translation.</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <span>Redirect Link URL</span>
              <span className="text-[10px] font-mono font-normal text-[var(--text-muted)]">
                (Click Destination)
              </span>
            </label>
          </div>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) =>
              onContentChange(sectionIndex, 'link_url', e.target.value)
            }
            placeholder="/sswt#maha-shivaratri"
            className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-orange-500 transition-colors font-mono"
          />
          <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>When devotees click anywhere on the scrolling banner, they are navigated to this page. Defaults to Shri Shantamalleshwara Swami Temple page.</span>
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-400" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-primary)]">
                  Announcement Live Preview
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Single Horizontal Line (Right → Left)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Exact preview of the homepage banner: English content first, bullet separator, then Telugu content scrolling continuously. Hover to pause.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPausedManually((prev) => !prev)}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title={isPausedManually ? 'Resume scrolling animation' : 'Pause scrolling animation'}
              >
                {isPausedManually ? (
                  <>
                    <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span>Play</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-orange-400" />
                    <span>Pause</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-300/40 bg-gradient-to-r from-[#FFF7ED] via-[#FFF5E5] to-[#FFF7ED] p-1 shadow-md overflow-hidden relative">
            <div className="announcement-preview-box relative w-full h-[42px] sm:h-[44px] overflow-hidden flex items-center rounded-xl bg-orange-50/60 select-none">
              
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#FFF7ED] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FFF7ED] to-transparent z-10 pointer-events-none" />

              <div
                className={`announcement-marquee-track ${
                  isPausedManually ? 'is-paused' : ''
                }`}
              >
                <span className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#7C2D12] tracking-wide shrink-0 pr-8">
                  <span className="font-sans font-medium text-[#7C2D12]">
                    {englishContent || DEFAULT_ENGLISH}
                  </span>
                  <span className="mx-4 text-[#EA580C] font-black select-none text-base">•</span>
                  <span
                    className="font-medium text-[#7C2D12]"
                    style={{
                      fontFamily:
                        "'Tiro Telugu', 'Hind Guntur', 'Noto Sans Telugu', system-ui, sans-serif",
                    }}
                  >
                    {teluguContent || DEFAULT_TELUGU}
                  </span>
                  <span className="mx-4 text-[#EA580C] font-black select-none text-base">•</span>
                </span>

                <span
                  aria-hidden="true"
                  className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#7C2D12] tracking-wide shrink-0 pr-8"
                >
                  <span className="font-sans font-medium text-[#7C2D12]">
                    {englishContent || DEFAULT_ENGLISH}
                  </span>
                  <span className="mx-4 text-[#EA580C] font-black select-none text-base">•</span>
                  <span
                    className="font-medium text-[#7C2D12]"
                    style={{
                      fontFamily:
                        "'Tiro Telugu', 'Hind Guntur', 'Noto Sans Telugu', system-ui, sans-serif",
                    }}
                  >
                    {teluguContent || DEFAULT_TELUGU}
                  </span>
                  <span className="mx-4 text-[#EA580C] font-black select-none text-base">•</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>
                Live preview reflects your unsaved textarea changes immediately.
              </span>
            </span>
            <span>
              Status:{' '}
              <strong className={isEnabled ? 'text-emerald-400' : 'text-slate-400'}>
                {isEnabled ? 'Will show on homepage' : 'Hidden from homepage'}
              </strong>
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-[var(--text-muted)] font-medium">
            {hasUnsavedChanges ? (
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                You have unsaved changes in the announcement.
              </span>
            ) : (
              <span className="text-emerald-400/80 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                All announcement settings are saved in the database.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {onReset && (
              <button
                type="button"
                onClick={() => onReset(sectionIndex)}
                disabled={saving || !hasUnsavedChanges}
                className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Saved</span>
              </button>
            )}

            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{saving ? 'Saving Announcement...' : 'Save Changes'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScrollingAnnouncementEditor;
