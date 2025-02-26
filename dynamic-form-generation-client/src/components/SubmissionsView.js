import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

function SubmissionsView({ submissions, loading }) {
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

          {loading ? (
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

export default SubmissionsView;
