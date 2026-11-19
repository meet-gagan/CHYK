import mongoose from 'mongoose';

const legalSectionSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    order: { type: Number, default: 0 },
    number: { type: Number, default: 1 },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
  },
  { _id: true }
);

const legalDocumentSchema = new mongoose.Schema(
  {
    website: {
      type: String,
      required: true,
      enum: ['chinmaya', 'marathon'],
      index: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: ['terms', 'privacy'],
      index: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    lastUpdated: { type: String, default: 'January 2027' },
    sections: [legalSectionSchema],
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

legalDocumentSchema.index({ website: 1, documentType: 1 }, { unique: true });

export default mongoose.model('LegalDocument', legalDocumentSchema);
