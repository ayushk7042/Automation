import React, { useState } from "react";
import { createUser } from "../../api/admin";
import "./Users.css";

const CreateUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "AM",
    tempPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUser(form);
      alert("User created & email sent!");
      window.location.href = "/users";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="users-page">
      <h2>Create User</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} required />

        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="AM">AM</option>
          <option value="Finance">Finance</option>
        </select>

        <label>Temp Password</label>
        <input
          name="tempPassword"
          type="text"
          value={form.tempPassword}
          onChange={handleChange}
          required
        />

        <button className="btn-primary" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
