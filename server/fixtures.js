if (Jobs.find().count() === 0) {
  Jobs.insert({
    jobNumber: 'admin',
    jobName: 'Admin'
  });
  Jobs.insert({
    jobNumber: 'afterSalesSupport',
    jobName: 'After Sales Support'
  });
  Jobs.insert({
    jobNumber: 'annualLeave',
    jobName: 'Annual Leave'
  });
}
