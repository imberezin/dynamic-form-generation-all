import { TextField } from "@mui/material";

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

export default TextFieldForm;
