const db = require("../config/database");

// Get all submissions
exports.getAllSubmissions = (req, res) => {
  const query = `
    SELECT * FROM submissions
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching submissions:", err);
      return res.status(500).json({ message: "Error fetching submissions" });
    }

    // Parse the data JSON for each submission
    const submissions = results.map((submission) => {
      try {
        return {
          ...submission,
          data: JSON.parse(submission.data),
        };
      } catch (error) {
        console.error("Error parsing submission data JSON:", error);
        return submission;
      }
    });

    res.status(200).json(submissions);
  });
};

// Create a new submission
exports.createSubmission = (req, res) => {
  const { formTitle, data } = req.body;

  // Validate request
  if (!formTitle || !data) {
    return res
      .status(400)
      .json({ message: "Form title and data are required" });
  }

  const query = `
    INSERT INTO submissions (form_title, data)
    VALUES (?, ?)
  `;

  db.query(query, [formTitle, JSON.stringify(data)], (err, result) => {
    if (err) {
      console.error("Error creating submission:", err);
      return res.status(500).json({ message: "Error creating submission" });
    }

    res.status(201).json({
      id: result.insertId,
      formTitle,
      data,
      created_at: new Date(),
      message: "Submission created successfully",
    });
  });
};

// Get a specific submission by ID
exports.getSubmissionById = (req, res) => {
  const query = `
    SELECT * FROM submissions
    WHERE id = ?
  `;

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Error fetching submission:", err);
      return res.status(500).json({ message: "Error fetching submission" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Parse the data JSON
    const submission = results[0];
    try {
      submission.data = JSON.parse(submission.data);
    } catch (error) {
      console.error("Error parsing submission data JSON:", error);
    }

    res.status(200).json(submission);
  });
};
