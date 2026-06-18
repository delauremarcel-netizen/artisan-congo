/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  // This hook runs on subscription updates
  // Check if subscription needs to be expired
  const nextPaymentDate = e.record.get("next_payment_date");
  const status = e.record.get("status");
  const artisanId = e.record.get("artisan_id");
  
  if (status === "active" && nextPaymentDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const paymentDate = new Date(nextPaymentDate);
    paymentDate.setHours(0, 0, 0, 0);
    
    if (paymentDate <= today) {
      e.record.set("status", "expired");
      
      // Update artisan's subscription_status to expired
      try {
        const artisan = $app.findRecordById("artisans", artisanId);
        if (artisan) {
          artisan.set("subscription_status", "expired");
          $app.save(artisan);
        }
      } catch (err) {
        console.log("Could not update artisan subscription status: " + err.message);
      }
    }
  }
  
  e.next();
}, "subscriptions");

// Also check on record creation
onRecordCreate((e) => {
  const nextPaymentDate = e.record.get("next_payment_date");
  const status = e.record.get("status");
  const artisanId = e.record.get("artisan_id");
  
  if (status === "active" && nextPaymentDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const paymentDate = new Date(nextPaymentDate);
    paymentDate.setHours(0, 0, 0, 0);
    
    if (paymentDate <= today) {
      e.record.set("status", "expired");
      
      try {
        const artisan = $app.findRecordById("artisans", artisanId);
        if (artisan) {
          artisan.set("subscription_status", "expired");
          $app.save(artisan);
        }
      } catch (err) {
        console.log("Could not update artisan subscription status: " + err.message);
      }
    }
  }
  
  e.next();
}, "subscriptions");