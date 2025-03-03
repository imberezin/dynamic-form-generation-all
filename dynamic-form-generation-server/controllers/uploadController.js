const fs = require("fs");
const db = require("../config/database");

// Upload schema file
exports.uploadSchemaFile = (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read the uploaded file
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parse the JSON
    let schemaData;
    try {
      schemaData = JSON.parse(fileContent);
    } catch (err) {
      // Clean up the file
      fs.unlinkSync(filePath);
      return res
        .status(400)
        .json({ message: "Invalid JSON format in uploaded file" });
    }

    // Validate schema structure
    if (!schemaData.title || !Array.isArray(schemaData.fields)) {
      // Clean up the file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message:
          'Invalid schema format. Must include "title" and "fields" array',
      });
    }

    // Set all existing schemas to inactive
    db.query("UPDATE form_schemas SET active = false", (err) => {
      if (err) {
        console.error("Error updating schemas status:", err);
        // Clean up the file
        fs.unlinkSync(filePath);
        return res
          .status(500)
          .json({ message: "Database error while creating schema" });
      }

      // Insert the new schema
      const insertQuery = `
        INSERT INTO form_schemas (title, fields, active)
        VALUES (?, ?, true)
      `;

      db.query(
        insertQuery,
        [schemaData.title, JSON.stringify(schemaData.fields)],
        (err, result) => {
          // Clean up the file
          fs.unlinkSync(filePath);

          if (err) {
            console.error("Error creating schema:", err);
            return res
              .status(500)
              .json({ message: "Database error while creating schema" });
          }

          res.status(201).json({
            id: result.insertId,
            title: schemaData.title,
            message: "Schema uploaded and activated successfully",
          });
        }
      );
    });
  } catch (error) {
    console.error("Error in uploadSchemaFile:", error);

    // Clean up the file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    res.status(500).json({ message: "Server error while processing file" });
  }
};
