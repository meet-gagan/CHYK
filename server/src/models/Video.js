import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    youtubeUrl: {
      type: String,
      required: [true, 'YouTube Video URL is required'],
      trim: true,
    },
    youtubeId: {
      type: String,
      required: [true, 'Valid YouTube Video ID is required'],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Video Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'One-line Description is required'],
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to safely return public fields
videoSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    title: this.title,
    description: this.description,
    youtubeId: this.youtubeId,
    thumbnailUrl: this.thumbnailUrl || `https://img.youtube.com/vi/${this.youtubeId}/hqdefault.jpg`,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Video = mongoose.model('Video', videoSchema);
export default Video;

