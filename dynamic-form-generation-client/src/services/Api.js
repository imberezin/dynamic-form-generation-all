const API_URL = "http://localhost:5000/api";

/**
 * Generic fetch function with error handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Parsed response data
 */
export async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
}

/**
 * Schema related API functions
 */
export const schemaService = {
  // Get the active form schema
  getActiveSchema: async (timestamp = "") => {
    const query = timestamp ? `?date=${timestamp}` : "";
    return fetchWithErrorHandling(`${API_URL}/schemas/active${query}`);
  },

  // Upload a schema as JSON
  uploadSchema: async (schemaData) => {
    return fetchWithErrorHandling(`${API_URL}/schemas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schemaData),
    });
  },

  // Upload a schema as file
  uploadSchemaFile: async (formData) => {
    return fetchWithErrorHandling(`${API_URL}/upload/schema`, {
      method: "POST",
      body: formData,
    });
  },
};

/**
 * Submissions related API functions
 */
export const submissionService = {
  // Get all submissions
  getSubmissions: async (timestamp = "") => {
    const query = timestamp ? `?date=${timestamp}` : "";
    return fetchWithErrorHandling(`${API_URL}/submissions${query}`);
  },

  // Create a new submission
  createSubmission: async (formTitle, formData) => {
    return fetchWithErrorHandling(`${API_URL}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formTitle,
        data: formData,
      }),
    });
  },

  // Get a specific submission
  getSubmission: async (id) => {
    return fetchWithErrorHandling(`${API_URL}/submissions/${id}`);
  },
};
