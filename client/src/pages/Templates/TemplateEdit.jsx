import React, { useEffect, useState } from "react";
import { getTemplate, updateTemplate } from "../../api/template";
import { useParams, useNavigate } from "react-router-dom";
import RichTextEditor from "../../components/RichTextEditor";
import "./Template.css";

const TemplateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [variables, setVariables] = useState("");

  const load = async () => {
    try {
      const res = await getTemplate(id);
      const t = res.data;
      setName(t.name);
      setSubject(t.subject);
      setHtml(t.html);
      setVariables(t.variables?.join(",") || "");
    } catch (err) {
      alert("Failed to load template");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await updateTemplate(id, {
        name,
        subject,
        html,
        variables: variables.split(",").map((v) => v.trim()),
      });

      alert("Template updated!");
      navigate("/templates");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="template-page">
      <h2>Edit Template</h2>

      <form className="template-form" onSubmit={handleSave}>
        
        <label>Template Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />

        <label>Variables (comma separated)</label>
        <input
          value={variables}
          onChange={(e) => setVariables(e.target.value)}
          placeholder="e.g. name, amount, date"
        />

        <label>HTML Body</label>
        <RichTextEditor value={html} onChange={setHtml} />

        <button className="btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
};

export default TemplateEdit;
