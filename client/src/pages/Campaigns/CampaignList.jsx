
// import React, { useEffect, useState , useContext} from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { getCampaigns, deleteCampaign, exportCampaignsCSV , importCampaigns} from "../../api/campaign";
// import { listUsers } from "../../api/admin";
// import "./Campaigns.css";
// import { AuthContext } from "../../context/AuthContext";   // ⭐ 


// const CampaignList = () => {

//    const { user } = useContext(AuthContext);     // ⭐
//   const [campaigns, setCampaigns] = useState([]);
//   const [ams, setAms] = useState([]);

//   const [filters, setFilters] = useState({
//     advertiser: "",
//     amId: "",
//     month: "",
//     status: "",
//     platform: "",
//     directType: ""
//   });

//   const navigate = useNavigate();

//   // Load AM dropdown
//   useEffect(() => {

//  if (user?.role !== "Admin") return;   // ⭐

//     (async () => {
//       try {
//         const res = await listUsers({ role: "AM" });
//         setAms(res.data);
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   }, []);

//   const load = async () => {
//     try {
//       const res = await getCampaigns(filters);
//       // Latest first
//       setCampaigns(res.data.reverse());
//     } catch (e) {
//       console.error(e);
//       alert("Failed to load campaigns");
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const applyFilters = async (e) => {
//     e?.preventDefault();
//     await load();
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this campaign?")) return;
//     try {
//       await deleteCampaign(id);
//       alert("Deleted");
//       load();
//     } catch (e) {
//       console.error(e);
//       alert("Delete failed");
//     }
//   };



// //new import 
// const handleImport = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const res = await importCampaigns(formData);
//     //alert(`Imported successfully: ${res.data.count} campaigns`);

// alert(`Upload Completed. Created: ${res.data.summary?.created || 0} | Updated: ${res.data.summary?.updated || 0}`);


//     load();   // refresh list
//   } catch (error) {
//     console.error(error);
//     alert("Import failed");
//   }
// };




//   const handleExport = async () => {
//     try {
//       const res = await exportCampaignsCSV();
//       const blob = new Blob([res.data], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "campaigns.csv";
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (e) {
//       console.error(e);
//       alert("Export failed");
//     }
//   };

//   // Tag colors
//   const tagClass = (value) => {
//     const v = value?.toLowerCase();

//     if (v === "pending") return "tag yellow";
//     if (v === "received") return "tag green";
//     if (v === "notraised") return "tag orange";
//     if (v === "raised") return "tag blue";
//     if (v === "notreceived") return "tag red";

//     return "tag";
//   };

//   const overdueStyle = (date) => {
//     if (!date) return {};
//     const d = new Date(date);
//     if (d < new Date()) return { color: "red", fontWeight: "bold" };
//     return {};
//   };

//   return (
//     <div className="campaigns-page">
//       <div className="page-header">
//         <h2>Campaigns</h2>
//         {/* <div className="page-actions">
//           <Link to="/campaigns/create" className="btn-primary">+ New Campaign</Link>
//           <button className="btn" onClick={handleExport}>Export CSV</button>
//         </div> */}


// <div className="page-actions">
//   <Link to="/campaigns/create" className="btn-primary">+ New Campaign</Link>
  
//   {user?.role === "Admin" && (
//   <label className="btn">
//     Import CSV
//     <input type="file" accept=".csv,.xlsx" style={{ display: "none" }} onChange={handleImport}/>
//   </label>
// )}



//   <button className="btn" onClick={handleExport}>Export CSV</button>
// </div>




//       </div>

//       {/* ---------------- FILTERS ---------------- */}
//       <form className="filters" onSubmit={applyFilters}>
//         <input
//           placeholder="Advertiser"
//           value={filters.advertiser}
//           onChange={(e) => setFilters({ ...filters, advertiser: e.target.value })}
//         />

//         {/* Select AM */}
//         <select
//           value={filters.amId}
//           onChange={(e) => setFilters({ ...filters, amId: e.target.value })}
//         >
//           <option value="">All AMs</option>
//           {ams.map((a) => (
//             <option key={a._id} value={a._id}>
//               {a.name}
//             </option>
//           ))}
//         </select>

//         {/* Platform */}
//         <select
//           value={filters.platform}
//           onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
//         >
//           <option value="">Platform</option>
//           <option value="Web">Web</option>
//           <option value="Mobile">Mobile</option>
//           <option value="Other">Other</option>
//         </select>

//         {/* Direct / Indirect */}
//         <select
//           value={filters.directType}
//           onChange={(e) => setFilters({ ...filters, directType: e.target.value })}
//         >
//           <option value="">Direct / Indirect</option>
//           <option value="Direct">Direct</option>
//           <option value="Indirect">Indirect</option>
//         </select>

//         {/* Month */}
//         <select
//           value={filters.month}
//           onChange={(e) => setFilters({ ...filters, month: e.target.value })}
//         >
//           <option value="">All months</option>
//           {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
//             <option key={m} value={m}>{m}</option>
//           ))}
//         </select>

//         {/* Status */}
//         <select
//           value={filters.status}
//           onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//         >
//           <option value="">All statuses</option>
//           <option value="Pending">Validation Pending</option>
//           <option value="Received">Validation Received</option>
//           <option value="Rejected">Validation Rejected</option>
//           <option value="Raised">Invoice Raised</option>
//           <option value="NotRaised">Invoice Not Raised</option>
//           <option value="NotReceived">Payment Pending</option>
//           <option value="Received">Payment Received</option>
//         </select>

//         <button className="btn" type="submit">Apply</button>
//       </form>

//       {/* ---------------- TABLE ---------------- */}
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Advertiser</th>
//             <th>Campaign</th>
//             <th>AM</th>
//             <th>Platform</th>
//             <th>Direct</th>
//             <th>Status</th>
//             <th>Validation</th>
//             <th>Invoice</th>
//             <th>Payment</th>
//             <th>Overdue</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {campaigns.map((c) => (
//             <tr key={c._id}>
//               <td>{c.advertiserName}</td>

//               <td>
//                 <Link to={`/campaigns/${c._id}`} className="link">
//                   {c.campaignName}
//                 </Link>
//               </td>

//               <td>{c.amAssigned?.name || "-"}</td>

//               <td>{c.platform}</td>

//               <td>{c.directType}</td>

//               <td>
//                 <span className="tag dark">{c.status}</span>
//               </td>

//               <td>
//                 <span className={tagClass(c.validationStatus)}>
//                   {c.validationStatus}
//                 </span>
//               </td>

//               <td>
//                 <span className={tagClass(c.invoiceStatus)}>
//                   {c.invoiceStatus}
//                 </span>
//               </td>

//               <td>
//                 <span className={tagClass(c.paymentStatus)}>
//                   {c.paymentStatus}
//                 </span>
//               </td>

//               <td style={overdueStyle(c.overdueDate)}>
//                 {c.overdueDate ? new Date(c.overdueDate).toLocaleDateString() : "-"}
//               </td>

//               <td>
//                 <button className="btn" onClick={() => navigate(`/campaigns/${c._id}`)}>View</button>
//                 <button className="btn" onClick={() => navigate(`/campaigns/${c._id}/edit`)}>Edit</button>
//                 <button className="btn danger" onClick={() => handleDelete(c._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CampaignList;


import React, { useEffect, useState , useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCampaigns, deleteCampaign, exportCampaignsCSV , importCampaigns} from "../../api/campaign";
import { listUsers } from "../../api/admin";
import "./Campaigns.css";
import { AuthContext } from "../../context/AuthContext";


const CampaignList = () => {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [ams, setAms] = useState([]);

  const [filters, setFilters] = useState({
    advertiser: "",
    amId: "",
    month: "",
    status: "",
    platform: "",
    directType: ""
  });

  const navigate = useNavigate();

  // Load AM dropdown
  useEffect(() => {
    if (user?.role !== "Admin") return;

    (async () => {
      try {
        const res = await listUsers({ role: "AM" });
        setAms(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Load campaigns
  const load = async () => {
    try {
      let payload = { ...filters };

      // If month filter selected, send start/end of that month
      // if (filters.month) {
      //   const month = parseInt(filters.month, 10);
      //   const year = new Date().getFullYear(); // current year
      //   const startOfMonth = new Date(year, month - 1, 1); // first day
      //   const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999); // last day

      //   payload.startDate = startOfMonth.toISOString();
      //   payload.endDate = endOfMonth.toISOString();
      // }

if (filters.month) {
  const month = parseInt(filters.month, 10);
  const year = new Date().getFullYear();
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  // send to backend
  payload.filterMonthStart = startOfMonth.toISOString();
  payload.filterMonthEnd = endOfMonth.toISOString();
}



      const res = await getCampaigns(payload);
      setCampaigns(res.data.reverse());
    } catch (e) {
      console.error(e);
      alert("Failed to load campaigns");
    }
  };

  useEffect(() => { load(); }, []);

  const applyFilters = async (e) => {
    e?.preventDefault();
    await load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      await deleteCampaign(id);
      alert("Deleted");
      load();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await importCampaigns(formData);
      alert(`Upload Completed. Created: ${res.data.summary?.created || 0} | Updated: ${res.data.summary?.updated || 0}`);
      load();
    } catch (error) {
      console.error(error);
      alert("Import failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportCampaignsCSV();
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "campaigns.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Export failed");
    }
  };

  const tagClass = (value) => {
    const v = value?.toLowerCase();
    if (v === "pending") return "tag yellow";
    if (v === "received") return "tag green";
    if (v === "notraised") return "tag orange";
    if (v === "raised") return "tag blue";
    if (v === "notreceived") return "tag red";
    return "tag";
  };

  const overdueStyle = (date) => {
    if (!date) return {};
    const d = new Date(date);
    if (d < new Date()) return { color: "red", fontWeight: "bold" };
    return {};
  };

  return (
    <div className="campaigns-page">
      <div className="page-header">
        <h2>Campaigns</h2>
        <div className="page-actions">
          <Link to="/campaigns/create" className="btn-primary">+ New Campaign</Link>
          {user?.role === "Admin" && (
            <label className="btn">
              Import CSV
              <input type="file" accept=".csv,.xlsx" style={{ display: "none" }} onChange={handleImport}/>
            </label>
          )}
          <button className="btn" onClick={handleExport}>Export CSV</button>
        </div>
      </div>

      <form className="filters" onSubmit={applyFilters}>
        <input placeholder="Advertiser" value={filters.advertiser} onChange={e => setFilters({...filters, advertiser: e.target.value})} />

        <select value={filters.amId} onChange={e => setFilters({...filters, amId: e.target.value})}>
          <option value="">All AMs</option>
          {ams.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>

        <select value={filters.platform} onChange={e => setFilters({...filters, platform: e.target.value})}>
          <option value="">Platform</option>
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="Other">Other</option>
        </select>

        <select value={filters.directType} onChange={e => setFilters({...filters, directType: e.target.value})}>
          <option value="">Direct / Indirect</option>
          <option value="Direct">Direct</option>
          <option value="Indirect">Indirect</option>
        </select>

        <select value={filters.month} onChange={e => setFilters({...filters, month: e.target.value})}>
          <option value="">All months</option>
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
          <option value="">All statuses</option>
          <option value="Pending">Validation Pending</option>
          <option value="Received">Validation Received</option>
          <option value="Rejected">Validation Rejected</option>
          <option value="Raised">Invoice Raised</option>
          <option value="NotRaised">Invoice Not Raised</option>
          <option value="NotReceived">Payment Pending</option>
          <option value="Received">Payment Received</option>
        </select>

        <button className="btn" type="submit">Apply</button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Advertiser</th>
            <th>Campaign</th>
            <th>AM</th>
            <th>Platform</th>
            <th>Direct</th>
            <th>Status</th>
            <th>Validation</th>
            <th>Invoice</th>
            <th>Payment</th>
            <th>Overdue</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map(c => (
            <tr key={c._id}>
              <td>{c.advertiserName}</td>
              <td><Link to={`/campaigns/${c._id}`} className="link">{c.campaignName}</Link></td>
              <td>{c.amAssigned?.name || "-"}</td>
              <td>{c.platform}</td>
              <td>{c.directType}</td>
              <td><span className="tag dark">{c.status}</span></td>
              <td><span className={tagClass(c.validationStatus)}>{c.validationStatus}</span></td>
              <td><span className={tagClass(c.invoiceStatus)}>{c.invoiceStatus}</span></td>
              <td><span className={tagClass(c.paymentStatus)}>{c.paymentStatus}</span></td>
              <td style={overdueStyle(c.overdueDate)}>{c.overdueDate ? new Date(c.overdueDate).toLocaleDateString() : "-"}</td>
              <td>
                <button className="btn" onClick={() => navigate(`/campaigns/${c._id}`)}>View</button>
                <button className="btn" onClick={() => navigate(`/campaigns/${c._id}/edit`)}>Edit</button>
                <button className="btn danger" onClick={() => handleDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignList;
