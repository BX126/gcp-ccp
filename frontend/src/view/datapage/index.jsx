import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";
import apis from "../../api";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFileName } from "../../store/reducers/user";

export const DataPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.user.email);
  const [formData, setFormData] = useState({
    chromosome: "",
    snp: "",
    a1: "",
    a2: "",
    z: "",
    beta: "",
    se: "",
  });

  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const response = await apis.uploadData(file, userEmail);
        setUploadedFileName(file.name);
      } catch (error) {
        console.log("Error while uploading:", error);
      }
      dispatch(setFileName(file.name));
      setUploading(false);
    }
  };

  const [scoreType, setScoreType] = useState("z");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleScoreTypeChange = (e) => {
    setScoreType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/process", { state: { formData } });
    console.log("Form submitted:", formData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "95vh",
        backgroundColor: "white",
      }}
    >
      <Grid item xs={3}>
        <Paper elevation={0} sx={{ p: 1, maxWidth: "500px" }}>
          <Typography variant="h5" gutterBottom align="center">
            Please upload data and fill in the corresponding column names in your data.
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt:3
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Data
            </Typography>
            <Button
              variant="contained"
              color="grey"
              component="label"
              disabled={uploading}
              endIcon={uploading ? <CircularProgress size={20} /> : null}
            >
              {uploadedFileName ? "Re-upload" : "Upload"}
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
          {uploadedFileName && (
            <Typography color="textSecondary">
              Uploaded: {uploadedFileName}
            </Typography>
          )}

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  label="CHROMOSOME"
                  name="chromosome"
                  value={formData.chromosome}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="SNP"
                  name="snp"
                  value={formData.snp}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="A1"
                  name="a1"
                  value={formData.a1}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="A2"
                  name="a2"
                  value={formData.a2}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={scoreType}
                    onChange={handleScoreTypeChange}
                  >
                    <FormControlLabel
                      value="z"
                      control={<Radio />}
                      label="Z-score"
                    />
                    <FormControlLabel
                      value="beta-se"
                      control={<Radio />}
                      label="Beta and SE"
                    />
                    <FormHelperText>
                      If you don't have Z in your data, please provide the name of BETA and SE columns.
                    </FormHelperText>
                  </RadioGroup>
                </FormControl>
              </Grid>
              {scoreType === "z" ? (
                <Grid item xs={12}>
                  <TextField
                    label="Z"
                    name="z"
                    value={formData.z}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
              ) : (
                <Grid item xs={12} container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      label="Beta"
                      name="beta"
                      value={formData.beta}
                      onChange={handleChange}
                      margin="normal"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="SE"
                      name="se"
                      value={formData.se}
                      onChange={handleChange}
                      margin="normal"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  {...(uploading && { disabled: true })}
                  sx={{ color: "white", backgroundColor: "darkgray" }}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Box>
  );
};
