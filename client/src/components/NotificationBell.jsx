// import React, { useContext } from "react";
// import { AppContext } from "../context/AppContext";
// import { AppContext as AC } from "../context/AppContext";
// import * as notificationAPI from "../api/notification";
// import "./NotificationBell.css";

// const NotificationBell = () => {
//   const { notifications, unreadCount, setNotifications, markReadLocal } = useContext(AppContext);

//   const markRead = async (id) => {
//     try {
//       await notificationAPI.markNotificationRead(id);
//       markReadLocal(id);
//     } catch (e) {
//       console.error("mark read failed", e);
//     }
//   };

//   return (
//     <div className="notif-bell">
//       <div className="bell-icon">🔔</div>
//       {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}

//       <div className="notif-dropdown">
//         {notifications.length === 0 && <div className="notif-empty">No notifications</div>}
//         {notifications.slice(0, 10).map((n) => (
//           <div key={n._id} className={`notif-item ${n.read ? "" : "unread"}`}>
//             <div className="notif-title">{n.title}</div>
//             <div className="notif-body">{n.body}</div>
//             <div className="notif-actions">
//               {!n.read && <button onClick={() => markRead(n._id)}>Mark read</button>}
//             </div>
//           </div>
//         ))}
//         <div style={{ padding: 8, textAlign: "center" }}>
//           <a href="/notifications">View all</a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationBell;



import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import * as notificationAPI from "../api/notification";
import "./NotificationBell.css";

const NotificationBell = () => {
  const { notifications, unreadCount, markReadLocal } = useContext(AppContext);

  const markRead = async (id) => {
    try {
      await notificationAPI.markNotificationRead(id);
      markReadLocal(id);
    } catch (e) {
      console.error("mark read failed", e);
    }
  };

  return (
    <div className="notif-wrapper">
      <div className="notif-bell">
        🔔
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </div>

      <div className="notif-dropdown">
        {notifications.length === 0 ? (
          <div className="notif-empty">No notifications</div>
        ) : (
          notifications.slice(0, 10).map((n) => (
            <div key={n._id} className={`notif-item ${n.read ? "" : "unread"}`}>
              <div className="notif-title">{n.title}</div>
              <div className="notif-body">{n.body}</div>

              {!n.read && (
                <button className="notif-btn" onClick={() => markRead(n._id)}>
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}

        <div className="notif-footer">
          <a href="/notifications">View All</a>
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
