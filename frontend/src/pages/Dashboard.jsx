import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>This dashboard changes behavior based on the logged-in user role.</p>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>Name</h3>
          <p>{user?.name}</p>
        </div>
        <div className="stat-box">
          <h3>Email</h3>
          <p>{user?.email}</p>
        </div>
        <div className="stat-box">
          <h3>Role</h3>
          <p>{user?.role}</p>
        </div>
        <div className="stat-box">
          <h3>Status</h3>
          <p>{user?.status}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;