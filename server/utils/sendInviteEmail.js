// const nodemailer = require("nodemailer");

// const sendInviteEmail = async (email, name, tempPassword) => {
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     }
//   });

//   const html = `
//     <div style="font-family:Arial;padding:20px;">
//       <h2>Welcome, ${name}</h2>
//       <p>Your account has been created by the Admin.</p>
//       <p><b>Email:</b> ${email}</p>
//       <p><b>Temporary Password:</b> ${tempPassword}</p>
//       <p>Please login and change your password immediately.</p>
//       <br/>
//       <p>Regards,<br/>Admin Team</p>
//     </div>
//   `;

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Your Account Credentials",
//     html,
//   });
// };

// module.exports = sendInviteEmail;


const nodemailer = require("nodemailer");
require("dotenv").config();

const sendInviteEmail = async (email, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Aff Alliances" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Account Has Been Created",
      html: `
        <h2>Welcome!</h2>
        <p>Your account has been created by the admin.</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Temporary Password:</b> ${password}</p>
        <p>Please login and change your password immediately.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Invite email sent successfully");
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

module.exports = sendInviteEmail;
