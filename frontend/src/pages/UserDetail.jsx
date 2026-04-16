import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const UserDetail = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/users/${id}`);
      setUserData(res.data.data);
    };
    fetchUser();
  }, [id]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>User Detail</h2>
      <div className="detail-grid">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Role:</strong> {userData.role}</p>
        <p><strong>Status:</strong> {userData.status}</p>
        <p><strong>Created At:</strong> {new Date(userData.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(userData.updatedAt).toLocaleString()}</p>
        <p><strong>Created By:</strong> {userData.createdBy || "N/A"}</p>
        <p><strong>Updated By:</strong> {userData.updatedBy || "N/A"}</p>
      </div>
    </div>
  );
};

export default UserDetail;