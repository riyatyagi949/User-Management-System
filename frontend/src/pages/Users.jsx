import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const Users = () => {
  const { user } = useAuth();
  const [usersData, setUsersData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const res = await axiosInstance.get(`/users?${params}`);
      setUsersData(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.page, filters.role, filters.status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await axiosInstance.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="card">
      <div className="page-header">
        <h2>Users</h2>
        {user?.role === "admin" && <Link className="btn" to="/users/new">Create User</Link>}
      </div>

      <form className="filters" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />

        <select
          value={filters.role}
          onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value, page: 1 }))}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button type="submit">Apply</button>
      </form>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.status}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td className="actions">
                  <Link to={`/users/${item._id}`}>View</Link>
                  {(user?.role === "admin" ||
                    (user?.role === "manager" && item.role !== "admin")) && (
                    <Link to={`/users/edit/${item._id}`}>Edit</Link>
                  )}
                  {user?.role === "admin" && item.role !== "admin" && (
                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button
          disabled={pagination.page <= 1}
          onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
        >
          Prev
        </button>
        <span>
          Page {pagination.page || 1} of {pagination.pages || 1}
        </span>
        <button
          disabled={pagination.page >= pagination.pages}
          onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;