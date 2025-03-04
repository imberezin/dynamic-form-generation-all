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
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import { Container, Typography, Box, CircularProgress } from "@mui/material";
// import DynamicForm from "./components/DynamicForm";
// import SchemaUploader from "./components/SchemaUploader";
import useFetch from "./hooks/useFetch";

// Import reducer, initial state, and action creators
import appReducer, { initialState, appActions } from "./reducers/appReducer";
import MainView from "./components/MainView";
import { FromProvider } from "./hooks/FromProvider";

// const theme = createTheme();
export const FromContext = React.createContext();

function App() {
  // const [state, dispatch] = useReducer(appReducer, initialState);
  // const { fetchOptions } = state;

  // const { formData, loading, error, setOptions } = useFetch(fetchOptions);

  // function handleSchemaUpdate(timestamp) {
  //   const newOptions = {
  //     service: "schema",
  //     endpoint: "getActive",
  //     params: { timestamp },
  //   };

  //   // Use action creator to dispatch UPDATE_FETCH_OPTIONS action
  //   dispatch(appActions.updateFetchOptions(newOptions));

  //   // Also update the useFetch hook
  //   setOptions(newOptions);
  // }

  // const initialOptions = {
  //   service: "submission",
  //   endpoint: "getAll",
  //   params: {},
  // };

  // const {
  //   formData: submissions = [],
  //   submissionsLoading,
  //   setOptions: submissionsSetOptions,
  // } = useFetch(initialOptions);

  // const updateSubmissionsList = () => {
  //   console.log("Updating submissions list...");
  //   const timestamp = new Date().toLocaleString().replace(",", "");
  //   submissionsSetOptions({
  //     service: "submission",
  //     endpoint: "getAll",
  //     params: { timestamp },
  //   });
  // };

  return (
    <FromProvider>
      <MainView />
    </FromProvider>
  );
}

export default App;
