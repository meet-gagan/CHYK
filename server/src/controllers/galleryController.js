import mongoose from 'mongoose';
import GalleryFolder from '../models/GalleryFolder.js';
import GalleryMedia from '../models/GalleryMedia.js';
import { uploadToR2, deleteFromR2 } from '../config/r2.js';
import { seedGalleryInitialData } from '../utils/gallerySeed.js';

// Helper to sanitize slug
const generateSlug = (name) => {
  return (name || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper to check valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Get all published gallery folders with media counts
// @route   GET /api/gallery/folders/public
// @access  Public
export const getPublicFolders = async (req, res) => {
  try {
    const totalCount = await GalleryFolder.countDocuments();
    if (totalCount === 0) {
      await seedGalleryInitialData();
    }

    const folders = await GalleryFolder.find({ status: 'published' })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    // Calculate media counts for each folder
    const folderIds = folders.map((f) => f._id);
    const mediaCounts = await GalleryMedia.aggregate([
      {
        $match: {
          folderId: { $in: folderIds },
          status: 'published',
        },
      },
      {
        $group: {
          _id: '$folderId',
          totalMedia: { $sum: 1 },
          imageCount: {
            $sum: { $cond: [{ $eq: ['$mediaType', 'image'] }, 1, 0] },
          },
          videoCount: {
            $sum: { $cond: [{ $eq: ['$mediaType', 'video'] }, 1, 0] },
          },
        },
      },
    ]);

    const countMap = {};
    mediaCounts.forEach((c) => {
      countMap[c._id.toString()] = c;
    });

    const enrichedFolders = folders.map((f) => {
      const counts = countMap[f._id.toString()] || { totalMedia: 0, imageCount: 0, videoCount: 0 };
      return {
        ...f,
        cover_image: f.coverImage,
        totalMedia: counts.totalMedia,
        imageCount: counts.imageCount,
        videoCount: counts.videoCount,
      };
    });

    res.json({
      success: true,
      data: enrichedFolders,
    });
  } catch (err) {
    console.error('[Get Public Folders Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve gallery folders',
      errorCode: 'GALLERY_FETCH_ERROR',
    });
  }
};

// @desc    Get single published folder by slug or ID
// @route   GET /api/gallery/folders/public/:idOrSlug
// @access  Public
export const getPublicFolder = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    const query = { status: 'published' };
    if (isValidObjectId(idOrSlug)) {
      query.$or = [{ _id: idOrSlug }, { slug: idOrSlug }];
    } else {
      query.slug = idOrSlug.toLowerCase();
    }

    let folder = await GalleryFolder.findOne(query).lean();

    // If initial folder query fails, try seeding first
    if (!folder) {
      await seedGalleryInitialData();
      folder = await GalleryFolder.findOne(query).lean();
    }

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Gallery folder not found or unpublished',
        errorCode: 'FOLDER_NOT_FOUND',
      });
    }

    const counts = await GalleryMedia.aggregate([
      {
        $match: {
          folderId: folder._id,
          status: 'published',
        },
      },
      {
        $group: {
          _id: null,
          totalMedia: { $sum: 1 },
          imageCount: {
            $sum: { $cond: [{ $eq: ['$mediaType', 'image'] }, 1, 0] },
          },
          videoCount: {
            $sum: { $cond: [{ $eq: ['$mediaType', 'video'] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = counts[0] || { totalMedia: 0, imageCount: 0, videoCount: 0 };

    res.json({
      success: true,
      data: {
        ...folder,
        cover_image: folder.coverImage,
        totalMedia: stats.totalMedia,
        imageCount: stats.imageCount,
        videoCount: stats.videoCount,
      },
    });
  } catch (err) {
    console.error('[Get Public Folder Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve folder details',
      errorCode: 'FOLDER_FETCH_ERROR',
    });
  }
};

// @desc    Get published media for a folder (public)
// @route   GET /api/gallery/folders/public/:idOrSlug/media
// @access  Public
export const getPublicFolderMedia = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const { category, search, mediaType } = req.query;

    const folderQuery = { status: 'published' };
    if (isValidObjectId(idOrSlug)) {
      folderQuery.$or = [{ _id: idOrSlug }, { slug: idOrSlug }];
    } else {
      folderQuery.slug = idOrSlug.toLowerCase();
    }

    let folder = await GalleryFolder.findOne(folderQuery);
    if (!folder) {
      await seedGalleryInitialData();
      folder = await GalleryFolder.findOne(folderQuery);
    }

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Gallery folder not found or unpublished',
        errorCode: 'FOLDER_NOT_FOUND',
      });
    }

    const mediaFilter = {
      folderId: folder._id,
      status: 'published',
    };

    if (category && category !== 'All' && category !== 'ALL') {
      mediaFilter.category = category;
    }

    if (mediaType && ['image', 'video'].includes(mediaType.toLowerCase())) {
      mediaFilter.mediaType = mediaType.toLowerCase();
    }

    if (search && search.trim()) {
      const q = new RegExp(search.trim(), 'i');
      mediaFilter.$or = [
        { title: q },
        { description: q },
        { tag: q },
        { category: q },
      ];
    }

    const media = await GalleryMedia.find(mediaFilter)
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    const formattedMedia = media.map((item) => ({
      ...item,
      media_url: item.url,
      media_type: item.mediaType,
      thumbnail_url: item.thumbnailUrl || item.url,
      display_order: item.displayOrder,
    }));

    res.json({
      success: true,
      folder: {
        _id: folder._id,
        name: folder.name,
        slug: folder.slug,
        description: folder.description,
        coverImage: folder.coverImage,
        cover_image: folder.coverImage,
      },
      data: formattedMedia,
      count: formattedMedia.length,
    });
  } catch (err) {
    console.error('[Get Public Folder Media Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve media items',
      errorCode: 'MEDIA_FETCH_ERROR',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Get all gallery folders with summary statistics
// @route   GET /api/gallery/folders
// @access  Private/Admin
export const getAdminFolders = async (req, res) => {
  try {
    const totalCount = await GalleryFolder.countDocuments();
    if (totalCount === 0) {
      await seedGalleryInitialData();
    }

    const { status, search } = req.query;
    const filter = {};

    if (status && ['published', 'draft'].includes(status.toLowerCase())) {
      filter.status = status.toLowerCase();
    }

    if (search && search.trim()) {
      const q = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: q }, { slug: q }, { description: q }];
    }

    const folders = await GalleryFolder.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    // Aggregate counts
    const [mediaCounts, totalMediaCount, totalImageCount, totalVideoCount, publishedFoldersCount, draftFoldersCount] =
      await Promise.all([
        GalleryMedia.aggregate([
          {
            $group: {
              _id: '$folderId',
              totalMedia: { $sum: 1 },
              imageCount: {
                $sum: { $cond: [{ $eq: ['$mediaType', 'image'] }, 1, 0] },
              },
              videoCount: {
                $sum: { $cond: [{ $eq: ['$mediaType', 'video'] }, 1, 0] },
              },
            },
          },
        ]),
        GalleryMedia.countDocuments(),
        GalleryMedia.countDocuments({ mediaType: 'image' }),
        GalleryMedia.countDocuments({ mediaType: 'video' }),
        GalleryFolder.countDocuments({ status: 'published' }),
        GalleryFolder.countDocuments({ status: 'draft' }),
      ]);

    const countMap = {};
    mediaCounts.forEach((c) => {
      countMap[c._id.toString()] = c;
    });

    const enrichedFolders = folders.map((f) => {
      const counts = countMap[f._id.toString()] || { totalMedia: 0, imageCount: 0, videoCount: 0 };
      return {
        ...f,
        cover_image: f.coverImage,
        totalMedia: counts.totalMedia,
        imageCount: counts.imageCount,
        videoCount: counts.videoCount,
      };
    });

    res.json({
      success: true,
      data: enrichedFolders,
      stats: {
        totalFolders: folders.length,
        totalImages: totalImageCount,
        totalVideos: totalVideoCount,
        publishedFolders: publishedFoldersCount,
        draftFolders: draftFoldersCount,
        totalMedia: totalMediaCount,
      },
    });
  } catch (err) {
    console.error('[Admin Get Folders Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin folders',
      errorCode: 'ADMIN_FOLDERS_ERROR',
    });
  }
};

// @desc    Get folder by ID (Admin)
// @route   GET /api/gallery/folders/:id
// @access  Private/Admin
export const getAdminFolderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder ID',
        errorCode: 'INVALID_ID',
      });
    }

    const folder = await GalleryFolder.findById(id).lean();
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
        errorCode: 'FOLDER_NOT_FOUND',
      });
    }

    const counts = await GalleryMedia.aggregate([
      { $match: { folderId: folder._id } },
      {
        $group: {
          _id: null,
          totalMedia: { $sum: 1 },
          imageCount: {
            $sum: { $cond: [{ $eq: ['$mediaType', 'image'] }, 1, 0] },
          },
          videoCount: {
            $sum: { $cond: [{ $eq: ['$mediaType', 'video'] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = counts[0] || { totalMedia: 0, imageCount: 0, videoCount: 0 };

    res.json({
      success: true,
      data: {
        ...folder,
        cover_image: folder.coverImage,
        totalMedia: stats.totalMedia,
        imageCount: stats.imageCount,
        videoCount: stats.videoCount,
      },
    });
  } catch (err) {
    console.error('[Admin Get Folder By ID Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve folder',
      errorCode: 'FOLDER_FETCH_ERROR',
    });
  }
};

// @desc    Create new gallery folder
// @route   POST /api/gallery/folders
// @access  Private/Admin
export const createFolder = async (req, res) => {
  try {
    const { name, description, coverImage, status, displayOrder } = req.body;
    let { slug } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Folder Name is required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    if (!slug || !slug.trim()) {
      slug = generateSlug(name);
    } else {
      slug = generateSlug(slug);
    }

    if (!slug) {
      slug = `folder-${Date.now()}`;
    }

    // Check duplicate slug
    const existing = await GalleryFolder.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A folder with slug "${slug}" already exists. Please choose a different name or slug.`,
        errorCode: 'DUPLICATE_SLUG',
      });
    }

    let finalCoverImage = coverImage || '';

    // If file uploaded as cover image
    if (req.file) {
      const folderPath = 'chinmaya/gallery/covers';
      const result = await uploadToR2(
        req.file.buffer,
        folderPath,
        req.file.mimetype,
        req.file.originalname
      );
      finalCoverImage = result.url;
    }

    const newFolder = new GalleryFolder({
      name: name.trim(),
      slug,
      description: (description || '').trim(),
      coverImage: finalCoverImage,
      status: ['published', 'draft'].includes((status || '').toLowerCase())
        ? status.toLowerCase()
        : 'published',
      displayOrder: Number(displayOrder) || 0,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    await newFolder.save();

    res.status(201).json({
      success: true,
      message: 'Gallery folder created successfully',
      data: newFolder,
    });
  } catch (err) {
    console.error('[Create Folder Error]:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create folder',
      errorCode: 'FOLDER_CREATE_ERROR',
    });
  }
};

// @desc    Update gallery folder
// @route   PUT /api/gallery/folders/:id
// @access  Private/Admin
export const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder ID',
        errorCode: 'INVALID_ID',
      });
    }

    const folder = await GalleryFolder.findById(id);
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
        errorCode: 'FOLDER_NOT_FOUND',
      });
    }

    const { name, description, coverImage, status, displayOrder, slug } = req.body;

    if (name && name.trim()) {
      folder.name = name.trim();
    }

    if (slug && slug.trim()) {
      const cleanSlug = generateSlug(slug);
      if (cleanSlug !== folder.slug) {
        const existing = await GalleryFolder.findOne({ slug: cleanSlug, _id: { $ne: folder._id } });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: `Slug "${cleanSlug}" is already in use by another folder.`,
            errorCode: 'DUPLICATE_SLUG',
          });
        }
        folder.slug = cleanSlug;
      }
    }

    if (description !== undefined) {
      folder.description = (description || '').trim();
    }

    if (coverImage !== undefined && !req.file) {
      folder.coverImage = coverImage;
    }

    if (req.file) {
      const folderPath = 'chinmaya/gallery/covers';
      const result = await uploadToR2(
        req.file.buffer,
        folderPath,
        req.file.mimetype,
        req.file.originalname
      );
      folder.coverImage = result.url;
    }

    if (status && ['published', 'draft'].includes(status.toLowerCase())) {
      folder.status = status.toLowerCase();
    }

    if (displayOrder !== undefined) {
      folder.displayOrder = Number(displayOrder) || 0;
    }

    folder.updatedBy = req.user?._id;
    await folder.save();

    res.json({
      success: true,
      message: 'Folder updated successfully',
      data: folder,
    });
  } catch (err) {
    console.error('[Update Folder Error]:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update folder',
      errorCode: 'FOLDER_UPDATE_ERROR',
    });
  }
};

// @desc    Toggle folder publish status
// @route   PATCH /api/gallery/folders/:id/publish
// @access  Private/Admin
export const toggleFolderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder ID',
        errorCode: 'INVALID_ID',
      });
    }

    const folder = await GalleryFolder.findById(id);
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
        errorCode: 'FOLDER_NOT_FOUND',
      });
    }

    folder.status = folder.status === 'published' ? 'draft' : 'published';
    folder.updatedBy = req.user?._id;
    await folder.save();

    res.json({
      success: true,
      message: `Folder status changed to ${folder.status}`,
      data: folder,
    });
  } catch (err) {
    console.error('[Toggle Folder Status Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle folder status',
      errorCode: 'STATUS_TOGGLE_ERROR',
    });
  }
};

// @desc    Delete gallery folder and its media
// @route   DELETE /api/gallery/folders/:id
// @access  Private/Admin
export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder ID',
        errorCode: 'INVALID_ID',
      });
    }

    const folder = await GalleryFolder.findById(id);
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
        errorCode: 'FOLDER_NOT_FOUND',
      });
    }

    // Find and delete all media items in this folder
    const mediaItems = await GalleryMedia.find({ folderId: folder._id });
    for (const item of mediaItems) {
      if (item.publicId) {
        await deleteFromR2(item.publicId);
      }
    }
    await GalleryMedia.deleteMany({ folderId: folder._id });

    // Delete folder
    await GalleryFolder.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Folder "${folder.name}" and all ${mediaItems.length} media items were deleted successfully.`,
    });
  } catch (err) {
    console.error('[Delete Folder Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete folder',
      errorCode: 'FOLDER_DELETE_ERROR',
    });
  }
};

// @desc    Get media items for a folder (Admin)
// @route   GET /api/gallery/folders/:folderId/media
// @access  Private/Admin
export const getAdminFolderMedia = async (req, res) => {
  try {
    const { folderId } = req.params;
    if (!isValidObjectId(folderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder ID',
        errorCode: 'INVALID_ID',
      });
    }

    const folder = await GalleryFolder.findById(folderId).lean();
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
        errorCode: 'FOLDER_NOT_FOUND',
      });
    }

    const { status, mediaType, search, category } = req.query;
    const filter = { folderId: folder._id };

    if (status && ['published', 'draft'].includes(status.toLowerCase())) {
      filter.status = status.toLowerCase();
    }

    if (mediaType && ['image', 'video'].includes(mediaType.toLowerCase())) {
      filter.mediaType = mediaType.toLowerCase();
    }

    if (category && category !== 'ALL' && category !== 'All') {
      filter.category = category;
    }

    if (search && search.trim()) {
      const q = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: q }, { description: q }, { tag: q }];
    }

    const media = await GalleryMedia.find(filter)
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    const formattedMedia = media.map((item) => ({
      ...item,
      media_url: item.url,
      media_type: item.mediaType,
      thumbnail_url: item.thumbnailUrl || item.url,
      display_order: item.displayOrder,
    }));

    res.json({
      success: true,
      folder: {
        ...folder,
        cover_image: folder.coverImage,
      },
      data: formattedMedia,
      count: formattedMedia.length,
    });
  } catch (err) {
    console.error('[Admin Get Folder Media Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve folder media',
      errorCode: 'MEDIA_FETCH_ERROR',
    });
  }
};

// @desc    Upload / add media items into folder
// @route   POST /api/gallery/folders/:folderId/media
// @access  Private/Admin
export const uploadFolderMedia = async (req, res) => {
  try {
    const { folderId } = req.params;
    if (!isValidObjectId(folderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder ID',
        errorCode: 'INVALID_ID',
      });
    }

    const folder = await GalleryFolder.findById(folderId);
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
        errorCode: 'FOLDER_NOT_FOUND',
      });
    }

    const {
      title,
      description,
      category = 'General',
      tag = '',
      displayOrder,
      status = 'published',
      mediaType,
      url,
      thumbnailUrl,
    } = req.body;

    let files = [];
    if (Array.isArray(req.files)) {
      files = req.files;
    } else if (req.files && typeof req.files === 'object') {
      files = [
        ...(req.files.files || []),
        ...(req.files.file || []),
        ...(req.files.image || []),
      ];
    } else if (req.file) {
      files = [req.file];
    }
    const insertedMedia = [];

    // CASE 1: Uploading files (multipart)
    if (files && files.length > 0) {
      const currentHighestOrderDoc = await GalleryMedia.findOne({ folderId: folder._id })
        .sort({ displayOrder: -1 })
        .select('displayOrder')
        .lean();
      let nextOrder = (currentHighestOrderDoc?.displayOrder || 0) + 1;

      for (const file of files) {
        const isVideo = file.mimetype.startsWith('video/');
        const targetType = isVideo ? 'video' : 'image';
        const folderR2Path = `chinmaya/gallery/${targetType}s`;

        const uploadResult = await uploadToR2(
          file.buffer,
          folderR2Path,
          file.mimetype,
          file.originalname
        );

        const cleanOriginalName = file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const mediaDoc = new GalleryMedia({
          folderId: folder._id,
          mediaType: targetType,
          url: uploadResult.url,
          thumbnailUrl: isVideo ? (thumbnailUrl || '') : uploadResult.url,
          title: (title && files.length === 1) ? title.trim() : cleanOriginalName,
          description: (description && files.length === 1) ? description.trim() : '',
          category: category.trim() || 'General',
          tag: tag.trim() || '',
          displayOrder: (displayOrder !== undefined && files.length === 1) ? Number(displayOrder) : nextOrder++,
          status: ['published', 'draft'].includes((status || '').toLowerCase()) ? status.toLowerCase() : 'published',
          fileSize: file.size || file.buffer.length,
          mimeType: file.mimetype,
          publicId: uploadResult.public_id,
          createdBy: req.user?._id,
          updatedBy: req.user?._id,
        });

        await mediaDoc.save();
        insertedMedia.push(mediaDoc);
      }
    } else if (url && url.trim()) {
      // CASE 2: Providing a media URL directly (e.g. YouTube video URL or hosted asset)
      const isVideo =
        (mediaType && mediaType.toLowerCase() === 'video') ||
        url.includes('youtube.com') ||
        url.includes('youtu.be') ||
        url.endsWith('.mp4') ||
        url.endsWith('.webm');

      const currentHighestOrderDoc = await GalleryMedia.findOne({ folderId: folder._id })
        .sort({ displayOrder: -1 })
        .select('displayOrder')
        .lean();
      const nextOrder = (currentHighestOrderDoc?.displayOrder || 0) + 1;

      const mediaDoc = new GalleryMedia({
        folderId: folder._id,
        mediaType: isVideo ? 'video' : 'image',
        url: url.trim(),
        thumbnailUrl: (thumbnailUrl || '').trim() || (isVideo ? '' : url.trim()),
        title: (title || '').trim() || 'Media Item',
        description: (description || '').trim(),
        category: category.trim() || 'General',
        tag: tag.trim() || '',
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : nextOrder,
        status: ['published', 'draft'].includes((status || '').toLowerCase()) ? status.toLowerCase() : 'published',
        publicId: `ext_${Date.now()}`,
        createdBy: req.user?._id,
        updatedBy: req.user?._id,
      });

      await mediaDoc.save();
      insertedMedia.push(mediaDoc);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please select a file to upload or provide a media URL.',
        errorCode: 'NO_MEDIA_PROVIDED',
      });
    }

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${insertedMedia.length} media item(s).`,
      data: insertedMedia,
    });
  } catch (err) {
    console.error('[Upload Folder Media Error]:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to upload media',
      errorCode: 'MEDIA_UPLOAD_ERROR',
    });
  }
};

// @desc    Update single media item details
// @route   PUT /api/gallery/media/:id
// @access  Private/Admin
export const updateMediaItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid media ID',
        errorCode: 'INVALID_ID',
      });
    }

    const item = await GalleryMedia.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Media item not found',
        errorCode: 'MEDIA_NOT_FOUND',
      });
    }

    const {
      title,
      description,
      category,
      tag,
      displayOrder,
      status,
      mediaType,
      url,
      thumbnailUrl,
    } = req.body;

    if (title !== undefined) item.title = (title || '').trim();
    if (description !== undefined) item.description = (description || '').trim();
    if (category !== undefined) item.category = (category || 'General').trim();
    if (tag !== undefined) item.tag = (tag || '').trim();
    if (displayOrder !== undefined) item.displayOrder = Number(displayOrder) || 0;
    if (status && ['published', 'draft'].includes(status.toLowerCase())) {
      item.status = status.toLowerCase();
    }
    if (mediaType && ['image', 'video'].includes(mediaType.toLowerCase())) {
      item.mediaType = mediaType.toLowerCase();
    }
    if (url && url.trim()) item.url = url.trim();
    if (thumbnailUrl !== undefined) item.thumbnailUrl = (thumbnailUrl || '').trim();

    item.updatedBy = req.user?._id;
    await item.save();

    res.json({
      success: true,
      message: 'Media item updated successfully',
      data: item,
    });
  } catch (err) {
    console.error('[Update Media Item Error]:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update media item',
      errorCode: 'MEDIA_UPDATE_ERROR',
    });
  }
};

// @desc    Delete single media item
// @route   DELETE /api/gallery/media/:id
// @access  Private/Admin
export const deleteMediaItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid media ID',
        errorCode: 'INVALID_ID',
      });
    }

    const item = await GalleryMedia.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Media item not found',
        errorCode: 'MEDIA_NOT_FOUND',
      });
    }

    if (item.publicId) {
      await deleteFromR2(item.publicId);
    }

    await GalleryMedia.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Media item deleted successfully',
    });
  } catch (err) {
    console.error('[Delete Media Item Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media item',
      errorCode: 'MEDIA_DELETE_ERROR',
    });
  }
};

// @desc    Reorder media inside a folder
// @route   PUT /api/gallery/folders/:folderId/reorder
// @access  Private/Admin
export const reorderFolderMedia = async (req, res) => {
  try {
    const { folderId } = req.params;
    if (!isValidObjectId(folderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder ID',
        errorCode: 'INVALID_ID',
      });
    }

    const { items, orderedIds } = req.body;

    if (Array.isArray(orderedIds)) {
      const bulkOps = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, folderId },
          update: { displayOrder: index + 1 },
        },
      }));
      await GalleryMedia.bulkWrite(bulkOps);
    } else if (Array.isArray(items)) {
      const bulkOps = items.map((item) => ({
        updateOne: {
          filter: { _id: item.id || item._id, folderId },
          update: { displayOrder: Number(item.displayOrder) || 0 },
        },
      }));
      await GalleryMedia.bulkWrite(bulkOps);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Provide "orderedIds" array or "items" array with order numbers.',
        errorCode: 'INVALID_REORDER_PAYLOAD',
      });
    }

    res.json({
      success: true,
      message: 'Media order updated successfully',
    });
  } catch (err) {
    console.error('[Reorder Media Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder media items',
      errorCode: 'REORDER_ERROR',
    });
  }
};
