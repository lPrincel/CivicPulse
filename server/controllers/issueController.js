const Issue = require('../models/Issue');
const User = require('../models/User');
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
    reporterName: 'Jane Doe',
    reporterEmail: 'citizen@civicpulse.org',
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
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
    reporterEmail: 'marcus@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
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
    reporterName: 'Jane Doe',
    reporterEmail: 'citizen@civicpulse.org',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
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
    reporterEmail: 'priya@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
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
    reporterEmail: 'david@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
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
    reporterEmail: 'elena@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
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
    reporterName: 'Jane Doe',
    reporterEmail: 'citizen@civicpulse.org',
    imageUrl: '',
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
    reporterEmail: 'maya@example.com',
    imageUrl: '',
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
    const { 
      title, 
      description, 
      category, 
      urgency, 
      location, 
      aiSummary, 
      status, 
      reporterName, 
      reporterEmail,
      imageUrl 
    } = req.body;

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
      reporterEmail: reporterEmail || '',
      imageUrl: imageUrl || '',
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
    const { status, category, urgency, search, reporterEmail } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;
    if (reporterEmail) filter.reporterEmail = reporterEmail;
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
 * @desc   Upvote an issue with dynamic community escalation & toggle
 * @route  POST /api/issues/:id/upvote
 */
const upvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { decrement } = req.body || {};

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    if (decrement) {
      issue.upvotes = Math.max(1, (issue.upvotes || 1) - 1);
    } else {
      issue.upvotes = (issue.upvotes || 0) + 1;

      // Dynamic Urgency Escalation: When multiple community members echo the hazard!
      if (issue.upvotes >= 10 && issue.urgency === 'High') {
        issue.urgency = 'Emergency';
        if (!issue.aiSummary.includes('COMMUNITY ESCALATED')) {
          issue.aiSummary = `[COMMUNITY ESCALATED: 10+ CITIZEN ECHOES] ${issue.aiSummary}`;
        }
      } else if (issue.upvotes >= 5 && issue.urgency === 'Medium') {
        issue.urgency = 'High';
        if (!issue.aiSummary.includes('COMMUNITY ESCALATED')) {
          issue.aiSummary = `[COMMUNITY ESCALATED: 5+ CITIZEN ECHOES] ${issue.aiSummary}`;
        }
      }
    }

    await issue.save();
    return res.status(200).json({ success: true, data: issue });
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

    // Ensure demo accounts exist
    const citizenExists = await User.findOne({ email: 'citizen@civicpulse.org' });
    if (!citizenExists) {
      const citizenUser = new User({
        name: 'Jane Doe',
        email: 'citizen@civicpulse.org',
        role: 'citizen',
        department: 'Community Resident'
      });
      citizenUser.setPassword('citizen123');
      await citizenUser.save();
    }

    const adminExists = await User.findOne({ email: 'admin@cityhall.gov' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Officer Davis',
        email: 'admin@cityhall.gov',
        role: 'admin',
        department: 'Emergency Dispatch'
      });
      adminUser.setPassword('admin123');
      await adminUser.save();
    }

    return res.status(200).json({
      success: true,
      message: `Database successfully seeded with ${seeded.length} realistic issues and accounts.`,
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

/**
 * @desc   Check for potential duplicate issue based on location and hazard keywords
 * @route  POST /api/issues/check-duplicate
 */
const checkDuplicateIssue = async (req, res) => {
  try {
    const { description = '', location = '' } = req.body;
    const descLower = description.toLowerCase().trim();
    const locLower = location.toLowerCase().trim();

    if (descLower.length < 5 || locLower.length < 3) {
      return res.status(200).json({ success: true, isDuplicate: false });
    }

    const activeIssues = await Issue.find({ status: { $ne: 'Resolved' } });

    const hazardKeywords = [
      'pothole', 'road', 'asphalt', 'crater', 'sinkhole',
      'water', 'pipe', 'leak', 'flood', 'flooding', 'drain', 'hydrant',
      'wire', 'spark', 'sparking', 'electric', 'power', 'transformer', 'blackout', 'streetlight', 'light',
      'trash', 'garbage', 'dump', 'dumping', 'waste', 'dumpster',
      'tree', 'branch', 'sidewalk', 'walkway'
    ];

    const matchedKeywords = hazardKeywords.filter((kw) => descLower.includes(kw));
    const ignoreWords = new Set(['near', 'corner', 'street', 'road', 'avenue', 'blvd', 'the', 'and', 'with', 'from']);
    const locTokens = locLower
      .replace(/[(),°NWES\d.]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !ignoreWords.has(w));

    for (const issue of activeIssues) {
      const issueDesc = (issue.description || '').toLowerCase();
      const issueLoc = (issue.location || '').toLowerCase();
      const issueTitle = (issue.title || '').toLowerCase();

      const hasLocationMatch = locTokens.some((token) => issueLoc.includes(token));
      const hasHazardMatch = matchedKeywords.some(
        (kw) => issueDesc.includes(kw) || issueTitle.includes(kw)
      );
      const hasCategoryMatch = issue.category && descLower.includes(issue.category.toLowerCase());

      if (hasLocationMatch && (hasHazardMatch || hasCategoryMatch)) {
        return res.status(200).json({
          success: true,
          isDuplicate: true,
          candidate: issue
        });
      }
    }

    return res.status(200).json({ success: true, isDuplicate: false });
  } catch (error) {
    console.error(`[checkDuplicateIssue Error] ${error.message}`);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  triageIssueHandler,
  createIssue,
  getIssues,
  updateIssueStatus,
  upvoteIssue,
  seedDatabase,
  checkDuplicateIssue
};
