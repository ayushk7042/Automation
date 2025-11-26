import React, { useEffect, useState } from "react";
import { createTemplate, getTemplate, updateTemplate } from "../../api/template";
import { useParams, useNavigate } from "react-router-dom";
import { showToast } from "../../components/toast";
import "./Template.css";

/**
 * Simple rich HTML editor using contentEditable div.
 * We keep html in state and save as template.html
 */

const TemplateCreate = () => {
  const { id } = useParams(); // if editing
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [variables, setVariables] = useState(""); // comma separated
  const [html, setHtml] = useState("<p>Start writing template...</p>");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getTemplate(id);
        const t = res.data;
        setName(t.name || "");
        setSubject(t.subject || "");
        setHtml(t.html || "");
        setVariables((t.variables || []).join(","));
      } catch (e) {
        console.error(e);
        showToast("Failed to load template", "error");
      }
    })();
  }, [id]);

  const insertVariable = (v) => {
    // insert placeholder at cursor in contenteditable
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      // append at end
      setHtml(prev => prev + ` {{${v}}} `);
      return;
    }
    const range = sel.getRangeAt(0);
    const frag = document.createTextNode(` {{${v}}} `);
    range.deleteContents();
    range.insertNode(frag);
    // update state from innerHTML
    setHtml(document.getElementById("editor").innerHTML);
  };

  const handleSave = async () => {
    try {
      const payload = { name, subject, html, variables: variables.split(",").map(s => s.trim()).filter(Boolean) };
      if (id) {
        await updateTemplate(id, payload);
        showToast("Template updated");
      } else {
        await createTemplate(payload);
        showToast("Template created");
      }
      navigate("/templates");
    } catch (e) {
      console.error(e);
      showToast("Save failed", "error");
    }
  };

  return (
    <div className="template-edit-page">
      <div className="header-row">
        <h2>{id ? "Edit Template" : "Create Template"}</h2>
        <div>
          <button className="btn" onClick={() => navigate("/templates")}>Back</button>
          <button className="btn-primary" onClick={handleSave} style={{ marginLeft: 8 }}>{id ? "Update" : "Create"}</button>
        </div>
      </div>

      <div className="template-edit-grid">
        <div className="form-col">
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />

          <label>Subject</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} />

          <label>Variables (comma separated)</label>
          <input value={variables} onChange={e => setVariables(e.target.value)} placeholder="name,campaignName" />

          <div style={{ marginTop: 12 }}>
            {(variables.split(",").map(s => s.trim()).filter(Boolean)).map(v => (
              <button key={v} className="btn" style={{ marginRight: 6, marginBottom: 6 }} onClick={() => insertVariable(v)}>{`{{${v}}}`}</button>
            ))}
          </div>
        </div>

        <div className="editor-col">
          <label>HTML Editor</label>
          <div
            id="editor"
            contentEditable
            className="rich-editor"
            onInput={(e) => setHtml(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn-primary" onClick={handleSave}>{id ? "Update Template" : "Create Template"}</button>
      </div>
    </div>
  );
};

export default TemplateCreate;
