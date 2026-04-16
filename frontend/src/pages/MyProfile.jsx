import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const MyProfile = () => {
  const { user, fetchMe } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const updateProfile = async (e) => {
    e.preventDefault();
    await axiosInstance.patch("/profile", profileForm);
    await fetchMe();
    alert("Profile updated");
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    await axiosInstance.patch("/profile/password", passwordForm);
    setPasswordForm({ currentPassword: "", newPassword: "" });
    alert("Password updated");
  };

  return (
    <div className="profile-grid">
      <form className="card" onSubmit={updateProfile}>
        <h2>My Profile</h2>
        <label>Name</label>
        <input
          value={profileForm.name}
          onChange={(e) => setProfileForm({ name: e.target.value })}
        />
        <label>Email</label>
        <input value={user?.email || ""} disabled />
        <label>Role</label>
        <input value={user?.role || ""} disabled />
        <button type="submit">Update Profile</button>
      </form>

      <form className="card" onSubmit={updatePassword}>
        <h2>Change Password</h2>
        <label>Current Password</label>
        <input
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
          }
        />
        <label>New Password</label>
        <input
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
          }
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default MyProfile;