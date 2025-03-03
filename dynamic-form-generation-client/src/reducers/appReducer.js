/**
 * appReducer.js
 *
 * This module contains the reducer and initial state for the App component.
 * It manages the application-level state, primarily focused on API fetch configuration.
 */

/**
 * Initial state for the app reducer
 * @property {Object} fetchOptions - Configuration for the API fetch operations
 * @property {string} fetchOptions.service - The API service to use (e.g., "schema", "submission")
 * @property {string} fetchOptions.endpoint - The endpoint to call on the service
 * @property {Object} fetchOptions.params - Additional parameters for the API call
 */
export const initialState = {
  fetchOptions: {
    service: "schema", // Target service for the API call
    endpoint: "getActive", // Specific endpoint to call
    params: {}, // Optional parameters (query params, etc.)
  },
};

/**
 * Action types as constants to avoid typos and improve autocomplete
 */
export const ACTIONS = {
  UPDATE_FETCH_OPTIONS: "UPDATE_FETCH_OPTIONS",
};

/**
 * App reducer function that handles application-level state transitions
 *
 * @param {Object} state - Current state
 * @param {Object} action - Action with type and payload
 * @returns {Object} New state
 */
export function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_FETCH_OPTIONS:
      // Update the fetch configuration for API calls
      // payload contains the complete new fetch options object
      return {
        ...state,
        fetchOptions: action.payload, // Replace fetch options with new configuration
      };

    default:
      // Return unchanged state for unknown actions
      return state;
  }
}

/**
 * Action creators for app actions
 * These functions create properly formatted action objects
 */
export const appActions = {
  updateFetchOptions: (options) => ({
    type: ACTIONS.UPDATE_FETCH_OPTIONS,
    payload: options,
  }),
};

export default appReducer;
