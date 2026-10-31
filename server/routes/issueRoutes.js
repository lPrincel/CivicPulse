const express = require('express');
const router = express.Router();
const {
  triageIssueHandler,
  createIssue,
  getIssues,
  updateIssueStatus,
  upvoteIssue,
  deleteIssue,
  seedDatabase,
  checkDuplicateIssue
} = require('../controllers/issueController');

// AI Triage Route
router.post('/triage', triageIssueHandler);

// Duplicate Checking Route
router.post('/check-duplicate', checkDuplicateIssue);

// Demo Seed Route
router.post('/seed', seedDatabase);

// Upvote Route
router.post('/:id/upvote', upvoteIssue);

// CRUD Routes
router.route('/')
  .get(getIssues)
  .post(createIssue);

router.route('/:id')
  .delete(deleteIssue);

router.patch('/:id/status', updateIssueStatus);

module.exports = router;
