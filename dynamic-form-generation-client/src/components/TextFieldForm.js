import { TextField } from "@mui/material";
import React, { memo } from "react";

function TextFieldForm({
  field,
  formValues,
  formErrors,
  touched,
  handleChange,
  handleBlur,
}) {
  return (
    <TextField
      fullWidth
      id={field.name}
      name={field.name}
      label={field.label}
      type={field.type}
      value={formValues[field.name] || ""}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched[field.name] && Boolean(formErrors[field.name])}
      helperText={touched[field.name] && formErrors[field.name]}
      required={field.required}
      InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
    />
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
export default memo(TextFieldForm, arePropsEqual);
