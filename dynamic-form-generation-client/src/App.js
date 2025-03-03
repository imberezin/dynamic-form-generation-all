/**
 * App.js
 *
 * Main application component that manages the overall structure and state.
 * It uses the useReducer hook with a separate reducer file for managing fetch options.
 *
 * Features:
 * - Implements the main layout with Material UI
 * - Manages loading, error, and success states
 * - Conditionally renders the dynamic form based on schema availability
 * - Coordinates schema updates between components
 */

import React, { useReducer } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import DynamicForm from "./components/DynamicForm";
import SchemaUploader from "./components/SchemaUploader";
import useFetch from "./hooks/useFetch";

// Import reducer, initial state, and action creators
import appReducer, { initialState, appActions } from "./reducers/appReducer";

const theme = createTheme();

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { fetchOptions } = state;

  const { formData, loading, error, setOptions } = useFetch(fetchOptions);

  function handleSchemaUpdate(timestamp) {
    const newOptions = {
      service: "schema",
      endpoint: "getActive",
      params: { timestamp },
    };

    // Use action creator to dispatch UPDATE_FETCH_OPTIONS action
    dispatch(appActions.updateFetchOptions(newOptions));

    // Also update the useFetch hook
    setOptions(newOptions);
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
