// import React, { useEffect, useState } from "react";
// import { fetchTimeline } from "../../api/timeline";
// import { useParams } from "react-router-dom";
// import "./Campaigns.css";

// const CampaignTimeline = () => {
//   const { id } = useParams();
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetchTimeline("Campaign", id);
//         setEvents(res.data);
//       } catch (e) {
//         console.error(e);
//         alert("Failed to load timeline");
//       }
//     })();
//   }, [id]);

//   return (
//     <div className="campaigns-page">
//       <h2>Timeline</h2>
//       <div className="card">
//         {events.length === 0 && <div>No timeline events</div>}
//         {events.map(ev => (
//           <div key={ev._id} className="timeline-item">
//             <div className="timeline-header">
//               <div className="timeline-action">{ev.action}</div>
//               <div className="timeline-time">{new Date(ev.createdAt).toLocaleString()}</div>
//             </div>
//             <div className="timeline-body">
//              <strong>Actor:</strong> 
// <strong>Actor:</strong> 
//   {ev.actor?.name 
//     ? `${ev.actor.name} (${ev.actor.role || "User"})` 
//     : "System"}


//  <br/>
//               <details>
//                 <summary>Show diff/meta</summary>
//                 <pre>{JSON.stringify(ev.diff || ev.meta || {}, null, 2)}</pre>
//               </details>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CampaignTimeline;
import React, { useEffect, useState } from "react";
import { fetchTimeline } from "../../api/timeline";
import { useParams } from "react-router-dom";
import "./Campaigns.css";

const CampaignTimeline = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchTimeline("Campaign", id);
        setEvents(res.data);
      } catch (e) {
        console.error(e);
        alert("Failed to load timeline");
      }
    })();
  }, [id]);

  return (
    <div className="campaigns-page">
      <h2>Timeline</h2>
      <div className="card">
        {events.length === 0 && <div>No timeline events</div>}
        {events.map(ev => (
          <div key={ev._id} className="timeline-item">
            <div className="timeline-header">
              <div className="timeline-action">{ev.action}</div>
              <div className="timeline-time">
                {new Date(ev.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="timeline-body">
              <strong>Actor:</strong>{" "}
              {ev.actor?.name
                ? `${ev.actor.name} (${ev.actor.role || "User"})`
                : "System"}
              <br />

              <details>
                <summary>Show diff/meta</summary>
                <pre>{JSON.stringify(ev.diff || ev.meta || {}, null, 2)}</pre>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignTimeline;
