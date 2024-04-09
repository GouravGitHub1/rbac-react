import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { Button, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { instanceAxios } from "./axiosInstance";
import { useRole } from "./hooks/useRoleContextProvider";
import { setLocalStorage } from "./hooks/localStorage";

export const LoginForm = () => {
  const [isLoginSuccessful, setSuccessful] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { setRoleId } = useRole();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const apiInput = {
      userName: data.get("UserId"),
      password: data.get("password"),
    };
    try {
      setLoading(true);
      const res = await instanceAxios.post("/user/login", apiInput);
      console.log("after login api call res", res);

      await setLocalStorage({
        isAuthenticated: true,
        userId: res.data.userId,
      });
      await setRoleId(res?.data.role.roleId);
      setLoading(false);
      setSuccessful(true);
    } catch (e) {
      alert(e.response.data);
      setLoading(false);
      setSuccessful(false);
      console.log(e);
    }
  };

  React.useEffect(() => {
    if (isLoginSuccessful) {
      return navigate("/");
    }
  }, [isLoginSuccessful, navigate]);

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography variant="h5">Log In</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="UserId"
          label="UserId"
          name="UserId"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
        />
        <Button type="submit" fullWidth variant="contained">
          Login In
        </Button>
      </Box>
      {loading && (
        <Box sx={{ display: "flex", marginTop: "16px" }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};
