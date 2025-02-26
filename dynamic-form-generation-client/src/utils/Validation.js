import * as Yup from "yup";

/**
 * Generate Yup validation schema based on form field definitions
 */
export function generateValidationSchema(fields) {
  if (!fields || !Array.isArray(fields)) {
    return Yup.object().shape({});
  }

  const validationFields = {};

  fields.forEach((field) => {
    let validator;

    // Create validator based on field type
    switch (field.type) {
      case "text":
        validator = Yup.string();
        break;
      case "email":
        validator = Yup.string().email("Invalid email format");
        break;
      case "password":
        validator = Yup.string();
        break;
      case "date":
        validator = Yup.date().typeError("Please enter a valid date");
        break;
      case "number":
        validator = Yup.number().typeError("Must be a number");
        break;
      case "select":
        validator = Yup.string();
        break;
      default:
        validator = Yup.string();
    }

    // Add additional validation rules
    if (field.required) {
      validator = validator.required(`${field.label} is required`);
    }

    if (field.minLength) {
      validator = validator.min(
        field.minLength,
        `Minimum ${field.minLength} characters required`
      );
    }

    // Add to validation schema
    validationFields[field.name] = validator;
  });

  return Yup.object().shape(validationFields);
}

/**
 * Validate an entire form
 */
export async function validateForm(schema, values) {
  try {
    await schema.validate(values, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err) {
    const errors = {};
    if (err.inner) {
      err.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
    }
    return { isValid: false, errors };
  }
}

/**
 * Validate a single field
 */
export async function validateField(schema, name, value) {
  try {
    await schema.validateAt(name, { [name]: value });
    return { isValid: true, error: null };
  } catch (err) {
    return { isValid: false, error: err.message };
  }
}

/**
 * Format a date string for display
 */
export function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (e) {
    return dateString;
  }
}
