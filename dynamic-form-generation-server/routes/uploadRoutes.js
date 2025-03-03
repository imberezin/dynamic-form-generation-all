const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uploadController = require("../controllers/uploadController");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter to only allow JSON files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/json") {
    cb(null, true);
  } else {
    cb(new Error("Only JSON files are allowed!"), false);
  }
};

// Set up multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 }, // 1MB file size limit
});

// Route to upload schema file
/*
upload.single("schemaFile") - This is middleware that handles file uploads. It's likely using multer 
(a popular file upload middleware for Express). 
The single() method indicates that only one file can be uploaded with this request, and "schemaFile" 
is the name of the form field that will contain the file.

uploadController.uploadSchemaFile - This is the controller function that will execute after the file upload middleware processes the request. 
It likely contains the logic for what to do with the uploaded schema file (such as validating it, saving it, or processing it further).

*/
router.post(
  "/schema",
  upload.single("schemaFile"),
  uploadController.uploadSchemaFile
);

module.exports = router;
