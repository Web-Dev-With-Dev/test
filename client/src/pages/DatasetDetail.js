import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDataset } from "../services/api";
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress
} from "@mui/material";

export default function DatasetDetail() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataset(id)
      .then(res => setRows(res.data.rows))
      .catch(() => alert("Failed to load dataset"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box mt={10} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!rows.length) {
    return (
      <Box mt={10} textAlign="center">
        <Typography>No data</Typography>
      </Box>
    );
  }

  const cols = Object.keys(rows[0]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Dataset Preview</Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {cols.map(c => <TableCell key={c}>{c}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(0, 50).map((r, i) => (
              <TableRow key={i}>
                {cols.map(c => <TableCell key={c}>{String(r[c])}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
