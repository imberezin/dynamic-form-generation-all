/**
 * DynamicForm.js
 *
 * This component renders a dynamic form based on a provided schema.
 * It uses the useReducer hook with a separate reducer file for state management.
 *
 * Features:
 * - Dynamically generates form fields based on schema
 * - Validates fields on blur and form submission
 * - Handles form submission to an API
 * - Displays success/error messages
 * - Provides form reset functionality
 */

import React, { useReducer, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import SelectFormView from "./SelectFormView";
import TextFieldForm from "./TextFieldForm";
import SubmissionsView from "./SubmissionsView";
import {
  generateValidationSchema,
  validateForm,
  validateField,
} from "../utils/Validation";
import { submissionService } from "../services/Api";

// Import reducer, initial state, and action creators
import formReducer, {
  initialState,
  formActions,
} from "../reducers/formReducer";
import { FromContext } from "../App";

function DynamicForm() {
  const { schema, updateSubmissionsList } = useContext(FromContext);

  const [state, dispatch] = useReducer(formReducer, initialState);
  const {
    formValues,
    formErrors,
    touched,
    validationSchema,
    submissionLoading,
    successMessage,
    errorMessage,
  } = state;

  // Generate validation schema based on the form schema
  useEffect(() => {
    if (schema?.fields) {
      // Use our validation utility to create the schema
      const newValidationSchema = generateValidationSchema(schema.fields);

      // Initialize form values
      const initialValues = {};
      schema.fields.forEach((field) => {
        initialValues[field.name] = "";
      });

      // Use action creator to dispatch INIT_FORM action
      dispatch(formActions.initForm(initialValues, newValidationSchema));
    }
  }, [schema]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Use action creator to dispatch UPDATE_FIELD action
    dispatch(formActions.updateField(name, value, Boolean(formErrors[name])));
  };

  // Handle field blur
  const handleBlur = async (e) => {
    const { name } = e.target;

    // Use action creator to dispatch SET_TOUCHED action
    dispatch(formActions.setTouched(name));

    // Use validation utility to validate the field
    if (validationSchema) {
      const result = await validateField(
        validationSchema,
        name,
        formValues[name]
      );

      // Use action creator to dispatch SET_FIELD_ERROR action
      dispatch(
        formActions.setFieldError(name, result.isValid ? "" : result.error)
      );
    }
  };

  // Validate all fields with our utility
  const validateFormValues = async () => {
    if (!validationSchema) return false;

    const result = await validateForm(validationSchema, formValues);

    if (!result.isValid) {
      // Use action creator to dispatch SET_FORM_ERRORS action
      dispatch(formActions.setFormErrors(result.errors));

      // Mark all fields as touched
      const newTouched = {};
      schema.fields.forEach((field) => {
        newTouched[field.name] = true;
      });

      // Use action creator to dispatch SET_ALL_TOUCHED action
      dispatch(formActions.setAllTouched(newTouched));

      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateFormValues();
    if (!isValid) {
      return;
    }

    // Use action creators to update state for form submission
    dispatch(formActions.setSubmissionLoading(true));
    dispatch(formActions.setErrorMessage(null));

    try {
      await submissionService.createSubmission(schema.title, formValues);

      // Use action creator to set success message
      dispatch(formActions.setSuccessMessage("Form submitted successfully!"));

      updateSubmissionsList();

      // Reset form
      const initialValues = {};
      schema.fields.forEach((field) => {
        initialValues[field.name] = "";
      });

      // Use action creator to reset form
      dispatch(formActions.resetForm(initialValues));
    } catch (error) {
      // Use action creator to set error message
      dispatch(
        formActions.setErrorMessage("Error submitting form. Please try again.")
      );

      console.error("Form submission error:", error);
    } finally {
      // Use action creator to update loading state
      dispatch(formActions.setSubmissionLoading(false));
    }
  };

  // Reset form
  const handleReset = () => {
    const initialValues = {};
    schema.fields.forEach((field) => {
      initialValues[field.name] = "";
    });

    // Use action creator to reset form
    dispatch(formActions.resetForm(initialValues));
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {schema.title}
              </Typography>

              <form onSubmit={handleSubmit}>
                {schema.fields.map((field) => (
                  <Box key={field.name} sx={{ mb: 3 }}>
                    {field.type === "select" ? (
                      <SelectFormView
                        touched={touched}
                        field={field}
                        formErrors={formErrors}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        formValues={formValues}
                      />
                    ) : (
                      <TextFieldForm
                        field={field}
                        formValues={formValues}
                        formErrors={formErrors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                      />
                    )}
                  </Box>
                ))}

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submissionLoading}
                    startIcon={
                      submissionLoading && (
                        <CircularProgress size={20} color="inherit" />
                      )
                    }
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Submissions Section */}
        <SubmissionsView />
      </Grid>

      {/* Success/Error messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => dispatch(formActions.setSuccessMessage(null))}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => dispatch(formActions.setSuccessMessage(null))}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => dispatch(formActions.setErrorMessage(null))}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => dispatch(formActions.setErrorMessage(null))}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default DynamicForm;
