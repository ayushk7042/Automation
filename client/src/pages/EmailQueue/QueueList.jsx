import React, { useEffect, useState } from "react";
import { listQueue, enqueueEmail } from "../../api/queue";
import { showToast } from "../../components/toast";
import "./Queue.css";

const QueueList = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");

  const load = async () => {
    try {
      const res = await listQueue();
      setItems(res.data);
    } catch (e) {
      console.error(e);
      showToast("Failed to load queue", "error");
    }
  };

  useEffect(() => { load(); }, []);

  const handleRetry = async (item) => {
    if (!window.confirm("Re-enqueue this email?")) return;
    try {
      await enqueueEmail({ to: item.to, subject: item.subject, html: item.html, campaignId: item.campaignId, scheduledAt: new Date() });
      showToast("Re-enqueued");
      load();
    } catch (e) {
      console.error(e);
      showToast("Retry failed", "error");
    }
  };

  return (
    <div className="queue-page">
      <div className="header-row">
        <h2>Email Queue</h2>
      </div>

      <div className="queue-filters">
        <input placeholder="Search by recipient or subject" value={filter} onChange={e => setFilter(e.target.value)} />
        <button className="btn" onClick={load}>Refresh</button>
      </div>

      <div className="queue-list">
        {items.filter(i => (i.to + " " + i.subject).toLowerCase().includes(filter.toLowerCase())).map(i => (
          <div key={i._id} className="queue-item">
            <div className="queue-left">
              <div className="queue-to">{i.to}</div>
              <div className="queue-sub">{i.subject}</div>
              <div className="queue-meta">Status: <strong>{i.status}</strong> · Attempts: {i.attempts}</div>
              {i.lastError && <div className="queue-error">Error: {i.lastError}</div>}
            </div>

            <div className="queue-actions">
              <button className="btn" onClick={() => {
                const w = window.open();
                w.document.body.innerHTML = i.html;
              }}>Preview</button>

              {i.status === "failed" && <button className="btn-primary" onClick={() => handleRetry(i)}>Retry</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueList;
