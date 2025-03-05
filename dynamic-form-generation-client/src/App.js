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

import React from "react";
import MainView from "./components/MainView";
import { FromProvider } from "./hooks/FromProvider";

// const theme = createTheme();
export const FromContext = React.createContext();

function App() {
  return (
    <FromProvider>
      <MainView />
    </FromProvider>
  );
}

export default App;
