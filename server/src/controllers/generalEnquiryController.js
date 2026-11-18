import GeneralEnquiry from '../models/GeneralEnquiry.js';

// @desc    Submit a new General Enquiry from homepage pop-up
// @route   POST /api/general-enquiry
// @access  Public
export const submitGeneralEnquiry = async (req, res) => {
  try {
    const name = (req.body.name || req.body.fullName || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const mobileNumber = (req.body.mobileNumber || req.body.phone || '').trim();
    const learningGoal = (
      req.body.learningGoal ||
      req.body.message ||
      req.body.whatDoYouWantToLearn ||
      ''
    ).trim();

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email ID is required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }
    if (!mobileNumber) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 6 || cleanPhone.length > 15) {
      return res.status(400).json({ success: false, message: 'Please provide a valid mobile number' });
    }
    if (!learningGoal) {
      return res.status(400).json({
        success: false,
        message: 'Please answer: "What would you like to know more about?"',
      });
    }

    const enquiry = new GeneralEnquiry({
      name,
      email,
      mobileNumber,
      learningGoal,
      status: 'NEW',
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your general enquiry has been submitted successfully.',
      data: enquiry,
    });
  } catch (err) {
    console.error('[Submit General Enquiry Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry. Please try again.',
      error: err.message,
    });
  }
};

// @desc    Get all general enquiries for Admin Panel
// @route   GET /api/general-enquiry
// @access  Admin
export const getGeneralEnquiriesAdmin = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const s = search.trim();
      const regex = new RegExp(s, 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { mobileNumber: regex },
        { learningGoal: regex },
      ];
    }

    const enquiries = await GeneralEnquiry.find(query).sort({ createdAt: -1 }).lean();

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (err) {
    console.error('[Get General Enquiries Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch general enquiries',
      error: err.message,
    });
  }
};

// @desc    Update status of an enquiry (NEW, READ, RESPONDED)
// @route   PATCH /api/general-enquiry/:id/status
// @access  Admin
export const updateGeneralEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['NEW', 'READ', 'RESPONDED'];
    const updateData = {};

    if (status) {
      const upper = status.toUpperCase();
      if (!validStatuses.includes(upper)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      updateData.status = upper;
    }

    if (notes !== undefined) {
      updateData.notes = (notes || '').trim();
    }

    const updated = await GeneralEnquiry.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(400).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: updated,
    });
  } catch (err) {
    console.error('[Update General Enquiry Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update enquiry',
      error: err.message,
    });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/general-enquiry/:id
// @access  Admin
export const deleteGeneralEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GeneralEnquiry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (err) {
    console.error('[Delete General Enquiry Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry',
      error: err.message,
    });
  }
};
