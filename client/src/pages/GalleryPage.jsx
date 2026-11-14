import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { galleryService } from '../services/api';
import './GalleryPage.css';

// Comprehensive Registry of Temple & Mission Sacred Images (Preserved for backward compatibility)
export const GALLERY_IMAGES = [
  // 1. Temple Lingams & Shrines
  {
    id: 'hero-lingam',
    src: '/assets/hero-lingam-new.jpeg',
    title: 'Shri Shantamalleshwara Swami Jyotirlinga (Hero Sanctum)',
    category: 'Temple & Sanctum',
    desc: 'Sacred Ishana Lingam representing the cosmic space element, consecrated with arrow marks from Kakatiya times.',
    tag: 'Principal Shrine',
  },
  {
    id: 'temple-real-clean',
    src: '/assets/temple-real-photo-clean.jpeg',
    title: 'Sanctum Sanctorum with Bilva & Sacred Chandan',
    category: 'Temple & Sanctum',
    desc: 'Authentic sanctum photograph of Lord Malleswara adorned with sacred Bilva leaves, Chandan, and Kumkum.',
    tag: 'Sanctum Photograph',
  },
  {
    id: 'temple-nandi',
    src: '/assets/temple-real-photo-nandi.jpeg',
    title: 'Sacred Nandi Vahana Guardian',
    category: 'Temple & Sanctum',
    desc: 'Ancient stone-carved Nandi bull facing the inner sanctum of Lord Shiva atop Navaratna Shikhara.',
    tag: 'Nandi Vahana',
  },
  {
    id: 'temple-hilltop-trishul',
    src: '/assets/temple-trishul-hilltop.jpeg',
    title: 'Sacred Golden Trishul on Hilltop',
    category: 'Temple & Sanctum',
    desc: 'The majestic golden trident erected on Navaratna Shikhara hill overlooking the hills.',
    tag: 'Sacred Trishul',
  },
  {
    id: 'temple-hilltop-panorama',
    src: '/assets/temple-hilltop-view.jpeg',
    title: 'Navaratna Shikhara Hilltop Sanctuary',
    category: 'Temple & Sanctum',
    desc: 'Panoramic hilltop view of the 12th-century Kakatiya temple complex built on multicolored strata rock.',
    tag: 'Hilltop View',
  },

  // 2. Sacred Deities (Pancha Lingas & Goddess)
  {
    id: 'bhogalingeswara',
    src: '/gallery/Bhogalingeswara_Shiva.jpeg',
    title: 'Sadyojata Linga — Bhogalingeswara Shiva',
    category: 'Sacred Deities',
    desc: 'West-facing lingam representing the Prithvi (Earth) element behind the principal shrine.',
    tag: 'Pancha Linga',
  },
  {
    id: 'tyagarajeswara',
    src: '/gallery/Tyagarajeswara_Shiva.jpeg',
    title: 'Vamadeva Linga — Tyagarajeswara Shiva',
    category: 'Sacred Deities',
    desc: 'North-facing lingam beside the holy spring pond, representing the Jala (Water) element.',
    tag: 'Pancha Linga',
  },
  {
    id: 'parvati-ammavaru',
    src: '/gallery/Parvati_Ammavaru.jpeg',
    title: 'Goddess Parvati Ammavaru',
    category: 'Sacred Deities',
    desc: 'The eternal Divine Mother Parvati, consort of Lord Shiva, worshipped with Sri Chakra Kumkumarchana.',
    tag: 'Divine Mother',
  },
  {
    id: 'shivaya-darshan',
    src: '/gallery/Shivaya.jpeg',
    title: 'Sanctum Darshan & Devotion',
    category: 'Sacred Deities',
    desc: 'Sacred offering in the inner sanctum surrounded by brass lamps and camphor glow.',
    tag: 'Darshan',
  },
  {
    id: 'kalasha-sthapana',
    src: '/gallery/Kalasha.jpeg',
    title: 'Sacred Kalasha Sthapana',
    category: 'Sacred Deities',
    desc: 'Sacred Kalash filled with holy waters and mango leaves, embodying the divine supreme presence.',
    tag: 'Vedic Ritual',
  },
  {
    id: 'havan-sacred-fire',
    src: '/gallery/Havan.jpeg',
    title: 'Vedic Agni Havan Ritual',
    category: 'Sacred Deities',
    desc: 'Priests performing Vedic Agni homam with ghee offerings, chanting ancient mantras for cosmic peace.',
    tag: 'Havan',
  },
  {
    id: 'sevak-team',
    src: '/gallery/Sevak_Team.jpeg',
    title: 'Temple Sevak Team & Priests',
    category: 'Sacred Deities',
    desc: 'Chinmaya Mission sevaks and priests dedicated to preserving the heritage of Shri Shantamalleshwara Swami.',
    tag: 'Sevak Sangha',
  },

  // 3. Grand Festivals & Celebrations
  {
    id: 'maha-shivaratri-2027',
    src: '/assets/Maha_Shivaratri_upcome_2027.jpeg',
    title: 'Maha Shivaratri Mahotsavam 2027',
    category: 'Festivals & Homams',
    desc: 'Grand all-night vigil celebrating the Great Night of Shiva with continuous Rudrabhishekam.',
    tag: 'Grand Festival',
  },
  {
    id: 'maha-shivaratri-fest',
    src: '/assets/festival-maha-shivaratri.jpeg',
    title: 'Maha Shivaratri Temple Celebrations',
    category: 'Festivals & Homams',
    desc: 'Thousands of devotees joining the sacred vigil and chanting Om Namah Shivaya through the night.',
    tag: 'Maha Shivaratri',
  },
  {
    id: 'rudra-homam-upcome',
    src: '/assets/rudra_homam_upcome.jpeg',
    title: 'Maha Rudra Homam & Fire Ritual',
    category: 'Festivals & Homams',
    desc: 'Most sacred Vedic ritual invoking Lord Shiva in his fierce Rudra form to ward off negative energies.',
    tag: 'Vedic Homam',
  },
  {
    id: 'rudra-homam-fest',
    src: '/assets/festival-rudra-homam.jpeg',
    title: 'Nakshatra Homam Celebrations',
    category: 'Festivals & Homams',
    desc: 'Annual Vedic ritual balancing cosmic planetary influences for devotee peace and prosperity.',
    tag: 'Nakshatra Homam',
  },
  {
    id: 'kartika-deepam',
    src: '/assets/kartika_deepam_upcome.jpeg',
    title: 'Kartika Masa Deeparadhana',
    category: 'Festivals & Homams',
    desc: 'A sacred month-long ritual of lighting thousands of clay oil lamps across the temple sanctum.',
    tag: 'Deeparadhana',
  },
  {
    id: 'sopana-deepotsavam',
    src: '/assets/Sopana_deepa_upcome.jpeg',
    title: 'Kartika Sopana Deepotsavam',
    category: 'Festivals & Homams',
    desc: 'Illuminating every step of the Navaratna Shikhara hill path with golden lamps on Kartika Pournami.',
    tag: 'Deepotsavam',
  },
  {
    id: 'shiva-parvati-kalyanam-new',
    src: '/assets/Shiva_parvati_kalyanam_new_upcome.jpeg',
    title: 'Shiva Parvati Kalyanam Celebrations',
    category: 'Festivals & Homams',
    desc: 'Symbolizing the supreme union of pure consciousness (Shiva) and primordial energy (Shakti).',
    tag: 'Kalyanam',
  },
  {
    id: 'upcome-kalyanam',
    src: '/assets/upcome_shiva_parvati_kalyanam.jpeg',
    title: 'Divine Kalyana Mahotsavam Banner',
    category: 'Festivals & Homams',
    desc: 'Official temple banner for the celestial wedding festival of Lord Shiva and Goddess Parvati.',
    tag: 'Festival Banner',
  },
  {
    id: 'kumbha-abhishekam',
    src: '/assets/festival-kumbha-abhishekam.jpeg',
    title: 'Maha Kumbha Abhishekam Ceremony',
    category: 'Festivals & Homams',
    desc: 'Sanctification ritual rejuvenating the temple by empowering the gopuram spire and deities.',
    tag: 'Kumbha Abhishekam',
  },
  {
    id: 'kalasha-puja-mega',
    src: '/assets/Kalasha_puja_mega.jpeg',
    title: 'Mega Kalasha Puja Gathering',
    category: 'Festivals & Homams',
    desc: 'Devotees participating in collective Kalasha puja with chanting of Sri Rudram and Chamakam.',
    tag: 'Kalasha Puja',
  },
  {
    id: 'chinmaya-amrit-mahotsav',
    src: '/assets/Chinmaya_Amrit_Mahotsav.jpeg',
    title: 'Chinmaya Amrit Mahotsav (75 Years)',
    category: 'Festivals & Homams',
    desc: 'Special celebrations commemorating 75 years of Chinmaya Mission service to Vedic spirituality.',
    tag: 'Amrit Mahotsav',
  },
  {
    id: 'rajat-mahotsav',
    src: '/assets/rajat_mahotsav_past.jpeg',
    title: 'Rajata Mahotsav Silver Jubilee',
    category: 'Festivals & Homams',
    desc: 'Celebrating 25 years of temple revival and cultural heritage preservation.',
    tag: 'Silver Jubilee',
  },
];

const INITIAL_FALLBACK_FOLDER = {
  _id: 'default-temple-folder',
  name: 'SHRI SHANTAMALLESHWARA SWAMI TEMPLE IMAGES',
  slug: 'shri-shantamalleshwara-swami-temple-images',
  description:
    'A collection of sacred photographs, deity darshan, temple rituals, festivals and special celebrations of Shri Shantamalleshwara Swami Temple.',
  coverImage: '/assets/hero-lingam-new.jpeg',
  cover_image: '/assets/hero-lingam-new.jpeg',
  totalMedia: 24,
  imageCount: 24,
  videoCount: 0,
};

export const GalleryPage = () => {
  const [folders, setFolders] = useState([INITIAL_FALLBACK_FOLDER]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch Public Folders
  useEffect(() => {
    let isMounted = true;
    const loadFolders = async () => {
      try {
        const res = await galleryService.getPublicFolders();
        if (isMounted && res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setFolders(res.data.data);
        }
      } catch (err) {
        console.warn('[GalleryPage] Failed to fetch public folders from API, using fallback:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFolders();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered Folders based on Search
  const filteredFolders = useMemo(() => {
    return folders.filter((folder) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      const matchName = folder.name && folder.name.toLowerCase().includes(q);
      const matchDesc = folder.description && folder.description.toLowerCase().includes(q);
      return matchName || matchDesc;
    });
  }, [folders, search]);

  return (
    <div className="gallery-page-container">
      <div className="gallery-content-wrap">
        {/* Sub-navigation bar */}
        <div className="gallery-subnav">
          <div className="gallery-subnav-left">
            <span className="gallery-subnav-om">ॐ</span>
            <span className="gallery-subnav-title">Chinmaya Mission & Temple Visual Archive</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="gallery-hero">
          <h1 className="gallery-hero-title">Sacred Image & Video Collections</h1>
          <p className="gallery-hero-subtitle">
            Explore dedicated photographic archives, deity darshans, Vedic havans, hilltop vistas, and grand festival celebrations preserved across Chinmaya Mission Adoni.
          </p>
        </section>
      </div>

      {/* Controls Bar: Search */}
      <div className="gallery-controls-bar">
        <div className="gallery-content-wrap">
          <div className="gallery-controls-flex">
            {/* Search Input */}
            <div className="gallery-search-box">
              <span className="gallery-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search sacred collections by title or festival..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="gallery-clear-search"
                  onClick={() => setSearch('')}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="text-xs font-serif text-[var(--ivory-dim)] font-bold">
              {filteredFolders.length} {filteredFolders.length === 1 ? 'Collection' : 'Collections'} Available
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Folder Collection Cards */}
      <div className="gallery-content-wrap">
        {loading ? (
          <div className="text-center py-24 text-[var(--ivory-dim)] font-serif text-lg">
            <div className="gallery-subnav-om text-4xl animate-pulse mb-3">ॐ</div>
            Loading sacred collections...
          </div>
        ) : filteredFolders.length === 0 ? (
          <div className="gallery-empty-state">
            <div className="gallery-empty-om">ॐ</div>
            <h3 className="gallery-empty-title">No Collections Found</h3>
            <p>No sacred collection matched your query "{search}". Try searching for "Temple" or "Images".</p>
            <button
              onClick={() => setSearch('')}
              className="gallery-subnav-back"
              style={{ marginTop: 20 }}
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="gallery-collections-grid">
            {filteredFolders.map((folder) => {
              const coverImg =
                folder.coverImage ||
                folder.cover_image ||
                '/assets/hero-lingam-new.jpeg';
              const totalItems =
                folder.totalMedia !== undefined
                  ? folder.totalMedia
                  : (folder.imageCount || 0) + (folder.videoCount || 0);

              return (
                <Link
                  key={folder._id || folder.slug}
                  to={`/gallery/${folder.slug}`}
                  className="gallery-collection-card group"
                >
                  {/* Cover Image & Count Badge */}
                  <div className="gallery-collection-cover-wrap">
                    <img
                      src={coverImg}
                      alt={folder.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/assets/hero-lingam-new.jpeg';
                      }}
                    />
                    <div className="gallery-collection-overlay">
                      <span className="gallery-collection-count-badge">
                        📁 {totalItems} {totalItems === 1 ? 'Media Item' : 'Items'}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="gallery-collection-body">
                    <h2 className="gallery-collection-title group-hover:text-[var(--gold)] transition-colors">
                      {folder.name}
                    </h2>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
