import GalleryFolder from '../models/GalleryFolder.js';
import GalleryMedia from '../models/GalleryMedia.js';

export const INITIAL_TEMPLE_FOLDER = {
  name: 'SHRI SHANTAMALLESHWARA SWAMI TEMPLE IMAGES',
  slug: 'shri-shantamalleshwara-swami-temple-images',
  description:
    'A collection of sacred photographs, deity darshan, temple rituals, festivals and special celebrations of Shri Shantamalleshwara Swami Temple.',
  coverImage: '/assets/hero-lingam-new.jpeg',
  status: 'published',
  displayOrder: 1,
};

export const INITIAL_24_IMAGES = [
  // 1. Temple Lingams & Shrines
  {
    url: '/assets/hero-lingam-new.jpeg',
    title: 'Shri Shantamalleshwara Swami Jyotirlinga (Hero Sanctum)',
    category: 'Temple & Sanctum',
    description: 'Sacred Ishana Lingam representing the cosmic space element, consecrated with arrow marks from Kakatiya times.',
    tag: '',
    mediaType: 'image',
    displayOrder: 1,
    status: 'published',
  },
  {
    url: '/assets/temple-real-photo-clean.jpeg',
    title: 'Sanctum Sanctorum with Bilva & Sacred Chandan',
    category: 'Temple & Sanctum',
    description: 'Authentic sanctum photograph of Lord Malleswara adorned with sacred Bilva leaves, Chandan, and Kumkum.',
    tag: '',
    mediaType: 'image',
    displayOrder: 2,
    status: 'published',
  },
  {
    url: '/assets/temple-real-photo-nandi.jpeg',
    title: 'Sacred Nandi Vahana Guardian',
    category: 'Temple & Sanctum',
    description: 'Ancient stone-carved Nandi bull facing the inner sanctum of Lord Shiva atop Navaratna Shikhara.',
    tag: '',
    mediaType: 'image',
    displayOrder: 3,
    status: 'published',
  },
  {
    url: '/assets/temple-trishul-hilltop.jpeg',
    title: 'Sacred Golden Trishul on Hilltop',
    category: 'Temple & Sanctum',
    description: 'The majestic golden trident erected on Navaratna Shikhara hill overlooking the hills.',
    tag: '',
    mediaType: 'image',
    displayOrder: 4,
    status: 'published',
  },
  {
    url: '/assets/temple-hilltop-view.jpeg',
    title: 'Navaratna Shikhara Hilltop Sanctuary',
    category: 'Temple & Sanctum',
    description: 'Panoramic hilltop view of the 12th-century Kakatiya temple complex built on multicolored strata rock.',
    tag: '',
    mediaType: 'image',
    displayOrder: 5,
    status: 'published',
  },

  // 2. Sacred Deities (Pancha Lingas & Goddess)
  {
    url: '/assets/gallery/Bhogalingeswara_Shiva.jpeg',
    title: 'Sadyojata Linga — Bhogalingeswara Shiva',
    category: 'Sacred Deities',
    description: 'West-facing lingam representing the Prithvi (Earth) element behind the principal shrine.',
    tag: '',
    mediaType: 'image',
    displayOrder: 6,
    status: 'published',
  },
  {
    url: '/assets/gallery/Tyagarajeswara_Shiva.jpeg',
    title: 'Vamadeva Linga — Tyagarajeswara Shiva',
    category: 'Sacred Deities',
    description: 'North-facing lingam beside the holy spring pond, representing the Jala (Water) element.',
    tag: '',
    mediaType: 'image',
    displayOrder: 7,
    status: 'published',
  },
  {
    url: '/assets/gallery/Parvati_Ammavaru.jpeg',
    title: 'Goddess Parvati Ammavaru',
    category: 'Sacred Deities',
    description: 'The eternal Divine Mother Parvati, consort of Lord Shiva, worshipped with Sri Chakra Kumkumarchana.',
    tag: '',
    mediaType: 'image',
    displayOrder: 8,
    status: 'published',
  },
  {
    url: '/assets/gallery/Shivaya.jpeg',
    title: 'Sanctum Darshan & Devotion',
    category: 'Sacred Deities',
    description: 'Sacred offering in the inner sanctum surrounded by brass lamps and camphor glow.',
    tag: '',
    mediaType: 'image',
    displayOrder: 9,
    status: 'published',
  },
  {
    url: '/assets/gallery/Kalasha.jpeg',
    title: 'Sacred Kalasha Sthapana',
    category: 'Sacred Deities',
    description: 'Sacred Kalash filled with holy waters and mango leaves, embodying the divine supreme presence.',
    tag: '',
    mediaType: 'image',
    displayOrder: 10,
    status: 'published',
  },
  {
    url: '/assets/gallery/Havan.jpeg',
    title: 'Vedic Agni Havan Ritual',
    category: 'Sacred Deities',
    description: 'Priests performing Vedic Agni homam with ghee offerings, chanting ancient mantras for cosmic peace.',
    tag: '',
    mediaType: 'image',
    displayOrder: 11,
    status: 'published',
  },
  {
    url: '/assets/gallery/Sevak_Team.jpeg',
    title: 'Temple Sevak Team & Priests',
    category: 'Sacred Deities',
    description: 'Chinmaya Mission sevaks and priests dedicated to preserving the heritage of Shri Shantamalleshwara Swami.',
    tag: '',
    mediaType: 'image',
    displayOrder: 12,
    status: 'published',
  },

  // 3. Grand Festivals & Celebrations
  {
    url: '/assets/Maha_Shivaratri_upcome_2027.jpeg',
    title: 'Maha Shivaratri Mahotsavam 2027',
    category: 'Festivals & Homams',
    description: 'Grand all-night vigil celebrating the Great Night of Shiva with continuous Rudrabhishekam.',
    tag: '',
    mediaType: 'image',
    displayOrder: 13,
    status: 'published',
  },
  {
    url: '/assets/festival-maha-shivaratri.jpeg',
    title: 'Maha Shivaratri Temple Celebrations',
    category: 'Festivals & Homams',
    description: 'Thousands of devotees joining the sacred vigil and chanting Om Namah Shivaya through the night.',
    tag: '',
    mediaType: 'image',
    displayOrder: 14,
    status: 'published',
  },
  {
    url: '/assets/rudra_homam_upcome.jpeg',
    title: 'Maha Rudra Homam & Fire Ritual',
    category: 'Festivals & Homams',
    description: 'Most sacred Vedic ritual invoking Lord Shiva in his fierce Rudra form to ward off negative energies.',
    tag: '',
    mediaType: 'image',
    displayOrder: 15,
    status: 'published',
  },
  {
    url: '/assets/festival-rudra-homam.jpeg',
    title: 'Nakshatra Homam Celebrations',
    category: 'Festivals & Homams',
    description: 'Annual Vedic ritual balancing cosmic planetary influences for devotee peace and prosperity.',
    tag: '',
    mediaType: 'image',
    displayOrder: 16,
    status: 'published',
  },
  {
    url: '/assets/kartika_deepam_upcome.jpeg',
    title: 'Kartika Masam Deeparadhana',
    category: 'Festivals & Homams',
    description: 'A sacred month-long ritual of lighting thousands of clay oil lamps across the temple sanctum.',
    tag: '',
    mediaType: 'image',
    displayOrder: 17,
    status: 'published',
  },
  {
    url: '/assets/Sopana_deepa_upcome.jpeg',
    title: 'Kartika Sopana Deepotsavam',
    category: 'Festivals & Homams',
    description: 'Illuminating every step of the Navaratna Shikhara hill path with golden lamps on Kartika Pournami.',
    tag: '',
    mediaType: 'image',
    displayOrder: 18,
    status: 'published',
  },
  {
    url: '/assets/Shiva_parvati_kalyanam_new_upcome.jpeg',
    title: 'Shiva Parvati Kalyanam Celebrations',
    category: 'Festivals & Homams',
    description: 'Symbolizing the supreme union of pure consciousness (Shiva) and primordial energy (Shakti).',
    tag: '',
    mediaType: 'image',
    displayOrder: 19,
    status: 'published',
  },
  {
    url: '/assets/upcome_shiva_parvati_kalyanam.jpeg',
    title: 'Divine Kalyana Mahotsavam Banner',
    category: 'Festivals & Homams',
    description: 'Official temple banner for the celestial wedding festival of Lord Shiva and Goddess Parvati.',
    tag: '',
    mediaType: 'image',
    displayOrder: 20,
    status: 'published',
  },
  {
    url: '/assets/festival-kumbha-abhishekam.jpeg',
    title: 'Maha Kumbha Abhishekam Ceremony',
    category: 'Festivals & Homams',
    description: 'Sanctification ritual rejuvenating the temple by empowering the gopuram spire and deities.',
    tag: '',
    mediaType: 'image',
    displayOrder: 21,
    status: 'published',
  },
  {
    url: '/assets/Kalasha_puja_mega.jpeg',
    title: 'Mega Kalasha Puja Gathering',
    category: 'Festivals & Homams',
    description: 'Devotees participating in collective Kalasha puja with chanting of Sri Rudram and Chamakam.',
    tag: '',
    mediaType: 'image',
    displayOrder: 22,
    status: 'published',
  },
  {
    url: '/assets/Chinmaya_Amrit_Mahotsav.jpeg',
    title: 'Chinmaya Amrit Mahotsav (75 Years)',
    category: 'Festivals & Homams',
    description: 'Special celebrations commemorating 75 years of Chinmaya Mission service to Vedic spirituality.',
    tag: '',
    mediaType: 'image',
    displayOrder: 23,
    status: 'published',
  },
  {
    url: '/assets/rajat_mahotsav_past.jpeg',
    title: 'Rajata Mahotsav Silver Jubilee',
    category: 'Festivals & Homams',
    description: 'Celebrating 25 years of temple revival and cultural heritage preservation.',
    tag: '',
    mediaType: 'image',
    displayOrder: 24,
    status: 'published',
  },
];

/**
 * Ensures initial gallery folder and its 24 sacred media items exist.
 */
export const seedGalleryInitialData = async () => {
  try {
    let folder = await GalleryFolder.findOne({ slug: INITIAL_TEMPLE_FOLDER.slug });

    if (!folder) {
      folder = await GalleryFolder.create(INITIAL_TEMPLE_FOLDER);
      console.log(`[GallerySeed] Created initial folder: "${folder.name}" (${folder._id})`);
    }

    // Check media inside this folder
    const mediaCount = await GalleryMedia.countDocuments({ folderId: folder._id });
    if (mediaCount === 0) {
      const docsToInsert = INITIAL_24_IMAGES.map((item) => ({
        ...item,
        folderId: folder._id,
      }));
      await GalleryMedia.insertMany(docsToInsert);
      console.log(`[GallerySeed] Seeded all ${docsToInsert.length} sacred images into folder "${folder.name}".`);
    } else {
      // Clean tags and categories on existing documents in this folder
      await GalleryMedia.updateMany(
        { folderId: folder._id },
        { $set: { tag: '', category: '' } }
      );
    }
  } catch (err) {
    console.error('[GallerySeed Error]:', err.message);
  }
};
