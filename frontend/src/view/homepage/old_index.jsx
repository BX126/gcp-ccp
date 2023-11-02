import React, { useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import MethodCard from "../../component/MethodCard";

export const HomePage = () => {
  const navigate = useNavigate();
  const handleSelectMethod = () => {
    navigate("/process", {
      state: {
        data: {
          name: "BLISS",
          imageURL: "methods/BLISS.png",
          introduction:
            "A novel method designed for developing protein imputation models using summary-level pQTL data.",
          githubLink: "https://github.com/gcb-hub/BLISS",
        },
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Typography variant="h2" component="h2" sx={{ mt: 5 }}>
        🧬 Biomedical Cloud Computing Platform
      </Typography>

      <Typography variant="h5" component="h5" sx={{ mt: 3, mb: 0 }}>
        🚩 Click on a supported method from following methods to start
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          mt: 5,
        }}
      >
        <MethodCard
          name="BLISS"
          imageURL="methods/BLISS.png"
          introduction="A novel method designed for developing protein imputation models using summary-level pQTL data."
          githubLink="https://github.com/gcb-hub/BLISS"
          onClick={handleSelectMethod}
        />
      </Box>

      <Typography
        variant="h5"
        component="h5"
        sx={{ mt: 5, mb: 0, color: "grey" }}
      >
        <i>More methods will be avalible soon ...</i>
      </Typography>
    </Box>
  );
};
