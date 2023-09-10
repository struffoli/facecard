import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import AuthForm from "../components/AuthForm";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [navigate, user]);

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          FaceCard
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to FaceCard!
        </Typography>
        <AuthForm />
      </Box>
    </Box>
  );
};

export default LoginPage;
