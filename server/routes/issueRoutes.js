const express = require('express');
const router = express.Router();
const {
  triageIssueHandler,
  createIssue,
  getIssues,
  updateIssueStatus
} = require('../controllers/issueController');

// AI Triage Route
router.post('/triage', triageIssueHandler);

// CRUD Routes
router.route('/')
  .get(getIssues)
  .post(createIssue);

router.patch('/:id/status', updateIssueStatus);

module.exports = router;

