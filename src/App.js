import { Routes, Route } from "react-router-dom";
import "./App.css";
import {LoginForm} from "./Login";
import { ProtectedLayout } from "./ProtectedLayout";
import Dashboard from './Dashboard'
import { RoleProvider } from "./hooks/useRoleContextProvider";
import { ReadOnlyProvider } from "./hooks/useReadOnlyContextProvider";

export default function App() {
  return (
    <>
    <RoleProvider>
      <ReadOnlyProvider>
    <Routes>
      <Route path="/" element={<ProtectedLayout/>} >
      <Route path="dashboard" element={<Dashboard/>}/>
        </Route>
      <Route path="/login" element={<LoginForm />} />
    </Routes>
    </ReadOnlyProvider>
    </RoleProvider>
    </>
  );
}