import React, { createContext, useState, useEffect, useContext } from "react";
import * as brandingAPI from "../api/branding";
import * as notificationAPI from "../api/notification";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";



export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [branding, setBranding] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // fetch branding once
    (async () => {
      try {
        const res = await brandingAPI.getBranding();
        setBranding(res.data);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadNotifications = async () => {
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      try {
        const res = await notificationAPI.fetchNotifications();
        if (!mounted) return;
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.read).length);
      } catch (e) {
        console.error("fetch notifications failed", e);
      }
    };
    loadNotifications();

    // optionally poll every 30s
    const iv = setInterval(loadNotifications, 30000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [user]);


// ⏳ REAL-TIME NOTIFICATION SOCKET LISTENER
useEffect(() => {
  if (!user) return;

  const socket = io(import.meta.env.VITE_BASE_URL, {
    transports: ["websocket"],
  });

  socket.emit("join", user._id);

  socket.on("notification.new", (payload) => {
    console.log("🔔 Real-Time Notification:", payload);
    setNotifications((prev) => [payload, ...prev]);
    setUnreadCount((c) => c + 1);
  });

  return () => socket.disconnect();
}, [user]);




  const markReadLocal = (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  return (
    <AppContext.Provider value={{ branding, notifications, unreadCount, setNotifications, markReadLocal, setBranding }}>
      {children}
    </AppContext.Provider>
  );
};
