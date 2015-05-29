Template.jobItem.helpers({
  ownJob: function() {
    return this.userId === Meteor.userId();
  }
});
