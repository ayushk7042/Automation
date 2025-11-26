import React, { useEffect, useState } from "react";
import { getUsers, deactivateUser, activateUser, deleteUser } from "../../api/admin";
import { Link } from "react-router-dom";
import "./Users.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);

 const loadUsers = async () => {
  try {
    const data = await getUsers();  // <-- direct data hi return hota hai
    setUsers(data || []);           // safe fallback
  } catch (err) {
    console.error(err);
    alert("Failed to load users");
  }
};


  useEffect(() => { loadUsers(); }, []);

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this user?")) return;
    await deactivateUser(id);
    loadUsers();
  };

  const handleActivate = async (id) => {
    if (!window.confirm("Activate this user?")) return;
    await activateUser(id);
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    await deleteUser(id);
    loadUsers();
  };

  return (
    <div className="users-page">
      <div className="header">
        <h2>Users</h2>
        <Link to="/users/create" className="create-user-btn">+ Create User</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <span className={u.status === "Active" ? "tag green" : "tag red"}>
                  {u.status}
                </span>
              </td>
              <td>
                {u.status === "Active" ? (
                  <button className="btn warn" onClick={() => handleDeactivate(u._id)}>Deactivate</button>
                ) : (
                  <button className="btn success" onClick={() => handleActivate(u._id)}>Activate</button>
                )}

                <button className="btn danger" onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default UsersList;
