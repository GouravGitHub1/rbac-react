import React, { useEffect, useMemo, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/EditOutlined";
import DoneIcon from "@mui/icons-material/DoneAllTwoTone";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RevertIcon from "@mui/icons-material/NotInterestedOutlined";
import { instanceAxios } from "./axiosInstance";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tooltip,
  FormControlLabel,
  Switch,
  Box,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "./hooks/useAuthContextProvider";
import { useRole } from "./hooks/useRoleContextProvider";
import { useReadOnly } from "./hooks/useReadOnlyContextProvider";
import { getLocalStorage } from "./hooks/localStorage";

const CustomTableCell = ({
  row,
  name,
  onChange,
  roleObj,
  isUpdatePermission,
  isGrantRolePermission,
  isReadOnly,
}) => {
  const { isEditMode } = row;

  const tableRow = useMemo(() => {
    if (name !== "role") {
      return isEditMode && isUpdatePermission && !isReadOnly ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className="input"
        />
      ) : (
        row[name]
      );
    } else {
      return isEditMode && isGrantRolePermission && !isReadOnly ? (
        <FormControl sx={{ width: "80%", margin: "16px" }}>
          <InputLabel id="Role">Role</InputLabel>
          <Select
            value={row[name].roleId}
            labelId="Role"
            onChange={(e) => onChange(e, row)}
            label="Role"
            name={name}
          >
            {Object.keys(roleObj).map((i) => (
              <MenuItem value={i} name={name}>
                {roleObj[i].roleName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        row[name]["roleName"]
      );
    }
  }, [
    isEditMode,
    name,
    onChange,
    roleObj,
    row,
    isGrantRolePermission,
    isReadOnly,
    isUpdatePermission,
  ]);
  return <TableCell className="tableCell">{tableRow}</TableCell>;
};

export function ManageUser() {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [roleObj, setRoleObj] = React.useState({});
  const { roleId, setRoleId } = useRole();
  const storedValue = getLocalStorage();
  const { permission } = useAuth();
  const [loading, setLoading] = useState(false);
  const { isReadOnly, setReadOnly, readOnly, isAdmin } = useReadOnly();
  const isDeletePermission = useMemo(
    () => permission?.[roleId]?.permissionSet?.has(4),
    [permission, roleId]
  );
  const isUpdatePermission = useMemo(
    () => permission?.[roleId]?.permissionSet?.has(3),
    [permission, roleId]
  );
  const isGrantRolePermission = useMemo(
    () => permission?.[roleId]?.permissionSet?.has(5),
    [permission, roleId]
  );

  const onSwitchChange = async (e) => {
    try {
      setReadOnly(e.target.checked);
      console.log("eswitch", e.target.checked);
      const res = await instanceAxios.get("config/toggleReadOnlyFlag");
      console.log(res);
    } catch (error) {
      setReadOnly(!e.target.checked);
      console.log("toggle read only flag failed", error);
      alert("toggle read only flag failed");
    }
  };
  useEffect(() => {
    const getRoles = async () => {
      const res = await instanceAxios.get("/role/allRoles");

      const data = res.data.reduce((acc, i) => {
        acc[i.roleId] = {
          roleName: i.roleName,
          description: i.description,
        };
        return acc;
      }, {});
      setRoleObj(data);
    };
    getRoles();
  }, []);

  React.useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const res = await instanceAxios.get("/user/");
      const col = Object.keys(res.data[0]).filter(
        (i) => i !== "userId" && i !== "password" && i !== "username"
      );
      const mRows = res.data.map((i) => ({ ...i, isEditMode: false }));
      setColumns(col);
      setRows(mRows);
      setLoading(false);
    };
    getUsers();
  }, []);
  const [previous, setPrevious] = React.useState({});

  const onToggleEditMode = (id) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.userId === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onSave = async (id) => {
    const row = rows.find((i) => i.userId === id);
    try {
      const input = {
        userId: id,
        userName: row.username,
        firstName: row.firstName,
        lastName: row.lastName,
        dob: row.birthDate,
        roleId: row.role.roleId,
        password: row.password,
      };
      const res = await instanceAxios.put("/user/updateUser", input);

      if (id === storedValue.userId) {
        console.log("res.data.role.roleId", res.data.role.roleId);
        setRoleId(res.data.role.roleId);
      }
      onToggleEditMode(id);
    } catch (e) {
      console.log("e", e);
      alert(e.response.data);
    }
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    console.log("e", e);
    const { userId } = row;
    const newRows = rows.map((row) => {
      if (row.userId === userId && name !== "role") {
        return { ...row, [name]: value };
      } else if (row.userId === userId && name === "role") {
        console.log("value", value);
        return {
          ...row,
          role: {
            roleId: value,
            roleName: roleObj[value]["roleName"],
            description: roleObj[value]["description"],
          },
        };
      }
      return row;
    });
    setRows(newRows);
  };

  const onRevert = (id) => {
    const newRows = rows.map((row) => {
      if (row.userId === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    setRows(newRows);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  const onDelete = async (id) => {
    try {
      await instanceAxios.delete(`/user/delete/${id}`);
      const newRows = rows.filter((row) => row.userId !== id);
      setRows(newRows);
      setPrevious((state) => {
        delete state[id];
        return state;
      });
    } catch (e) {
      console.log("e", e);
      alert(e.data);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "90Vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper className="root">
      {isAdmin && (
        <FormControlLabel
          control={<Switch onChange={onSwitchChange} checked={readOnly} />}
          label="ReadOnly"
        />
      )}
      <Table className="table" aria-label="caption table">
        <TableHead>
          <TableRow className="tableHead">
            {(isUpdatePermission ||
              isGrantRolePermission ||
              isDeletePermission) &&
              !isReadOnly && (
                <TableCell className="tableHeadCell">Actions</TableCell>
              )}
            {columns.map((i) => (
              <TableCell key={i} className="tableHeadCell">
                {i.toUpperCase()}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.userId} className="tableRow">
              {(isUpdatePermission ||
                isGrantRolePermission ||
                isDeletePermission) &&
                !isReadOnly && (
                  <TableCell>
                    {(isUpdatePermission || isGrantRolePermission) &&
                    !isReadOnly ? (
                      row.isEditMode ? (
                        <>
                          <Tooltip title="Save">
                            <IconButton
                              aria-label="done"
                              sx="iconButton"
                              onClick={() => onSave(row.userId)}
                            >
                              <DoneIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton
                              aria-label="revert"
                              className="iconButton"
                              onClick={() => onRevert(row.userId)}
                            >
                              <RevertIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title="Edit">
                          <IconButton
                            aria-label="edit"
                            className="iconButton"
                            onClick={() => onToggleEditMode(row.userId)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )
                    ) : (
                      <></>
                    )}
                    {isDeletePermission && !isReadOnly && (
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="Delete"
                          className="iconButton"
                          onClick={() => onDelete(row.userId)}
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              {columns.map((i) => (
                <CustomTableCell
                  key={`${row.userId}${i}`}
                  {...{
                    row,
                    name: i,
                    onChange,
                    roleObj: i === "role" ? roleObj : null,
                    isUpdatePermission,
                    isGrantRolePermission,
                    isReadOnly,
                  }}
                />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
