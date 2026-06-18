/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const nextPaymentDate = e.record.get("next_payment_date");
  const artisanId = e.record.get("artisan_id");
  const status = e.record.get("status");
  
  if (status === "active" && nextPaymentDate && artisanId) {
    // Calculate 7 days before payment date
    const paymentDate = new Date(nextPaymentDate);
    const reminderDate = new Date(paymentDate);
    reminderDate.setDate(reminderDate.getDate() - 7);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    reminderDate.setHours(0, 0, 0, 0);
    
    // If today is exactly 7 days before payment, send reminder
    if (today.getTime() === reminderDate.getTime()) {
      try {
        const artisan = $app.findRecordById("artisans", artisanId);
        if (artisan && artisan.get("email")) {
          const formattedDate = paymentDate.toLocaleDateString();
          const message = new MailerMessage({
            from: {
              address: $app.settings().meta.senderAddress,
              name: $app.settings().meta.senderName
            },
            to: [{ address: artisan.get("email") }],
            subject: "Payment Reminder - Subscription Renewal Due",
            html: "<h2>Payment Reminder</h2><p>Dear " + artisan.get("name") + ",</p><p>Your subscription payment is due on <strong>" + formattedDate + "</strong>.</p><p>Please renew your subscription to maintain your active status and continue appearing in search results.</p><p><a href='https://yourapp.com/renew'>Renew Now</a></p><p>Thank you!</p>"
          });
          $app.newMailClient().send(message);
        }
      } catch (err) {
        console.log("Could not send payment reminder: " + err.message);
      }
    }
  }
  
  e.next();
}, "subscriptions");

onRecordAfterUpdateSuccess((e) => {
  const nextPaymentDate = e.record.get("next_payment_date");
  const artisanId = e.record.get("artisan_id");
  const status = e.record.get("status");
  
  if (status === "active" && nextPaymentDate && artisanId) {
    const paymentDate = new Date(nextPaymentDate);
    const reminderDate = new Date(paymentDate);
    reminderDate.setDate(reminderDate.getDate() - 7);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    reminderDate.setHours(0, 0, 0, 0);
    
    if (today.getTime() === reminderDate.getTime()) {
      try {
        const artisan = $app.findRecordById("artisans", artisanId);
        if (artisan && artisan.get("email")) {
          const formattedDate = paymentDate.toLocaleDateString();
          const message = new MailerMessage({
            from: {
              address: $app.settings().meta.senderAddress,
              name: $app.settings().meta.senderName
            },
            to: [{ address: artisan.get("email") }],
            subject: "Payment Reminder - Subscription Renewal Due",
            html: "<h2>Payment Reminder</h2><p>Dear " + artisan.get("name") + ",</p><p>Your subscription payment is due on <strong>" + formattedDate + "</strong>.</p><p>Please renew your subscription to maintain your active status and continue appearing in search results.</p><p><a href='https://yourapp.com/renew'>Renew Now</a></p><p>Thank you!</p>"
          });
          $app.newMailClient().send(message);
        }
      } catch (err) {
        console.log("Could not send payment reminder: " + err.message);
      }
    }
  }
  
  e.next();
}, "subscriptions");