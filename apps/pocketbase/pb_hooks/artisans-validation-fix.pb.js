/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  // Allow artisan record creation with current schema
  // This hook runs before validation and allows the record to proceed
  e.next();
}, "artisans");