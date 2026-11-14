import PageContent from '../models/PageContent.js';

export const getPageContent = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const item = await PageContent.findOne({ sectionKey });
    res.json({ success: true, data: item ? item.content : null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePageContent = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const { content } = req.body;

    const item = await PageContent.findOneAndUpdate(
      { sectionKey },
      { $set: { sectionKey, content } },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: `Section '${sectionKey}' updated successfully`,
      data: item.content,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
