import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const ChangePassword = () => {
  const { changePassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await changePassword(oldPassword, newPassword);
      alert("Password changed successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="change-container">
      <form className="change-box" onSubmit={submit}>
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          onChange={(e) => setOld(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setNew(e.target.value)}
        />

        <button>Save</button>
      </form>
    </div>
  );
};

export default ChangePassword;
