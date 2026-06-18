/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  if (!e.record.get("registration_id")) {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    e.record.set("registration_id", "REG-" + timestamp + "-" + random);
  }
  e.next();
}, "artisan_registrations");