import { createContext, useContext, useMemo,useState } from "react";


const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roleId, setRoleId] = useState('')
  const value = useMemo(()=>({
    roleId,
    setRoleId
}),[roleId,setRoleId])
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  return useContext(RoleContext);
};
