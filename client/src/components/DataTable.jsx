// import React from "react";
// import "./DataTable.css";

// const DataTable = ({ columns = [], data = [] }) => {
//   return (
//     <table className="datatable">
//       <thead>
//         <tr>
//           {columns.map((c, i) => (
//             <th key={i}>{c.label}</th>
//           ))}
//         </tr>
//       </thead>

//       <tbody>
//         {data.map((row, i) => (
//           <tr key={i}>
//             {columns.map((c, idx) => (
//               <td key={idx}>{c.render ? c.render(row) : row[c.key]}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default DataTable;
import React from "react";
import "./DataTable.css";

const DataTable = ({ columns = [], data = [] }) => {
  return (
    <div className="datatable-container">
      <table className="datatable-premium">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i}>{c.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((c, idx) => (
                <td key={idx}>{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
