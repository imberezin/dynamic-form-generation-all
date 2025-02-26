const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");

// Get all submissions
router.get("/", submissionController.getAllSubmissions);

// Create a new submission
router.post("/", submissionController.createSubmission);

// Get a specific submission by ID
router.get("/:id", submissionController.getSubmissionById);

module.exports = router;
