

// const mongoose = require("mongoose");

// const campaignSchema = new mongoose.Schema(
//   {
//     advertiserName: { type: String, required: true },
//     campaignName: { type: String, required: true },

//     amAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     startDate: { type: Date },
//     endDate: { type: Date },

//     validationStatus: {
//       type: String,
//       enum: ["Pending", "Received", "Rejected"],
//       default: "Pending",
//     },

//     validatedAmount: { type: Number, default: 0 },

//     invoiceStatus: {
//       type: String,
//       enum: ["NotRaised", "Raised"],
//       default: "NotRaised",
//     },

//     invoiceAmount: { type: Number, default: 0 },
//     invoiceDate: { type: Date },

//     paymentStatus: {
//       type: String,
//       enum: ["NotReceived", "Received"],
//       default: "NotReceived",
//     },



//     paymentReceivedDate: { type: Date },

//     overdueDate: { type: Date }, // Validation TAT End Date

//     notes: { type: String },

//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

// invoiceDocs: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "InvoiceDoc"
//   }
// ]


//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Campaign", campaignSchema);





const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    advertiserName: { type: String, required: true },
    campaignName: { type: String, required: true },

    amAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Platform logic fields
    platform: {
      type: String,
      enum: ["Web", "Mobile", "Other"],
      required: true,
    },

    durationType: {
      type: String, // auto_15, auto_30, auto_45, custom
      default: "custom",
    },

    startDate: { type: Date },
    endDate: { type: Date },

    // Marketing & Finance Metrics
    directType: { type: String, enum: ["Direct", "Indirect"] },

    status: { type: String, enum: ["Live", "Paused"], default: "Live" },

    transactions: { type: Number, default: 0 },

    expectedBilling: { type: Number, default: 0 },
    expectedSpend: { type: Number, default: 0 },
    expectedMargin: { type: Number, default: 0 },

    finalSpend: { type: Number, default: 0 },
    margin: { type: Number, default: 0 },
    marginPercentage: { type: Number, default: 0 },

    invoiceNumber: { type: String },

    // Validation + Invoice + Payment fields
    validationStatus: {
      type: String,
      enum: ["Pending", "Received", "Rejected"],
      default: "Pending",
    },

    validatedAmount: { type: Number, default: 0 },

    invoiceStatus: {
      type: String,
      enum: ["NotRaised", "Raised"],
      default: "NotRaised",
    },

    invoiceAmount: { type: Number, default: 0 },
    invoiceDate: { type: Date },

    paymentStatus: {
      type: String,
      enum: ["NotReceived", "Received"],
      default: "NotReceived",
    },

    paymentReceivedDate: { type: Date },
    overdueDate: { type: Date },

    // Notes
    notes: { type: String },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Invoice Files
    invoiceDocs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InvoiceDoc",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
