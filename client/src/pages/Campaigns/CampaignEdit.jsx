// import React, { useEffect, useState, useContext } from "react";
// import { getCampaign, updateCampaign } from "../../api/campaign";
// import { useParams, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import "./Campaigns.css";

// const CampaignEdit = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const [campaign, setCampaign] = useState(null);
//   const [form, setForm] = useState({});

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getCampaign(id);
//         setCampaign(res.data);
//         setForm({
//           advertiserName: res.data.advertiserName || "",
//           campaignName: res.data.campaignName || "",
//           validationStatus: res.data.validationStatus || "Pending",
//           validatedAmount: res.data.validatedAmount || 0,
//           invoiceStatus: res.data.invoiceStatus || "NotRaised",
//           invoiceAmount: res.data.invoiceAmount || 0,
//           invoiceDate: res.data.invoiceDate ? new Date(res.data.invoiceDate).toISOString().slice(0,10) : "",
//           paymentStatus: res.data.paymentStatus || "NotReceived",
//           paymentReceivedDate: res.data.paymentReceivedDate ? new Date(res.data.paymentReceivedDate).toISOString().slice(0,10) : "",
//           overdueDate: res.data.overdueDate ? new Date(res.data.overdueDate).toISOString().slice(0,10) : "",
//           notes: res.data.notes || "",
//         });
//       } catch (e) {
//         console.error(e);
//         alert("Load failed");
//       }
//     })();
//   }, [id]);

//   const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Prepare payload depending on role (server enforces permission)
//       const payload = { ...form };
//       await updateCampaign(id, payload);
//       alert("Updated");
//       navigate(`/campaigns/${id}`);
//     } catch (e) {
//       console.error(e);
//       alert(e.response?.data?.message || "Update failed");
//     }
//   };

//   if (!campaign) return <div>Loading...</div>;

//   return (
//     <div className="campaigns-page">
//       <h2>Edit Campaign</h2>
//       <form className="campaign-form" onSubmit={handleSubmit}>
//         <label>Advertiser Name</label>
//         <input name="advertiserName" value={form.advertiserName} onChange={handleChange} />

//         <label>Campaign Name</label>
//         <input name="campaignName" value={form.campaignName} onChange={handleChange} />

//         <label>Validation Status</label>
//         <select name="validationStatus" value={form.validationStatus} onChange={handleChange}>
//           <option value="Pending">Pending</option>
//           <option value="Received">Received</option>
//           <option value="Rejected">Rejected</option>
//         </select>

//         <label>Validated Amount</label>
//         <input type="number" name="validatedAmount" value={form.validatedAmount} onChange={handleChange} />

//         <label>Invoice Status</label>
//         <select name="invoiceStatus" value={form.invoiceStatus} onChange={handleChange}>
//           <option value="NotRaised">NotRaised</option>
//           <option value="Raised">Raised</option>
//         </select>

//         <label>Invoice Amount</label>
//         <input type="number" name="invoiceAmount" value={form.invoiceAmount} onChange={handleChange} />

//         <label>Invoice Date</label>
//         <input type="date" name="invoiceDate" value={form.invoiceDate} onChange={handleChange} />

//         <label>Payment Status</label>
//         <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
//           <option value="NotReceived">NotReceived</option>
//           <option value="Received">Received</option>
//         </select>

//         <label>Payment Received Date</label>
//         <input type="date" name="paymentReceivedDate" value={form.paymentReceivedDate} onChange={handleChange} />

//         <label>Overdue Date</label>
//         <input type="date" name="overdueDate" value={form.overdueDate} onChange={handleChange} />

//         <label>Notes</label>
//         <textarea name="notes" value={form.notes} onChange={handleChange} />

//         <div style={{ marginTop: 12 }}>
//           <button className="btn-primary" type="submit">Save</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CampaignEdit;


import React, { useEffect, useState, useContext } from "react";
import { getCampaign, updateCampaign } from "../../api/campaign";
import { listUsers } from "../../api/admin";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Campaigns.css";

const CampaignEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [campaign, setCampaign] = useState(null);
  const [ams, setAms] = useState([]);

  const [form, setForm] = useState({});

  // Load AM list
  useEffect(() => {
    (async () => {
      try {
        const res = await listUsers({ role: "AM" });
        setAms(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Load campaign
  useEffect(() => {
    (async () => {
      try {
        const res = await getCampaign(id);
        const c = res.data;
        setCampaign(c);

        setForm({
          advertiserName: c.advertiserName || "",
          campaignName: c.campaignName || "",
          amAssigned: c.amAssigned?._id || "",
          platform: c.platform || "Web",
          durationType: c.durationType || "auto_30",
          directType: c.directType || "Direct",
          status: c.status || "Live",

          startDate: c.startDate ? c.startDate.slice(0, 10) : "",
          endDate: c.endDate ? c.endDate.slice(0, 10) : "",
          overdueDate: c.overdueDate ? c.overdueDate.slice(0, 10) : "",
          notes: c.notes || "",

          transactions: c.transactions || "",
          expectedBilling: c.expectedBilling || "",
          expectedSpend: c.expectedSpend || "",
          expectedMargin: c.expectedMargin || "",
          finalSpend: c.finalSpend || "",
          margin: c.margin || "",
          marginPercentage: c.marginPercentage || "",
          invoiceNumber: c.invoiceNumber || "",

          validationStatus: c.validationStatus || "Pending",
          validatedAmount: c.validatedAmount || 0,
          invoiceStatus: c.invoiceStatus || "NotRaised",
          invoiceAmount: c.invoiceAmount || 0,
          invoiceDate: c.invoiceDate ? c.invoiceDate.slice(0, 10) : "",
          paymentStatus: c.paymentStatus || "NotReceived",
          paymentReceivedDate: c.paymentReceivedDate ? c.paymentReceivedDate.slice(0, 10) : ""
        });
      } catch (e) {
        console.error(e);
        alert("Failed to load campaign");
      }
    })();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Auto duration like backend
  useEffect(() => {
    if (!form.startDate) return;

    const start = new Date(form.startDate);
    let end = "";

    if (form.platform === "Mobile") {
      const d = new Date(start);
      d.setDate(d.getDate() + 15);
      end = d.toISOString().slice(0, 10);
    }

    if (form.platform === "Web") {
      const d = new Date(start);
      if (form.durationType === "auto_30") d.setDate(d.getDate() + 30);
      if (form.durationType === "auto_45") d.setDate(d.getDate() + 45);
      end = d.toISOString().slice(0, 10);
    }

    if (form.platform === "Other") {
      end = form.endDate; // Manual
    }

    setForm((f) => ({ ...f, endDate: end }));
  }, [form.platform, form.durationType, form.startDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCampaign(id, form);
      alert("Campaign updated");
      navigate(`/campaigns/${id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (!campaign) return <div>Loading...</div>;

  return (
    <div className="campaigns-page">
      <h2>Edit Campaign</h2>

      <form className="campaign-form" onSubmit={handleSubmit}>
        <label>Advertiser Name</label>
        <input name="advertiserName" value={form.advertiserName} onChange={handleChange} />

        <label>Campaign Name</label>
        <input name="campaignName" value={form.campaignName} onChange={handleChange} />

        <label>Assign AM</label>
        <select name="amAssigned" value={form.amAssigned} onChange={handleChange}>
          <option value="">-- select AM --</option>
          {ams.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name} ({a.email})
            </option>
          ))}
        </select>

        {/* PLATFORM */}
        <label>Platform</label>
        <select name="platform" value={form.platform} onChange={handleChange}>
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="Other">Other</option>
        </select>

        {/* Duration only for Web */}
        {form.platform === "Web" && (
          <>
            <label>Duration Type</label>
            <select name="durationType" value={form.durationType} onChange={handleChange}>
              <option value="auto_30">30 Days</option>
              <option value="auto_45">45 Days</option>
              <option value="custom">Custom</option>
            </select>
          </>
        )}

        <label>Direct / Indirect</label>
        <select name="directType" value={form.directType} onChange={handleChange}>
          <option value="Direct">Direct</option>
          <option value="Indirect">Indirect</option>
        </select>

        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Live">Live</option>
          <option value="Paused">Paused</option>
        </select>

        {/* Dates */}
        <label>Start Date</label>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />

        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          disabled={form.platform !== "Other"}
          value={form.endDate}
          onChange={handleChange}
        />

        <label>Overdue Date</label>
        <input type="date" name="overdueDate" value={form.overdueDate} onChange={handleChange} />

        {/* FINANCIAL FIELDS */}
        <label>Transactions</label>
        <input name="transactions" value={form.transactions} onChange={handleChange} />

        <label>Expected Billing</label>
        <input name="expectedBilling" value={form.expectedBilling} onChange={handleChange} />

        <label>Expected Spend</label>
        <input name="expectedSpend" value={form.expectedSpend} onChange={handleChange} />

        <label>Expected Margin</label>
        <input name="expectedMargin" value={form.expectedMargin} onChange={handleChange} />

        <label>Final Spend</label>
        <input name="finalSpend" value={form.finalSpend} onChange={handleChange} />

        <label>Margin</label>
        <input name="margin" value={form.margin} onChange={handleChange} />

        <label>Margin Percentage</label>
        <input name="marginPercentage" value={form.marginPercentage} onChange={handleChange} />

        <label>Invoice Number</label>
        <input name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} />

        {/* Validation + Invoice */}
        <label>Validation Status</label>
        <select name="validationStatus" value={form.validationStatus} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Received">Received</option>
          <option value="Rejected">Rejected</option>
        </select>

        <label>Validated Amount</label>
        <input type="number" name="validatedAmount" value={form.validatedAmount} onChange={handleChange} />

        <label>Invoice Status</label>
        <select name="invoiceStatus" value={form.invoiceStatus} onChange={handleChange}>
          <option value="NotRaised">NotRaised</option>
          <option value="Raised">Raised</option>
        </select>

        <label>Invoice Amount</label>
        <input type="number" name="invoiceAmount" value={form.invoiceAmount} onChange={handleChange} />

        <label>Invoice Date</label>
        <input type="date" name="invoiceDate" value={form.invoiceDate} onChange={handleChange} />

        {/* Payment */}
        <label>Payment Status</label>
        <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
          <option value="NotReceived">NotReceived</option>
          <option value="Received">Received</option>
        </select>

        <label>Payment Received Date</label>
        <input
          type="date"
          name="paymentReceivedDate"
          value={form.paymentReceivedDate}
          onChange={handleChange}
        />

        <label>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} />

        <button className="btn-primary" type="submit" style={{ marginTop: 12 }}>
          Save
        </button>
      </form>
    </div>
  );
};

export default CampaignEdit;
