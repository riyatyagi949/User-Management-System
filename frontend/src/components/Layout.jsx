import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>User Management</h2>

        <nav>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "soft-link-active" : "")}
          >
            <span className="icon-badge icon-dashboard">
              <LayoutDashboard size={18} />
            </span>
            <span>Dashboard</span>
          </NavLink>

          {(user?.role === "admin" || user?.role === "manager") && (
            <NavLink
              to="/users"
              className={({ isActive }) => (isActive ? "soft-link-active" : "")}
            >
              <span className="icon-badge icon-users">
                <Users size={18} />
              </span>
              <span>Users</span>
            </NavLink>
          )}

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "soft-link-active" : "")}
          >
            <span className="icon-badge icon-profile">
              <User size={18} />
            </span>
            <span>My Profile</span>
          </NavLink>
        </nav>

        <button onClick={handleLogout} type="button">
          <span className="icon-badge icon-logout">
            <LogOut size={18} />
          </span>
          <span>Logout</span>
        </button>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <h3>Welcome, {user?.name}</h3>
            <p>
              Role: <strong>{user?.role}</strong>
            </p>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;