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

export default SelectFormView;
