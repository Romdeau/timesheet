Jobs = new Mongo.Collection('jobs');

Jobs.allow({
  update: function(userId, job) { return ownsDocument(userId, job); },
  remove: function(userId, job) { return ownsDocument(userId, job); },
});

Jobs.deny({
  update: function(userId, job, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'jobName', 'jobNumber').length > 0);
  }
});

Jobs.deny({
  update: function(userId, job, fieldNames, modifier) {
    var errors = validateJob(modifier.$set);
    return errors.jobNumber || errors.jobName;
  }
});

validateJob = function (job) {
  var errors = {};
  if (!job.jobNumber)
    errors.jobNumber = "Please add a Job Number";
  if (!job.jobName)
    errors.jobName =  "Please give this Job a name";
  return errors;
}

Meteor.methods({
  jobInsert: function(jobAttributes) {
    check(Meteor.userId(), String);
    check(jobAttributes, {
      jobNumber: String,
      jobName: String
    });

    var errors = validateJob(jobAttributes);
    if (errors.jobNumber || errors.jobName)
      throw new Meteor.Error('invalid-job', "You must set a Job Number and Name for your Job");

    var jobWithSameNumber = Jobs.findOne({jobNumber: jobAttributes.jobNumber});
    if (jobWithSameNumber) {
      return {
        jobExists: true,
        _id: jobWithSameNumber._id
      }
    }

    var user = Meteor.user();
    var job = _.extend(jobAttributes, {
      userId: user._id,
      author: user.username,
      timeCoding: "spent",
      jobType: "user-defined"
    });
    var jobId = Jobs.insert(job);
    return {
      _id: jobId
    };
  }
});
