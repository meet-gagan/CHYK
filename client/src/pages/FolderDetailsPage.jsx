import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { galleryService } from '../services/api';
import { GALLERY_IMAGES } from './GalleryPage';
import './GalleryPage.css';

const GalleryMediaCardThumbnail = ({ item, isVideo }) => {
  const [thumbError, setThumbError] = useState(false);
  const videoRef = useRef(null);

  const videoUrl = item.url || item.media_url || item.mediaUrl || '';
  const customThumb = (item.thumbnailUrl || '').trim();
  const isVideoFileThumb = Boolean(customThumb && customThumb.match(/\.(mp4|webm|mov|mkv|avi|m4v)(\?.*)?$/i));
  const hasCustomImage = customThumb && !isVideoFileThumb && customThumb !== videoUrl && !thumbError;

  const handleLoadedMetadata = (e) => {
    try {
      if (e.target.currentTime === 0) {
        e.target.currentTime = 0.001;
      }
    } catch (_) {}
  };

  if (isVideo) {
    if (hasCustomImage) {
      return (
        <img
          src={customThumb}
          alt={item.title}
          loading="lazy"
          onError={() => setThumbError(true)}
        />
      );
    }

    const ytMatch = videoUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    if (ytMatch?.[1]) {
      return (
        <img
          src={`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`}
          alt={item.title}
          loading="lazy"
          onError={() => setThumbError(true)}
        />
      );
    }

    return (
      <video
        ref={videoRef}
        src={videoUrl}
        className="gallery-video-poster-element"
        preload="metadata"
        muted
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
      />
    );
  }

  const imageUrl = item.thumbnailUrl || item.thumbnail_url || item.url || item.media_url;
  return (
    <img
      src={imageUrl}
      alt={item.title}
      loading="lazy"
      onError={(e) => {
        if (!e.target.dataset.tried) {
          e.target.dataset.tried = '1';
          e.target.src = '/assets/images/temple-seva-shiva-kalyanam.jpg';
        }
      }}
    />
  );
};

export const FolderDetailsPage = () => {
  const { slug } = useParams();

  const [folder, setFolder] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lightbox Modal state for Images
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  // Video Modal state
  const [activeVideoItem, setActiveVideoItem] = useState(null);

  // Fetch Folder & Media
  useEffect(() => {
    let isMounted = true;
    const fetchFolderData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await galleryService.getPublicFolderMedia(slug);
        if (isMounted && res.data?.success) {
          setFolder(res.data.folder);
          setMediaItems(res.data.data || []);
        }
      } catch (err) {
        console.warn('[FolderDetails] API call failed, evaluating fallback:', err.message);
        // Fallback for initial temple folder if API unreachable
        if (
          slug === 'shri-shantamalleshwara-swami-temple-images' ||
          slug === 'sacred-gallery' ||
          slug === 'default'
        ) {
          if (isMounted) {
            setFolder({
              name: 'SHRI SHANTAMALLESHWARA SWAMI TEMPLE IMAGES',
              slug: 'shri-shantamalleshwara-swami-temple-images',
              description:
                'A collection of sacred photographs, deity darshan, temple rituals, festivals and special celebrations of Shri Shantamalleshwara Swami Temple.',
              coverImage: '/assets/hero-lingam-new.jpeg',
            });
            setMediaItems(
              GALLERY_IMAGES.map((img, idx) => ({
                _id: img.id,
                title: img.title,
                description: img.desc,
                category: '',
                tag: '',
                url: img.src,
                mediaType: 'image',
                displayOrder: idx + 1,
              }))
            );
          }
        } else if (isMounted) {
          setError('Collection not found or currently unavailable.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFolderData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Dynamic Categories from media
  // Image items only for the Lightbox carousel
  const imageItems = useMemo(() => {
    return mediaItems.filter((m) => {
      const isVid =
        m.mediaType === 'video' ||
        m.media_type === 'video' ||
        Boolean((m.url || m.media_url || '').match(/\.(mp4|webm|mov|mkv|avi|m4v)(\?.*)?$/i));
      return !isVid;
    });
  }, [mediaItems]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev + 1) % imageItems.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev - 1 + imageItems.length) % imageItems.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, imageItems]);

  // Lock background scroll when lightbox or video modal is open
  useEffect(() => {
    if (activeLightboxIndex !== null || activeVideoItem !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeLightboxIndex, activeVideoItem]);

  const currentLightboxImg =
    activeLightboxIndex !== null && imageItems[activeLightboxIndex]
      ? imageItems[activeLightboxIndex]
      : null;

  return (
    <div className="gallery-page-container">
      <div className="gallery-content-wrap">
        {/* Sub-navigation bar */}
        <div className="gallery-subnav">
          <div className="gallery-subnav-left">
            <span className="gallery-subnav-om">ॐ</span>
            <span className="gallery-subnav-title">
              Chinmaya Mission & Temple Visual Archive
            </span>
          </div>
          <Link to="/gallery" className="gallery-subnav-back" title="Back to Gallery Collections">
            ← Back
          </Link>
        </div>

        {/* Folder Header Banner */}
        {folder && (
          <header className="gallery-folder-header-card">
            <h1 className="gallery-hero-title">{folder.name}</h1>
          </header>
        )}
      </div>

      {/* Media Grid */}
      <div className="gallery-content-wrap">
        {loading ? (
          <div className="text-center py-24 text-[var(--ivory-dim)] font-serif text-lg">
            <div className="gallery-subnav-om text-4xl animate-pulse mb-3">ॐ</div>
            Loading sacred media archive...
          </div>
        ) : error ? (
          <div className="gallery-empty-state">
            <div className="gallery-empty-om">ॐ</div>
            <h3 className="gallery-empty-title">Collection Unavailable</h3>
            <p>{error}</p>
            <Link
              to="/gallery"
              className="gallery-subnav-back"
              style={{ marginTop: 20 }}
            >
              ← Back to Gallery
            </Link>
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="gallery-empty-state">
            <div className="gallery-empty-om">ॐ</div>
            <h3 className="gallery-empty-title">No Items Found</h3>
            <p>Photographs and videos for this collection will be added soon.</p>
            <Link
              to="/gallery"
              className="gallery-subnav-back"
              style={{ marginTop: 20 }}
            >
              ← Back to Gallery
            </Link>
          </div>
        ) : (
          <div className="gallery-images-grid">
            {mediaItems.map((item) => {
              const isVideo =
                item.mediaType === 'video' ||
                item.media_type === 'video' ||
                Boolean((item.url || item.media_url || '').match(/\.(mp4|webm|mov|mkv|avi|m4v)(\?.*)?$/i));
              const imgIndex = imageItems.findIndex((m) => m._id === item._id);

              return (
                <article key={item._id} className="gallery-image-card">
                  {/* Thumbnail Wrap */}
                  <div
                    className="gallery-thumb-wrap"
                    onClick={() => {
                      if (isVideo) {
                        setActiveVideoItem(item);
                      } else {
                        setActiveLightboxIndex(imgIndex >= 0 ? imgIndex : 0);
                      }
                    }}
                    title={isVideo ? 'Click to play video' : 'Click to view high-resolution image'}
                  >
                    <GalleryMediaCardThumbnail item={item} isVideo={isVideo} />

                    {isVideo ? (
                      <div className="gallery-video-play-indicator">
                        <div className="gallery-play-btn-circle" aria-label="Play Video">
                          <svg
                            className="w-6 h-6 ml-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="gallery-video-tag-badge">VIDEO ARCHIVE</span>
                      </div>
                    ) : (
                      <div className="gallery-thumb-overlay">
                        <span className="gallery-zoom-badge">Full View 🔍</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="gallery-card-body">
                    <div>
                      <h2 className="gallery-card-title">{item.title}</h2>
                      <p className="gallery-card-desc">{item.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {currentLightboxImg && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={() => setActiveLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="gallery-lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="gallery-lightbox-close"
              onClick={() => setActiveLightboxIndex(null)}
              aria-label="Close image lightbox"
            >
              ×
            </button>

            {/* Left Navigation Arrow */}
            {imageItems.length > 1 && (
              <button
                className="gallery-nav-arrow left"
                onClick={() =>
                  setActiveLightboxIndex(
                    (prev) => (prev - 1 + imageItems.length) % imageItems.length
                  )
                }
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            {/* Right Navigation Arrow */}
            {imageItems.length > 1 && (
              <button
                className="gallery-nav-arrow right"
                onClick={() =>
                  setActiveLightboxIndex((prev) => (prev + 1) % imageItems.length)
                }
                aria-label="Next image"
              >
                ›
              </button>
            )}

            {/* Main Lightbox Image View */}
            <div className="gallery-lightbox-image-area">
              <img
                src={currentLightboxImg.url || currentLightboxImg.media_url}
                alt={currentLightboxImg.title}
              />
            </div>

            {/* Details Bar */}
            <div className="gallery-lightbox-info">
              <div>
                <h2 className="gallery-lightbox-title">{currentLightboxImg.title}</h2>
                <p className="gallery-lightbox-desc">{currentLightboxImg.description}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span
                  style={{
                    fontFamily: 'var(--f-mono)',
                    fontSize: 13,
                    color: 'var(--ivory-faint)',
                  }}
                >
                  {activeLightboxIndex + 1} / {imageItems.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideoItem && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={() => setActiveVideoItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="gallery-lightbox-dialog max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="gallery-lightbox-close"
              onClick={() => setActiveVideoItem(null)}
              aria-label="Close video player"
            >
              ×
            </button>

            <div className="bg-black flex items-center justify-center aspect-video w-full">
              {(() => {
                const vidUrl = activeVideoItem.url || activeVideoItem.media_url || '';
                return vidUrl.includes('youtube.com') || vidUrl.includes('youtu.be') ? (
                  <iframe
                    src={vidUrl.replace('watch?v=', 'embed/')}
                    title={activeVideoItem.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={vidUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                );
              })()}
            </div>

            <div className="gallery-lightbox-info">
              <div>
                <h2 className="gallery-lightbox-title">{activeVideoItem.title}</h2>
                <p className="gallery-lightbox-desc">{activeVideoItem.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderDetailsPage;
