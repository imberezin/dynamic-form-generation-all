const express = require("express");
const router = express.Router();
const schemaController = require("../controllers/schemaController");

// Get active form schema
router.get("/active", schemaController.getActiveSchema);

// Create a new form schema
router.post("/", schemaController.createSchema);

// Get all form schemas
router.get("/", schemaController.getAllSchemas);

// Set a schema as active by ID
router.put("/:id/activate", schemaController.setActiveSchema);

module.exports = router;
