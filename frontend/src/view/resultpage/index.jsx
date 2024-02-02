import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

export const ResultPage = () => {
  const email = useSelector((state) => state.user.email);
  const [jobs, setJobs] = useState([
    { id: "Loading", name: "Loading", status: "Loading" },
  ]);
  const determinStatus = (job) => {
    if (job.status === "completed") {
      const downloadLink = `http://3.131.97.141/api/download/${email}/${job.id}`;
      return (
        <div>
          {job.status} <a href={downloadLink} download>Download Result</a>
        </div>
      );
    }
    return job.status;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(email);
      axios
        .get("http://3.131.97.141:5000/api/get_jobs", {params: {
          email: email
        }})
        .then((response) => {
          console.log(response.data);
          setJobs(response.data);
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error);
        });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box mt={5}>
      <Container>
        <Typography variant="h4" align="center" mb={5} gutterBottom>
          My Jobs
        </Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.name}</TableCell>
                  <TableCell>{determinStatus(job)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  );
};
