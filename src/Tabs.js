import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuth } from "./hooks/useAuthContextProvider";
import { useRole } from "./hooks/useRoleContextProvider";
import { useReadOnly } from "./hooks/useReadOnlyContextProvider";
import { setLocalStorage } from "./hooks/localStorage";
import { useNavigate } from "react-router-dom";

export default function AppTabs({ value, setValue }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isReadOnly } = useReadOnly();
  const open = React.useMemo(() => Boolean(anchorEl), [anchorEl]);
  const { permission } = useAuth();
  const { roleId } = useRole();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const isGrantPermission = React.useMemo(
    () => permission?.[roleId]?.permissionSet?.has(5),
    [permission, roleId]
  );

  const onHandleClick = async () => {
    await setLocalStorage(null);
    navigate("/");
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <AppBar position="static" sx={{ display: "flex", flexDirection: "row" }}>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={onHandleClick}>Logout</MenuItem>
        </Menu>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          sx={{ width: "100%" }}
        >
          {permission?.[roleId]?.permissionSet?.has(2) && !isReadOnly && (
            <Tab label="Create user" value={0} />
          )}
          <Tab label="Manage User" value={1} />
          {<Tab label="Help" value={2} />}
        </Tabs>
      </AppBar>
    </Box>
  );
}
