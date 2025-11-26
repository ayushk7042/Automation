// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import { AppProvider } from "./context/AppContext";
// import ProtectedRoute from "./components/ProtectedRoute";

// import Login from "./pages/Auth/Login";
// import ChangePassword from "./pages/Auth/ChangePassword";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import UsersList from "./pages/Users/UsersList";
// import CreateUser from "./pages/Users/CreateUser";
// import CampaignList from "./pages/Campaigns/CampaignList";
// import CampaignCreate from "./pages/Campaigns/CampaignCreate";
// import CampaignDetails from "./pages/Campaigns/CampaignDetails";
// import TemplateList from "./pages/Templates/TemplateList";
// import QueueList from "./pages/EmailQueue/QueueList";
// import NotificationsPage from "./pages/Notifications/NotificationsPage";
// import BrandingSettings from "./pages/Branding/BrandingSettings";

// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";
// import "./App.css";

// function AppLayout({ children }) {
//   return (
//     <div className="app-root">
//       <Navbar />
//       <div className="app-body">
//         <Sidebar />
//         <main className="app-main">{children}</main>
//       </div>
//     </div>
//   );
// }

// function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/change-password" element={<ChangePassword />} />

//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <AppLayout><Dashboard /></AppLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <AppLayout><Dashboard /></AppLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/users"
//         element={
//           <ProtectedRoute allowedRoles={["Admin"]}>
//             <AppLayout><UsersList /></AppLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/users/create"
//         element={
//           <ProtectedRoute allowedRoles={["Admin"]}>
//             <AppLayout><CreateUser /></AppLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/campaigns"
//         element={
//           <ProtectedRoute>
//             <AppLayout><CampaignList /></AppLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/campaigns/create"
//         element={
//           <ProtectedRoute>
//             <AppLayout><CampaignCreate /></AppLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/campaigns/:id"
//         element={
//           <ProtectedRoute>
//             <AppLayout><CampaignDetails /></AppLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/templates"
//         element={
//           <ProtectedRoute>
//             <AppLayout><TemplateList /></AppLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/queue"
//         element={
//           <ProtectedRoute>
//             <AppLayout><QueueList /></AppLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/notifications"
//         element={
//           <ProtectedRoute>
//             <AppLayout><NotificationsPage /></AppLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/branding"
//         element={
//           <ProtectedRoute allowedRoles={["Admin"]}>
//             <AppLayout><BrandingSettings /></AppLayout>
//           </ProtectedRoute>
//         }
//       />

//       <Route path="*" element={<div style={{ padding: 20 }}>404 Not Found</div>} />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppProvider>
//           <AppRoutes />
//         </AppProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }


import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Auth/Login";
import ChangePassword from "./pages/Auth/ChangePassword";

import Dashboard from "./pages/Dashboard/Dashboard";
import AuditLogs from "./pages/Audit/AuditLogs";
import FinanceDashboard from "./pages/Finance/FinanceDashboard";
import UsersList from "./pages/Users/UsersList";
import CreateUser from "./pages/Users/CreateUser";

import CampaignList from "./pages/Campaigns/CampaignList";
import CampaignCreate from "./pages/Campaigns/CampaignCreate";
import CampaignEdit from "./pages/Campaigns/CampaignEdit";
import CampaignDetails from "./pages/Campaigns/CampaignDetails";
import CampaignTimeline from "./pages/Campaigns/CampaignTimeline";

import TemplateList from "./pages/Templates/TemplateList";
import TemplateCreate from "./pages/Templates/TemplateCreate";
import TemplateEdit from "./pages/Templates/TemplateEdit";

import QueueList from "./pages/EmailQueue/QueueList";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import BrandingSettings from "./pages/Branding/BrandingSettings";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import "./App.css";

// -------------------------
// Layout Wrapper
// -------------------------
function AppLayout({ children }) {
  return (
    <div className="app-root">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}

// -------------------------
// All Routes
// -------------------------
function AppRoutes() {
  return (
    <Routes>

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- Users (Admin Only) ---------------- */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AppLayout><UsersList /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/create"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AppLayout><CreateUser /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- Campaigns ---------------- */}
      <Route
        path="/campaigns"
        element={
          <ProtectedRoute>
            <AppLayout><CampaignList /></AppLayout>
          </ProtectedRoute>
        }
      />

<Route
  path="/audit-logs"
  element={
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AppLayout><AuditLogs /></AppLayout>
    </ProtectedRoute>
  }
/>


      <Route
        path="/campaigns/create"
        element={
          <ProtectedRoute>
            <AppLayout><CampaignCreate /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/campaigns/:id/edit"
        element={
          <ProtectedRoute>
            <AppLayout><CampaignEdit /></AppLayout>
          </ProtectedRoute>
        }
      />

<Route
  path="/finance"
  element={
    <ProtectedRoute allowedRoles={["Finance"]}>
      <AppLayout><FinanceDashboard /></AppLayout>
    </ProtectedRoute>
  }
/>


      <Route
        path="/campaigns/:id"
        element={
          <ProtectedRoute>
            <AppLayout><CampaignDetails /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/campaigns/:id/timeline"
        element={
          <ProtectedRoute>
            <AppLayout><CampaignTimeline /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- Templates ---------------- */}
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <AppLayout><TemplateList /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/templates/create"
        element={
          <ProtectedRoute>
            <AppLayout><TemplateCreate /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/templates/:id/edit"
        element={
          <ProtectedRoute>
            <AppLayout><TemplateEdit /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- Email Queue ---------------- */}
      <Route
        path="/queue"
        element={
          <ProtectedRoute>
            <AppLayout><QueueList /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- Notifications ---------------- */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppLayout><NotificationsPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- Branding Settings (Admin) ---------------- */}
      <Route
        path="/branding"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AppLayout><BrandingSettings /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<div style={{ padding: 20 }}>404 Not Found</div>} />
    </Routes>
  );
}

// -------------------------
// App Wrapper
// -------------------------
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
