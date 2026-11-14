import mongoose from 'mongoose';

const galleryFolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Folder Name is required'],
      trim: true,
      maxlength: [150, 'Folder Name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Folder Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    coverImage: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      lowercase: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
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
        ret.cover_image = ret.coverImage;
        ret.display_order = ret.displayOrder;
        ret.created_at = ret.createdAt;
        ret.updated_at = ret.updatedAt;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// High performance indexes
galleryFolderSchema.index({ status: 1, displayOrder: 1, createdAt: -1 });

export default mongoose.model('GalleryFolder', galleryFolderSchema);
