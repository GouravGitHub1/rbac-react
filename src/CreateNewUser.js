import {
  TextField,
  MenuItem,
  Select,
  Box,
  Button,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { useCallback, useEffect, useState, useMemo } from "react";
import { instanceAxios } from "./axiosInstance";
import { useRole } from "./hooks/useRoleContextProvider";
import { useAuth } from "./hooks/useAuthContextProvider";

export const CreateNewUser = () => {
  const [roleList, setRoleList] = useState([]);
  const [role, setRole] = useState();
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    color: "",
  });

  const [formInput, setFormInput] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    roleId: 3,
    password: "",
    userName: "",
  });
  const { roleId } = useRole();
  const { permission } = useAuth();
  const isGrantRolePermission = useMemo(
    () => permission?.[roleId]?.permissionSet?.has(5),
    [permission, roleId]
  );
  useEffect(() => {
    const getRoles = async () => {
      const res = await instanceAxios.get("/role/allRoles");

      const data = res.data.map((i) => ({
        roleName: i.roleName,
        roleId: i.roleId,
      }));
      setRoleList(data);
    };
    if (isGrantRolePermission) getRoles();
  }, [isGrantRolePermission]);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleUserNameChange = (event) => {
    setFormInput((prev) => ({ ...prev, userName: event.target.value }));
  };
  const handlePasswordChange = (event) => {
    setFormInput((prev) => ({ ...prev, password: event.target.value }));
  };
  const handleFirstChange = (event) => {
    if (!event.target.value) {
      setFormInput((prev) => ({ ...prev, firstName: event.target.value }));
      return;
    }
    const re = /^[A-Za-z]+$/;
    if (re.test(event.target.value))
      setFormInput((prev) => ({ ...prev, firstName: event.target.value }));
    else alert("only alphabet are allowed");
  };
  const handleLastChange = (event) => {
    if (!event.target.value) {
      setFormInput((prev) => ({ ...prev, lastName: event.target.value }));
      return;
    }
    const re = /^[A-Za-z ]+$/;
    const validate = re.test(event.target.value);
    if (validate)
      setFormInput((prev) => ({ ...prev, lastName: event.target.value }));
    else alert("only alphabet are allowed");
  };
  const handleDobChange = (event) => {
    setFormInput((prev) => ({ ...prev, dob: event.target.value }));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBar({ open: false, message: "", color: "" });
  };
  const handleClick = useCallback(async () => {
    if (
      !formInput.dob ||
      !formInput.firstName ||
      !formInput.lastName ||
      !formInput.userName ||
      !formInput.password ||
      !formInput.roleId
    ) {
      alert("All Fields are Required");
      return;
    }
    try {
      const res = await instanceAxios.post("/user/createUser", formInput);
      console.log("res", res);
      setSnackBar({
        open: true,
        message: "User is Successfully Created",
        color: "success",
      });
      setFormInput({
        firstName: "",
        lastName: "",
        dob: "",
        roleId: 3,
        password: "",
        userName: "",
      });
      setRole("");
    } catch (e) {
      if (typeof e.response.data === "string")
        setSnackBar({ open: true, message: e.response.data, color: "error" });
      else
        setSnackBar({
          open: true,
          message: "an error occured please check the input",
          color: "error",
        });
    }
  }, [formInput]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "90vh",
      }}
    >
      <TextField
        required
        name="User Name"
        label="User Name"
        InputLabelProps={{ required: true }}
        sx={{ width: "30%", margin: "8px" }}
        onChange={handleUserNameChange}
        value={formInput.userName}
      />
      <TextField
        required
        name="Password"
        label="Password"
        type="password"
        InputLabelProps={{ required: true }}
        sx={{ width: "30%", margin: "8px" }}
        onChange={handlePasswordChange}
        value={formInput.password}
      />
      <TextField
        required
        name="FirstName"
        label="FirstName"
        InputLabelProps={{ required: true }}
        sx={{ width: "30%", margin: "8px" }}
        onChange={handleFirstChange}
        value={formInput.firstName}
      />
      <TextField
        required
        name="LastName"
        label="LastName"
        InputLabelProps={{ required: true }}
        sx={{ width: "30%", margin: "8px" }}
        onChange={handleLastChange}
        value={formInput.lastName}
      />
      <TextField
        required
        name="DOB"
        InputLabelProps={{ required: true }}
        type="date"
        sx={{ width: "30%", margin: "8px" }}
        onChange={handleDobChange}
        value={formInput.dob}
      />
      {isGrantRolePermission ? (
        <>
          <FormControl sx={{ width: "30%", margin: "8px" }}>
            <InputLabel id="Role">Role</InputLabel>
            <Select
              value={role}
              labelId="Role"
              onChange={handleRoleChange}
              label="Role"
            >
              {roleList.map((i) => (
                <MenuItem value={i.roleId} key={i.roleId}>
                  {i.roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      ) : (
        <TextField
          name="Role"
          label="Role"
          sx={{ width: "30%", margin: "16px" }}
          InputLabelProps={{ required: true }}
          value="Worker"
          readOnly
        />
      )}
      <Button
        sx={{ width: "30%", margin: "16px" }}
        variant="contained"
        onClick={handleClick}
      >
        Create User
      </Button>
      <Snackbar
        open={snackBar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        sx={{ width: "25%" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackBar.color}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
