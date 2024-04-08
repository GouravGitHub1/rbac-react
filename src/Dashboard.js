import React, { useMemo, useEffect } from "react";
import AppTabs from "./Tabs";
import { useAuth } from "./hooks/useAuthContextProvider";
import { CreateNewUser } from "./CreateNewUser";
import { ManageUser } from "./ManageUser";
import UserRolesGuide from "./UserRolesGuide";
import { useRole } from "./hooks/useRoleContextProvider";
import { instanceAxios } from "./axiosInstance";
import { useReadOnly } from "./hooks/useReadOnlyContextProvider";
import { getLocalStorage } from "./hooks/localStorage";
const Dashboard = () => {
  const { permission } = useAuth();
  const storedValue = getLocalStorage();
  const { roleId, setRoleId } = useRole();
  const { isReadOnly } = useReadOnly();

  useEffect(() => {
    const getData = async () => {
      const res = await instanceAxios.get(`/role/${storedValue.userId}`);
      setRoleId(res.data.roleId);
    };
    getData();
  }, [setRoleId, storedValue.userId]);

  const isWritePermission = useMemo(
    () => permission?.[roleId]?.permissionSet?.has(2),
    [permission, roleId]
  );
  const isGrantPermission = useMemo(
    () => permission?.[roleId]?.permissionSet?.has(5),
    [permission, roleId]
  );
  const [value, setValue] = React.useState(isWritePermission ? 0 : 1);

  return (
    <>
      {storedValue.isAuthenticated ? (
        <AppTabs value={value} setValue={setValue} />
      ) : (
        <p>loading</p>
      )}
      {value === 0 && isWritePermission && !isReadOnly && <CreateNewUser />}
      {value === 1 && <ManageUser />}
      {value === 2 && <UserRolesGuide />}
    </>
  );
};
export default Dashboard;
