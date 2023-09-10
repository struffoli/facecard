import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../state/slices/authSlice";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../state/slices/usersApiSlice";
import Dropzone from "react-dropzone";
import FlexBetween from "./FlexBetween";

const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(1, "Name must be at least 1 character")
    .max(50, "Name cannot be longer than 50 characters")
    .trim()
    .required("Required field"),
  username: yup
    .string()
    .min(1, "Username must be at least 4 characters")
    .max(50, "Username cannot be longer than 30 characters")
    .trim()
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, or underscores"
    )
    .required("Required field"),
  email: yup
    .string()
    .email("Invalid email")
    .max(100, "Email cannot be longer than 100 characters")
    .lowercase()
    .required("Required field"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(50, "Password cannot be longer than 64 characters")
    .required("Required field"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const loginSchema = yup.object().shape({
  loginName: yup.string().required("Required field"),
  password: yup.string().required("Required field"),
});

const initialValuesRegister = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

const initialValuesLogin = {
  loginName: "",
  password: "",
};

const AuthForm = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const registerHandler = async (values, onSubmitProps) => {
    try {
      const res = await register(values).unwrap();
      onSubmitProps.resetForm();
      if (res) {
        dispatch(
          setLogin({
            user: res,
          })
        );
        navigate("/home");
      }
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  };

  const loginHandler = async (values, onSubmitProps) => {
    try {
      const res = await login(values).unwrap();
      onSubmitProps.resetForm();
      if (res) {
        dispatch(
          setLogin({
            user: res,
          })
        );
        navigate("/home");
      }
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await loginHandler(values, onSubmitProps);
    if (isRegister) await registerHandler(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(2, minxmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: "span 2" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.fullName}
                  name="fullName"
                  error={Boolean(touched.fullName) && Boolean(errors.fullName)}
                  helperText={touched.fullName && errors.fullName}
                />
                <TextField
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
                <TextField
                  label="E-mail"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </>
            )}

            {isLogin && (
              <TextField
                label="Username/E-mail"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.loginName}
                name="loginName"
                error={Boolean(touched.loginName) && Boolean(errors.loginName)}
                helperText={touched.loginName && errors.loginName}
              />
            )}

            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            {isRegister && (
              <TextField
                label="Confirm password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.passwordConfirmation}
                name="passwordConfirmation"
                error={
                  Boolean(touched.passwordConfirmation) &&
                  Boolean(errors.passwordConfirmation)
                }
                helperText={
                  touched.passwordConfirmation && errors.passwordConfirmation
                }
              />
            )}
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "Login" : "Register"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Click here to sign up"
                : "Already have an account? Click here to login"}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthForm;
