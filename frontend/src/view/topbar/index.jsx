import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux";
import { setUserEmail } from "../../store/reducers/user";
import { useNavigate } from "react-router-dom";

export const TopBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const userEmail = useSelector((state) => state.user.email);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyJobs = () => {
    handleClose();
    navigate("/result");
  }

  const gc = () => {
    handleClose();
    navigate("/gwascatalog");
  }

  const handleUploadNewData = () => {
    handleClose();
    navigate("/data");
  }

  const handleUploadNewJob = () => {
    handleClose();
    navigate("/process");
  }

  const handleLogOut = () => {
    dispatch(setUserEmail(null));
    handleClose();
    navigate("/");
  };


  return (
    <AppBar
      position="static"
      color="default"
      style={{ backgroundColor: "lightgrey" }}
      elevation={0}
    >
      <Toolbar>
        <Typography variant="h6" style={{ marginRight: "16px" }}>
          🧬 Biomedical Cloud Computing Platform
        </Typography>
        <Box display="flex" flexGrow={1}></Box>
        {userEmail && (
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={gc}>GWAS Catalog</MenuItem>
          <MenuItem onClick={handleMyJobs}>My Jobs</MenuItem>
          <MenuItem onClick={handleUploadNewData}>Upload New Data</MenuItem>
          <MenuItem onClick={handleUploadNewJob}>Submit New Job</MenuItem>
          <MenuItem onClick={handleLogOut}>Log out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
