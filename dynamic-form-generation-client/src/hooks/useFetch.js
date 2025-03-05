import { useState, useEffect, useCallback, useRef } from "react";
import { schemaService, submissionService } from "../services/Api";
/**
 * Enhanced useFetch hook that works with the API service
 * @param {Object} options - Initial options
 * @returns {Object} - Hook state and handlers
 */
export default function useFetch(options) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiOptions, setApiOptions] = useState(options);

  const hasRun = useRef(false);

  const handleSetError = useCallback((errorMessage) => {
    setError(() => errorMessage);
  }, []);

  // Create a function to update API options
  const setOptions = useCallback((newOptions) => {
    // console.log("Setting new options:", newOptions);
    setApiOptions(newOptions);
  }, []);

  // Fetch data based on service and endpoint
  useEffect(() => {
    if (!hasRun.current) {
      console.log("This will run only once");
      hasRun.current = true;

      const controller = new AbortController();
      const signal = controller.signal;

      async function fetchData() {
        if (!apiOptions || !apiOptions.service || !apiOptions.endpoint) {
          console.error("Invalid API options:", apiOptions);
          return;
        }

        const { service, endpoint, params = {} } = apiOptions;

        setLoading(true);
        setError(null);

        try {
          let data;

          // Select the appropriate service and endpoint
          switch (service) {
            case "schema":
              switch (endpoint) {
                case "getActive":
                  data = await schemaService.getActiveSchema(params.timestamp);
                  hasRun.current = false;
                  break;
                case "upload":
                  data = await schemaService.uploadSchema(params.schemaData);
                  hasRun.current = false;
                  break;
                case "uploadFile":
                  data = await schemaService.uploadSchemaFile(params.formData);
                  hasRun.current = false;
                  break;
                default:
                  throw new Error(`Unknown schema endpoint: ${endpoint}`);
              }
              break;

            case "submission":
              switch (endpoint) {
                case "getAll":
                  data = await submissionService.getSubmissions(
                    params.timestamp
                  );
                  hasRun.current = false;
                  break;
                case "create":
                  data = await submissionService.createSubmission(
                    params.formTitle,
                    params.formData
                  );
                  hasRun.current = false;
                  break;
                case "getOne":
                  data = await submissionService.getSubmission(params.id);
                  hasRun.current = false;
                  break;
                default:
                  throw new Error(`Unknown submission endpoint: ${endpoint}`);
              }
              break;

            default:
              // Legacy API mode for backward compatibility
              if (apiOptions.url) {
                const response = await fetch(apiOptions.url, {
                  method:
                    apiOptions.method !== "GET" ? apiOptions.method : "GET",
                  signal,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  ...(apiOptions.method !== "GET" && { body: apiOptions.body }),
                });

                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }

                data = await response.json();
                hasRun.current = false;
              } else {
                throw new Error(`Unknown service: ${service}`);
              }
          }

          // console.log("Data fetched:", data);
          setFormData(data);
        } catch (err) {
          console.error("Error fetching data:", err);
          if (err.name !== "AbortError") {
            setError(err.message || "An error occurred while fetching data.");
          }
        } finally {
          setLoading(false);
        }
      }

      fetchData();

      //cleanup function
      return () => {
        //hasRun.current = false;
        controller.abort();
      };
    }
  }, [apiOptions]);

  return {
    formData,
    loading,
    error,
    handleSetError,
    setOptions,
  };
}
