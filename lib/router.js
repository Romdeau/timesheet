Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('jobs')]
  }
});

Router.route('/', { name: 'jobsList' });

Router.route('/jobs/submit', {name: 'jobSubmit'});

Router.route('/jobs/:_id', {
  name: 'jobPage',
  data: function() { return Jobs.findOne(this.params._id); }
});

Router.route('/jobs/:_id/edit', {
  name: 'jobEdit',
  data: function() { return Jobs.findOne(this.params._id); }
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'jobPage'});
Router.onBeforeAction(requireLogin, {only: 'jobSubmit'});
