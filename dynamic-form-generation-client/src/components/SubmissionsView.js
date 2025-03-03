import React, { memo, useContext } from "react";
import { FromContext } from "../App";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

function SubmissionsView() {
  const { submissions, submissionsLoading } = useContext(FromContext);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Grid item xs={12} md={6}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Previous Submissions
          </Typography>

          {submissionsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={30} />
            </Box>
          ) : submissions?.length === 0 ? (
            <Typography color="textSecondary">No submissions yet</Typography>
          ) : (
            submissions?.map((submission, index) => (
              <Card
                key={submission.id || index}
                variant="outlined"
                sx={{ mb: 2, p: 2 }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Submitted: {formatDate(submission.created_at)}
                </Typography>
                <Box>
                  {Object.entries(submission.data).map(([key, value]) => (
                    <Typography key={key} variant="body2">
                      <strong>{key}:</strong> {value.toString()}
                    </Typography>
                  ))}
                </Box>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

function arePropsEqual(prevProps, nextProps) {
  // Check if loading state changed
  if (prevProps.loading !== nextProps.loading) return false;

  // Check if submissions array reference changed
  if (prevProps.submissions !== nextProps.submissions) {
    // If lengths differ, definitely changed
    if (
      !prevProps.submissions ||
      !nextProps.submissions ||
      prevProps.submissions.length !== nextProps.submissions.length
    ) {
      return false;
    }

    // Check if submissions were added or ids changed
    for (let i = 0; i < prevProps.submissions.length; i++) {
      if (prevProps.submissions[i].id !== nextProps.submissions[i].id) {
        return false;
      }
    }
  }

  // If we got here, no relevant props changed
  return true;
}

// Export memoized component with custom comparison function
export default memo(SubmissionsView, arePropsEqual);
