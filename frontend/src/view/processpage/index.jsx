import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apis from "../../api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const ProcessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const props = location.state.data;

  const [selectedModels, setSelectedModels] = useState([]);
  const [chrNumbers, setChrNumbers] = useState([...Array(22).keys()]);
  const [jobName, setJobName] = useState("");
  const handleRun = () => {
    apis.addJobs(jobName).then(navigate("/result"));
  };
  const [ancestry, setAncestry] = useState("European");

  useEffect(() => {
    if (ancestry === "European") {
      setSelectedModels(["ARIC", "deCODE", "UKB"]);
    } else if (ancestry === "African American") {
      setSelectedModels(["ARIC_AA", "UKB_AFR_std", "UKB_AFR_super"]);
    } else if (ancestry === "Asian") {
      setSelectedModels(["UKB_ASN_std", "UKB_ASN_super"]);
    }
  }, [ancestry]);

  const handleAncestryChange = (event) => {
    setAncestry(event.target.value);
  };

  const handleSelectAll = () => {
    setChrNumbers([...Array(22).keys()].map((_, index) => index + 1));
  };

  const handleUnselectAll = () => {
    setChrNumbers([]);
  };

  return (
    <Box>
      <Box mt={2}>
        <Button
          startIcon={
            <ArrowBackIcon style={{ color: "black", size: "large" }} />
          }
          onClick={() => navigate(-1)}
        ></Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 5,
          gap: 2,
          px: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          BLISS
        </Typography>
        <Typography variant="h6" >
        a novel method designed for developing protein imputation models using summary-level pQTL data
        </Typography>
        <Box sx={{ width: "80%" }}>
          <Typography variant="body1" fontWeight="bold">
            Job Name
          </Typography>
          <TextField
            label="Job Name"
            name="jobName"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            margin="normal"
            fullWidth
          />
        </Box>
        <Box sx={{ width: "80%" }}>
          <Typography variant="body1" fontWeight="bold">
            Ancestry
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup row value={ancestry} onChange={handleAncestryChange}>
              <FormControlLabel
                value="European"
                control={<Radio />}
                label="European"
              />
              <FormControlLabel
                value="African American"
                control={<Radio />}
                label="African American"
              />
              <FormControlLabel
                value="Asian"
                control={<Radio />}
                label="Asian"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={{ width: "80%" }}>
          <Typography variant="body1" fontWeight="bold">
            Weights Model
          </Typography>
          <FormControl variant="outlined" fullWidth>
            <Select
              multiple
              value={selectedModels}
              onChange={(e) => setSelectedModels(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem value={"ARIC"}>ARIC</MenuItem>
              <MenuItem value={"ARIC_AA"}>ARIC_AA</MenuItem>
              <MenuItem value={"deCODE"}>deCODE</MenuItem>
              <MenuItem value={"UKB"}>UKB</MenuItem>
              <MenuItem value={"UKB_AFR_std"}>UKB_AFR_std</MenuItem>
              <MenuItem value={"UKB_AFR_super"}>UKB_AFR_super</MenuItem>
              <MenuItem value={"UKB_ASN_std"}>UKB_ASN_std</MenuItem>
              <MenuItem value={"UKB_ASN_super"}>UKB_ASN_super</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ width: "80%" }}>
          <Typography variant="body1" fontWeight="bold">
            CHR Number (1-22)
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <Select
                  multiple
                  value={chrNumbers}
                  onChange={(e) => setChrNumbers(e.target.value)}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {[...Array(22)].map((_, index) => (
                    <MenuItem key={index} value={index + 1}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" fullWidth onClick={handleSelectAll}>
                Select All
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" fullWidth onClick={handleUnselectAll}>
                Unselect All
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            width: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{ color: "white", backgroundColor: "darkgray", width: "50%" }}
            onClick={handleRun}
          >
            Submit Job
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
