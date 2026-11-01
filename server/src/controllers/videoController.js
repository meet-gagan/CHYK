import Video from '../models/Video.js';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../utils/youtube.js';

// @desc    Get all public videos (or all videos for admin)
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .lean();

    // Map to public shape
    const data = videos.map((v) => ({
      _id: v._id,
      title: v.title,
      description: v.description,
      youtubeId: v.youtubeId,
      thumbnailUrl: v.thumbnailUrl || getYouTubeThumbnailUrl(v.youtubeId),
      // Only include youtubeUrl if requested or in admin context, but safe to include for admin edit
      youtubeUrl: v.youtubeUrl,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error('[Video Controller] Error fetching videos:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve videos',
      errorCode: 'VIDEOS_FETCH_FAILED',
    });
  }
};

// @desc    Create a new YouTube video
// @route   POST /api/videos
// @access  Private/Admin
export const createVideo = async (req, res) => {
  try {
    const { youtubeUrl, title, description } = req.body;

    // 1. Validation: Required fields
    if (!youtubeUrl || !youtubeUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: 'YouTube Video URL is required',
        errorCode: 'YOUTUBE_URL_REQUIRED',
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Video Title is required',
        errorCode: 'VIDEO_TITLE_REQUIRED',
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'One-line Description is required',
        errorCode: 'VIDEO_DESCRIPTION_REQUIRED',
      });
    }

    // 2. Extract and validate YouTube ID
    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube Video URL. Please provide a valid youtube.com or youtu.be link.',
        errorCode: 'INVALID_YOUTUBE_URL',
      });
    }

    const thumbnailUrl = getYouTubeThumbnailUrl(youtubeId);

    const video = await Video.create({
      youtubeUrl: youtubeUrl.trim(),
      youtubeId,
      title: title.trim(),
      description: description.trim(),
      thumbnailUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Video added successfully',
      data: {
        _id: video._id,
        title: video.title,
        description: video.description,
        youtubeId: video.youtubeId,
        youtubeUrl: video.youtubeUrl,
        thumbnailUrl: video.thumbnailUrl,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      },
    });
  } catch (error) {
    console.error('[Video Controller] Error creating video:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create video',
      errorCode: 'VIDEO_CREATE_FAILED',
    });
  }
};

// @desc    Update an existing YouTube video
// @route   PUT /api/videos/:id
// @access  Private/Admin
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { youtubeUrl, title, description } = req.body;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
        errorCode: 'VIDEO_NOT_FOUND',
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Video Title is required',
        errorCode: 'VIDEO_TITLE_REQUIRED',
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'One-line Description is required',
        errorCode: 'VIDEO_DESCRIPTION_REQUIRED',
      });
    }

    // If youtubeUrl is provided and changed, validate and extract new ID
    if (youtubeUrl && youtubeUrl.trim() !== video.youtubeUrl) {
      const youtubeId = extractYouTubeId(youtubeUrl);
      if (!youtubeId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid YouTube Video URL. Please provide a valid youtube.com or youtu.be link.',
          errorCode: 'INVALID_YOUTUBE_URL',
        });
      }
      video.youtubeUrl = youtubeUrl.trim();
      video.youtubeId = youtubeId;
      video.thumbnailUrl = getYouTubeThumbnailUrl(youtubeId);
    }

    video.title = title.trim();
    video.description = description.trim();

    await video.save();

    res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      data: {
        _id: video._id,
        title: video.title,
        description: video.description,
        youtubeId: video.youtubeId,
        youtubeUrl: video.youtubeUrl,
        thumbnailUrl: video.thumbnailUrl,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      },
    });
  } catch (error) {
    console.error('[Video Controller] Error updating video:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update video',
      errorCode: 'VIDEO_UPDATE_FAILED',
    });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
        errorCode: 'VIDEO_NOT_FOUND',
      });
    }

    await Video.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    console.error('[Video Controller] Error deleting video:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete video',
      errorCode: 'VIDEO_DELETE_FAILED',
    });
  }
};

