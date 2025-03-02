const express = require("express");
const dotenv = require("dotenv");
const submissionRoutes = require("./routes/submissionRoutes");
const schemaRoutes = require("./routes/schemaRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const db = require("./config/database");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);

  // Create the default schema file if it doesn't exist
  const schemaPath = path.join(dataDir, "defaultSchema.json");
  if (!fs.existsSync(schemaPath)) {
    const defaultSchema = {
      title: "User Registration",
      fields: [
        {
          name: "username",
          label: "Username",
          type: "text",
          required: true,
          minLength: 2,
        },
        { name: "email", label: "Email", type: "email", required: true },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
          minLength: 6,
        },
        { name: "birthdate", label: "Birthdate", type: "date", required: true },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: ["Male", "Female", "Other"],
          required: true,
        },
      ],
    };

    fs.writeFileSync(schemaPath, JSON.stringify(defaultSchema, null, 2));
    console.log("Default schema file created");
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/submissions", submissionRoutes);
app.use("/api/schemas", schemaRoutes);
app.use("/api/upload", uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
