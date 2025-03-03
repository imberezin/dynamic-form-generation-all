const db = require("../config/database");

// Get the active form schema
exports.getActiveSchema = (req, res) => {
  const query = `
    SELECT * FROM form_schemas 
    WHERE active = true 
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching active schema:", err);
      return res.status(500).json({ message: "Error fetching active schema" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No active form schema found" });
    }

    // Parse the fields JSON
    const schema = results[0];
    try {
      schema.fields = JSON.parse(schema.fields);
    } catch (error) {
      console.error("Error parsing fields JSON:", error);
      return res.status(500).json({ message: "Error parsing schema data" });
    }

    res.status(200).json(schema);
  });
};

// Create a new form schema
exports.createSchema = (req, res) => {
  const { title, fields } = req.body;

  if (!title || !fields || !Array.isArray(fields)) {
    return res.status(400).json({ message: "Invalid schema format" });
  }

  // First, set all existing schemas to inactive
  db.query("UPDATE form_schemas SET active = false", (err) => {
    if (err) {
      console.error("Error updating schemas status:", err);
      return res.status(500).json({ message: "Error creating schema" });
    }

    // Then insert the new schema
    const insertQuery = `
      INSERT INTO form_schemas (title, fields, active)
      VALUES (?, ?, true)
    `;

    db.query(insertQuery, [title, JSON.stringify(fields)], (err, result) => {
      if (err) {
        console.error("Error creating schema:", err);
        return res.status(500).json({ message: "Error creating schema" });
      }

      // Get the inserted schema
      db.query(
        "SELECT * FROM form_schemas WHERE id = ?",
        [result.insertId],
        (err, results) => {
          if (err || results.length === 0) {
            console.error("Error fetching created schema:", err);
            return res
              .status(201)
              .json({
                id: result.insertId,
                message: "Schema created successfully",
              });
          }

          const schema = results[0];
          try {
            schema.fields = JSON.parse(schema.fields);
          } catch (error) {
            console.error("Error parsing fields JSON:", error);
          }

          res.status(201).json(schema);
        }
      );
    });
  });
};

// Get all form schemas
exports.getAllSchemas = (req, res) => {
  db.query(
    "SELECT * FROM form_schemas ORDER BY created_at DESC",
    (err, results) => {
      if (err) {
        console.error("Error fetching schemas:", err);
        return res.status(500).json({ message: "Error fetching schemas" });
      }

      // Parse the fields JSON for each schema
      const schemas = results.map((schema) => {
        try {
          return {
            ...schema,
            fields: JSON.parse(schema.fields),
          };
        } catch (error) {
          console.error("Error parsing fields JSON:", error);
          return schema;
        }
      });

      res.status(200).json(schemas);
    }
  );
};
