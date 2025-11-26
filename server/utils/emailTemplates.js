function renderTemplate(html, vars = {}) {
  let out = html;
  Object.keys(vars).forEach(k => {
    const re = new RegExp(`{{\\s*${k}\\s*}}`, 'g');
    out = out.replace(re, vars[k] ?? '');
  });
  return out;
}
module.exports = { renderTemplate };
