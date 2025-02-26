import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
?import axios from "axios";

const API_URL = "http://localhost:5000/api";

const theme = createTheme();

function App() {
  const [formSchema, setFormSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFormSchema = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/schemas/active`);
      setFormSchema(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching form schema:', err);
      setError('Failed to load form schema. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div>
      <h1>React App</h1>
    </div>
  );
}

export default App;
