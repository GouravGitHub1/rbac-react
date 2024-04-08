import { useEffect } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { instanceAxios } from "../axiosInstance";
import { useRole } from "./useRoleContextProvider";
import { useAuth } from "./useAuthContextProvider";
import { Box, CircularProgress } from "@mui/material";

const ReadOnlyContext = createContext();

export const ReadOnlyProvider = ({ children }) => {
  const [readOnly, setReadOnly] = useState(false);
  const [allPermission, setAllPermissions] = useState(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const { roleId } = useRole();
  const { permission } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getReadOnlyStatus = async () => {
      setLoading(true);
      const res = await instanceAxios.get("/config/fetchReadOnlyFlag");
      setReadOnly(res.data);
      setLoading(false);
    };
    getReadOnlyStatus();
  }, []);

  useEffect(() => {
    const getPermissions = async () => {
      setLoading(true);
      const res = await instanceAxios.get("/role/permissions");
      const d = res.data.map((i) => i.permissionId);
      setAllPermissions(new Set(d));
      setLoading(false);
    };
    getPermissions();
  }, []);

  const isSetEqual = useMemo(() => {
    const userPermissionSet = permission?.[roleId]?.permissionSet;
    const isSetEqual =
      userPermissionSet?.size === allPermission?.size &&
      [...userPermissionSet].every((x) => allPermission.has(x));
    return isSetEqual;
  }, [permission, allPermission, roleId]);

  useEffect(() => {
    console.log("isSetEqual", isSetEqual);
    setIsAdmin(isSetEqual);
  }, [isSetEqual]);

  const isReadOnly = useMemo(() => {
    if (isSetEqual) {
      return false;
    } else {
      return readOnly;
    }
  }, [readOnly, isSetEqual]);
  console.log("isAdmin", isAdmin);
  const value = useMemo(
    () => ({
      isReadOnly,
      setReadOnly,
      readOnly,
      isAdmin,
    }),
    [isReadOnly, setReadOnly, readOnly, isAdmin]
  );

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
    <ReadOnlyContext.Provider value={value}>
      {children}
    </ReadOnlyContext.Provider>
  );
};

export const useReadOnly = () => {
  return useContext(ReadOnlyContext);
};
