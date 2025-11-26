// const EmailQueue = require('../models/EmailQueue');
// const sendCampaignEmail = require('./sendCampaignEmail');
// const moment = require('moment');

// const PROCESS_INTERVAL_MS = 15 * 1000; // every 15 seconds

// let processorHandle = null;

// const processQueue = async () => {
//   try {
//     const now = new Date();
//     const items = await EmailQueue.find({
//       status: 'pending',
//       scheduledAt: { $lte: now }
//     }).limit(50).sort({ scheduledAt: 1 });

//     for (const item of items) {
//       try {
//         const ok = await sendCampaignEmail({ to: item.to, subject: item.subject, html: item.html });
//         if (ok) {
//           item.status = 'sent';
//           item.attempts = item.attempts + 1;
//           await item.save();
//         } else {
//           item.attempts = item.attempts + 1;
//           item.lastError = 'sendCampaignEmail returned false';
//           if (item.attempts >= 3) item.status = 'failed';
//           else {
//             // retry in 5 minutes
//             item.scheduledAt = moment().add(5, 'minutes').toDate();
//           }
//           await item.save();
//         }
//       } catch (err) {
//         item.attempts = item.attempts + 1;
//         item.lastError = err.message || String(err);
//         if (item.attempts >= 3) item.status = 'failed';
//         else item.scheduledAt = moment().add(5, 'minutes').toDate();
//         await item.save();
//         console.error('EmailQueue send error', err);
//       }
//     }
//   } catch (err) {
//     console.error('processQueue error', err);
//   }
// };

// const startProcessor = () => {
//   if (processorHandle) return;
//   processorHandle = setInterval(processQueue, PROCESS_INTERVAL_MS);
//   console.log('Email queue processor started');
// };

// const stopProcessor = () => {
//   if (processorHandle) {
//     clearInterval(processorHandle);
//     processorHandle = null;
//   }
// };

// module.exports = { startProcessor, stopProcessor };
const EmailQueue = require('../models/EmailQueue');
const sendCampaignEmail = require('./sendCampaignEmail');
const Notification = require('../models/Notification');
const moment = require('moment');
const writeAudit = require('./audit');

const PROCESS_INTERVAL_MS = 15 * 1000;
let handle = null;

async function processOnce() {
  try {
    const now = new Date();
    const items = await EmailQueue.find({ status: 'pending', scheduledAt: { $lte: now } }).limit(50).sort({ scheduledAt: 1 });
    for (const item of items) {
      try {
        const ok = await sendCampaignEmail({ to: item.to, subject: item.subject, html: item.html });
        item.attempts++;
        if (ok) {
          item.status = 'sent';
          await item.save();
          await writeAudit('email_sent', null, 'EmailQueue', item._id, {}, { to: item.to, subject: item.subject });
          // optional: create notification if campaignId present for assigned users
          if (item.campaignId) {
            // find campaign creator or assigned users? keeping simple — skip
          }
        } else {
          item.lastError = 'sendCampaignEmail returned false';
          if (item.attempts >= 3) item.status = 'failed';
          else item.scheduledAt = moment().add(5, 'minutes').toDate();
          await item.save();
        }
      } catch(err) {
        item.attempts++;
        item.lastError = err.message || String(err);
        if (item.attempts >= 3) item.status = 'failed';
        else item.scheduledAt = moment().add(5, 'minutes').toDate();
        await item.save();
        console.error('email queue item send error', err);
      }
    }
  } catch(err) {
    console.error('processQueue error', err);
  }
}

function startProcessor() {
  if (handle) return;
  handle = setInterval(processOnce, PROCESS_INTERVAL_MS);
  console.log('Email queue processor started');
}
function stopProcessor() {
  if (handle) clearInterval(handle);
  handle = null;
}
module.exports = { startProcessor, stopProcessor, processOnce };
