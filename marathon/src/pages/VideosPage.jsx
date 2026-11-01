import React, { useState, useEffect, useCallback, useRef } from 'react';
import { videoService } from '../services/api';
import { Play, X, AlertTriangle, RefreshCw, Film, Sparkles, Maximize2, Minimize2 } from 'lucide-react';

const YoutubeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);

  // Fetch videos from API
  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await videoService.getVideos();
      if (res.data?.success && Array.isArray(res.data.data)) {
        setVideos(res.data.data);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error('Failed to load marathon videos:', err);
      setError('Unable to load videos right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Close player safely (exiting fullscreen if active)
  const closePlayer = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreen(false);
    setActiveVideo(null);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && !isFullscreen) {
      if (modalRef.current?.requestFullscreen) {
        modalRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Listen for native browser fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // Handle escape key to close video playback modal
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && activeVideo) {
        closePlayer();
      }
    },
    [activeVideo]
  );

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideo, handleKeyDown]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#FFFDF9)] py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--orange,#FF6600)]/10 text-[var(--orange,#FF6600)] font-black text-xs uppercase tracking-widest border border-[var(--orange,#FF6600)]/20 shadow-sm">
            <Film className="w-3.5 h-3.5" />
            <span>Anti-Drug Movement Media</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-[var(--text-primary,#0B2340)] tracking-tight uppercase">
            Videos
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-[var(--text-primary,#0B2340)]/75 font-medium leading-relaxed">
            Watch event highlights, inspirational messages, youth movements, and marathon stories
            from the Anti-Drug Movement Marathon 2026.
          </p>
        </div>

        {/* Loading State: Skeleton Cards */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-white/80 rounded-2xl overflow-hidden border border-[var(--border-color,#E5E7EB)] shadow-sm animate-pulse space-y-3 p-3"
              >
                <div className="aspect-video w-full bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-4/5" />
                <div className="h-3 bg-slate-200 rounded w-3/5" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-white border border-red-500/20 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-base text-[var(--text-primary,#0B2340)]">
              {error}
            </h3>
            <button
              onClick={fetchVideos}
              className="btn-primary text-xs py-2.5 px-6 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && videos.length === 0 && (
          <div className="max-w-md mx-auto text-center p-12 rounded-3xl bg-white border border-[var(--border-color,#E5E7EB)] shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-[var(--orange,#FF6600)]/10 text-[var(--orange,#FF6600)] flex items-center justify-center mx-auto">
              <YoutubeIcon className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-lg text-[var(--text-primary,#0B2340)]">
              No Videos Available Yet
            </h3>
            <p className="text-xs text-[var(--text-muted,#64748B)]">
              Videos will appear here soon. Check back shortly for updates and race highlights!
            </p>
          </div>
        )}

        {/* Responsive Grid: 5 on large desktop, 4 on laptop, 2-3 on tablet, 1-2 on mobile */}
        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {videos.map((video) => {
              const thumbUrl =
                video.thumbnailUrl ||
                `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

              return (
                <div
                  key={video._id}
                  onClick={() => setActiveVideo(video)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveVideo(video);
                    }
                  }}
                  className="bg-white rounded-2xl overflow-hidden border border-[rgba(11,35,64,0.08)] shadow-[0_2px_8px_rgba(11,35,64,0.04)] hover:shadow-[0_12px_24px_rgba(11,35,64,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left"
                >
                  <div>
                    {/* Fixed 16:9 Thumbnail Dimension */}
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      <img
                        src={thumbUrl}
                        alt={video.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback to standard quality if maxres or hq is unavailable
                          if (e.target.src !== `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`) {
                            e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
                          }
                        }}
                      />

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Center Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-xl group-hover:scale-115 group-hover:bg-red-600 transition-all duration-300">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>

                      {/* YouTube indicator badge */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                        <YoutubeIcon className="w-3 h-3 text-red-500" />
                        <span>Watch</span>
                      </div>
                    </div>

                    {/* Card Content: Title and Description */}
                    <div className="p-3.5 sm:p-4 space-y-1.5">
                      {/* Video Title */}
                      <h3
                        className="font-heading font-black text-xs sm:text-sm text-[var(--text-primary,#0B2340)] line-clamp-2 leading-snug group-hover:text-[var(--orange,#FF6600)] transition-colors"
                        title={video.title}
                      >
                        {video.title}
                      </h3>

                      {/* One-Line Description */}
                      <p
                        className="text-[11px] sm:text-xs text-[var(--text-muted,#64748B)] truncate block font-medium"
                        title={video.description}
                      >
                        {video.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* YOUTUBE EMBEDDED PLAYER MODAL (16:9 Aspect Ratio with True Fullscreen Coverage) */}
      {activeVideo && (
        <div
          ref={modalRef}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in ${
            isFullscreen ? 'p-0 w-screen h-screen' : 'p-2 sm:p-4 md:p-6'
          }`}
          onClick={closePlayer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          <div
            className={`w-full bg-black shadow-2xl relative border border-white/10 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
              isFullscreen
                ? 'fixed inset-0 w-screen h-screen max-w-none max-h-none rounded-none border-0 p-0 m-0 z-50'
                : 'max-w-5xl xl:max-w-6xl max-h-[95vh] rounded-2xl sm:rounded-3xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`p-3 sm:p-4 text-white flex items-center justify-between gap-3 border-b border-white/10 transition-all ${
                isFullscreen
                  ? 'absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 via-black/60 to-transparent border-0'
                  : 'bg-slate-950/95 shrink-0'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden min-w-0">
                <YoutubeIcon className="w-4 h-4 text-red-500 shrink-0" />
                <h3
                  id="video-modal-title"
                  className="font-heading font-bold text-xs sm:text-sm truncate text-white drop-shadow"
                >
                  {activeVideo.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors"
                  title={isFullscreen ? 'Exit full screen' : 'Full screen'}
                  aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={closePlayer}
                  className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors"
                  aria-label="Close video player"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official YouTube Embedded Player (100% Filled Canvas) */}
            <div
              className={`w-full bg-black relative flex items-center justify-center overflow-hidden ${
                isFullscreen ? 'w-full h-full flex-1' : 'w-full'
              }`}
              style={
                isFullscreen
                  ? { width: '100%', height: '100%', flex: '1 1 auto' }
                  : { width: '100%', aspectRatio: '16 / 9', position: 'relative' }
              }
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&fs=1`}
                title={activeVideo.title}
                width="100%"
                height="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen={true}
                className="w-full h-full border-0 absolute inset-0 block"
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  border: 0,
                }}
              />
            </div>

            {/* Modal Footer: Description (Hidden in full screen to allow 100% full video canvas) */}
            {activeVideo.description && !isFullscreen && (
              <div className="p-3 sm:p-4 bg-slate-950 text-slate-300 text-xs sm:text-sm border-t border-white/5 shrink-0">
                <p className="line-clamp-2">{activeVideo.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosPage;
