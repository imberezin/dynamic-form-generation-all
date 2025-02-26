import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import DynamicForm from "./components/DynamicForm";
import SchemaUploader from "./components/SchemaUploader";
import useFetch from "./hooks/useFetch";

const theme = createTheme();

function App() {
  const initialOptions = {
    service: "schema",
    endpoint: "getActive",
    params: {},
  };

  const { formData, loading, error, setOptions } = useFetch(initialOptions);

  function handleSchemaUpdate(timestamp) {
    setOptions({
      service: "schema",
      endpoint: "getActive",
      params: { timestamp },
    });
  }

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
            <DynamicForm schema={formData} />
          ) : (
            <Typography align="center">
              No form schema available. Please upload a schema.
            </Typography>
          )}
        </Box>
      </Container>

      <SchemaUploader onSchemaUpdated={handleSchemaUpdate} />
    </ThemeProvider>
  );
}

export default App;
