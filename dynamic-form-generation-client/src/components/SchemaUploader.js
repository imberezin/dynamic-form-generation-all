import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Snackbar,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { schemaService } from "../services/Api";

function SchemaUploader({ onSchemaUpdated }) {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [schemaText, setSchemaText] = useState("");
  const [schemaFile, setSchemaFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setTabValue(0);
    setSchemaText("");
    setSchemaFile(null);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(null);
  };

  const handleTextChange = (e) => {
    setSchemaText(e.target.value);
    setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/json") {
        setError("Only JSON files are allowed");
        setSchemaFile(null);
      } else {
        setSchemaFile(file);
        setError(null);
      }
    }
  };

  const handleJsonSubmit = async () => {
    try {
      setLoading(true);
      // Validate JSON format
      let schemaJson;
      try {
        schemaJson = JSON.parse(schemaText);
      } catch (err) {
        setError("Invalid JSON format");
        setLoading(false);
        return;
      }

      // Validate schema structure
      if (!schemaJson.title || !Array.isArray(schemaJson.fields)) {
        setError("Schema must include a title and fields array");
        setLoading(false);
        return;
      }

      // Submit the schema using our service
      await schemaService.uploadSchema(schemaJson);

      setSuccess("Schema uploaded successfully");
      handleClose();

      // Notify the parent component to refresh the schema
      const timestamp = new Date().toLocaleString().replace(",", "");
      onSchemaUpdated(timestamp);
    } catch (err) {
      console.error("Error uploading schema:", err);
      setError(err.message || "Failed to upload schema");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async () => {
    if (!schemaFile) {
      setError("Please select a file");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("schemaFile", schemaFile);

      // Submit file using our service
      await schemaService.uploadSchemaFile(formData);

      setSuccess("Schema file uploaded successfully");
      handleClose();

      // Notify the parent component to refresh the schema
      const timestamp = new Date().toLocaleString().replace(",", "");
      onSchemaUpdated(timestamp);
    } catch (err) {
      console.error("Error uploading schema file:", err);
      setError(err.message || "Failed to upload schema file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add schema"
        onClick={handleOpen}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Upload Form Schema</DialogTitle>
        <DialogContent>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ mb: 2 }}
          >
            <Tab label="Paste JSON" />
            <Tab label="Upload File" />
          </Tabs>

          {tabValue === 0 && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Paste your JSON schema below. It should have a title and fields
                array.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                id="schema"
                label="JSON Schema"
                multiline
                rows={10}
                fullWidth
                variant="outlined"
                value={schemaText}
                onChange={handleTextChange}
                error={!!error}
                helperText={error}
              />
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body2" gutterBottom>
                Upload a JSON file containing your form schema.
              </Typography>

              <Box sx={{ mt: 3, mb: 2 }}>
                <input
                  accept=".json"
                  style={{ display: "none" }}
                  id="schema-file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="schema-file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadFileIcon />}
                    sx={{ mb: 2 }}
                  >
                    Select JSON File
                  </Button>
                </label>
              </Box>

              {schemaFile && (
                <Paper
                  variant="outlined"
                  sx={{ p: 2, maxWidth: 400, mx: "auto" }}
                >
                  <Typography variant="body2">
                    Selected file: <strong>{schemaFile.name}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Size: {(schemaFile.size / 1024).toFixed(2)} KB
                  </Typography>
                </Paper>
              )}

              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {tabValue === 0 ? (
            <Button
              onClick={handleJsonSubmit}
              variant="contained"
              disabled={!schemaText || loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              Upload JSON
            </Button>
          ) : (
            <Button
              onClick={handleFileSubmit}
              variant="contained"
              disabled={!schemaFile || loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              Upload File
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SchemaUploader;
