// // import React, { useRef, useEffect } from "react";
// // import "./RichTextEditor.css";

// // const RichTextEditor = ({ value, onChange }) => {
// //   const ref = useRef();

// //   useEffect(() => {
// //     if (ref.current && value !== ref.current.innerHTML) {
// //       ref.current.innerHTML = value;
// //     }
// //   }, [value]);

// //   const exec = (cmd, arg = null) => {
// //     document.execCommand(cmd, false, arg);
// //   };

// //   return (
// //     <div className="rte-container">
// //       <div className="rte-toolbar">
// //         <button onClick={() => exec("bold")}><b>B</b></button>
// //         <button onClick={() => exec("italic")}><i>I</i></button>
// //         <button onClick={() => exec("underline")}><u>U</u></button>
// //         <button onClick={() => {
// //           const url = prompt("Enter link:");
// //           if (url) exec("createLink", url);
// //         }}>
// //           🔗
// //         </button>
// //         <button onClick={() => exec("removeFormat")}>❌</button>
// //       </div>

// //       <div
// //         ref={ref}
// //         className="rte-editor"
// //         contentEditable
// //         onInput={(e) => onChange(e.target.innerHTML)}
// //       />
// //     </div>
// //   );
// // };

// // export default RichTextEditor;



// import React, { useRef, useEffect } from "react";
// import "./RichTextEditor.css";

// const RichTextEditor = ({ value, onChange }) => {
//   const ref = useRef();

//   useEffect(() => {
//     if (ref.current && value !== ref.current.innerHTML) {
//       ref.current.innerHTML = value;
//     }
//   }, [value]);

//   const exec = (cmd, arg = null) => {
//     document.execCommand(cmd, false, arg);
//   };

//   return (
//     <div className="rte-box">
//       <div className="rte-toolbar">
//         <button onClick={() => exec("bold")}>B</button>
//         <button onClick={() => exec("italic")}>I</button>
//         <button onClick={() => exec("underline")}>U</button>

//         <button
//           onClick={() => {
//             const url = prompt("Enter link:");
//             if (url) exec("createLink", url);
//           }}
//         >
//           🔗
//         </button>

//         <button onClick={() => exec("removeFormat")}>❌</button>
//       </div>

//       <div
//         ref={ref}
//         className="rte-editor"
//         contentEditable
//         onInput={(e) => onChange(e.target.innerHTML)}
//       ></div>
//     </div>
//   );
// };

// export default RichTextEditor;




import React, { useRef, useEffect } from "react";
import "./RichTextEditor.css";

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const exec = (command, arg = null) => {
    document.execCommand(command, false, arg);
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="rte-container">
      {/* Toolbar */}
      <div className="rte-toolbar">
        <button onClick={() => exec("bold")}><b>B</b></button>
        <button onClick={() => exec("italic")}><i>I</i></button>
        <button onClick={() => exec("underline")}><u>U</u></button>

        <span className="rte-divider" />

        <button onClick={() => exec("insertOrderedList")}>1.</button>
        <button onClick={() => exec("insertUnorderedList")}>•</button>

        <span className="rte-divider" />

        <select
          className="rte-select"
          onChange={(e) => exec("formatBlock", e.target.value)}
        >
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <span className="rte-divider" />

        <button onClick={() => exec("createLink", prompt("Enter URL:"))}>
          🔗 Link
        </button>
        <button onClick={() => exec("unlink")}>Unlink</button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        onInput={(e) => onChange(e.target.innerHTML)}
      ></div>
    </div>
  );
};

export default RichTextEditor;
