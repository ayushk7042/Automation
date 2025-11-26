import React, { useEffect, useState } from "react";
import { getInvoices, approveInvoice, rejectInvoice } from "../../api/finance";
import "./FinanceDashboard.css";

export default function FinanceDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await getInvoices();
      setInvoices(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load finance data");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id) => {
    if (!window.confirm("Approve this invoice?")) return;
    await approveInvoice(id);
    loadData();
  };

  const reject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return alert("Reason required!");
    await rejectInvoice(id, reason);
    loadData();
  };

  if (loading) return <div>Loading...</div>;

  // ---- SAFE helper ----
  const safe = (v) => (v ? v.toString() : "");

  const pending = invoices.filter((i) => safe(i.status) === "Pending");
  const approved = invoices.filter((i) => safe(i.status) === "Approved");
  const rejected = invoices.filter((i) => safe(i.status) === "Rejected");

  return (
    <div className="finance-page">
      <h2>Finance Dashboard</h2>

      {/* KPI CARDS */}
      <div className="kpi-row">
        <div className="kpi-card blue">
          <h3>Total Invoices</h3>
          <p>{invoices.length}</p>
        </div>

        <div className="kpi-card yellow">
          <h3>Pending</h3>
          <p>{pending.length}</p>
        </div>

        <div className="kpi-card green">
          <h3>Approved</h3>
          <p>{approved.length}</p>
        </div>

        <div className="kpi-card red">
          <h3>Rejected</h3>
          <p>{rejected.length}</p>
        </div>
      </div>

      {/* PENDING TABLE */}
      <h3 className="section-title">Pending Approvals</h3>
      <table className="finance-table">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Amount</th>
            <th>Uploaded By</th>
            <th>Date</th>
            <th>Proof</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {pending.length === 0 ? (
            <tr>
              <td colSpan="6">No pending invoices</td>
            </tr>
          ) : (
            pending.map((inv) => (
              <tr key={inv._id}>
                <td>{safe(inv.campaignName)}</td>
                <td>₹ {safe(inv.amount)}</td>
                <td>{inv.uploadedBy?.name || "Unknown"}</td>
                <td>{new Date(inv.createdAt).toLocaleString()}</td>
                <td>
                  {inv.fileUrl ? (
                    <a href={inv.fileUrl} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <button className="btn-approve" onClick={() => approve(inv._id)}>
                    Approve
                  </button>
                  <button className="btn-reject" onClick={() => reject(inv._id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ALL INVOICES */}
      <h3 className="section-title">All Invoices</h3>
      <table className="finance-table small">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Uploaded</th>
            <th>Reason</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td>{safe(inv.campaignName)}</td>

              {/* SAFE STATUS */}
              <td className={`tag ${safe(inv.status).toLowerCase()}`}>
                {safe(inv.status)}
              </td>

              <td>₹ {safe(inv.amount)}</td>
              <td>{inv.uploadedBy?.name || "Unknown"}</td>
              <td>{inv.rejectReason || "-"}</td>
              <td>{new Date(inv.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
