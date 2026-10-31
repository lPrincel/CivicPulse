const express = require('express');
const router = express.Router();
const {
  triageIssueHandler,
  createIssue,
  getIssues,
  updateIssueStatus,
  upvoteIssue,
  seedDatabase
} = require('../controllers/issueController');

// AI Triage Route
router.post('/triage', triageIssueHandler);

// Demo Seed Route
router.post('/seed', seedDatabase);

// Upvote Route
router.post('/:id/upvote', upvoteIssue);

// CRUD Routes
router.route('/')
  .get(getIssues)
  .post(createIssue);

router.patch('/:id/status', updateIssueStatus);

module.exports = router;
