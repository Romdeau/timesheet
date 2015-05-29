Template.jobsList.helpers({
  jobs: function() {
    return Jobs.find({}, {sort: {jobNumber: 1}});
  }
});
