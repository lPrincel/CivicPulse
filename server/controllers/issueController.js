const Issue = require('../models/Issue');
const { triageIssue, VALID_CATEGORIES, VALID_URGENCIES } = require('../services/aiService');

/**
 * @desc   AI Triage an issue report
 * @route  POST /api/issues/triage
 * @access Public
 */
const triageIssueHandler = async (req, res) => {
  try {
    const { description, location } = req.body;

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Issue description is required for AI triage.'
      });
    }

    const triageResult = await triageIssue(description.trim(), location ? location.trim() : '');

    return res.status(200).json({
      success: true,
      data: triageResult
    });
  } catch (error) {
    console.error(`[triageIssueHandler Error] ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to triage issue. Please try again.'
    });
  }
};

/**
 * @desc   Create and save a new issue
 * @route  POST /api/issues
 * @access Public
 */
const createIssue = async (req, res) => {
  try {
    const { title, description, category, urgency, location, aiSummary, status } = req.body;

    if (!description || !location) {
      return res.status(400).json({
        success: false,
        error: 'Both description and location are required.'
      });
    }

    // Auto-triage if title, category, or urgency wasn't provided by client
    let finalTitle = title;
    let finalCategory = category;
    let finalUrgency = urgency;
    let finalAiSummary = aiSummary;

    if (!finalTitle || !finalCategory || !finalUrgency) {
      const autoTriage = await triageIssue(description, location);
      finalTitle = finalTitle || autoTriage.title;
      finalCategory = finalCategory || autoTriage.category;
      finalUrgency = finalUrgency || autoTriage.urgency;
      finalAiSummary = finalAiSummary || autoTriage.aiSummary;
    }

    const newIssue = await Issue.create({
      title: finalTitle.trim(),
      description: description.trim(),
      category: finalCategory,
      urgency: finalUrgency,
      location: location.trim(),
      aiSummary: finalAiSummary || '',
      status: status || 'Reported'
    });

    return res.status(201).json({
      success: true,
      data: newIssue
    });
  } catch (error) {
    console.error(`[createIssue Error] ${error.message}`);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc   Get all issues sorted by newest first (with optional filter & stats)
 * @route  GET /api/issues
 * @access Public
 */
const getIssues = async (req, res) => {
  try {
    const { status, category, urgency } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;

    const issues = await Issue.find(filter).sort({ createdAt: -1 });

    // Compute quick dashboard analytics for frontend cards
    const totalCount = await Issue.countDocuments();
    const urgentCount = await Issue.countDocuments({ urgency: { $in: ['High', 'Emergency'] }, status: { $ne: 'Resolved' } });
    const resolvedCount = await Issue.countDocuments({ status: 'Resolved' });
    const reportedCount = await Issue.countDocuments({ status: 'Reported' });

    return res.status(200).json({
      success: true,
      count: issues.length,
      stats: {
        total: totalCount,
        urgent: urgentCount,
        resolved: resolvedCount,
        reported: reportedCount
      },
      data: issues
    });
  } catch (error) {
    console.error(`[getIssues Error] ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve issues.'
    });
  }
};

/**
 * @desc   Update issue status (Reported -> In Progress -> Resolved)
 * @route  PATCH /api/issues/:id/status
 * @access Public
 */
const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Reported', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status: '${status}'. Allowed values are: ${validStatuses.join(', ')}`
      });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({
        success: false,
        error: `Issue not found with ID: ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedIssue
    });
  } catch (error) {
    console.error(`[updateIssueStatus Error] ${error.message}`);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  triageIssueHandler,
  createIssue,
  getIssues,
  updateIssueStatus
};

