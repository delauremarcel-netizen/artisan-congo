/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  const projectAmount = e.record.get("project_amount");
  if (projectAmount && projectAmount > 0) {
    const commissionAmount = projectAmount * 0.05;
    e.record.set("commission_amount", commissionAmount);
  }
  e.next();
}, "commissions");

onRecordUpdate((e) => {
  const projectAmount = e.record.get("project_amount");
  if (projectAmount && projectAmount > 0) {
    const commissionAmount = projectAmount * 0.05;
    e.record.set("commission_amount", commissionAmount);
  }
  e.next();
}, "commissions");