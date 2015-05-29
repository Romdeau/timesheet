Template.jobEdit.onCreated(function() {
  Session.set('jobEditErrors', {});
});
Template.jobEdit.helpers({
  errorMessage: function(field) {
    return Session.get('jobEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('jobEditErrors')[field] ? 'has-error' : '';
  }
});

Template.jobEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentJobId = this._id;

    var jobProperties = {
      jobNumber: $(e.target).find('[name=jobNumber]').val(),
      jobName: $(e.target).find('[name=jobName]').val()
    }

    var errors = validateJob(jobProperties);
    if (errors.jobNumber || errors.jobName)
      return Session.set('jobEditErrors', errors);

    Jobs.update(currentJobId, {$set: jobProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('jobPage', {_id: currentJobId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this job?")) {
      var currentJobId = this._id;
      Jobs.remove(currentJobId);
      Router.go('jobsList');
    }
  }
});
