import mongoose from 'mongoose';

const marathonSiteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'marathon',
      unique: true,
      index: true,
    },
    // true = Live marathon website | false = Coming Soon mode
    isLive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('MarathonSiteSettings', marathonSiteSettingsSchema);

