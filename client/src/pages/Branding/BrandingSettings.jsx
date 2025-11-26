// import React, { useState, useEffect } from "react";
// import * as brandingAPI from "../../api/branding";

// const BrandingSettings = () => {
//   const [form, setForm] = useState({
//     companyName: "",
//     themeColor: "",
//   });

//   const [logo, setLogo] = useState(null);
//   const [existingLogo, setExistingLogo] = useState(null);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await brandingAPI.getBranding();
//         setForm(res.data);
//         if (res.data.logo) setExistingLogo(res.data.logo);
//       } catch (e) {
//         console.error("fetch branding failed", e);
//       }
//     })();
//   }, []);

//   const saveSettings = async () => {
//     try {
//       await brandingAPI.updateBranding(form);
//       alert("Branding settings updated!");
//     } catch (e) {
//       alert("Error updating settings");
//     }
//   };

//   const uploadLogo = async () => {
//     if (!logo) return alert("Select a logo first!");
//     try {
//       const formData = new FormData();
//       formData.append("logo", logo);

//       const res = await brandingAPI.uploadLogo(formData);
//       alert("Logo uploaded!");

//       setExistingLogo(res.data.logo);
//     } catch (e) {
//       alert("Error uploading logo");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Branding Settings</h2>

//       <div style={{ marginTop: 20 }}>
//         <label>Company Name:</label>
//         <input
//           type="text"
//           name="companyName"
//           value={form.companyName || ""}
//           onChange={handleChange}
//         />
//       </div>

//       <div style={{ marginTop: 20 }}>
//         <label>Theme Color:</label>
//         <input
//           type="color"
//           name="themeColor"
//           value={form.themeColor || "#000000"}
//           onChange={handleChange}
//         />
//       </div>

//       <button style={{ marginTop: 20 }} onClick={saveSettings}>
//         Save Settings
//       </button>

//       <hr style={{ margin: "30px 0" }} />

//       <h3>Company Logo</h3>

//       {existingLogo && (
//         <div>
//           <p>Current Logo:</p>
//           <img
//             src={`/${existingLogo}`}
//             alt="logo"
//             style={{ height: 80, marginBottom: 20 }}
//           />
//         </div>
//       )}

//       <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
//       <button style={{ marginTop: 10 }} onClick={uploadLogo}>
//         Upload Logo
//       </button>
//     </div>
//   );
// };

// export default BrandingSettings;   // ← VERY IMPORTANT

import React, { useState, useEffect } from "react";
import * as brandingAPI from "../../api/branding";
import "./BrandingSettings.css";

const BrandingSettings = () => {
  const [form, setForm] = useState({
    companyName: "",
    themeColor: "",
  });

  const [logo, setLogo] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await brandingAPI.getBranding();
        setForm(res.data);
        if (res.data.logo) setExistingLogo(res.data.logo);
      } catch (e) {
        console.error("fetch branding failed", e);
      }
    })();
  }, []);

  const saveSettings = async () => {
    try {
      await brandingAPI.updateBranding(form);
      alert("Branding settings updated!");
    } catch (e) {
      alert("Error updating settings");
    }
  };

  const uploadLogo = async () => {
    if (!logo) return alert("Select a logo first!");
    try {
      const formData = new FormData();
      formData.append("logo", logo);

      const res = await brandingAPI.uploadLogo(formData);
      alert("Logo uploaded!");
      setExistingLogo(res.data.logo);
    } catch (e) {
      alert("Error uploading logo");
    }
  };

  return (
    <div className="branding-container">
      <h2 className="branding-title">Branding Settings</h2>

      <div className="branding-card">
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={form.companyName || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Theme Color</label>
          <input
            type="color"
            name="themeColor"
            value={form.themeColor || "#000000"}
            onChange={handleChange}
            className="color-picker"
          />
        </div>

        <button className="btn-primary" onClick={saveSettings}>
          Save Settings
        </button>
      </div>

      <div className="divider"></div>

      <h3 className="branding-subtitle">Company Logo</h3>

      <div className="branding-card">
        {existingLogo && (
          <div className="logo-preview-section">
            <p>Current Logo:</p>
            <img
              src={`/${existingLogo}`}
              alt="logo"
              className="logo-preview"
            />
          </div>
        )}

        <div className="form-group">
          <label>Upload New Logo</label>
          <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
        </div>

        <button className="btn-secondary" onClick={uploadLogo}>
          Upload Logo
        </button>
      </div>
    </div>
  );
};

export default BrandingSettings;
