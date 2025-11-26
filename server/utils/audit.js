// const AuditLog = require('../models/AuditLog');

// const writeAudit = async (action, actorId=null, meta={}) => {
//   try {
//     await AuditLog.create({ action, actor: actorId, meta });
//   } catch (err) {
//     console.error('Audit write error', err);
//   }
// };

// module.exports = writeAudit;
const AuditLog = require('../models/AuditLog');
async function writeAudit(action, actorId=null, targetType=null, targetId=null, diff={}, meta={}) {
  try {
    await AuditLog.create({ action, actor: actorId, targetType, targetId, diff, meta });
  } catch(err) {
    console.error('audit write error', err);
  }
}
module.exports = writeAudit;
