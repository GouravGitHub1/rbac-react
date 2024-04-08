import { Navigate, useOutlet } from "react-router-dom";
import { getLocalStorage } from "./hooks/localStorage";


export const ProtectedLayout = () => {
  const storedValue = getLocalStorage()

  const outlet = useOutlet(); 
  if (!storedValue||!storedValue?.isAuthenticated) {
    return <Navigate to="/login" />;
  }


  return (
    <div>
      {outlet?outlet:<Navigate to ="dashboard"/>}
    </div>
  );
};
