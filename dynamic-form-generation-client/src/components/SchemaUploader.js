/**
 * SchemaUploader.js
 *
 * This component provides a UI for uploading form schemas either as JSON text
 * or as a file upload. It uses the useReducer hook with a separate reducer file.
 *
 * Features:
 * - Dialog with tab navigation between JSON paste and file upload
 * - JSON validation before submission
 * - File type validation
 * - Loading indicators during submission
 * - Success/error notifications
 */

import React, { useReducer } from "react";
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

// Import reducer, initial state, and action creators
import schemaReducer, {
  initialState,
  schemaActions,
} from "../reducers/schemaReducer";

function SchemaUploader({ onSchemaUpdated }) {
  const [state, dispatch] = useReducer(schemaReducer, initialState);
  const { open, tabValue, schemaText, schemaFile, error, success, loading } =
    state;

  const handleOpen = () => {
    // Use action creator to dispatch OPEN_DIALOG action
    dispatch(schemaActions.openDialog());
  };

  const handleClose = () => {
    // Use action creator to dispatch CLOSE_DIALOG action
    dispatch(schemaActions.closeDialog());
  };

  const handleTabChange = (event, newValue) => {
    // Use action creator to dispatch CHANGE_TAB action
    dispatch(schemaActions.changeTab(newValue));
  };

  const handleTextChange = (e) => {
    // Use action creator to dispatch UPDATE_SCHEMA_TEXT action
    dispatch(schemaActions.updateSchemaText(e.target.value));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/json") {
        // Use action creator to dispatch SET_ERROR action
        dispatch(schemaActions.setError("Only JSON files are allowed"));
        // Use action creator to dispatch SET_SCHEMA_FILE action with null
        dispatch(schemaActions.setSchemaFile(null));
      } else {
        // Use action creator to dispatch SET_SCHEMA_FILE action with file
        dispatch(schemaActions.setSchemaFile(file));
      }
    }
  };

  const handleJsonSubmit = async () => {
    try {
      // Use action creator to dispatch SET_LOADING action
      dispatch(schemaActions.setLoading(true));

      // Validate JSON format
      let schemaJson;
      try {
        schemaJson = JSON.parse(schemaText);
      } catch (err) {
        // Use action creator to dispatch SET_ERROR action
        dispatch(schemaActions.setError("Invalid JSON format"));
        dispatch(schemaActions.setLoading(false));
        return;
      }

      // Validate schema structure
      if (!schemaJson.title || !Array.isArray(schemaJson.fields)) {
        // Use action creator to dispatch SET_ERROR action
        dispatch(
          schemaActions.setError("Schema must include a title and fields array")
        );
        dispatch(schemaActions.setLoading(false));
        return;
      }

      // Submit the schema using our service
      await schemaService.uploadSchema(schemaJson);

      // Use action creator to dispatch SET_SUCCESS action
      dispatch(schemaActions.setSuccess("Schema uploaded successfully"));
      handleClose();

      // Notify the parent component to refresh the schema
      const timestamp = new Date().toLocaleString().replace(",", "");
      onSchemaUpdated(timestamp);
    } catch (err) {
      console.error("Error uploading schema:", err);
      // Use action creator to dispatch SET_ERROR action
      dispatch(
        schemaActions.setError(err.message || "Failed to upload schema")
      );
    } finally {
      // Use action creator to dispatch SET_LOADING action
      dispatch(schemaActions.setLoading(false));
    }
  };

  const handleFileSubmit = async () => {
    if (!schemaFile) {
      // Use action creator to dispatch SET_ERROR action
      dispatch(schemaActions.setError("Please select a file"));
      return;
    }

    try {
      // Use action creator to dispatch SET_LOADING action
      dispatch(schemaActions.setLoading(true));
      const formData = new FormData();
      formData.append("schemaFile", schemaFile);

      // Submit file using our service
      await schemaService.uploadSchemaFile(formData);

      // Use action creator to dispatch SET_SUCCESS action
      dispatch(schemaActions.setSuccess("Schema file uploaded successfully"));
      handleClose();

      // Notify the parent component to refresh the schema
      const timestamp = new Date().toLocaleString().replace(",", "");
      onSchemaUpdated(timestamp);
    } catch (err) {
      console.error("Error uploading schema file:", err);
      // Use action creator to dispatch SET_ERROR action
      dispatch(
        schemaActions.setError(err.message || "Failed to upload schema file")
      );
    } finally {
      // Use action creator to dispatch SET_LOADING action
      dispatch(schemaActions.setLoading(false));
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
        onClose={() => dispatch(schemaActions.setSuccess(null))}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => dispatch(schemaActions.setSuccess(null))}
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
