import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    if (isEdit) {
      axiosInstance.get(`/users/${id}`).then((res) => {
        const data = res.data.data;
        setForm({
          name: data.name,
          email: data.email,
          password: "",
          role: data.role,
          status: data.status,
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      await axiosInstance.patch(`/users/${id}`, form);
    } else {
      await axiosInstance.post("/users", form);
    }

    navigate("/users");
  };

  return (
    <div className="card">
      <h2>{isEdit ? "Edit User" : "Create User"}</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        {!isEdit && (
          <>
            <label>Password</label>
            <input
              name="password"
              type="text"
              value={form.password}
              onChange={handleChange}
              placeholder="Default: User@123"
            />
          </>
        )}

        <label>Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          disabled={user?.role !== "admin"}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>

        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button type="submit">{isEdit ? "Update User" : "Create User"}</button>
      </form>
    </div>
  );
};

export default UserForm;