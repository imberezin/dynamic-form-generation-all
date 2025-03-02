import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

/**
 * This file exports all reducers, their initial states, and action creators.
 * It provides a single entry point for importing reducer-related functionality.
 */

// Export form reducer components
export { default as formReducer } from "./reducers/formReducer";
export {
  initialState as formInitialState,
  formActions,
} from "./reducers/formReducer";

// Export schema reducer components
export { default as schemaReducer } from "./reducers/schemaReducer";
export {
  initialState as schemaInitialState,
  schemaActions,
} from "./reducers/schemaReducer";

// Export app reducer components
export { default as appReducer } from "./reducers/appReducer";
export {
  initialState as appInitialState,
  appActions,
} from "./reducers/appReducer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
