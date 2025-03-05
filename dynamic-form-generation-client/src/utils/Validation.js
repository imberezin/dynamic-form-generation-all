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
    console.log("field is :", field);

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
      case "phone": // Add phone validation
        validator = Yup.string().matches(
          /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/,
          "Invalid phone number format"
        );
        break;
      case "url": // Add URL validation
        validator = Yup.string().url("Invalid URL format");
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

  // Add password confirmation validation
  fields.forEach((field) => {
    if (field.confirmPassword) {
      // Update the validator with the password confirmation check
      validationFields[field.name] = Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref(field.confirmPassword)], "Passwords must match");
    }
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
export async function validateField(schema, name, value, allValues) {
  try {
    // Create an object that includes the current field value
    const valuesToValidate = {
      ...allValues,
      [name]: value, // Ensure the current value is used
    };

    // Validate using the combined values
    await schema.validateAt(name, valuesToValidate);
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
