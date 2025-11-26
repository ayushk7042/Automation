const PDFDocument = require('pdfkit');
const fs = require('fs');
function generateCampaignPDF(campaign, destPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(destPath);
    doc.pipe(stream);
    doc.fontSize(16).text(`Campaign Summary: ${campaign.campaignName}`, { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Advertiser: ${campaign.advertiserName}`);
    doc.text(`AM: ${campaign.amAssigned?.toString() || 'N/A'}`);
    doc.text(`Validation Status: ${campaign.validationStatus}`);
    doc.text(`Validated Amount: ${campaign.validatedAmount || 0}`);
    doc.text(`Invoice Status: ${campaign.invoiceStatus} (${campaign.invoiceAmount || 0})`);
    doc.text(`Payment Status: ${campaign.paymentStatus}`);
    doc.end();
    stream.on('finish', () => resolve(destPath));
    stream.on('error', reject);
  });
}
module.exports = { generateCampaignPDF };
