import mongoose from 'mongoose';

const galleryMediaSchema = new mongoose.Schema(
  {
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryFolder',
      required: [true, 'Folder ID is required'],
      index: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
      lowercase: true,
      index: true,
    },
    url: {
      type: String,
      required: [true, 'Media URL is required'],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
      trim: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      default: '',
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      lowercase: true,
      index: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.media_url = ret.url;
        ret.thumbnail_url = ret.thumbnailUrl || (ret.mediaType === 'video' ? '' : ret.url);
        ret.media_type = ret.mediaType;
        ret.folder_id = ret.folderId;
        ret.display_order = ret.displayOrder;
        ret.created_at = ret.createdAt;
        ret.updated_at = ret.updatedAt;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Indexes for fast retrieval by folder and sorting by displayOrder
galleryMediaSchema.index({ folderId: 1, status: 1, displayOrder: 1, createdAt: 1 });
galleryMediaSchema.index({ mediaType: 1, status: 1 });

export default mongoose.model('GalleryMedia', galleryMediaSchema);
