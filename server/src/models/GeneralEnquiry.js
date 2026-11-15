import mongoose from 'mongoose';

const generalEnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email ID is required'],
      trim: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    learningGoal: {
      type: String,
      required: [true, 'What do you want to learn from this is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'READ', 'RESPONDED'],
      default: 'NEW',
      index: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

generalEnquirySchema.index({ status: 1, createdAt: -1 });
generalEnquirySchema.index({ createdAt: -1 });

export default mongoose.model('GeneralEnquiry', generalEnquirySchema);
