import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import UserForm from "./pages/UserForm";
import MyProfile from "./pages/MyProfile";
import Unauthorized from "./pages/Unauthorized";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<MyProfile />} />

            <Route
              path="users"
              element={
                <RoleGuard roles={["admin", "manager"]}>
                  <Users />
                </RoleGuard>
              }
            />
            <Route
              path="users/new"
              element={
                <RoleGuard roles={["admin"]}>
                  <UserForm />
                </RoleGuard>
              }
            />
            <Route
              path="users/edit/:id"
              element={
                <RoleGuard roles={["admin", "manager"]}>
                  <UserForm />
                </RoleGuard>
              }
            />
            <Route
              path="users/:id"
              element={
                <ProtectedRoute>
                  <UserDetail />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;