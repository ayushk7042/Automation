
const cron = require("node-cron");
const Campaign = require("../models/Campaign");
const User = require("../models/User");
const sendCampaignEmail = require("./sendCampaignEmail");
const moment = require("moment");
const Notification = require("../models/Notification");



const setupCronJobs = () => {
  console.log("⏳ Cron Jobs Loaded Successfully");

  // -------------------------------------------------------------
  // 🟦 1) WEEKLY SUMMARY TO AM — Every Monday at 09:00 AM
  // -------------------------------------------------------------
  cron.schedule(
    "0 9 * * 1", 
    async () => {
      try {
        console.log("[Cron] Weekly summary started...");

        const ams = await User.find({ role: "AM", status: "Active" });

        for (const am of ams) {
          const campaigns = await Campaign.find({ amAssigned: am._id });

          const totalCampaigns = campaigns.length;
          const pendingValidation = campaigns.filter(
            (c) => c.validationStatus === "Pending"
          ).length;
          const validatedButNoInvoice = campaigns.filter(
            (c) =>
              c.validationStatus === "Received" &&
              c.invoiceStatus === "NotRaised"
          ).length;
          const invoicesOlder30 = campaigns.filter((c) => {
            if (!c.invoiceDate || c.paymentStatus !== "NotReceived") return false;
            const diff = moment().diff(moment(c.invoiceDate), "days");
            return diff >= 30;
          }).length;

          const monthTotals = {};
          campaigns.forEach((c) => {
            if (c.invoiceDate) {
              const month = moment(c.invoiceDate).format("MM");
              monthTotals[month] = (monthTotals[month] || 0) + (c.invoiceAmount || 0);
            }
          });

          const html = `
            <h3>Your Weekly Campaign Summary</h3>
            <p><b>Total Campaigns:</b> ${totalCampaigns}</p>
            <p><b>Pending Validation:</b> ${pendingValidation}</p>
            <p><b>Validated but Invoice Not Raised:</b> ${validatedButNoInvoice}</p>
            <p><b>Payment Pending Over 30 Days:</b> ${invoicesOlder30}</p>
            <p><b>Monthly Invoice Totals:</b> ${JSON.stringify(monthTotals)}</p>
          `;

          await sendCampaignEmail({
            to: am.email,
            subject: "Weekly Campaign Summary",
            html,
          });
        }

        console.log("[Cron] Weekly summary finished");
      } catch (err) {
        console.error("[Cron Error: Weekly Summary]", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );


  // 🟧 WEEKLY SUMMARY TO FINANCE TEAM — Monday 09:15 AM
  cron.schedule(
    "15 9 * * 1",
    async () => {
      try {
        console.log("[Cron] Finance weekly summary started...");

        const finances = await User.find({ role: "Finance", status: "Active" });

        const campaigns = await Campaign.find();

        const pendingPayments = campaigns.filter(
          (c) => c.paymentStatus === "NotReceived"
        ).length;

        const invoicesRaised = campaigns.filter(
          (c) => c.invoiceStatus === "Raised"
        ).length;

        const totalInvoiceAmount = campaigns.reduce(
          (sum, c) => sum + (c.invoiceAmount || 0),
          0
        );

        const html = `
          <h3>Weekly Finance Summary</h3>
          <p><b>Total Campaigns:</b> ${campaigns.length}</p>
          <p><b>Pending Payments:</b> ${pendingPayments}</p>
          <p><b>Invoices Raised:</b> ${invoicesRaised}</p>
          <p><b>Total Invoice Value:</b> ₹${totalInvoiceAmount}</p>
        `;

        for (const fin of finances) {
          await sendCampaignEmail({
            to: fin.email,
            subject: "Weekly Finance Summary",
            html,
          });
        }

        console.log("[Cron] Finance weekly summary completed");
      } catch (err) {
        console.error("[Cron Error: Finance Weekly]", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );


  // 🟩 CAMPAIGN END DATE REMINDER — 1 Day Before (9 AM)
  cron.schedule(
    "0 9 * * *",
    async () => {
      const tomorrow = moment().add(1, "day").startOf("day");
      const dayAfter = moment(tomorrow).add(1, "day");

      const campaigns = await Campaign.find({
        endDate: { $gte: tomorrow.toDate(), $lt: dayAfter.toDate() }
      }).populate("amAssigned createdBy");

      for (const c of campaigns) {
        const html = `
          <p>The campaign <b>${c.campaignName}</b> is ending tomorrow.</p>
        `;

        const targetUsers = [c.amAssigned, c.createdBy].filter(Boolean);

        for (const user of targetUsers) {
          await sendCampaignEmail({ to: user.email, subject: "Campaign Ending Tomorrow", html });
          await Notification.create({
            user: user._id,
            title: "Campaign Ending",
            body: `Campaign ${c.campaignName} ends tomorrow`,
            type: "deadline",
            meta: { campaignId: c._id }
          });
        }
      }
    },
    { timezone: "Asia/Kolkata" }
  );




  cron.schedule(
    "0 11 * * *",
    async () => {
      const tomorrow = moment().add(1, "day").startOf("day");
      const dayAfter = moment(tomorrow).add(1, "day");

      const campaigns = await Campaign.find({
        overdueDate: { $gte: tomorrow.toDate(), $lt: dayAfter.toDate() }
      }).populate("amAssigned createdBy");

      for (const c of campaigns) {
        const html = `
          <p>Overdue date for <b>${c.campaignName}</b> is tomorrow.</p>
        `;

        const targetUsers = [c.amAssigned, c.createdBy].filter(Boolean);

        for (const user of targetUsers) {
          await sendCampaignEmail({
            to: user.email,
            subject: "Overdue Deadline Tomorrow",
            html,
          });

          await Notification.create({
            user: user._id,
            title: "Overdue Deadline",
            body: `Overdue deadline for ${c.campaignName} is tomorrow.`,
            type: "overdue",
            meta: { campaignId: c._id }
          });
        }
      }
    },
    { timezone: "Asia/Kolkata" }
  );




  // -------------------------------------------------------------
  // 🟩 2) VALIDATION REMINDER — 1 Day Before OverdueDate (8 AM)
  // -------------------------------------------------------------
  cron.schedule(
    "0 8 * * *",
    async () => {
      try {
        console.log("[Cron] Validation reminder running...");

        const tomorrow = moment().add(1, "day").startOf("day");
        const dayAfter = moment(tomorrow).add(1, "day");

        const campaigns = await Campaign.find({
          overdueDate: { $gte: tomorrow.toDate(), $lt: dayAfter.toDate() },
          validationStatus: "Pending",
        }).populate("amAssigned");

        for (const c of campaigns) {
          if (c.amAssigned && c.amAssigned.email) {
            const html = `
              <p>
                The campaign <b>${c.campaignName}</b> from <b>${c.advertiserName}</b> 
                is completing validation TAT tomorrow. Please follow up.
              </p>
            `;

            await sendCampaignEmail({
              to: c.amAssigned.email,
              subject: "Reminder: Validation TAT Ending Tomorrow",
              html,
            });
          }
        }

        console.log("[Cron] Validation reminder complete");
      } catch (err) {
        console.error("[Cron Error: Validation Reminder]", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );

  // -------------------------------------------------------------
  // 🟥 3) PAYMENT REMINDER — 30+ Days After Invoice Date (10 AM)
  // -------------------------------------------------------------
  cron.schedule(
    "0 10 * * *",
    async () => {
      try {
        console.log("[Cron] Payment reminder started...");

        const threshold = moment().subtract(30, "days").startOf("day").toDate();

        const pendingCampaigns = await Campaign.find({
          invoiceDate: { $lte: threshold },
          paymentStatus: "NotReceived",
        });

        if (pendingCampaigns.length === 0) return;

        const financeUsers = await User.find({
          role: "Finance",
          status: "Active",
        });

        for (const fin of financeUsers) {
          for (const c of pendingCampaigns) {
            const html = `
              <p>Payment is pending for:</p>
              <p><b>Campaign:</b> ${c.campaignName}</p>
              <p><b>Advertiser:</b> ${c.advertiserName}</p>
              <p><b>Invoice Date:</b> ${moment(c.invoiceDate).format("DD MMM YYYY")}</p>
            `;

            await sendCampaignEmail({
              to: fin.email,
              subject: "Payment Pending 30+ Days — Action Required",
              html,
            });
          }
        }

        console.log("[Cron] Payment reminder finished");
      } catch (err) {
        console.error("[Cron Error: Payment Reminder]", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );
};






module.exports = setupCronJobs;
