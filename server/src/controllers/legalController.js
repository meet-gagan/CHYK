import LegalDocument from '../models/LegalDocument.js';
import { DEFAULT_LEGAL_DOCUMENTS } from '../utils/defaultLegalDocs.js';

// Helper to sanitize key
const getKey = (website, type) => `${website}_${type}`;

/**
 * Ensure a specific legal document exists, or seed it from defaults
 */
export const ensureLegalDoc = async (website, type) => {
  const validWebsites = ['chinmaya', 'marathon'];
  const validTypes = ['terms', 'privacy'];

  if (!validWebsites.includes(website) || !validTypes.includes(type)) {
    throw new Error(`Invalid website (${website}) or document type (${type})`);
  }

  let doc = await LegalDocument.findOne({ website, documentType: type });
  if (!doc) {
    const key = getKey(website, type);
    const defaultData = DEFAULT_LEGAL_DOCUMENTS[key];
    if (defaultData) {
      doc = await LegalDocument.create(defaultData);
      console.log(`[Legal] Seeded default document: ${website} / ${type}`);
    }
  }
  return doc;
};

/**
 * GET /api/legal/:website/:type
 * Public: Get a single legal document
 */
export const getLegalDoc = async (req, res) => {
  try {
    const { website, type } = req.params;
    const doc = await ensureLegalDoc(website, type);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: `Legal document not found for ${website} - ${type}`,
      });
    }

    res.json({
      success: true,
      data: doc,
    });
  } catch (err) {
    console.error('[getLegalDoc Error]:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/legal/:website/:type
 * Admin: Update a legal document
 */
export const updateLegalDoc = async (req, res) => {
  try {
    const { website, type } = req.params;
    const { title, subtitle, lastUpdated, sections, metadata } = req.body;

    const validWebsites = ['chinmaya', 'marathon'];
    const validTypes = ['terms', 'privacy'];

    if (!validWebsites.includes(website) || !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid website or document type',
      });
    }

    let doc = await LegalDocument.findOne({ website, documentType: type });
    if (!doc) {
      doc = new LegalDocument({ website, documentType: type });
    }

    if (title !== undefined) doc.title = title;
    if (subtitle !== undefined) doc.subtitle = subtitle;
    if (lastUpdated !== undefined) doc.lastUpdated = lastUpdated;
    if (Array.isArray(sections)) doc.sections = sections;
    if (metadata !== undefined) doc.metadata = metadata;

    await doc.save();

    res.json({
      success: true,
      message: `${website === 'chinmaya' ? 'Chinmaya Mission' : 'Marathon'} ${type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'} updated successfully`,
      data: doc,
    });
  } catch (err) {
    console.error('[updateLegalDoc Error]:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/legal/:website/:type/reset
 * Admin: Reset a document to default content
 */
export const resetLegalDoc = async (req, res) => {
  try {
    const { website, type } = req.params;
    const key = getKey(website, type);
    const defaultData = DEFAULT_LEGAL_DOCUMENTS[key];

    if (!defaultData) {
      return res.status(404).json({ success: false, message: 'Default document template not found' });
    }

    const doc = await LegalDocument.findOneAndUpdate(
      { website, documentType: type },
      { $set: defaultData },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: `Reset ${website} ${type} to default successfully`,
      data: doc,
    });
  } catch (err) {
    console.error('[resetLegalDoc Error]:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/legal/all
 * Admin: Get all 4 legal documents
 */
export const getAllLegalDocs = async (req, res) => {
  try {
    const keys = ['chinmaya_terms', 'chinmaya_privacy', 'marathon_terms', 'marathon_privacy'];
    for (const k of keys) {
      const [website, type] = k.split('_');
      await ensureLegalDoc(website, type);
    }

    const docs = await LegalDocument.find().lean();
    const structured = {
      chinmaya: {
        terms: docs.find((d) => d.website === 'chinmaya' && d.documentType === 'terms') || null,
        privacy: docs.find((d) => d.website === 'chinmaya' && d.documentType === 'privacy') || null,
      },
      marathon: {
        terms: docs.find((d) => d.website === 'marathon' && d.documentType === 'terms') || null,
        privacy: docs.find((d) => d.website === 'marathon' && d.documentType === 'privacy') || null,
      },
    };

    res.json({
      success: true,
      data: structured,
    });
  } catch (err) {
    console.error('[getAllLegalDocs Error]:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
