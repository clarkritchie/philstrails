Template.weather.onRendered(function() {
    Session.setDefault('counter', 0);
    log.debug("---> ", this.data);
});


Template.weather.helpers({
    counter: function () {
      return Session.get('counter');
    }
});

Template.weather.events({
    // 'click .someclass': function(e) {
    //      e.preventDefault();
    //       // $(e.target)
    // }
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
});
