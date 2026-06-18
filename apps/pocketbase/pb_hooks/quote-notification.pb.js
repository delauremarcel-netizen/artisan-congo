/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const artisanId = e.record.get("artisan_id");
  const companyId = e.record.get("company_id");
  const description = e.record.get("description");
  const amount = e.record.get("amount");
  
  if (artisanId && companyId) {
    try {
      // Get artisan details
      const artisan = $app.findRecordById("artisans", artisanId);
      // Get company details
      const company = $app.findRecordById("companies", companyId);
      
      if (artisan && artisan.get("email") && company) {
        const companyName = company.get("name") || "A company";
        const companyEmail = company.get("email") || "N/A";
        const companyPhone = company.get("phone") || "N/A";
        const amountText = amount ? "$" + amount : "To be determined";
        
        const message = new MailerMessage({
          from: {
            address: $app.settings().meta.senderAddress,
            name: $app.settings().meta.senderName
          },
          to: [{ address: artisan.get("email") }],
          subject: "New Quote Request from " + companyName,
          html: "<h2>New Quote Request</h2><p>Dear " + artisan.get("name") + ",</p><p>You have received a new quote request from <strong>" + companyName + "</strong>.</p><h3>Quote Details:</h3><p><strong>Description:</strong> " + description + "</p><p><strong>Estimated Amount:</strong> " + amountText + "</p><h3>Company Contact Information:</h3><p><strong>Email:</strong> " + companyEmail + "</p><p><strong>Phone:</strong> " + companyPhone + "</p><p>Please review the quote request and respond at your earliest convenience.</p><p><a href='https://yourapp.com/quotes'>View Quote</a></p><p>Thank you!</p>"
        });
        $app.newMailClient().send(message);
      }
    } catch (err) {
      console.log("Could not send quote notification: " + err.message);
    }
  }
  
  e.next();
}, "quotes");