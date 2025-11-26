// import React from "react";
// import "./FileUploader.css";

// const FileUploader = ({ label = "Upload File", onChange }) => {
//   return (
//     <div className="file-upload">
//       <label className="upload-label">
//         {label}
//         <input
//           type="file"
//           onChange={(e) => onChange(e.target.files[0])}
//           hidden
//         />
//       </label>
//     </div>
//   );
// };

// export default FileUploader;
import React from "react";
import "./FileUploader.css";

const FileUploader = ({ label = "Upload File", onChange }) => {
  return (
    <div className="file-upload-box">
      <label className="upload-box">
        <div className="upload-icon">📁</div>
        <p className="upload-text">{label}</p>
        <input type="file" hidden onChange={(e) => onChange(e.target.files[0])} />
      </label>
    </div>
  );
};

export default FileUploader;
