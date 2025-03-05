// import React from "react";
import { useReducer } from "react";
import useFetch from "./useFetch";
import appReducer, { initialState, appActions } from "../reducers/appReducer";
import React, { createContext, useContext } from "react";

export const FromContext = createContext();

export function FromProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { fetchOptions } = state;

  const { formData, loading, error, setOptions } = useFetch(fetchOptions);
  // console.log("useFetch result - formData:", formData, "loading:", loading);

  function handleSchemaUpdate(timestamp) {
    // console.log("Updating schema...");
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

  const submissionsInitialOptions = {
    service: "submission",
    endpoint: "getAll",
    params: {},
  };
  const {
    formData: submissions = [],
    submissionsLoading,
    setOptions: submissionsSetOptions,
  } = useFetch(submissionsInitialOptions);

  const updateSubmissionsList = () => {
    // console.log("Updating submissions list...");
    const timestamp = new Date().toLocaleString().replace(",", "");
    submissionsSetOptions({
      service: "submission",
      endpoint: "getAll",
      params: { timestamp },
    });
  };

  const value = {
    formData,
    loading,
    error,
    handleSchemaUpdate,
    submissions,
    submissionsLoading,
    updateSubmissionsList,
  };

  return <FromContext.Provider value={value}>{children}</FromContext.Provider>;
}
export function useFromContext() {
  return useContext(FromContext);
}
