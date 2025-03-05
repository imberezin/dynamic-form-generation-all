import { useFromContext } from "../hooks/FromProvider";
import DynamicForm from "./DynamicForm";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import SchemaUploader from "./SchemaUploader";
const theme = createTheme();

function MainView() {
  const { formData, loading, error } = useFromContext(); // use custom hook.
  //   console.log("formData", formData);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Dynamic Form System
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            </Box>
          ) : formData ? (
            <DynamicForm />
          ) : (
            <Typography align="center">
              No form schema available. Please upload a schema.
            </Typography>
          )}
        </Box>
      </Container>

      <SchemaUploader />
    </ThemeProvider>
  );
}

export default MainView;
