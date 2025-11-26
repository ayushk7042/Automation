import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="app-sidebar">
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>

          <li><Link to="/campaigns">Campaigns</Link></li>
          <li><Link to="/templates">Templates</Link></li>
          <li><Link to="/queue">Email Queue</Link></li>

          {user && user.role === "Admin" && (
            <>
              <li><Link to="/users">Users</Link></li>
              <li><Link to="/audit-logs">Audit Logs</Link></li>
              <li><Link to="/branding">Branding</Link></li>
            </>
          )}

          {user && user.role === "Finance" && <li><Link to="/finance">Finance</Link></li>}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;




