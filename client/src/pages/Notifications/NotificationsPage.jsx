import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import * as notificationAPI from "../../api/notification";
import { showToast } from "../../components/toast";
import "./Notifications.css";

const NotificationsPage = () => {
  const { notifications, setNotifications } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await notificationAPI.fetchNotifications();
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
      showToast("Failed to load", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, []);

  const markRead = async (id) => {
    try {
      await notificationAPI.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      showToast("Marked read");
    } catch (e) {
      console.error(e);
      showToast("Failed", "error");
    }
  };

  return (
    <div className="notifications-page">
      <div className="header-row">
        <h2>Notifications</h2>
        <div>
          <button className="btn" onClick={reload}>{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 && <div>No notifications</div>}
        {notifications.map(n => (
          <div key={n._id} className={`notif-row ${n.read ? "read" : "unread"}`}>
            <div className="notif-left">
              <div className="notif-title">{n.title}</div>
              <div className="notif-body">{n.body}</div>
            </div>
            <div className="notif-right">
              {!n.read && <button className="btn-primary" onClick={() => markRead(n._id)}>Mark read</button>}
              <div className="notif-time">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
