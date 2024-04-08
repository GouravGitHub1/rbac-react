import React, { useEffect, useState } from "react";
import { instanceAxios } from "./axiosInstance";
import { Box, CircularProgress } from "@mui/material";

function UserRolesGuide() {
  const [roles, setRoles] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getPermission() {
      setLoading(true)
      const res = await instanceAxios.get("/role/allRolesWithPermission");
      console.log("res", res);
      setRoles(res.data);
      setLoading(false)
    }
    getPermission();
  }, []);

  
  if (loading ) {
    return <Box sx={{ display: "flex", width: "100%", height: "90Vh", justifyContent:'center', alignItems:'center' }}>
      <CircularProgress />
    </Box>;
  }
  return (
    <div className="container">
      <div className="role-guide">
        <h1>User Roles Guide</h1>
        <p>Explore different user roles and their permissions</p>
      </div>

      {roles?.map((i) => {
        return (
          <div className="role" key={i.role.roleName}>
            <div className="role-title">{i.role.roleName}</div>
            <ul className="permission-list">
              {i?.permissions?.map((item) => (
                <li className="permission-item" key={`${i.role.roleName}${item.permissionName}`}>
                  <span className="permission-name">
                    {item.permissionName}:
                  </span>
                  {item.description}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default UserRolesGuide;
