Template.jobSubmit.onCreated(function() {
  Session.set('jobSubmitErrors', {});
});
Template.jobSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('jobSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('jobSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.jobSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var job = {
      jobNumber: $(e.target).find('[name=jobNumber]').val(),
      jobName: $(e.target).find('[name=jobName]').val()
    };

    var errors = validateJob(job);
    if (errors.jobNumber || errors.jobName)
      return Session.set('jobSubmitErrors', errors);

    Meteor.call('jobInsert', job, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);

      // show this result but route anyway
      if (result.jobExists)
        throwError('This job has already been added');

      Router.go('jobPage', {_id: result._id});
    });
  }
});
