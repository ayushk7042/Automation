// import React, { useEffect, useState, useContext } from "react";
// import { getCampaign, updateCampaign } from "../../api/campaign";
// import { uploadInvoice } from "../../api/invoice";
// import { fetchTimeline } from "../../api/timeline";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import "./Campaigns.css";
// import { AuthContext } from "../../context/AuthContext";

// const CampaignDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const [campaign, setCampaign] = useState(null);
//   const [timeline, setTimeline] = useState([]);
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const load = async () => {
//     try {
//       const res = await getCampaign(id);
//       setCampaign(res.data);
//     } catch (e) {
//       console.error(e);
//       alert("Failed to load");
//     }
//   };

//   const loadTimeline = async () => {
//     try {
//       const res = await fetchTimeline("Campaign", id);
//       setTimeline(res.data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => { load(); loadTimeline(); }, [id]);

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) { alert("Choose file"); return; }
//     setLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       const res = await uploadInvoice(id, fd);
//       alert("Uploaded");
//       setFile(null);
//       load(); // refresh campaign data (invoiceDoc attached)
//       loadTimeline();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Upload failed");
//     } finally { setLoading(false); }
//   };

//   const handleQuickStatus = async (changes) => {
//     try {
//       await updateCampaign(id, changes);
//       alert("Updated");
//       load();
//       loadTimeline();
//     } catch (e) {
//       console.error(e);
//       alert("Update failed");
//     }
//   };

//   if (!campaign) return <div>Loading...</div>;

//   return (
//     <div className="campaigns-page">
//       <div className="header-row">
//         <h2>{campaign.campaignName}</h2>
//         <div>
//           <Link to={`/campaigns/${id}/edit`} className="btn">Edit</Link>
//         </div>
//       </div>

//       <div className="grid-2">
//         <div className="card">
//           <h3>Details</h3>
//           <p><b>Advertiser:</b> {campaign.advertiserName}</p>
//           <p><b>AM:</b> {campaign.amAssigned ? campaign.amAssigned.name : "-"}</p>
//           <p><b>Validation Status:</b> {campaign.validationStatus}</p>
//           <p><b>Invoice Status:</b> {campaign.invoiceStatus} {campaign.invoiceAmount ? ` (₹${campaign.invoiceAmount})` : ""}</p>
//           <p><b>Payment Status:</b> {campaign.paymentStatus}</p>
//           <p><b>Overdue Date:</b> {campaign.overdueDate ? new Date(campaign.overdueDate).toLocaleDateString() : "-"}</p>
//           <p><b>Notes:</b> {campaign.notes}</p>
//         </div>

//         <div className="card">
//           <h3>Invoice</h3>
//           <form onSubmit={handleUpload}>
//             <input type="file" onChange={handleFileChange} />
//             <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload Invoice"}</button>
//           </form>

//           {campaign.invoiceDoc && (
//             <div style={{ marginTop: 12 }}>
//               <p><b>Invoice:</b> {campaign.invoiceDoc.filename}</p>
//               <a href={`/${campaign.invoiceDoc.path}`} target="_blank" rel="noreferrer">View / Download</a>
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={{ marginTop: 16 }} className="card">
//         <h3>Quick Actions</h3>
//         <div style={{ display: "flex", gap: 8 }}>
//           {user.role === "Finance" && (
//             <button className="btn" onClick={() => handleQuickStatus({ paymentStatus: "Received", paymentReceivedDate: new Date().toISOString() })}>
//               Mark Payment Received
//             </button>
//           )}

//           <button className="btn" onClick={() => handleQuickStatus({ validationStatus: "Received" })}>Mark Validation Received</button>
//           <button className="btn" onClick={() => handleQuickStatus({ invoiceStatus: "Raised" })}>Mark Invoice Raised</button>
//         </div>
//       </div>

//       <div style={{ marginTop: 16 }} className="card">
//         <h3>Timeline</h3>
//         <div>
//           {timeline.length === 0 && <div>No events</div>}
//           {timeline.map(t => (
//             <div key={t._id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
//               <div style={{ fontWeight: 600 }}>{t.action}</div>
//               {/* <div style={{ fontSize: 13, color: "#555" }}>{t.actor ? t.actor : "system"} — {new Date(t.createdAt).toLocaleString()}</div> */}

// <div style={{ fontSize: 13, color: "#555" }}>
//   {t.actor?.name 
//     ? `${t.actor.name} (${t.actor.role || "User"})`
//     : "System"
//   } 
//   {" — "}
//   {new Date(t.createdAt).toLocaleString()}
// </div>



//               <details style={{ marginTop: 6 }}>
//                 <summary>Diff / Meta</summary>
//                 <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(t.diff || t.meta || {}, null, 2)}</pre>
//               </details>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CampaignDetails;



// import React, { useEffect, useState, useContext } from "react";
// import { getCampaign, updateCampaign } from "../../api/campaign";
// import { uploadInvoice, deleteInvoice  } from "../../api/invoice";
// import { fetchTimeline } from "../../api/timeline";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import "./Campaigns.css";
// import { AuthContext } from "../../context/AuthContext";

// const CampaignDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const [campaign, setCampaign] = useState(null);
//   const [timeline, setTimeline] = useState([]);
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const load = async () => {
//     try {
//       const res = await getCampaign(id);
//       setCampaign(res.data);
//     } catch (e) {
//       alert("Failed to load");
//     }
//   };

//   const loadTimeline = async () => {
//     try {
//       const res = await fetchTimeline("Campaign", id);
//       setTimeline(res.data);
//     } catch {
//       console.log("Timeline load failed");
//     }
//   };

//   useEffect(() => {
//     load();
//     loadTimeline();
//   }, [id]);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Choose a file");

//     setLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);

//       await uploadInvoice(id, fd);
//       alert("Uploaded");

//       setFile(null);
//       load();
//       loadTimeline();
//     } catch (err) {
//       alert(err.response?.data?.message || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };


// const handleDelete = async (docId) => {
//   if (!window.confirm("Delete this file?")) return;

//   try {
//     await deleteInvoice(docId);
//     alert("Deleted successfully");
//     load();   // refresh campaign
//   } catch (err) {
//     alert(err.response?.data?.message || "Delete failed");
//   }
// };





//   const handleQuickStatus = async (changes) => {
//     try {
//       await updateCampaign(id, changes);
//       alert("Updated");
//       load();
//       loadTimeline();
//     } catch {
//       alert("Update failed");
//     }
//   };

//   if (!campaign) return <div className="loading">Loading campaign...</div>;

//   return (
//     <div className="campaign-container">

//       {/* HEADER */}
//       <div className="campaign-header">
//         <h2>{campaign.campaignName}</h2>
//         <Link to={`/campaigns/${id}/edit`} className="btn-edit">
//           ✏ Edit
//         </Link>
//       </div>

//       {/* TOP GRID */}
//       <div className="grid-2">

//         {/* DETAILS CARD */}
//         <div className="card">
//           <h3 className="card-title">Campaign Details</h3>

//           <div className="detail-row"><b>Advertiser:</b> {campaign.advertiserName}</div>
//           <div className="detail-row"><b>AM:</b> {campaign.amAssigned?.name || "-"}</div>
//           <div className="detail-row"><b>Validation Status:</b> {campaign.validationStatus}</div>
//           <div className="detail-row">
//             <b>Invoice Status:</b> {campaign.invoiceStatus}
//             {campaign.invoiceAmount && ` (₹${campaign.invoiceAmount})`}
//           </div>
//           <div className="detail-row"><b>Payment Status:</b> {campaign.paymentStatus}</div>

//           <div className="detail-row">
//             <b>Overdue Date:</b>{" "}
//             {campaign.overdueDate
//               ? new Date(campaign.overdueDate).toLocaleDateString()
//               : "-"}
//           </div>

//           <div className="detail-row">
//             <b>Notes:</b> {campaign.notes || "-"}
//           </div>
//         </div>

//         {/* INVOICE CARD */}
//         {/* <div className="card">
//           <h3 className="card-title">Invoice</h3>

//           <form className="upload-box" onSubmit={handleUpload}>
//             <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//             <button className="btn-primary" disabled={loading}>
//               {loading ? "Uploading..." : "Upload Invoice"}
//             </button>
//           </form>

//           {campaign.invoiceDoc && (
//             <div className="invoice-file-box">
//               <p><b>Invoice:</b> {campaign.invoiceDoc.filename}</p>
//               <a href={`/${campaign.invoiceDoc.path}`} target="_blank" className="link">
//                 View / Download
//               </a>
//             </div>
//           )}
//         </div> */}

// {/* <div className="card">
//   <h3 className="card-title">Invoice / Uploaded Files</h3>

  
//   <form className="upload-box" onSubmit={handleUpload}>
//     <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//     <button className="btn-primary" disabled={loading}>
//       {loading ? "Uploading..." : "Upload File"}
//     </button>
//   </form>

//   <h4 style={{ marginTop: 15 }}>Upload History</h4>

//   {!campaign.invoiceDocs?.length && <p>No files uploaded yet.</p>}

//   {campaign.invoiceDocs?.length > 0 && (
//     <table className="finance-table small">
//       <thead>
//         <tr>
//           <th>File</th>
//           <th>Uploaded By</th>
//           <th>Date</th>
//           <th>Download</th>
//         </tr>
//       </thead>

//       <tbody>
//         {campaign.invoiceDocs.map((doc) => (
//           <tr key={doc._id}>
//             <td>{doc.filename}</td>
//             <td>{doc.uploadedBy?.name || "-"}</td>
//             <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
//             <td>
//               <a href={`/${doc.path}`} target="_blank">Download</a>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )}
// </div> */}

// <div className="card">
//   <h3 className="card-title">Invoice / Uploaded Files</h3>

//   {/* Upload */}
//   <form className="upload-box" onSubmit={handleUpload}>
//     <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//     <button className="btn-primary" disabled={loading}>
//       {loading ? "Uploading..." : "Upload File"}
//     </button>
//   </form>

//   <h4 style={{ marginTop: 15 }}>Upload History</h4>

//   {!campaign.invoiceDocs?.length && <p>No files uploaded yet.</p>}

//   {campaign.invoiceDocs?.length > 0 && (
//     <table className="finance-table small">
//       <thead>
//         <tr>
//           <th>File</th>
//           <th>Uploaded By</th>
//           <th>Date</th>
//           <th>Download</th>
//           <th>Delete</th>
//         </tr>
//       </thead>

//       <tbody>
//         {campaign.invoiceDocs.map((doc) => (
//           <tr key={doc._id}>
//             <td>{doc.filename}</td>
//             <td>{doc.uploadedBy?.name} ({doc.uploadedBy?.role})</td>
//             <td>{new Date(doc.uploadedAt).toLocaleString()}</td>

//             <td>
//               {/* <a href={`http://localhost:5000//${doc.path}`} target="_blank" className="link">
//                 Download
//               </a> */}


//               <a
//   href={`http://localhost:5000/${doc.path}`}
//   target="_blank"
// >
//   Download
// </a>

//             </td>

//             <td>
//               <button
//                 className="btn-danger small"
//                 onClick={() => handleDelete(doc._id)}
//               >
//                 Delete
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )}
// </div>




//       </div>

//       {/* QUICK ACTIONS */}
//       <div className="card">
//         <h3 className="card-title">Quick Actions</h3>
//         <div className="quick-actions">

//           {user.role === "Finance" && (
//             <button
//               className="btn"
//               onClick={() =>
//                 handleQuickStatus({
//                   paymentStatus: "Received",
//                   paymentReceivedDate: new Date().toISOString(),
//                 })
//               }
//             >
//               ✔ Mark Payment Received
//             </button>
//           )}

//           <button
//             className="btn"
//             onClick={() => handleQuickStatus({ validationStatus: "Received" })}
//           >
//             ✔ Mark Validation Received
//           </button>

//           <button
//             className="btn"
//             onClick={() => handleQuickStatus({ invoiceStatus: "Raised" })}
//           >
//             ✔ Mark Invoice Raised
//           </button>
//         </div>
//       </div>

//       {/* TIMELINE */}
//       <div className="card">
//         <h3 className="card-title">Activity Timeline</h3>

//         {timeline.length === 0 ? (
//           <div className="empty">No events yet</div>
//         ) : (
//           timeline.map((t) => (
//             <div key={t._id} className="timeline-item">
//               <div className="timeline-header">
//                 <div className="timeline-action">{t.action}</div>
//                 <div className="timeline-time">
//                   {new Date(t.createdAt).toLocaleString()}
//                 </div>
//               </div>

//               <div className="timeline-meta">
//                 {t.actor?.name
//                   ? `${t.actor.name} (${t.actor.role})`
//                   : "System"}
//               </div>

//               <details className="timeline-details">
//                 <summary>View Diff / Meta</summary>
//                 <pre>{JSON.stringify(t.diff || t.meta || {}, null, 2)}</pre>
//               </details>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default CampaignDetails;





import React, { useEffect, useState, useContext } from "react";
import { getCampaign, updateCampaign } from "../../api/campaign";
import { uploadInvoice, deleteInvoice } from "../../api/invoice";
import { fetchTimeline } from "../../api/timeline";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Campaigns.css";
import { AuthContext } from "../../context/AuthContext";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [campaign, setCampaign] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD CAMPAIGN ----------------
  const load = async () => {
    try {
      const res = await getCampaign(id);
      setCampaign(res.data);
    } catch (e) {
      alert("Failed to load campaign");
    }
  };

  // ---------------- LOAD TIMELINE ----------------
  const loadTimeline = async () => {
    try {
      const res = await fetchTimeline("Campaign", id);
      setTimeline(res.data);
    } catch {}
  };

  useEffect(() => {
    load();
    loadTimeline();
  }, [id]);

  // ---------------- UPLOAD FILE ----------------
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose a file");

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      await uploadInvoice(id, fd);

      alert("Uploaded");
      setFile(null);
      load();
      loadTimeline();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE FILE ----------------
  const handleDelete = async (docId) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await deleteInvoice(docId);
      alert("Deleted successfully");
      load();
      loadTimeline();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ---------------- QUICK ACTIONS ----------------
  const handleQuickStatus = async (changes) => {
    try {
      await updateCampaign(id, changes);
      alert("Updated");
      load();
      loadTimeline();
    } catch {
      alert("Update failed");
    }
  };

  if (!campaign) return <div className="loading">Loading...</div>;

  return (
    <div className="campaign-container">

      {/* HEADER */}
      <div className="campaign-header">
        <h2>{campaign.campaignName}</h2>

        <Link to={`/campaigns/${id}/edit`} className="btn-edit-link">
          ✏ Edit
        </Link>
      </div>

      {/* TOP GRID */}
      <div className="grid-2">

        {/* LEFT CARD — DETAILS */}
        <div className="card">
          <h3 className="card-title">Campaign Details</h3>

          <div className="detail-row"><b>Advertiser:</b> {campaign.advertiserName}</div>
          <div className="detail-row"><b>AM Assigned:</b> {campaign.amAssigned?.name || "-"}</div>
          <div className="detail-row"><b>Platform:</b> {campaign.platform}</div>
          <div className="detail-row"><b>Direct Type:</b> {campaign.directType}</div>

          <div className="detail-row"><b>Status:</b> {campaign.status}</div>

          <div className="detail-row"><b>Validation:</b> {campaign.validationStatus}</div>

          <div className="detail-row">
            <b>Invoice:</b> {campaign.invoiceStatus}{" "}
            {campaign.invoiceAmount ? `(₹${campaign.invoiceAmount})` : ""}
          </div>

          <div className="detail-row"><b>Payment:</b> {campaign.paymentStatus}</div>

          <div className="detail-row">
            <b>Overdue Date:</b>{" "}
            {campaign.overdueDate ? new Date(campaign.overdueDate).toLocaleDateString() : "-"}
          </div>

          <div className="detail-row"><b>Notes:</b> {campaign.notes || "-"}</div>
        </div>

        {/* RIGHT CARD — FILES */}
        <div className="card">
          <h3 className="card-title">Invoice / Uploaded Files</h3>

          {/* Upload */}
          <form className="upload-box" onSubmit={handleUpload}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button className="btn-primary" disabled={loading}>
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </form>

          <h4 style={{ marginTop: 15 }}>Upload History</h4>

          {!campaign.invoiceDocs?.length && <p>No files uploaded yet.</p>}

          {campaign.invoiceDocs?.length > 0 && (
            <table className="finance-table small">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Download</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {campaign.invoiceDocs.map((doc) => (
                  <tr key={doc._id}>
                    <td>{doc.filename}</td>
                    <td>{doc.uploadedBy?.name} ({doc.uploadedBy?.role})</td>
                    <td>{new Date(doc.uploadedAt).toLocaleString()}</td>

                    <td>
                      <a
                        href={`http://localhost:5000/${doc.path}`}
                        target="_blank"
                        className="link"
                      >
                        Download
                      </a>
                    </td>

                    <td>
                      <button
                        className="btn-danger small"
                        onClick={() => handleDelete(doc._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="card">
        <h3 className="card-title">Quick Actions</h3>

        <div className="quick-actions">

          {user.role === "Finance" && (
            <button
              className="btn"
              onClick={() =>
                handleQuickStatus({
                  paymentStatus: "Received",
                  paymentReceivedDate: new Date().toISOString(),
                })
              }
            >
              ✔ Mark Payment Received
            </button>
          )}

          <button
            className="btn"
            onClick={() => handleQuickStatus({ validationStatus: "Received" })}
          >
            ✔ Mark Validation Received
          </button>

          <button
            className="btn"
            onClick={() => handleQuickStatus({ invoiceStatus: "Raised" })}
          >
            ✔ Mark Invoice Raised
          </button>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="card">
        <h3 className="card-title">Activity Timeline</h3>

        {timeline.length === 0 ? (
          <div className="empty">No events yet</div>
        ) : (
          timeline.map((t) => (
            <div key={t._id} className="timeline-item">

              <div className="timeline-header">
                <div className="timeline-action">{t.action}</div>
                <div className="timeline-time">
                  {new Date(t.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="timeline-meta">
                {t.actor?.name
                  ? `${t.actor.name} (${t.actor.role})`
                  : "System"}
              </div>

              <details className="timeline-details">
                <summary>View Details</summary>
                <pre>{JSON.stringify(t.diff || t.meta || {}, null, 2)}</pre>
              </details>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default CampaignDetails;
