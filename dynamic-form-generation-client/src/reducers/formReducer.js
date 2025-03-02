/**
 * formReducer.js
 *
 * This module contains the reducer and initial state for the DynamicForm component.
 * It centralizes all form-related state management logic in one place.
 */

/**
 * Initial state for the form reducer
 * @property {Object} formValues - The current values of all form fields, keyed by field name
 * @property {Object} formErrors - Validation error messages for each field, keyed by field name
 * @property {Object} touched - Tracks which fields have been interacted with, keyed by field name with boolean values
 * @property {Object|null} validationSchema - The Yup validation schema generated from form fields
 * @property {boolean} submissionLoading - Indicates if a form submission is in progress
 * @property {string|null} successMessage - Success message to display after operations
 * @property {string|null} errorMessage - Error message to display after failed operations
 */

export const initialState = {
  formValues: {}, // Stores all input values: { fieldName: fieldValue }
  formErrors: {}, // Stores validation errors: { fieldName: errorMessage }
  touched: {}, // Tracks which fields user has interacted with: { fieldName: true }
  validationSchema: null, // Yup schema for validation
  submissionLoading: false, // Indicates if form is being submitted
  successMessage: null, // Success message after submission
  errorMessage: null, // Error message if submission fails
};

/**
 * Action types as constants to avoid typos and improve autocomplete
 */
export const ACTIONS = {
  INIT_FORM: "INIT_FORM",
  UPDATE_FIELD: "UPDATE_FIELD",
  SET_FIELD_ERROR: "SET_FIELD_ERROR",
  SET_TOUCHED: "SET_TOUCHED",
  SET_ALL_TOUCHED: "SET_ALL_TOUCHED",
  SET_FORM_ERRORS: "SET_FORM_ERRORS",
  RESET_FORM: "RESET_FORM",
  SET_SUBMISSION_LOADING: "SET_SUBMISSION_LOADING",
  SET_SUCCESS_MESSAGE: "SET_SUCCESS_MESSAGE",
  SET_ERROR_MESSAGE: "SET_ERROR_MESSAGE",
};

/**
 * Form reducer function that handles all state transitions for the dynamic form
 *
 * @param {Object} state - Current state
 * @param {Object} action - Action with type and payload
 * @returns {Object} New state
 */
export function formReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT_FORM:
      // Initialize the form with schema-derived values and validation
      // payload contains: initialValues, validationSchema
      return {
        ...state,
        formValues: action.payload.initialValues, // Set initial empty values for all fields
        formErrors: {}, // Clear any previous errors
        touched: {}, // Reset touched state for all fields
        validationSchema: action.payload.validationSchema, // Set validation schema
      };

    case ACTIONS.UPDATE_FIELD:
      // Update a single field value and optionally clear its error
      // payload contains: name, value, clearError (boolean)
      return {
        ...state,
        formValues: {
          ...state.formValues,
          [action.payload.name]: action.payload.value, // Update the specific field value
        },
        // Conditionally clear error for this field if it had an error and clearError is true
        formErrors: action.payload.clearError
          ? {
              ...state.formErrors,
              [action.payload.name]: "", // Clear the error for this field
            }
          : state.formErrors, // Keep errors unchanged if not clearing
      };

    case ACTIONS.SET_FIELD_ERROR:
      // Set validation error for a specific field
      // payload contains: name, error
      return {
        ...state,
        formErrors: {
          ...state.formErrors,
          [action.payload.name]: action.payload.error, // Set or clear error for the field
        },
      };

    case ACTIONS.SET_TOUCHED:
      // Mark a field as touched (user has interacted with it)
      // payload contains: name
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.payload.name]: true, // Mark this specific field as touched
        },
      };

    case ACTIONS.SET_ALL_TOUCHED:
      // Mark all fields as touched (typically on form submission)
      // payload contains map of all fields set to touched: { field1: true, field2: true, ... }
      return {
        ...state,
        touched: action.payload, // Replace entire touched object with new one
      };

    case ACTIONS.SET_FORM_ERRORS:
      // Set multiple field errors at once (typically from full form validation)
      // payload contains: { field1: error1, field2: error2, ... }
      return {
        ...state,
        formErrors: action.payload, // Replace entire errors object with validation results
      };

    case ACTIONS.RESET_FORM:
      // Reset form to initial or empty values
      // payload contains initialValues object to reset to
      return {
        ...state,
        formValues: action.payload, // Set form values back to initial state
        formErrors: {}, // Clear all validation errors
        touched: {}, // Reset all touched states
      };

    case ACTIONS.SET_SUBMISSION_LOADING:
      // Update loading state during form submission
      // payload is boolean indicating loading state
      return {
        ...state,
        submissionLoading: action.payload, // Set loading indicator
      };

    case ACTIONS.SET_SUCCESS_MESSAGE:
      // Set success message after successful operation
      // payload is the message string or null
      return {
        ...state,
        successMessage: action.payload, // Update success message
      };

    case ACTIONS.SET_ERROR_MESSAGE:
      // Set error message after failed operation
      // payload is the error message string or null
      return {
        ...state,
        errorMessage: action.payload, // Update error message
      };

    default:
      // Return unchanged state for unknown actions
      return state;
  }
}

/**
 * Action creators for form actions
 * These functions create properly formatted action objects
 */
export const formActions = {
  initForm: (initialValues, validationSchema) => ({
    type: ACTIONS.INIT_FORM,
    payload: { initialValues, validationSchema },
  }),

  updateField: (name, value, clearError = true) => ({
    type: ACTIONS.UPDATE_FIELD,
    payload: { name, value, clearError },
  }),

  setFieldError: (name, error) => ({
    type: ACTIONS.SET_FIELD_ERROR,
    payload: { name, error },
  }),

  setTouched: (name) => ({
    type: ACTIONS.SET_TOUCHED,
    payload: { name },
  }),

  setAllTouched: (touchedFields) => ({
    type: ACTIONS.SET_ALL_TOUCHED,
    payload: touchedFields,
  }),

  setFormErrors: (errors) => ({
    type: ACTIONS.SET_FORM_ERRORS,
    payload: errors,
  }),

  resetForm: (initialValues) => ({
    type: ACTIONS.RESET_FORM,
    payload: initialValues,
  }),

  setSubmissionLoading: (isLoading) => ({
    type: ACTIONS.SET_SUBMISSION_LOADING,
    payload: isLoading,
  }),

  setSuccessMessage: (message) => ({
    type: ACTIONS.SET_SUCCESS_MESSAGE,
    payload: message,
  }),

  setErrorMessage: (message) => ({
    type: ACTIONS.SET_ERROR_MESSAGE,
    payload: message,
  }),
};

export default formReducer;
