// import React, { useEffect, useState, useContext } from "react";
// import { createCampaign } from "../../api/campaign";
// import { listUsers } from "../../api/admin";
// import { AuthContext } from "../../context/AuthContext";
// import "./Campaigns.css";

// const CampaignCreate = () => {
//   const { user } = useContext(AuthContext);
//   const [form, setForm] = useState({
//     advertiserName: "",
//     campaignName: "",
//     amAssigned: "",
//     startDate: "",
//     endDate: "",
//     overdueDate: "",
//     notes: ""
//   });

//   const [ams, setAms] = useState([]);

//   useEffect(() => {
//     // load AM list for dropdown (admin only) — admin route returns all users by role query
//     (async () => {
//       try {
//         const res = await listUsers({ role: "AM" });
//         setAms(res.data);
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     // if AM user, auto-assign
//     if (user && user.role === "AM") {
//       setForm(f => ({ ...f, amAssigned: user.id || user._id }));
//     }
//   }, [user]);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         advertiserName: form.advertiserName,
//         campaignName: form.campaignName,
//         amAssigned: form.amAssigned || undefined,
//         startDate: form.startDate || undefined,
//         endDate: form.endDate || undefined,
//         overdueDate: form.overdueDate || undefined,
//         notes: form.notes
//       };
//       const res = await createCampaign(payload);
//       alert("Campaign created");
//       window.location.href = `/campaigns/${res.data._id}`;
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Create failed");
//     }
//   };

//   return (
//     <div className="campaigns-page">
//       <h2>Create Campaign</h2>
//       <form className="campaign-form" onSubmit={handleSubmit}>
//         <label>Advertiser Name</label>
//         <input name="advertiserName" required value={form.advertiserName} onChange={handleChange} />

//         <label>Campaign Name</label>
//         <input name="campaignName" required value={form.campaignName} onChange={handleChange} />

//         <label>AM Assigned</label>
//         <select name="amAssigned" value={form.amAssigned} onChange={handleChange}>
//           <option value="">-- select AM --</option>
//           {ams.map(a => <option key={a._id} value={a._id}>{a.name} ({a.email})</option>)}
//         </select>

//         <label>Start Date</label>
//         <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />

//         <label>End Date</label>
//         <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />

//         <label>Overdue Date</label>
//         <input name="overdueDate" type="date" value={form.overdueDate} onChange={handleChange} />

//         <label>Notes</label>
//         <textarea name="notes" value={form.notes} onChange={handleChange} />

//         <div style={{ marginTop: 12 }}>
//           <button className="btn-primary" type="submit">Create</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CampaignCreate;


import React, { useEffect, useState, useContext } from "react";
import { createCampaign } from "../../api/campaign";
import { listUsers } from "../../api/admin";
import { AuthContext } from "../../context/AuthContext";
import "./Campaigns.css";

const CampaignCreate = () => {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    advertiserName: "",
    campaignName: "",
    amAssigned: "",
    platform: "Web",           // New
    durationType: "auto_30",   // New
    directType: "Direct",      // New
    status: "Live",            // New

    startDate: "",
    endDate: "",
    overdueDate: "",
    notes: "",

    transactions: "",
    expectedBilling: "",
    expectedSpend: "",
    expectedMargin: "",
    finalSpend: "",
    margin: "",
    marginPercentage: "",
    invoiceNumber: ""
  });

  const [ams, setAms] = useState([]);

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

  // Auto assign AM if logged-in user is AM
  useEffect(() => {
    if (user && user.role === "AM") {
      setForm(f => ({ ...f, amAssigned: user.id || user._id }));
    }
  }, [user]);

  // Auto duration logic (matches backend)
  useEffect(() => {
    if (!form.startDate) return;

    const start = new Date(form.startDate);
    let end = "";

    if (form.platform === "Mobile") {
      const d = new Date(start);
      d.setDate(d.getDate() + 15);
      end = d.toISOString().substring(0, 10);
    }

    if (form.platform === "Web") {
      const d = new Date(start);
      if (form.durationType === "auto_30") d.setDate(d.getDate() + 30);
      if (form.durationType === "auto_45") d.setDate(d.getDate() + 45);
      end = d.toISOString().substring(0, 10);
    }

    if (form.platform === "Other") {
      // endDate will be manually set by user
      end = form.endDate;
    }

    setForm(f => ({ ...f, endDate: end }));
  }, [form.platform, form.durationType, form.startDate]);


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form };

    try {
      const res = await createCampaign(payload);
      alert("Campaign created successfully!");
      window.location.href = `/campaigns/${res.data._id}`;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Create failed");
    }
  };

  return (
    <div className="campaigns-page">
      <h2>Create Campaign</h2>

      <form className="campaign-form" onSubmit={handleSubmit}>

        {/* BASIC DETAILS */}
        <label>Advertiser Name</label>
        <input name="advertiserName" required value={form.advertiserName} onChange={handleChange} />

        <label>Campaign Name</label>
        <input name="campaignName" required value={form.campaignName} onChange={handleChange} />

        {/* AM ASSIGN */}
        <label>Assign AM</label>
        <select name="amAssigned" value={form.amAssigned} onChange={handleChange}>
          <option value="">-- select AM --</option>
          {ams.map(a => (
            <option key={a._id} value={a._id}>{a.name} ({a.email})</option>
          ))}
        </select>

        {/* PLATFORM */}
        <label>Platform</label>
        <select name="platform" value={form.platform} onChange={handleChange}>
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="Other">Other</option>
        </select>

        {/* Duration type (only for Web) */}
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

        {/* Direct / Indirect */}
        <label>Direct / Indirect</label>
        <select name="directType" value={form.directType} onChange={handleChange}>
          <option value="Direct">Direct</option>
          <option value="Indirect">Indirect</option>
        </select>

        {/* Status */}
        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Live">Live</option>
          <option value="Paused">Paused</option>
        </select>

        {/* DATE FIELDS */}
        <label>Start Date</label>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />

        <label>End Date</label>
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} disabled={form.platform !== "Other"} />

        <label>Overdue Date</label>
        <input type="date" name="overdueDate" value={form.overdueDate} onChange={handleChange} />

        {/* FINANCIAL FIELDS */}
        <label>Transactions</label>
        <input name="transactions" type="number" value={form.transactions} onChange={handleChange} />

        <label>Expected Billing</label>
        <input name="expectedBilling" type="number" value={form.expectedBilling} onChange={handleChange} />

        <label>Expected Spend</label>
        <input name="expectedSpend" type="number" value={form.expectedSpend} onChange={handleChange} />

        <label>Expected Margin</label>
        <input name="expectedMargin" type="number" value={form.expectedMargin} onChange={handleChange} />

        <label>Final Spend</label>
        <input name="finalSpend" type="number" value={form.finalSpend} onChange={handleChange} />

        <label>Margin</label>
        <input name="margin" type="number" value={form.margin} onChange={handleChange} />

        <label>Margin Percentage</label>
        <input name="marginPercentage" type="number" value={form.marginPercentage} onChange={handleChange} />

        <label>Invoice Number</label>
        <input name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} />

        {/* NOTES */}
        <label>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} />

        {/* SUBMIT */}
        <button className="btn-primary" type="submit" style={{ marginTop: 12 }}>
          Create
        </button>
      </form>
    </div>
  );
};

export default CampaignCreate;
