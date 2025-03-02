/**
 * schemaReducer.js
 *
 * This module contains the reducer and initial state for the SchemaUploader component.
 * It centralizes all schema upload related state management logic.
 */

/**
 * Initial state for the schema uploader
 * @property {boolean} open - Controls if the upload dialog is open
 * @property {number} tabValue - Current active tab index (0 for JSON input, 1 for file upload)
 * @property {string} schemaText - The JSON schema text entered by the user
 * @property {File|null} schemaFile - The JSON file selected for upload
 * @property {string|null} error - Error message to display
 * @property {string|null} success - Success message to display
 * @property {boolean} loading - Indicates if an upload operation is in progress
 */
export const initialState = {
  open: false, // Controls dialog visibility
  tabValue: 0, // Active tab (0 = JSON paste, 1 = File upload)
  schemaText: "", // Content of the JSON text field
  schemaFile: null, // Selected file for upload
  error: null, // Error message to display
  success: null, // Success message after upload
  loading: false, // Loading indicator for API operations
};

/**
 * Action types as constants to avoid typos and improve autocomplete
 */
export const ACTIONS = {
  OPEN_DIALOG: "OPEN_DIALOG",
  CLOSE_DIALOG: "CLOSE_DIALOG",
  CHANGE_TAB: "CHANGE_TAB",
  UPDATE_SCHEMA_TEXT: "UPDATE_SCHEMA_TEXT",
  SET_SCHEMA_FILE: "SET_SCHEMA_FILE",
  SET_ERROR: "SET_ERROR",
  SET_SUCCESS: "SET_SUCCESS",
  SET_LOADING: "SET_LOADING",
};

/**
 * Schema uploader reducer function that handles all state transitions
 *
 * @param {Object} state - Current state
 * @param {Object} action - Action with type and payload
 * @returns {Object} New state
 */
export function schemaReducer(state, action) {
  switch (action.type) {
    case ACTIONS.OPEN_DIALOG:
      // Open the dialog and reset form fields
      return {
        ...state,
        open: true, // Show the dialog
        tabValue: 0, // Reset to first tab (JSON input)
        schemaText: "", // Clear any previous text
        schemaFile: null, // Clear any previous file selection
        error: null, // Clear any previous errors
      };

    case ACTIONS.CLOSE_DIALOG:
      // Close the dialog without changing other state
      return {
        ...state,
        open: false, // Hide the dialog
      };

    case ACTIONS.CHANGE_TAB:
      // Switch between JSON input and file upload tabs
      // payload is the new tab index (0 or 1)
      return {
        ...state,
        tabValue: action.payload, // Update active tab
        error: null, // Clear any errors when switching tabs
      };

    case ACTIONS.UPDATE_SCHEMA_TEXT:
      // Update the JSON text input value
      // payload is the new text value
      return {
        ...state,
        schemaText: action.payload, // Update text content
        error: null, // Clear any validation errors
      };

    case ACTIONS.SET_SCHEMA_FILE:
      // Set the selected file for upload
      // payload is the File object or null
      return {
        ...state,
        schemaFile: action.payload, // Update file selection
        error: null, // Clear any previous errors
      };

    case ACTIONS.SET_ERROR:
      // Set error message for display
      // payload is the error message string
      return {
        ...state,
        error: action.payload, // Set error message
      };

    case ACTIONS.SET_SUCCESS:
      // Set success message after successful operation
      // payload is the success message string
      return {
        ...state,
        success: action.payload, // Set success message
      };

    case ACTIONS.SET_LOADING:
      // Update loading state during API operations
      // payload is boolean indicating loading state
      return {
        ...state,
        loading: action.payload, // Update loading indicator
      };

    default:
      // Return unchanged state for unknown actions
      return state;
  }
}

/**
 * Action creators for schema uploader actions
 * These functions create properly formatted action objects
 */
export const schemaActions = {
  openDialog: () => ({
    type: ACTIONS.OPEN_DIALOG,
  }),

  closeDialog: () => ({
    type: ACTIONS.CLOSE_DIALOG,
  }),

  changeTab: (tabIndex) => ({
    type: ACTIONS.CHANGE_TAB,
    payload: tabIndex,
  }),

  updateSchemaText: (text) => ({
    type: ACTIONS.UPDATE_SCHEMA_TEXT,
    payload: text,
  }),

  setSchemaFile: (file) => ({
    type: ACTIONS.SET_SCHEMA_FILE,
    payload: file,
  }),

  setError: (errorMessage) => ({
    type: ACTIONS.SET_ERROR,
    payload: errorMessage,
  }),

  setSuccess: (successMessage) => ({
    type: ACTIONS.SET_SUCCESS,
    payload: successMessage,
  }),

  setLoading: (isLoading) => ({
    type: ACTIONS.SET_LOADING,
    payload: isLoading,
  }),
};

export default schemaReducer;
