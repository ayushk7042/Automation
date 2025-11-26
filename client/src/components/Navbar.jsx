// import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { AppContext } from "../context/AppContext";
// import NotificationBell from "./NotificationBell";
// import "./Navbar.css";

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const { branding } = useContext(AppContext);

//   return (
//     <div className="app-navbar">
//       <div className="navbar-left">
//         <div className="brand">
//           {branding && branding.logo ? (
//             <img src={`/${branding.logo}`} alt="logo" className="brand-logo" />
//           ) : (
//             <span className="brand-text">Aff Alliances</span>
//           )}
//         </div>
//       </div>

//       <div className="navbar-right">
//         <NotificationBell />
//         {user && (
//           <>
//             <span className="nav-user">Hi, {user.name}</span>
//             <button className="btn-logout" onClick={() => { logout(); window.location.href = "/login"; }}>
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;



import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";
import NotificationBell from "./NotificationBell";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { branding } = useContext(AppContext);

  return (
    <div className="navbar-premium">
      <div className="navbar-left">
        <div className="brand">
          {branding && branding.logo ? (
            <img src={`/${branding.logo}`} alt="logo" className="brand-logo"/>
          ) : (
            <span className="brand-text">Aff Alliances</span>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <NotificationBell />
        {user && (
          <>
            <span className="nav-username">Hi, {user.name}</span>
            <button 
              className="logout-btn"
              onClick={() => { logout(); window.location.href = "/login"; }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
