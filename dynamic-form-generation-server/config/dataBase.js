const mysql = require("mysql");

const dbConfig = require("./config");

const fs = require("fs");
const path = require("path");
const formConfig = require("./data/defaultSchema");

var con = mysql.createConnection(dbConfig.database);

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  // Initialize database tables without file operations
  initDb();
});

// Function to initialize database tables
function initDb() {
  // Create form_schemas table if not exists
  const createFormSchemasTable = `
    CREATE TABLE IF NOT EXISTS form_schemas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      fields JSON NOT NULL,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create submissions table if not exists
  const createSubmissionsTable = `
    CREATE TABLE IF NOT EXISTS submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      form_title VARCHAR(255) NOT NULL,
      data JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  con.query(createFormSchemasTable, (err) => {
    if (err) {
      console.error("Error creating form_schemas table:", err);
      return;
    }
    console.log("form_schemas table is ready");

    // Check if we need to insert default schema
    con.query("SELECT COUNT(*) as count FROM form_schemas", (err, results) => {
      if (err) {
        console.error("Error counting schemas:", err);
        return;
      }

      if (results[0].count === 0) {
        // Insert default schema directly
        const defaultSchema = formConfig.defaultSchema;

        const insertQuery = `
          INSERT INTO form_schemas (title, fields, active)
          VALUES (?, ?, true)
        `;

        con.query(
          insertQuery,
          [defaultSchema.title, JSON.stringify(defaultSchema.fields)],
          (err) => {
            if (err) {
              console.error("Error inserting default schema:", err);
              return;
            }
            console.log("Default schema inserted");
          }
        );
      }
    });
  });

  con.query(createSubmissionsTable, (err) => {
    if (err) {
      console.error("Error creating submissions table:", err);
      return;
    }
    console.log("submissions table is ready");
  });
}

module.exports = con;
