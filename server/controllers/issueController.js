const Issue = require('../models/Issue');
const { triageIssue, VALID_CATEGORIES, VALID_URGENCIES } = require('../services/aiService');

const DEFAULT_SAMPLE_ISSUES = [
  {
    title: 'High-Voltage Transformer Sparking Near School',
    description: 'Transformer on the utility pole is emitting loud pops and visible electrical sparks near the corner of Oak St. and 4th Ave.',
    category: 'Electricity',
    urgency: 'Emergency',
    location: '402 Oak Street (Corner of 4th Ave)',
    status: 'Reported',
    upvotes: 18,
    reporterName: 'Sarah Jenkins',
    aiSummary: 'Critical electrical hazard adjacent to school zone. Immediate power company isolation and emergency crew dispatch dispatched.'
  },
  {
    title: 'Severe Water Main Rupture Flooding Commercial Avenue',
    description: 'Main water line burst under asphalt, buckling the road surface and flooding both lanes with approximately 8 inches of water.',
    category: 'Water',
    urgency: 'Emergency',
    location: '880 North Commercial Blvd',
    status: 'In Progress',
    upvotes: 12,
    reporterName: 'Marcus Vance',
    aiSummary: 'Major utility rupture causing infrastructure damage and transit disruption. Water department valve shutdown active.'
  },
  {
    title: 'Deep Hazardous Pothole Damaging Vehicles on Expressway Exit',
    description: 'Pothole estimated 2.5 feet wide and 6 inches deep causing tire blowouts at the highway exit ramp.',
    category: 'Roads',
    urgency: 'High',
    location: 'Westbound Highway 9 Exit 12 Ramp',
    status: 'Reported',
    upvotes: 9,
    reporterName: 'Carlos Rivera',
    aiSummary: 'High-speed roadway defect with confirmed vehicle damage incidents. Road maintenance crew prioritized for asphalt patching.'
  },
  {
    title: 'Overflowing Waste Dumpster Attracting Rodents',
    description: 'Commercial trash receptacle hasn’t been collected in two weeks, overflowing into the public pedestrian walkway.',
    category: 'Sanitation',
    urgency: 'Medium',
    location: 'Alleyway behind 15 Market Square',
    status: 'In Progress',
    upvotes: 5,
    reporterName: 'Priya Sharma',
    aiSummary: 'Sanitation violation and health compliance risk. Department of Public Works route scheduled for pickup.'
  },
  {
    title: 'Fallen Tree Branch Obstructing Sidewalk and Bike Lane',
    description: 'Heavy storm broke a large oak branch that fell across the pedestrian sidewalk and designated bike lane.',
    category: 'Safety',
    urgency: 'Medium',
    location: '214 Pinecrest Way',
    status: 'Reported',
    upvotes: 4,
    reporterName: 'David Kim',
    aiSummary: 'Pedestrian right-of-way obstruction. Parks & Recreation arborist crew ticket generated for removal.'
  },
  {
    title: 'Non-Functional Streetlight Creating Dark Intersection',
    description: 'Streetlight pole #42 is dark at night, making the crosswalk dangerous for evening pedestrians.',
    category: 'Electricity',
    urgency: 'Low',
    location: 'Intersection of Elm St & 8th Avenue',
    status: 'Resolved',
    upvotes: 6,
    reporterName: 'Elena Rostova',
    aiSummary: 'Routine illumination failure. Public works municipal electrician replaced LED fixture and verified circuit.'
  },
  {
    title: 'Broken Storm Drain Grate In Bicycle Commute Corridor',
    description: 'Metal storm drain cover is cracked in half, leaving an open hole that can catch bicycle wheels or pedestrians.',
    category: 'Roads',
    urgency: 'High',
    location: '512 Riverview Promenade',
    status: 'Reported',
    upvotes: 11,
    reporterName: 'Alex Morgan',
    aiSummary: 'Pedestrian and cyclist safety hazard. Immediate barricade placement and grate replacement required.'
  },
  {
    title: 'Illegal Chemical Dumping in Public Park Drainage Ditch',
    description: 'Suspicious oily chemical residue with strong solvent odor dumped near park boundary stream.',
    category: 'Sanitation',
    urgency: 'High',
    location: 'Riverside Community Park, North Edge',
    status: 'In Progress',
    upvotes: 14,
    reporterName: 'Maya Lin',
    aiSummary: 'Environmental contamination alert. Environmental protection agency notified for containment and soil sampling.'
  }
];

/**
 * @desc   AI Triage an issue report
 * @route  POST /api/issues/triage
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
      error: 'Failed to triage issue.'
    });
  }
};

/**
 * @desc   Create and save a new issue
 * @route  POST /api/issues
 */
const createIssue = async (req, res) => {
  try {
    const { title, description, category, urgency, location, aiSummary, status, reporterName } = req.body;

    if (!description || !location) {
      return res.status(400).json({
        success: false,
        error: 'Both description and location are required.'
      });
    }

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
      status: status || 'Reported',
      reporterName: reporterName || 'Anonymous Citizen',
      upvotes: 1
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
 * @desc   Get all issues sorted by newest first (with stats)
 * @route  GET /api/issues
 */
const getIssues = async (req, res) => {
  try {
    const { status, category, urgency, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const issues = await Issue.find(filter).sort({ createdAt: -1 });

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
 * @desc   Update issue status
 * @route  PATCH /api/issues/:id/status
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

/**
 * @desc   Upvote an issue (Community Echo)
 * @route  POST /api/issues/:id/upvote
 */
const upvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Issue.findByIdAndUpdate(
      id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc   Seed / Reset Demo Database
 * @route  POST /api/issues/seed
 */
const seedDatabase = async (req, res) => {
  try {
    await Issue.deleteMany({});
    const seeded = await Issue.insertMany(DEFAULT_SAMPLE_ISSUES);
    return res.status(200).json({
      success: true,
      message: `Database successfully seeded with ${seeded.length} realistic issues.`,
      count: seeded.length,
      data: seeded
    });
  } catch (error) {
    console.error(`[seedDatabase Error] ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  triageIssueHandler,
  createIssue,
  getIssues,
  updateIssueStatus,
  upvoteIssue,
  seedDatabase
};
