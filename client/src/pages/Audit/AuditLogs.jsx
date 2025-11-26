import React, { useEffect, useState } from "react";
import { getAllAuditLogs } from "../../api/audit";
import "./AuditLogs.css";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  const loadLogs = async () => {
    try {
      const res = await getAllAuditLogs();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load logs");
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((l) =>
    JSON.stringify(l).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="audit-page">
      <h2>Audit Logs</h2>

      <input
        className="search-box"
        placeholder="Search by action, actor, target..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="audit-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Actor</th>
            <th>Target</th>
            <th>Changes</th>
            <th>Meta</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6">No logs found.</td>
            </tr>
          )}

          {filtered.map((log) => (
            <tr key={log._id}>
              <td className="action">{log.action}</td>
              <td>
                {log.actor
                  ? `${log.actor.name} (${log.actor.email})`
                  : "System"}
              </td>
              <td>
                {log.targetType || "-"}  
                {log.targetId ? ` (${log.targetId})` : ""}
              </td>

              <td>
                <pre>{JSON.stringify(log.diff, null, 2)}</pre>
              </td>

              <td>
                <pre>{JSON.stringify(log.meta, null, 2)}</pre>
              </td>

              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
