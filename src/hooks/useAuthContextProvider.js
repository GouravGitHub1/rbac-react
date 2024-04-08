import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { instanceAxios } from "../axiosInstance";
import { Box, CircularProgress } from "@mui/material";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(null);
  useEffect(() => {
    async function getPermission() {
      setLoading(true);
      const res = await instanceAxios.get("/role/allRolesWithPermission");

      const data = res.data.reduce((acc, item) => {
        const permissionIdArray = item.permissions?.map((i) => i.permissionId);
        acc[item?.role?.roleId] = {
          roleName: item.role.roleName,
          permissionSet: new Set(permissionIdArray),
        }
        return acc;
      }, {});

      setPermission(data);
      setLoading(false);
    }
    getPermission();
  }, []);
  
  const value = useMemo(
    () => ({
      permission,
    }),
    [permission]
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
