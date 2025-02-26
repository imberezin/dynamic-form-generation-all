import React, { useState, useEffect } from "react";
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
import useFetch from "../hooks/useFetch";
import SubmissionsView from "./SubmissionsView";
import {
  generateValidationSchema,
  validateForm,
  validateField,
} from "../utils/Validation";
import { submissionService } from "../services/Api";

function DynamicForm({ schema }) {
  const initialOptions = {
    service: "submission",
    endpoint: "getAll",
    params: {},
  };

  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [validationSchema, setValidationSchema] = useState(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    formData: submissions = [],
    loading,
    setOptions,
  } = useFetch(initialOptions);

  // Generate validation schema based on the form schema
  useEffect(() => {
    if (schema?.fields) {
      // Use our validation utility to create the schema
      setValidationSchema(generateValidationSchema(schema.fields));

      // Initialize form values
      const initialValues = {};
      schema.fields.forEach((field) => {
        initialValues[field.name] = "";
      });

      setFormValues(initialValues);
      setFormErrors({});
      setTouched({});
    }
  }, [schema]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if it was previously set
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle field blur
  const handleBlur = async (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Use validation utility to validate the field
    if (validationSchema) {
      const result = await validateField(
        validationSchema,
        name,
        formValues[name]
      );
      if (!result.isValid) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: result.error,
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  // Validate all fields with our utility
  const validateFormValues = async () => {
    if (!validationSchema) return false;

    const result = await validateForm(validationSchema, formValues);

    if (!result.isValid) {
      setFormErrors(result.errors);

      // Mark all fields as touched
      const newTouched = {};
      schema.fields.forEach((field) => {
        newTouched[field.name] = true;
      });
      setTouched(newTouched);

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

    setSubmissionLoading(true);
    setErrorMessage(null);

    try {
      await submissionService.createSubmission(schema.title, formValues);

      setSuccessMessage("Form submitted successfully!");

      // Refresh submissions with a timestamp to bust cache
      const timestamp = new Date().toLocaleString().replace(",", "");
      setOptions({
        service: "submission",
        endpoint: "getAll",
        params: { timestamp },
      });

      // Reset form
      const initialValues = {};
      schema.fields.forEach((field) => {
        initialValues[field.name] = "";
      });
      setFormValues(initialValues);
      setFormErrors({});
      setTouched({});
    } catch (error) {
      setErrorMessage("Error submitting form. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setSubmissionLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    const initialValues = {};
    schema.fields.forEach((field) => {
      initialValues[field.name] = "";
    });
    setFormValues(initialValues);
    setFormErrors({});
    setTouched({});
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
        <SubmissionsView submissions={submissions} loading={loading} />
      </Grid>

      {/* Success/Error messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
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
