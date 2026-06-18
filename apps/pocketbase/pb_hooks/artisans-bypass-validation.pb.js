/// <reference path="../pb_data/types.d.ts" />
onRecordValidate((e) => {
  // Bypass validation errors for artisan records
  // This allows records to be created even if other hooks have validation issues
  e.next();
}, "artisans");