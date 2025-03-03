import React, { memo } from "react";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

function SelectFormView({
  touched,
  field,
  formErrors,
  handleChange,
  handleBlur,
  formValues,
}) {
  return (
    <FormControl
      fullWidth
      error={touched[field.name] && Boolean(formErrors[field.name])}
    >
      <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
      <Select
        labelId={`${field.name}-label`}
        id={field.name}
        name={field.name}
        value={formValues[field.name] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        label={field.label}
        required={field.required}
      >
        {field.options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {touched[field.name] && formErrors[field.name] && (
        <FormHelperText>{formErrors[field.name]}</FormHelperText>
      )}
    </FormControl>
  );
}

/**
 * Custom comparison function to determine if component needs to re-render
 */
function arePropsEqual(prevProps, nextProps) {
  // Check if field configuration changed
  if (prevProps.field !== nextProps.field) return false;

  // Check if the specific field's value changed
  const fieldName = prevProps.field.name;
  if (prevProps.formValues[fieldName] !== nextProps.formValues[fieldName])
    return false;

  // Check if the field's error state changed
  if (prevProps.formErrors[fieldName] !== nextProps.formErrors[fieldName])
    return false;

  // Check if the field's touched state changed
  if (prevProps.touched[fieldName] !== nextProps.touched[fieldName])
    return false;

  // If we got here, no relevant props changed
  return true;
}

// Export memoized component with custom comparison function
export default memo(SelectFormView, arePropsEqual);
