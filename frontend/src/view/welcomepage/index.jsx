import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import AlertWindow from "../../component/AlertWindow";
import PromptWindow from "../../component/PromptWindow";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import GoogleIcon from "@mui/icons-material/Google";
import { useDispatch, useSelector } from 'react-redux';
import { setUserEmail } from '../../store/reducers/user';

export const WelcomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = useSelector(state => state.user.email);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [promptOpen, setPromptOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const googleProvider = new GoogleAuthProvider();

  const handleAuth = () => {
    if (isLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User logged in:", user);
          dispatch(setUserEmail(email));
        })
        .catch((error) => {
          console.error("Error:", error.message);
          if (
            error.code === "auth/invalid-email" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/invalid-login-credentials"
          ) {
            setAlertMessage("Invalid login credentials. Please try again.");
            setAlertTitle("⚠️ Error");
            setAlertOpen(true);
          }
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User signed up:", user);
          dispatch(setUserEmail(email));
        })
        .catch((error) => {
          console.error("Error:", error.message);
          if (error.code === "auth/email-already-in-use") {
            setAlertTitle("⚠️ Error");
            setAlertMessage(
              "The email address is already in use by another account."
            );
            setAlertOpen(true);
          } else if (error.code === "auth/weak-password") {
            setAlertTitle("⚠️ Error");
            setAlertMessage("Password should be at least 6 characters.");
            setAlertOpen(true);
          }
        });
    }
  };

  const handlePasswordReset = (resetEmail) => {
    if (!resetEmail) {
      setAlertMessage("Please enter your email address.");
      setAlertTitle("⚠️ Error");
      setAlertOpen(true);
      return;
    }
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setAlertMessage(
          "Password reset email sent if you have an account. Check your email to reset your password. "
        );
        setAlertTitle("✅ Sent email");
        setAlertOpen(true);
      })
      .catch((error) => {
        console.error("Error:", error.message);
        if (error.code === "auth/invalid-email") {
          setAlertMessage("Invalid email address.");
          setAlertTitle("⚠️ Error");
          setAlertOpen(true);
          return;
        }
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log("User logged in with Google:", user);
        dispatch(setUserEmail(user.email));
      })
      .catch((error) => {
        console.error("Error:", error.message);
        setAlertTitle("⚠️ Error");
        setAlertMessage(error.message);
        setAlertOpen(true);
      });
  };

  useEffect(() => {
    if (userEmail) {
      navigate("/home");
    }
  }
  , [navigate, userEmail]);


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
      <Typography variant="h3" component="h2" sx={{ mt: 5 }}>
        🧬 Biomedical Cloud Computing Platform
      </Typography>

      <Typography variant="h5" component="h5" sx={{ mt: 3, mb: 0 }}>
        👋 Welcome ! Please Login or Sign Up to start
      </Typography>

      <AlertWindow
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
      />

      <PromptWindow
        open={promptOpen}
        onClose={() => setPromptOpen(false)}
        title="Reset Password"
        onConfirm={(email) => {
          setPromptOpen(false);
          handlePasswordReset(email);
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          width: "45%",
          mt: 5,
          p: 3,
        }}
      >
        <Typography variant="h6">{isLogin ? "Login" : "Signup"}</Typography>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleAuth}
          sx={{
            mt: 3,
            width: "45%",
            height: "50px",
            color: "white",
            backgroundColor: "grey",
          }}
        >
          {isLogin ? "Login" : "Signup"}
        </Button>
        <Button
          color="secondary"
          sx={{ mt: 2 }}
          onClick={() => setIsLogin((prev) => !prev)}
        >
          {isLogin
            ? "New User ? Sign up here !"
            : "Already have account? Login here !"}
        </Button>
        {isLogin && (
          <Button
            color="secondary"
            onClick={() => {
              setPromptOpen(true);
            }}
          >
            Forgot Password?
          </Button>
        )}
      </Box>
      <Typography variant="h6" >
       --------------- Or ---------------
      </Typography>

      <Button
    
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        sx={{ mt: 1, width: "15%", height: "50px", color: "black"}}
      >
        Login with Google
      </Button>
    </Box>
  );
};
