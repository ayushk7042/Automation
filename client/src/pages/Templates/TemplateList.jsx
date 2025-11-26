import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate } from "../../api/template";
import { enqueueEmail } from "../../api/queue";
import { showToast } from "../../components/toast";
import "./Template.css";

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [editing, setEditing] = useState(null); // template being previewed/edited
  const [previewVars, setPreviewVars] = useState({});
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await listTemplates();
      setTemplates(res.data);
    } catch (e) {
      console.error(e);
      showToast("Failed to load templates", "error");
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await deleteTemplate(id);
      showToast("Deleted");
      load();
    } catch (e) {
      console.error(e);
      showToast("Delete failed", "error");
    }
  };

  const openPreview = async (t) => {
    setEditing(t);
    // build default previewVars object
    const vars = {};
    (t.variables || []).forEach(v => vars[v] = `sample_${v}`);
    setPreviewVars(vars);
  };

  const renderHtmlWithVars = (html, vars) => {
    let out = html || "";
    Object.keys(vars).forEach(k => {
      const re = new RegExp(`{{\\s*${k}\\s*}}`, "g");
      out = out.replace(re, vars[k] ?? "");
    });
    return out;
  };

  const sendTest = async () => {
    if (!editing) return;
    const to = window.prompt("Send test to (email):", "");
    if (!to) return;
    try {
      const html = renderHtmlWithVars(editing.html, previewVars);
      await enqueueEmail({ to, subject: editing.subject || "Test", html, scheduledAt: new Date() });
      showToast("Test email enqueued");
    } catch (e) {
      console.error(e);
      showToast("Send failed", "error");
    }
  };

  return (
    <div className="templates-page">
      <div className="header-row">
        <h2>Email Templates</h2>
        <div>
          <Link to="/templates/create" className="btn-primary">+ New Template</Link>
        </div>
      </div>

      <div className="templates-list">
        {templates.length === 0 && <div>No templates yet</div>}

        {templates.map(t => (
          <div key={t._id} className="template-card">
            <div className="template-head">
              <div className="template-name">{t.name}</div>
              <div className="template-actions">
                <button className="btn" onClick={() => navigate(`/templates/${t._id}/edit`)}>Edit</button>
                <button className="btn" onClick={() => openPreview(t)}>Preview</button>
                <button className="btn danger" onClick={() => handleDelete(t._id)}>Delete</button>
              </div>
            </div>

            <div className="template-sub">{t.subject}</div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="template-preview-modal">
          <div className="preview-inner">
            <div className="preview-head">
              <h3>Preview: {editing.name}</h3>
              <button className="btn" onClick={() => setEditing(null)}>Close</button>
            </div>

            <div className="preview-body">
              <div className="preview-side">
                <h4>Variables</h4>
                {(editing.variables || []).length === 0 && <div>No variables</div>}
                {(editing.variables || []).map(v => (
                  <div key={v} className="var-row">
                    <label>{v}</label>
                    <input value={previewVars[v] || ""} onChange={e => setPreviewVars({...previewVars, [v]: e.target.value})} />
                  </div>
                ))}

                <div style={{ marginTop: 12 }}>
                  <button className="btn-primary" onClick={sendTest}>Send Test</button>
                </div>
              </div>

              <div className="preview-html">
                <h4>Rendered HTML</h4>
                <div className="preview-frame" dangerouslySetInnerHTML={{ __html: renderHtmlWithVars(editing.html, previewVars) }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateList;
