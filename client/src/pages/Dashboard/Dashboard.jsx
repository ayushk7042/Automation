// import React, { useEffect, useState } from "react";
// import { fetchSummary, fetchMonthlyInvoice } from "../../api/analytics";
// import "./Dashboard.css";

// const Dashboard = () => {
//   const [summary, setSummary] = useState(null);
//   const [invoices, setInvoices] = useState([]);

//   const load = async () => {
//     try {
//       const s = await fetchSummary();
//       setSummary(s.data);

//       const inv = await fetchMonthlyInvoice();
//       setInvoices(inv.data);
//     } catch (err) {
//       alert("Failed to load dashboard");
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <div className="dashboard-page">
//       <h2>Analytics Dashboard</h2>

//       {!summary ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="cards">
//           <div className="card">
//             <h3>Total Campaigns</h3>
//             <p>{summary.total}</p>
//           </div>

//           <div className="card">
//             <h3>Pending Validation</h3>
//             <p>{summary.pendingValidation}</p>
//           </div>

//           <div className="card">
//             <h3>Invoices Raised</h3>
//             <p>{summary.invoicesRaised}</p>
//           </div>

//           <div className="card">
//             <h3>Payments Pending</h3>
//             <p>{summary.paymentsPending}</p>
//           </div>
//         </div>
//       )}

//       <h3>Monthly Invoice Chart</h3>
//       <div className="chart-box">
//         {invoices.map((m, i) => (
//           <div key={i} className="bar">
//             <div className="bar-inner" style={{ height: m.total / 50 }}></div>
//             <span>{m._id.month}/{m._id.year}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { fetchSummary, fetchMonthlyInvoice } from "../../api/analytics";
import "./Dashboard.css";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);

  const load = async () => {
    try {
      const s = await fetchSummary();
      setSummary(s.data);

      const inv = await fetchMonthlyInvoice();
      setInvoices(inv.data);
    } catch (err) {
      alert("Failed to load dashboard");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">Analytics Dashboard</h2>

      {!summary ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="cards-grid">
          <div className="dash-card">
            <h3>Total Campaigns</h3>
            <p>{summary.total}</p>
          </div>

          <div className="dash-card">
            <h3>Pending Validation</h3>
            <p>{summary.pendingValidation}</p>
          </div>

          <div className="dash-card">
            <h3>Invoices Raised</h3>
            <p>{summary.invoicesRaised}</p>
          </div>

          <div className="dash-card">
            <h3>Payments Pending</h3>
            <p>{summary.paymentsPending}</p>
          </div>
        </div>
      )}

      <h3 className="chart-title">Monthly Invoice Chart</h3>

      <div className="chart-box">
        {invoices.map((m, i) => (
          <div key={i} className="bar">
            <div
              className="bar-inner"
              style={{ height: m.total / 50 }}
            ></div>
            <span className="bar-label">
              {m._id.month}/{m._id.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
