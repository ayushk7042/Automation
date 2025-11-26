// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// const sendCampaignEmail = async ({ to, subject, html }) => {
//   try {
//     await transporter.sendMail({
//       from: `"Aff Alliances" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html
//     });
//     console.log('Campaign email sent to', to);
//     return true;
//   } catch (err) {
//     console.error('Failed to send campaign email', err);
//     return false;
//   }
// };

// module.exports = sendCampaignEmail;
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendCampaignEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Aff Alliances" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent to:", to, "| Subject:", subject);
    return true;
  } catch (err) {
    console.error("sendCampaignEmail error:", err);
    return false;
  }
};

module.exports = sendCampaignEmail;
